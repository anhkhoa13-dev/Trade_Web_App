package com.web.TradeApp.feature.vnpayment;

import java.io.UnsupportedEncodingException;
import java.util.Collections;
import java.util.UUID;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.web.TradeApp.exception.IdInvalidException;
import com.web.TradeApp.feature.common.Annotation.ApiMessage;
import com.web.TradeApp.feature.vnpayment.dto.DepositRequest;
import com.web.TradeApp.feature.vnpayment.dto.DepositResponse;
import com.web.TradeApp.feature.vnpayment.services.PaymentService;
import com.web.TradeApp.utils.SecurityUtil;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("payments")
@RequiredArgsConstructor
public class PaymentController {

        private final PaymentService paymentService;

        @PostMapping("/deposit")
        @ApiMessage("payment created")
        public ResponseEntity<?> createPayment(
                        HttpServletRequest request,
                        @RequestBody @Valid DepositRequest depositRequestDTO) throws UnsupportedEncodingException {

                UUID userId = SecurityUtil.getCurrentUserId()
                                .orElseThrow(() -> new IdInvalidException("User not authenticated"));
                String vnpTxnRef = paymentService.createPendingPayment(userId, depositRequestDTO.getAmount());

                // URL trả về frontend sau khi thanh toán xong
                // Hoặc fix cứng: "http://localhost:3000/payment-return"
                String paymentUrl = paymentService.createVnPayPayment(depositRequestDTO.getAmount(),
                                vnpTxnRef,
                                request);

                return ResponseEntity.ok(Collections.singletonMap("url", paymentUrl));
        }

        // Handle VnPay return URL
        @PostMapping("/vnpay-callback")
        @ApiMessage("payment returned")
        public ResponseEntity<DepositResponse> paymentCallback(HttpServletRequest request) {
                DepositResponse depositResponse = paymentService.processPaymentCallback(request);
                return ResponseEntity.status(HttpStatus.OK).body(depositResponse);
        }
}
