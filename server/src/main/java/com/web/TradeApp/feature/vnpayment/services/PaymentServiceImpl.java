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

@Service
@RequiredArgsConstructor
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

    /**
     * 1. create a vnPay payment URL that redirect user to VnPay payment gateway (in
     * frontend)
     * 2. vnPay will call returnUrl after payment done => verifyPayment()
     */
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
        vnp_Params.put("vnp_Amount", String.valueOf(amount));
        vnp_Params.put("vnp_CurrCode", "VND");
        vnp_Params.put("vnp_TxnRef", vnpTxnRef); // Mã tham chiếu giao dịch nạp tiền (Unique)
        vnp_Params.put("vnp_OrderInfo", "deposit to wallet: " + vnpTxnRef);
        vnp_Params.put("vnp_OrderType", "topup");
        vnp_Params.put("vnp_Locale", "vn");
        vnp_Params.put("vnp_ReturnUrl", VnPayConfig.RETURN_URL);
        vnp_Params.put("vnp_IpAddr", VnPayConfig.getIpAddress(request));

        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyyMMddHHmmss");
        ZoneId zoneId = ZoneId.of("Asia/Ho_Chi_Minh"); // Hoặc "Etc/GMT+7"

        ZonedDateTime now = ZonedDateTime.now(zoneId);

        // TCreation time and Expires after 15 minutes
        vnp_Params.put("vnp_CreateDate", now.format(formatter));
        vnp_Params.put("vnp_ExpireDate", now.plusMinutes(EXPIRED_MINUTES).format(formatter));

        // Create checksum (for validate return url)
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
    public DepositResponse processPaymentCallback(HttpServletRequest request) {
        // check sum
        if (!verifyPayment(request))
            return null;

        // --- 2. VERIFY TRANSACTION STATUS ---
        String vnpTxnRef = request.getParameter("vnp_TxnRef");
        String vnpResponseCode = request.getParameter("vnp_ResponseCode");

        PaymentTransaction transaction = transactionRepository.findByVnpTxnRef(vnpTxnRef)
                .orElseThrow(() -> new PaymentException("Transaction not found: " + vnpTxnRef));

        // Idempotency check
        if (transaction.getStatus() == PaymentStatus.SUCCESS) {
            return transactionToDepositResponse(transaction); // Already processed, just return
        }
        if (!"00".equals(vnpResponseCode)) {
            // Payment Failed
            transaction.setStatus(PaymentStatus.FAILED);
            transactionRepository.save(transaction);
            throw new PaymentException("Payment failed with error code: " + vnpResponseCode);
        }

        // --- 3. SUCCESS LOGIC (UPDATE WALLET) ---
        transaction.setStatus(PaymentStatus.SUCCESS);

        // Fetch Real-time Exchange Rate (USD -> VND)
        BigDecimal exchangeRate = CommonUtils.fetchRealTimeExchangeRate();
        transaction.setExchangeRate(exchangeRate);

        // Convert Currency
        BigDecimal amountVND = transaction.getAmount();
        BigDecimal amountUSD = amountVND.divide(exchangeRate, 2, RoundingMode.HALF_UP);
        transaction.setAmount(amountVND);
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

    // 2. Process Callback from VNPay
    // Returns a Map containing results for Controller processing
    private boolean verifyPayment(HttpServletRequest request) {
        Map fields = new HashMap();

        // 1. Get all parameters from the returned URL
        for (Enumeration params = request.getParameterNames(); params.hasMoreElements();) {
            String fieldName = null;
            String fieldValue = null;
            try {
                fieldName = (String) params.nextElement();
                fieldValue = request.getParameter(fieldName);
                if ((fieldValue != null) && (fieldValue.length() > 0)) {
                    fields.put(fieldName, fieldValue);
                }
            } catch (Exception e) {
                e.printStackTrace();
            }
        }

        // 2. Get the signature sent by VNPay (vnp_SecureHash)
        String vnp_SecureHash = request.getParameter("vnp_SecureHash");

        // 3. Remove hash-related parameters from data before re-calculating hash
        if (fields.containsKey("vnp_SecureHashType"))
            fields.remove("vnp_SecureHashType");
        if (fields.containsKey("vnp_SecureHash"))
            fields.remove("vnp_SecureHash");

        // 4. Re-calculate signature (Checksum) based on received data and our Secret
        // Key
        // Logic: Hash(SecretKey + SortedParams)
        String signValue = VnPayConfig.hmacSHA512(VnPayConfig.HASH_SECRET, VnPayConfig.hashAllFields(fields));

        // 5. Compare calculated signature (signValue) with VNPay's signature
        // (vnp_SecureHash)
        if (!signValue.equals(vnp_SecureHash)) {
            throw new PaymentException("Invalid Checksum - Possible data tampering");
        }
        return true;
    }

    private DepositResponse transactionToDepositResponse(PaymentTransaction transaction) {
        return DepositResponse.builder()
                .amount(transaction.getAmount().toPlainString())
                .convertedAmount(transaction.getConvertedAmount() != null)
                .status(transaction.getStatus())
                .exchangeRate(transaction.getExchangeRate())
                .description(transaction.getDescription())
                .build();
    }

}
