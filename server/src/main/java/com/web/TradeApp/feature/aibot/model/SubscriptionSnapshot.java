package com.web.TradeApp.feature.aibot.model;

import java.math.BigDecimal;
import java.time.Instant;

import com.web.TradeApp.feature.common.entity.BaseEntity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Index;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "subscription_snapshot", indexes = {
        // Index để tối ưu query lịch sử PnL theo thời gian
        @Index(name = "idx_sub_snapshot_time", columnList = "bot_subscription_id, recorded_at")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SubscriptionSnapshot extends BaseEntity {

    /**
     * Liên kết tới gói Copy (Subscription) thay vì User.
     * FetchType.LAZY để tránh load thừa dữ liệu khi không cần thiết.
     */
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "bot_subscription_id", nullable = false)
    private BotSubscription botSubscription;
    /**
     * Tổng giá trị tài sản ròng (Equity) tại thời điểm snapshot.
     * Equity = Vốn gốc (Allocated) + Lời đã chốt (Realized) + Lời đang treo
     * (Unrealized)
     */
    @Column(name = "total_equity", nullable = false, precision = 18, scale = 6)
    private BigDecimal totalEquity;

    /**
     * Snapshot của số dư USDT trong ví bot tại thời điểm này.
     * Chỉ để tham khảo, KHÔNG dùng để tính PnL.
     */
    @Column(name = "bot_wallet_balance", nullable = false, precision = 18, scale = 6)
    private BigDecimal botWalletBalance;

    /**
     * Snapshot của số lượng Coin trong ví bot tại thời điểm này.
     * Chỉ để tham khảo, KHÔNG dùng để tính PnL.
     */
    @Column(name = "bot_wallet_coin", nullable = false, precision = 36, scale = 18)
    private BigDecimal botWalletCoin;

    /**
     * TỔNG VỐN ĐẦU TƯ GỐC (Net Investment) tại thời điểm snapshot.
     * ĐÂY MỚI LÀ MỎ NEO ĐỂ TÍNH PNL!
     * 
     * Lưu lại để phát hiện user có nạp/rút tiền không:
     * - Nếu netInvestment tăng → User nạp thêm vốn
     * - Nếu netInvestment giảm → User rút vốn
     * - Nếu netInvestment không đổi → Bot đang trade bình thường
     */
    @Column(name = "net_investment", nullable = false, precision = 18, scale = 6)
    private BigDecimal netInvestment;

    /**
     * Lợi nhuận/lỗ (Profit and Loss) tính bằng USDT.
     * Công thức: PnL = totalEquity - netInvestment
     * 
     * Ví dụ:
     * - Net Investment = $1000, Total Equity = $1150 → PnL = +$150 (lãi 150 USDT)
     * - Net Investment = $1000, Total Equity = $950 → PnL = -$50 (lỗ 50 USDT)
     */
    @Column(name = "pnl", nullable = false, precision = 18, scale = 6)
    private BigDecimal pnl;

    /**
     * Tỷ suất lợi nhuận (Return on Investment) tính bằng %.
     * Công thức: ROI = (PnL / netInvestment) × 100
     * 
     * Ví dụ:
     * - PnL = $150, Net Investment = $1000 → ROI = 15%
     * - PnL = -$50, Net Investment = $1000 → ROI = -5%
     */
    @Column(name = "roi", nullable = false, precision = 10, scale = 4)
    private BigDecimal roi;

    /**
     * Thời điểm hệ thống chụp lại dữ liệu (Snapshot time).
     */
    @Column(name = "recorded_at", nullable = false)
    private Instant recordedAt;
}
