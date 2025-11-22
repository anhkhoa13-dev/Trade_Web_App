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

import com.web.TradeApp.feature.aibot.enums.BotAction;
import com.web.TradeApp.feature.common.entity.BaseEntity;

@Entity
@Table(name = "bot_trades")
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Getter
@Setter
public class BotTrade extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "bot_id", nullable = false)
    private Bot bot;

    @Column(name = "user_id", nullable = false)
    private UUID userId;

    @Enumerated(EnumType.STRING)
    @Column(name = "action", nullable = false, length = 10)
    private BotAction action; // BUY or SELL

    @Column(name = "coin_symbol", nullable = false, length = 20)
    private String coinSymbol;

    // Amount of coin bought/sold
    @Column(name = "quantity", nullable = false, columnDefinition = "DECIMAL(36,18)")
    private Double quantity;

    // Price per coin in USDT at execution time
    @Column(name = "price", nullable = false, columnDefinition = "DECIMAL(18,6)")
    private Double price;

    // Total quote currency amount, e.g. quantity * price
    @Column(name = "notional", nullable = false, columnDefinition = "DECIMAL(18,6)")
    private Double notional;

    // Trading fee if any
    @Column(name = "fee", columnDefinition = "DECIMAL(18,6)")
    private Double fee;

    // Realized PnL for this trade (simplified)
    // For prototype, you can set this only on SELL trades when closing a portion of
    // position
    @Column(name = "realized_pnl", columnDefinition = "DECIMAL(18,6)")
    private Double realizedPnl;

    @Column(name = "executed_at", nullable = false)
    private Instant executedAt;

    // Reference to source signal (optional but useful)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "bot_signal_id")
    private BotSignal botSignal;
}
