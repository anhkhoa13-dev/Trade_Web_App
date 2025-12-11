package com.web.TradeApp.feature.vnpayment.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.web.TradeApp.feature.vnpayment.entity.PaymentTransaction;

@Repository
public interface PaymentTransactionRepository extends JpaRepository<PaymentTransaction, Long> {
    Optional<PaymentTransaction> findByVnpTxnRef(String vnpTxnRef);
}
