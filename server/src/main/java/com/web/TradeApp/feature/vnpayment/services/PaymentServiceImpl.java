package com.web.TradeApp.feature.vnpayment.services;

import java.io.UnsupportedEncodingException;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Enumeration;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import org.springframework.stereotype.Service;

import com.web.TradeApp.config.VnPayConfig;
import com.web.TradeApp.exception.PaymentException;
import com.web.TradeApp.exception.UserNotFoundException;
import com.web.TradeApp.feature.coin.entity.Wallet;
import com.web.TradeApp.feature.coin.repository.WalletRepository;
import com.web.TradeApp.feature.user.entity.User;
import com.web.TradeApp.feature.user.repository.UserRepository;
import com.web.TradeApp.feature.vnpayment.dto.DepositResponse;
import com.web.TradeApp.feature.vnpayment.entity.PaymentStatus;
import com.web.TradeApp.feature.vnpayment.entity.PaymentTransaction;
import com.web.TradeApp.feature.vnpayment.repository.PaymentTransactionRepository;
import com.web.TradeApp.utils.CommonUtils;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class PaymentServiceImpl implements PaymentService {
    private final PaymentTransactionRepository transactionRepository;
    private final UserRepository userRepository;
    private final WalletRepository walletRepository;

    private final int EXPIRED_MINUTES = 15;

    @Override
    public String createPendingPayment(UUID userId, BigDecimal amount) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException("User not found with ID: " + userId));
        // Tạo mã giao dịch unique
        String vnpTxnRef = VnPayConfig.getRandomNumber(8);

        // Lưu Transaction vào DB với trạng thái PENDING
        PaymentTransaction transaction = PaymentTransaction.builder()
                .user(user)
                .vnpTxnRef(vnpTxnRef)
                .amount(amount) // Save amount in VND
                .status(PaymentStatus.PENDING)
                .description("Deposit through VNPay")
                .build();

        transactionRepository.save(transaction);

        return vnpTxnRef;
    }

    @Override
    @Transactional
    public String createVnPayPayment(BigDecimal totalAmount, String vnpTxnRef, HttpServletRequest request)
            throws UnsupportedEncodingException {
        // follow VnPay rule: amount in VND x 100
        BigDecimal amount = totalAmount.multiply(BigDecimal.valueOf(100));

        Map<String, String> vnp_Params = new HashMap<>();
        vnp_Params.put("vnp_Version", VnPayConfig.VNP_VERSION);
        vnp_Params.put("vnp_Command", VnPayConfig.VNP_COMMAND);
        vnp_Params.put("vnp_TmnCode", VnPayConfig.TMN_CODE);
        vnp_Params.put("vnp_Amount", String.valueOf(amount.longValue())); // Ensure .00 is removed for integer
                                                                          // requirement
        vnp_Params.put("vnp_CurrCode", "VND");
        vnp_Params.put("vnp_TxnRef", vnpTxnRef);
        vnp_Params.put("vnp_OrderInfo", "deposit to wallet: " + vnpTxnRef);
        vnp_Params.put("vnp_OrderType", "topup");
        vnp_Params.put("vnp_Locale", "vn");
        vnp_Params.put("vnp_ReturnUrl", VnPayConfig.RETURN_URL);
        vnp_Params.put("vnp_IpAddr", VnPayConfig.getIpAddress(request));

        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyyMMddHHmmss");
        ZoneId zoneId = ZoneId.of("Asia/Ho_Chi_Minh");

        ZonedDateTime now = ZonedDateTime.now(zoneId);

        vnp_Params.put("vnp_CreateDate", now.format(formatter));
        vnp_Params.put("vnp_ExpireDate", now.plusMinutes(EXPIRED_MINUTES).format(formatter));

        // Build hash data with ENCODING
        List<String> fieldNames = new ArrayList<>(vnp_Params.keySet());
        Collections.sort(fieldNames);
        StringBuilder hashData = new StringBuilder();
        StringBuilder query = new StringBuilder();
        Iterator<String> itr = fieldNames.iterator();
        while (itr.hasNext()) {
            String fieldName = itr.next();
            String fieldValue = vnp_Params.get(fieldName);
            if ((fieldValue != null) && (fieldValue.length() > 0)) {
                // Build hash data
                hashData.append(fieldName);
                hashData.append('=');
                hashData.append(URLEncoder.encode(fieldValue, StandardCharsets.US_ASCII.toString()));
                // Build query
                query.append(URLEncoder.encode(fieldName, StandardCharsets.US_ASCII.toString()));
                query.append('=');
                query.append(URLEncoder.encode(fieldValue, StandardCharsets.US_ASCII.toString()));
                if (itr.hasNext()) {
                    query.append('&');
                    hashData.append('&');
                }
            }
        }
        String queryUrl = query.toString();
        String vnp_SecureHash = VnPayConfig.hmacSHA512(VnPayConfig.HASH_SECRET, hashData.toString());
        queryUrl += "&vnp_SecureHash=" + vnp_SecureHash;
        String paymentUrl = VnPayConfig.PAY_URL + "?" + queryUrl;
        return paymentUrl;
    }

    @Override
    @Transactional
    public DepositResponse processPaymentCallback(HttpServletRequest request) {
        // 1. Verify Checksum first
        if (!verifyPayment(request)) {
            // Logic verifyPayment đã throw Exception nếu fail, nên dòng này chỉ là fallback
            return null;
        }

        // --- 2. VERIFY TRANSACTION STATUS ---
        String vnpTxnRef = request.getParameter("vnp_TxnRef");
        String vnpResponseCode = request.getParameter("vnp_ResponseCode");
        String vnpTransactionStatus = request.getParameter("vnp_TransactionStatus");

        PaymentTransaction transaction = transactionRepository.findByVnpTxnRef(vnpTxnRef)
                .orElseThrow(() -> new PaymentException("Transaction not found: " + vnpTxnRef));

        // Idempotency check: Nếu đã thành công rồi thì không xử lý lại
        if (transaction.getStatus() == PaymentStatus.SUCCESS) {
            log.info("Return directly. This transaction {} has been already processed successfully.", vnpTxnRef);
            return transactionToDepositResponse(transaction);
        }

        boolean isSuccessResponse = "00".equals(vnpResponseCode);
        boolean isSuccessStatus = "00".equals(vnpTransactionStatus);

        if (isSuccessResponse && isSuccessStatus) {
            // --- SUCCESS CASE ---
            return handleSuccessTransaction(transaction);
        } else {
            // --- FAILURE CASE ---
            return handleFailedTransaction(transaction, vnpResponseCode);
        }
    }

    private boolean verifyPayment(HttpServletRequest request) {
        Map<String, String> fields = new HashMap<>();

        // 1. Get all parameters
        for (Enumeration<String> params = request.getParameterNames(); params.hasMoreElements();) {
            String fieldName = params.nextElement();
            String fieldValue = request.getParameter(fieldName);
            if ((fieldValue != null) && (fieldValue.length() > 0)) {
                fields.put(fieldName, fieldValue);
            }
        }

        String vnp_SecureHash = request.getParameter("vnp_SecureHash");
        if (fields.containsKey("vnp_SecureHashType"))
            fields.remove("vnp_SecureHashType");
        if (fields.containsKey("vnp_SecureHash"))
            fields.remove("vnp_SecureHash");

        // 2. Re-calculate signature
        // QUAN TRỌNG: Phải dùng URLEncoder cho value giống như lúc tạo URL
        List<String> fieldNames = new ArrayList<>(fields.keySet());
        Collections.sort(fieldNames);
        StringBuilder hashData = new StringBuilder();
        Iterator<String> itr = fieldNames.iterator();
        while (itr.hasNext()) {
            String fieldName = itr.next();
            String fieldValue = fields.get(fieldName);
            if ((fieldValue != null) && (fieldValue.length() > 0)) {
                hashData.append(fieldName);
                hashData.append("=");
                try {
                    // Encoding value để khớp với quy tắc hash của VNPay
                    hashData.append(URLEncoder.encode(fieldValue, StandardCharsets.US_ASCII.toString()));
                } catch (UnsupportedEncodingException e) {
                    e.printStackTrace();
                }
            }
            if (itr.hasNext()) {
                hashData.append("&");
            }
        }

        String signValue = VnPayConfig.hmacSHA512(VnPayConfig.HASH_SECRET, hashData.toString());

        if (!signValue.equals(vnp_SecureHash)) {
            // Log chi tiết để debug nếu lỗi
            log.error("Checksum mismatch!");
            log.error("Received Hash: {}", vnp_SecureHash);
            log.error("Calculated Hash: {}", signValue);
            log.error("Hash String: {}", hashData.toString());
            throw new PaymentException("Invalid Checksum - Possible data tampering");
        }
        return true;
    }

    private DepositResponse handleSuccessTransaction(PaymentTransaction transaction) {
        transaction.setStatus(PaymentStatus.SUCCESS);

        // Fetch Real-time Exchange Rate (USD -> VND)
        // Fallback nếu API lỗi
        BigDecimal exchangeRate = BigDecimal.valueOf(25000);
        try {
            BigDecimal fetchedRate = CommonUtils.fetchRealTimeExchangeRate();
            if (fetchedRate != null)
                exchangeRate = fetchedRate;
        } catch (Exception e) {
            log.warn("Failed to fetch exchange rate, using default: {}", exchangeRate);
        }

        transaction.setExchangeRate(exchangeRate);

        // Convert Currency
        BigDecimal amountVND = transaction.getAmount();
        BigDecimal amountUSD = amountVND.divide(exchangeRate, 2, RoundingMode.HALF_UP);
        transaction.setConvertedAmount(amountUSD);

        // Update Wallet
        Wallet wallet = walletRepository.findByUserId(transaction.getUser().getId())
                .orElseThrow(
                        () -> new PaymentException("Wallet not found for user ID: " + transaction.getUser().getId()));

        wallet.setBalance(wallet.getBalance().add(amountUSD));
        wallet.setNetInvestment(wallet.getNetInvestment().add(amountUSD));

        walletRepository.save(wallet);
        PaymentTransaction savedTransaction = transactionRepository.save(transaction);
        return transactionToDepositResponse(savedTransaction);
    }

    private DepositResponse handleFailedTransaction(PaymentTransaction transaction, String responseCode) {
        transaction.setStatus(PaymentStatus.FAILED);
        transactionRepository.save(transaction);

        String errorMessage;
        switch (responseCode) {
            case "24":
                errorMessage = "Giao dịch đã bị hủy bởi người dùng";
                break;
            case "11":
                errorMessage = "Giao dịch thất bại: Hết hạn chờ thanh toán";
                break;
            case "09":
                errorMessage = "Giao dịch thất bại: Thẻ/Tài khoản chưa đăng ký dịch vụ InternetBanking";
                break;
            case "07":
                errorMessage = "Giao dịch thất bại: Trừ tiền thành công nhưng nghi ngờ gian lận";
                break;
            default:
                errorMessage = "Giao dịch thất bại với mã lỗi VNPay: " + responseCode;
                break;
        }

        log.warn("Payment failed for TxnRef: {}. Reason: {}", transaction.getVnpTxnRef(), errorMessage);
        throw new PaymentException(errorMessage);
    }

    private DepositResponse transactionToDepositResponse(PaymentTransaction transaction) {
        return DepositResponse.builder()
                .amount(transaction.getAmount())
                .convertedAmount(transaction.getConvertedAmount())
                .status(transaction.getStatus())
                .exchangeRate(transaction.getExchangeRate())
                .description(transaction.getDescription())
                .build();
    }
}