package com.web.TradeApp.feature.aibot.service;

import java.time.Duration;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;

import com.web.TradeApp.feature.aibot.dto.BotMetricsDTO;
import com.web.TradeApp.feature.aibot.model.BotTrade;
import com.web.TradeApp.feature.aibot.repository.BotRepository;
import com.web.TradeApp.feature.aibot.repository.BotSignalRepository;
import com.web.TradeApp.feature.aibot.repository.BotSubscriptionRepository;
import com.web.TradeApp.feature.aibot.repository.BotTradeRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class BotAnalysisServiceImpl implements BotAnalysisService {

    private final BotRepository botRepository;
    private final BotTradeRepository tradeRepository;
    private final BotSignalRepository signalRepository;
    private final BotSubscriptionRepository subscriptionRepository;

    @Override
    public BotMetricsDTO getBotMetrics(UUID botId) {

        botRepository.findById(botId)
                .orElseThrow(() -> new RuntimeException("Bot not found"));

        Double pnl24h = calculatePnl24h(botId);
        Double roi24h = calculateRoi24h(botId);
        long subs = subscriptionRepository.countActiveSubscribers(botId);
        Instant lastSignal = signalRepository.findLastSignalTime(botId);
        List<BotMetricsDTO.PnlPoint> chart = getPnlChart24h(botId);

        return new BotMetricsDTO(
                botId,
                pnl24h,
                roi24h,
                subs,
                lastSignal,
                chart);
    }

    @Override
    public Double calculatePnl24h(UUID botId) {
        Instant from = Instant.now().minus(Duration.ofHours(24));
        return tradeRepository.sumRealizedPnlSince(botId, from);
    }

    @Override
    public Double calculateRoi24h(UUID botId) {

        Double allocated = subscriptionRepository.sumAllocatedCapital(botId);
        Double pnl24h = calculatePnl24h(botId);

        if (allocated == null || allocated == 0) {
            return 0.0;
        }

        return (pnl24h / allocated) * 100.0;
    }

    @Override
    public List<BotMetricsDTO.PnlPoint> getPnlChart24h(UUID botId) {

        Instant from = Instant.now().minus(Duration.ofHours(24));

        List<BotTrade> trades = tradeRepository.findTradesSince(botId, from);

        List<BotMetricsDTO.PnlPoint> points = new ArrayList<>();

        double cumulative = 0.0;

        for (BotTrade trade : trades) {
            cumulative += trade.getRealizedPnl();
            points.add(new BotMetricsDTO.PnlPoint(trade.getExecutedAt(), cumulative));
        }

        return points;
    }
}
