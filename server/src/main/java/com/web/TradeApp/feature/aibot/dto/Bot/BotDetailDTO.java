package com.web.TradeApp.feature.aibot.dto.Bot;

import java.math.BigDecimal;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO for bot detail page with metrics and chart data
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BotDetailDTO {

    // Basic Bot Info
    private String botId;
    private String name;
    private String description;
    private String coinSymbol;
    private String tradingPair;
    private String riskLevel;
    private String category;
    private String status;
    private BigDecimal fee;

    // Current Metrics
    private Integer activeSubscribers;
    private BigDecimal totalPnl;
    private BigDecimal averageRoi;
    private BigDecimal maxDrawdown;
    private BigDecimal maxDrawdownPercent;
    private BigDecimal totalNetInvestment;
    private BigDecimal totalEquity;

    // Chart Data (for timeframe-based PnL chart)
    private List<ChartDataPoint> chartData;
}
