package com.web.TradeApp.feature.aibot.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

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

    // Amount of capital user allocates to this bot in USDT (or your base currency)
    @Column(name = "allocated_amount", nullable = false, columnDefinition = "DECIMAL(18,6)")
    private Double allocatedAmount;

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
