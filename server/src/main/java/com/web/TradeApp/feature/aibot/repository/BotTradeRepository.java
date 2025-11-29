package com.web.TradeApp.feature.aibot.repository;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.web.TradeApp.feature.aibot.model.BotTrade;

@Repository
public interface BotTradeRepository extends JpaRepository<BotTrade, UUID> {
}
