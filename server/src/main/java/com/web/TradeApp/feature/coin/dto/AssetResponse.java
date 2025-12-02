package com.web.TradeApp.feature.coin.dto;

import java.math.BigDecimal;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AssetResponse {
    private BigDecimal balance;
    private List<CoinHoldingDTO> coinHoldings;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class CoinHoldingDTO {
        private String coinSymbol;
        private String coinName;
        private BigDecimal amount;
    }
}
