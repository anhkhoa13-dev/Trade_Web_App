package com.web.TradeApp.feature.vnpayment.dto;

import java.math.BigDecimal;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class DepositRequest {
    @NotNull
    @Min(value = 10000, message = "Minimum deposit amount is 10,000 VND")
    private BigDecimal amount;
}
