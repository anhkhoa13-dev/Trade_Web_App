package com.web.TradeApp.feature.aibot.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

import com.web.TradeApp.feature.common.entity.BaseEntity;

@Entity
@Table(name = "bot_subscriptions")
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Getter
@Setter
public class BotSubscription extends BaseEntity {
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "bot_id", nullable = false)
    private Bot bot;

    // reference to your existing User entity (adjust class name & package)
    @Column(name = "user_id", nullable = false)
    private UUID userId;

    /**
     * SỐ DÒ VÍ USDT CỦA BOT (Bot Wallet Balance)
     * Biến động liên tục khi bot trade (mua/bán coin).
     * VD: Ban đầu 1000 USDT → Mua BTC → Còn 500 USDT
     */
    @Column(name = "bot_wallet_balance", nullable = false, precision = 18, scale = 6)
    private BigDecimal botWalletBalance;

    /**
     * SỐ LƯỢNG COIN TRONG VÍ BOT (Bot Wallet Coin)
     * Biến động liên tục khi bot trade.
     * VD: Ban đầu 0 BTC → Mua → 0.01 BTC → Bán → 0.005 BTC
     */
    @Column(name = "bot_wallet_coin", nullable = false, precision = 36, scale = 18)
    @Builder.Default
    private BigDecimal botWalletCoin = BigDecimal.ZERO;

    /**
     * TỔNG VỐN ĐẦU TƯ GỐC (Net Investment) - MỎ NEO ĐỂ TÍNH PNL
     * Quy đổi ra USDT tại thời điểm nạp.
     * 
     * Công thức PnL:
     * PnL = (botWalletBalance + botWalletCoin × CurrentPrice) - netInvestment
     * 
     * Cách hoạt động:
     * - Khi user nạp $1000 USDT: netInvestment += 1000
     * - Khi user nạp 1 BTC (giá $50k): netInvestment += 50000
     * - Khi bot trade thắng/thua: netInvestment KHÔNG ĐỔI ✅
     * - Khi user rút $500: netInvestment -= 500
     */
    @Column(name = "net_investment", nullable = false, precision = 18, scale = 6)
    @Builder.Default
    private BigDecimal netInvestment = BigDecimal.ZERO;

    // 2. Percentage per Trade (e.g., 0.10 for 10%)
    // "For every action, bot buys/sells % of allocation amount"
    @Column(name = "trade_percentage", nullable = false, precision = 5, scale = 4)
    private BigDecimal tradePercentage;

    @Column(name = "is_active", nullable = false)
    @Builder.Default
    private boolean active = true;

    @Column(name = "started_at", nullable = false)
    private Instant startedAt;

    @Column(name = "stopped_at")
    private Instant stoppedAt;

    // Optional: user-specific config for this bot
    @Column(name = "max_daily_loss_percentage", columnDefinition = "DECIMAL(5,2)")
    private Double maxDailyLossPercentage;

}
