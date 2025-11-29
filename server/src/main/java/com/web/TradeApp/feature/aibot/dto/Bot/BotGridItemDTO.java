package com.web.TradeApp.feature.aibot.dto.Bot;

import java.math.BigDecimal;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO cho grid display của bots với pagination và sorting
 * Được tổng hợp từ nhiều queries riêng biệt ở service layer
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BotGridItemDTO {

    // Basic Bot Info
    private String botId;
    private String name;
    private String coinSymbol;
    private String tradingPair;

    // Metrics (computed at service layer)
    private Integer activeSubscribers;
    private BigDecimal totalPnl;
    private BigDecimal averageRoi;
    private BigDecimal maxDrawdown;
    private BigDecimal maxDrawdownPercent;

    // Additional info
    private BigDecimal totalNetInvestment;
    private BigDecimal totalEquity;
}
