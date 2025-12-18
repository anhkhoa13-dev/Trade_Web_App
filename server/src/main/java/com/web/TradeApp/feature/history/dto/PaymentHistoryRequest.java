package com.web.TradeApp.feature.history.dto;

import com.web.TradeApp.feature.vnpayment.entity.PaymentStatus;

import lombok.Data;

@Data
public class PaymentHistoryRequest {
    private PaymentStatus status;
}
