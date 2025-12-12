package com.web.TradeApp.feature.vnpayment.entity;

import java.math.BigDecimal;

import com.web.TradeApp.feature.common.entity.BaseEntity;
import com.web.TradeApp.feature.user.entity.User;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "payment_transactions")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PaymentTransaction extends BaseEntity {
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "vnp_txn_ref", unique = true, nullable = false)
    private String vnpTxnRef;

    @Column(nullable = false)
    private BigDecimal amount; // Amount in VND

    @Column(name = "converted_amount", precision = 19, scale = 8)
    private BigDecimal convertedAmount; // Amount in USD

    @Column(name = "exchange_rate", precision = 19, scale = 8)
    private BigDecimal exchangeRate; // Stored rate at the time of transaction

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PaymentStatus status;

    @Column(name = "description")
    private String description;
}
