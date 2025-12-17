package com.web.TradeApp.feature.history.dto;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

import com.web.TradeApp.feature.vnpayment.entity.PaymentStatus;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PaymentHistoryResponse {
    private UUID id;
    private Instant createdAt;
    private BigDecimal amount; // VND
    private BigDecimal convertedAmount; // USD
    private BigDecimal exchangeRate;
    private PaymentStatus status;
}
