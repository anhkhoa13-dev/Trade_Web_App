package com.web.TradeApp.feature.vnpayment.services;

import java.io.UnsupportedEncodingException;
import java.math.BigDecimal;
import java.util.UUID;

import com.web.TradeApp.feature.vnpayment.dto.DepositResponse;

import jakarta.servlet.http.HttpServletRequest;

public interface PaymentService {
    String createPendingPayment(UUID userId, BigDecimal amount);

    String createVnPayPayment(BigDecimal totalAmount, String vnpTxnRef, HttpServletRequest request)
            throws UnsupportedEncodingException;

    DepositResponse processPaymentCallback(HttpServletRequest request);

}
