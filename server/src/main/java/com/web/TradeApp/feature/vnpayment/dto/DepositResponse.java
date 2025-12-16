package com.web.TradeApp.feature.vnpayment.dto;

import java.math.BigDecimal;

import com.web.TradeApp.feature.vnpayment.entity.PaymentStatus;

import lombok.Builder;

@Builder
public record DepositResponse(
                BigDecimal amount,
                BigDecimal convertedAmount,
                PaymentStatus status,
                BigDecimal exchangeRate,
                String description) {
}
