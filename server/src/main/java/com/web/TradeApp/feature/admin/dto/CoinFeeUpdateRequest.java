package com.web.TradeApp.feature.admin.dto;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

import jakarta.validation.Valid;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class CoinFeeUpdateRequest {
    @Valid
    @NotNull
    private List<CoinFeeUpdateItem> coins;

    @Data
    public static class CoinFeeUpdateItem {
        @NotNull
        private String symbol;

        @NotNull
        @DecimalMin(value = "0.0")
        private BigDecimal fee;
    }
}
