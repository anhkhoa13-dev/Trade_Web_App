package com.web.TradeApp.feature.coin.service;

import java.util.UUID;

import com.web.TradeApp.feature.coin.dto.AssetResponse;

public interface WalletService {
    AssetResponse getAssetSummary(UUID userId);

    AssetResponse getAssetTotal(UUID userId);
}
