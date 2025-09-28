package com.web.TradeApp.dto.CoinDTO;

import java.math.BigDecimal;
import java.util.UUID;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CoinDepositResponse {
    private UUID uuid;
    private String coinGeckoId;
    private String symbol;
    private String name;
    private BigDecimal depositedQuantity;
    private BigDecimal newQuantity;
}
