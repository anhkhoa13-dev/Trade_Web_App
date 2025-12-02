package com.web.TradeApp.feature.coin.service;

import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.web.TradeApp.feature.coin.dto.AssetResponse;
import com.web.TradeApp.feature.coin.entity.Wallet;
import com.web.TradeApp.feature.coin.repository.WalletRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class WalletServiceImpl implements WalletService {
    private final WalletRepository walletRepository;

    @Override
    public AssetResponse getAssetSummary(UUID userId) {
        Wallet wallet = walletRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Wallet not found for user: " + userId));

        // Get top 5 their coin holdings by amount
        throw new UnsupportedOperationException("Unimplemented method 'getAssetSummary'");
    }

    @Override
    public AssetResponse getAssetTotal(UUID userId) {
        Wallet wallet = walletRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Wallet not found for user: " + userId));

        AssetResponse asset = AssetResponse.builder()
                .balance(wallet.getBalance())
                .coinHoldings(wallet.getCoinHoldings().stream()
                        .map(holding -> {
                            return AssetResponse.CoinHoldingDTO.builder()
                                    .coinSymbol(holding.getCoin().getSymbol())
                                    .coinName(holding.getCoin().getName())
                                    .amount(holding.getAmount())
                                    .build();
                        })
                        .collect(Collectors.toList()))
                .build();
        return asset;
    }

    // private List<AssetResponse.CoinHoldingDTO> getTop5HighestValueCoins(UUID
    // userId) {
    // List<CoinHolding> holdings =
    // coinHoldingRepository.findByWallet_User_Id(userId);

    // return holdings.stream()
    // .map(holding -> {
    // // Get live price
    // BigDecimal livePrice =
    // priceService.getCurrentPrice(holding.getCoin().getSymbol());
    // BigDecimal totalValue = holding.getAmount().multiply(livePrice);
    // return AssetResponse.CoinHoldingDTO.builder()
    // .coinSymbol(holding.getCoin().getSymbol())
    // .coinName(holding.getCoin().getName())
    // .amount(holding.getAmount())
    // .totalValue(totalValue)
    // .portfolioPercentage(BigDecimal.ZERO) // Placeholder, calculate later
    // .build();
    // })
    // .sorted(Comparator.comparing(AssetResponse.CoinHoldingDTO::getTotalValue).reversed())
    // .limit(5)
    // .collect(Collectors.toList());
    // }

}
