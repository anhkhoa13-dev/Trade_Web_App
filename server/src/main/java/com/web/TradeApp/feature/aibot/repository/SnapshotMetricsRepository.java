package com.web.TradeApp.feature.aibot.repository;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.web.TradeApp.feature.aibot.model.SubscriptionSnapshot;

/**
 * Repository với các queries modular - mỗi metric một query riêng
 * Service layer sẽ tổng hợp các kết quả lại
 */
@Repository
public interface SnapshotMetricsRepository extends JpaRepository<SubscriptionSnapshot, UUID> {

    // ============================================================================
    // BOT METRICS - Queries cho aggregate metrics của bot
    // ============================================================================

    /**
     * 1. Đếm số active subscribers của bot
     */
    @Query(value = """
            SELECT COUNT(DISTINCT bs.id)
            FROM bot_subscriptions bs
            WHERE bs.bot_id = UNHEX(REPLACE(:botId, '-', ''))
              AND bs.is_active = true
            """, nativeQuery = true)
    Integer countActiveSubsByBotId(@Param("botId") String botId);

    /**
     * 2. Tính total PnL của bot theo timeframe
     */
    @Query(value = """
            SELECT COALESCE(SUM(
                latest.pnl - COALESCE(compare.pnl, 0)
            ), 0)
            FROM (
                SELECT ss.bot_subscription_id, ss.pnl
                FROM subscription_snapshot ss
                JOIN bot_subscriptions bs ON bs.id = ss.bot_subscription_id
                WHERE bs.bot_id = UNHEX(REPLACE(:botId, '-', ''))
                  AND bs.is_active = true
                  AND ss.recorded_at = (
                      SELECT MAX(ss2.recorded_at)
                      FROM subscription_snapshot ss2
                      WHERE ss2.bot_subscription_id = ss.bot_subscription_id
                  )
            ) latest
            LEFT JOIN (
                SELECT ss.bot_subscription_id, ss.pnl
                FROM subscription_snapshot ss
                JOIN bot_subscriptions bs ON bs.id = ss.bot_subscription_id
                WHERE bs.bot_id = UNHEX(REPLACE(:botId, '-', ''))
                  AND bs.is_active = true
                  AND ss.recorded_at >= :compareTime
                  AND ss.recorded_at = (
                      SELECT MIN(ss2.recorded_at)
                      FROM subscription_snapshot ss2
                      WHERE ss2.bot_subscription_id = ss.bot_subscription_id
                        AND ss2.recorded_at >= :compareTime
                  )
            ) compare ON latest.bot_subscription_id = compare.bot_subscription_id
            """, nativeQuery = true)
    BigDecimal calcBotPnl(@Param("botId") String botId, @Param("compareTime") Instant compareTime);

    /**
     * 3. Tính average ROI của bot theo timeframe
     */
    @Query(value = """
            SELECT COALESCE(AVG(
                CASE
                    WHEN COALESCE(compare.net_investment, latest.net_investment) > 0
                    THEN ((latest.pnl - COALESCE(compare.pnl, 0)) / COALESCE(compare.net_investment, latest.net_investment)) * 100
                    ELSE 0
                END
            ), 0)
            FROM (
                SELECT ss.bot_subscription_id, ss.pnl, ss.net_investment
                FROM subscription_snapshot ss
                JOIN bot_subscriptions bs ON bs.id = ss.bot_subscription_id
                WHERE bs.bot_id = UNHEX(REPLACE(:botId, '-', ''))
                  AND bs.is_active = true
                  AND ss.recorded_at = (
                      SELECT MAX(ss2.recorded_at)
                      FROM subscription_snapshot ss2
                      WHERE ss2.bot_subscription_id = ss.bot_subscription_id
                  )
            ) latest
            LEFT JOIN (
                SELECT ss.bot_subscription_id, ss.pnl, ss.net_investment
                FROM subscription_snapshot ss
                JOIN bot_subscriptions bs ON bs.id = ss.bot_subscription_id
                WHERE bs.bot_id = UNHEX(REPLACE(:botId, '-', ''))
                  AND bs.is_active = true
                  AND ss.recorded_at >= :compareTime
                  AND ss.recorded_at = (
                      SELECT MIN(ss2.recorded_at)
                      FROM subscription_snapshot ss2
                      WHERE ss2.bot_subscription_id = ss.bot_subscription_id
                        AND ss2.recorded_at >= :compareTime
                  )
            ) compare ON latest.bot_subscription_id = compare.bot_subscription_id
            """, nativeQuery = true)
    BigDecimal calcBotRoi(@Param("botId") String botId, @Param("compareTime") Instant compareTime);

