// package com.web.TradeApp.feature.aibot.dto.Bot;

// import java.math.BigDecimal;

// /**
// * DTO chứa tất cả metrics tổng hợp của một bot (từ tất cả subscriptions)
// * Được tính toán trực tiếp từ database bằng SQL native query
// */
// public interface BotAggregateMetrics {

// // Basic Info
// String getBotId();

// Integer getActiveSubscribers();

// BigDecimal getTotalNetInvestment();

// BigDecimal getTotalEquity();

// // Metrics (theo timeframe được chọn: current/1d/7d)
// BigDecimal getTotalPnl();

// BigDecimal getAverageRoi();

// // Max Drawdown (all time)
// BigDecimal getMaxDrawdown();

// BigDecimal getMaxDrawdownPercent();
// }
