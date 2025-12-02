package com.web.TradeApp.feature.aibot.dto.Bot;

import java.math.BigDecimal;
import java.time.Instant;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Chart data point for PnL over time
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ChartDataPoint {
    private Instant timestamp;
    private BigDecimal totalPnl;
}
