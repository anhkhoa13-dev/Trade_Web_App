package com.web.TradeApp.feature.coin.repository;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.web.TradeApp.feature.coin.entity.WalletSnapshot;

@Repository
public interface WalletSnapshotRepository extends JpaRepository<WalletSnapshot, UUID> {

}
