package com.web.TradeApp.feature.aibot.dto.BotSubscription;

import java.math.BigDecimal;

/**
 * DTO chứa tất cả metrics của một bot subscription
 * Được tính toán trực tiếp từ database bằng SQL native query
 */
public interface SubscriptionMetrics {

    // Basic Info
    String getSubscriptionId();

    String getUserId();

    String getBotId();

    BigDecimal getNetInvestment();

    BigDecimal getTotalEquity();

    // Metrics (theo timeframe được chọn: current/1d/7d)
    BigDecimal getPnl();

    BigDecimal getRoi();

    // Max Drawdown (all time)
    BigDecimal getMaxDrawdown();

    BigDecimal getMaxDrawdownPercent();
}
