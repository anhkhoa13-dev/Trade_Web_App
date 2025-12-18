package com.web.TradeApp.feature.vnpayment.repository;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.web.TradeApp.feature.vnpayment.entity.PaymentStatus;
import com.web.TradeApp.feature.vnpayment.entity.PaymentTransaction;

@Repository
public interface PaymentTransactionRepository extends JpaRepository<PaymentTransaction, UUID> {
    Optional<PaymentTransaction> findByVnpTxnRef(String vnpTxnRef);

    @Query("SELECT pt FROM PaymentTransaction pt WHERE pt.user.id = :userId " +
            "AND (:status IS NULL OR pt.status = :status)")
    Page<PaymentTransaction> findPaymentTransactions(
            @Param("userId") UUID userId,
            @Param("status") PaymentStatus status,
            Pageable pageable);
}