    /**
     * 4. Tính max drawdown của bot (all-time)
     */
    @Query(value = """
            SELECT COALESCE(MIN(ss.total_equity - ss.net_investment), 0)
            FROM subscription_snapshot ss
            JOIN bot_subscriptions bs ON bs.id = ss.bot_subscription_id
            WHERE bs.bot_id = UNHEX(REPLACE(:botId, '-', ''))
              AND bs.is_active = true
            """, nativeQuery = true)
    BigDecimal calcBotMaxDrawdown(@Param("botId") String botId);

    /**
     * 5. Tính max drawdown percent của bot (all-time)
     */
    @Query(value = """
            SELECT COALESCE(MIN(
                CASE WHEN ss.net_investment > 0
                    THEN ((ss.total_equity - ss.net_investment) / ss.net_investment) * 100
                    ELSE 0
                END
            ), 0)
            FROM subscription_snapshot ss
            JOIN bot_subscriptions bs ON bs.id = ss.bot_subscription_id
            WHERE bs.bot_id = UNHEX(REPLACE(:botId, '-', ''))
              AND bs.is_active = true
            """, nativeQuery = true)
    BigDecimal calcBotMaxDrawdownPct(@Param("botId") String botId);

    /**
     * 6. Tính total net investment của bot
     */
    @Query(value = """
            SELECT COALESCE(SUM(ss.net_investment), 0)
            FROM subscription_snapshot ss
            JOIN bot_subscriptions bs ON bs.id = ss.bot_subscription_id
            WHERE bs.bot_id = UNHEX(REPLACE(:botId, '-', ''))
              AND bs.is_active = true
              AND ss.recorded_at = (
                  SELECT MAX(ss2.recorded_at)
                  FROM subscription_snapshot ss2
                  WHERE ss2.bot_subscription_id = ss.bot_subscription_id
              )
            """, nativeQuery = true)
    BigDecimal calcBotTotalInvestment(@Param("botId") String botId);

    /**
     * 7. Tính total equity của bot
     */
    @Query(value = """
            SELECT COALESCE(SUM(ss.total_equity), 0)
            FROM subscription_snapshot ss
            JOIN bot_subscriptions bs ON bs.id = ss.bot_subscription_id
            WHERE bs.bot_id = UNHEX(REPLACE(:botId, '-', ''))
              AND bs.is_active = true
              AND ss.recorded_at = (
                  SELECT MAX(ss2.recorded_at)
                  FROM subscription_snapshot ss2
                  WHERE ss2.bot_subscription_id = ss.bot_subscription_id
              )
            """, nativeQuery = true)
    BigDecimal calcBotTotalEquity(@Param("botId") String botId);

    // ============================================================================
    // SUBSCRIPTION METRICS - Queries cho metrics của một subscription
    // ============================================================================

    /**
     * 8. Tính PnL của subscription theo timeframe
     */
    @Query(value = """
            SELECT COALESCE(latest.pnl - compare.pnl, latest.pnl)
            FROM (
                SELECT pnl FROM subscription_snapshot
                WHERE bot_subscription_id = UNHEX(REPLACE(:subscriptionId, '-', ''))
                ORDER BY recorded_at DESC LIMIT 1
            ) latest
            LEFT JOIN (
                SELECT pnl FROM subscription_snapshot
                WHERE bot_subscription_id = UNHEX(REPLACE(:subscriptionId, '-', ''))
                  AND recorded_at >= :compareTime
                ORDER BY recorded_at ASC LIMIT 1
            ) compare ON 1=1
            """, nativeQuery = true)
    BigDecimal calcSubPnl(@Param("subscriptionId") String subscriptionId, @Param("compareTime") Instant compareTime);

