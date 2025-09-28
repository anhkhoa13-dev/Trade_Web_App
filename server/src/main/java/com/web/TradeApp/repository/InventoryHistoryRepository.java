package com.web.TradeApp.repository;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.web.TradeApp.model.coin.InventoryHistory;

public interface InventoryHistoryRepository extends JpaRepository<InventoryHistory, UUID> {
}