    /**
     * 9. Tính ROI của subscription theo timeframe
     */
    @Query(value = """
            SELECT COALESCE(
                CASE WHEN COALESCE(compare.net_investment, latest.net_investment) > 0
                    THEN ((latest.pnl - COALESCE(compare.pnl, 0)) / COALESCE(compare.net_investment, latest.net_investment)) * 100
                    ELSE 0
                END,
                0
            )
            FROM (
                SELECT pnl, net_investment FROM subscription_snapshot
                WHERE bot_subscription_id = UNHEX(REPLACE(:subscriptionId, '-', ''))
                ORDER BY recorded_at DESC LIMIT 1
            ) latest
            LEFT JOIN (
                SELECT pnl, net_investment FROM subscription_snapshot
                WHERE bot_subscription_id = UNHEX(REPLACE(:subscriptionId, '-', ''))
                  AND recorded_at >= :compareTime
                ORDER BY recorded_at ASC LIMIT 1
            ) compare ON 1=1
            """, nativeQuery = true)
    BigDecimal calcSubRoi(@Param("subscriptionId") String subscriptionId, @Param("compareTime") Instant compareTime);

    /**
     * 10. Tính max drawdown của subscription (all-time)
     */
    @Query(value = """
            SELECT COALESCE(MIN(total_equity - net_investment), 0)
            FROM subscription_snapshot
            WHERE bot_subscription_id = UNHEX(REPLACE(:subscriptionId, '-', ''))
            """, nativeQuery = true)
    BigDecimal calcSubMaxDrawdown(@Param("subscriptionId") String subscriptionId);

    /**
     * 11. Tính max drawdown percent của subscription (all-time)
     */
    @Query(value = """
            SELECT COALESCE(MIN(
                CASE WHEN net_investment > 0
                    THEN ((total_equity - net_investment) / net_investment) * 100
                    ELSE 0
                END
            ), 0)
            FROM subscription_snapshot
            WHERE bot_subscription_id = UNHEX(REPLACE(:subscriptionId, '-', ''))
            """, nativeQuery = true)
    BigDecimal calcSubMaxDrawdownPct(@Param("subscriptionId") String subscriptionId);

    /**
     * 12. Lấy net investment mới nhất của subscription
     */
    @Query(value = """
            SELECT COALESCE(net_investment, 0)
            FROM subscription_snapshot
            WHERE bot_subscription_id = UNHEX(REPLACE(:subscriptionId, '-', ''))
            ORDER BY recorded_at DESC LIMIT 1
            """, nativeQuery = true)
    BigDecimal getLatestNetInvestment(@Param("subscriptionId") String subscriptionId);

    /**
     * 13. Lấy total equity mới nhất của subscription
     */
    @Query(value = """
            SELECT COALESCE(total_equity, 0)
            FROM subscription_snapshot
            WHERE bot_subscription_id = UNHEX(REPLACE(:subscriptionId, '-', ''))
            ORDER BY recorded_at DESC LIMIT 1
            """, nativeQuery = true)
    BigDecimal getLatestTotalEquity(@Param("subscriptionId") String subscriptionId);

    /**
     * 14. Lấy chart data (PnL over time) cho bot theo timeframe
     * Aggregates all active subscriptions' PnL at each snapshot time
     */
    @Query(value = """
            SELECT ss.recorded_at, SUM(ss.pnl) as total_pnl
            FROM subscription_snapshot ss
            JOIN bot_subscriptions bs ON bs.id = ss.bot_subscription_id
            WHERE bs.bot_id = UNHEX(REPLACE(:botId, '-', ''))
              AND bs.is_active = true
              AND ss.recorded_at >= :fromTime
            GROUP BY ss.recorded_at
            ORDER BY ss.recorded_at ASC
            """, nativeQuery = true)
    java.util.List<Object[]> getBotChartData(
            @Param("botId") String botId,
            @Param("fromTime") Instant fromTime);
}
