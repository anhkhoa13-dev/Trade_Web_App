package com.web.TradeApp.feature.aibot.service.subscription;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import com.web.TradeApp.exception.IdInvalidException;
import com.web.TradeApp.feature.aibot.dto.Bot.BotGridItemDTO;
import com.web.TradeApp.feature.aibot.dto.BotSubscription.SubscriptionMetrics;
import com.web.TradeApp.feature.aibot.model.Bot;
import com.web.TradeApp.feature.aibot.repository.BotRepository;
import com.web.TradeApp.feature.aibot.repository.SnapshotMetricsRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Service tính toán metrics theo kiến trúc modular
 * Mỗi metric được tính bằng một query riêng biệt
 * Service layer tổng hợp kết quả lại thành DTO
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class ModularPnLService {

    private final SnapshotMetricsRepository metricsRepo;
    private final BotRepository botRepo;

    /**
     * Lấy danh sách bots với pagination, search và sorting
     * 
     * @param timeframe  "current" | "1d" | "7d"
     * @param sortBy     "pnl" | "roi" | "copied"
     * @param searchName Tên bot để search (optional)
     * @param pageable   Pagination info
     * @return Page of BotGridItemDTO
     */
    public Page<BotGridItemDTO> getAllBotsWithPagination(
            String timeframe,
            String sortBy,
            String searchName,
            Pageable pageable) {

        Instant compareTime = getCompareTime(timeframe);

        // 1. Lấy tất cả bots (có thể filter by name)
        List<Bot> allBots;
        if (searchName != null && !searchName.trim().isEmpty()) {
            Specification<Bot> spec = (root, query, cb) -> cb.like(cb.lower(root.get("name")),
                    "%" + searchName.toLowerCase() + "%");
            allBots = botRepo.findAll(spec);
        } else {
            allBots = botRepo.findAll();
        }

        // 2. Tính metrics cho từng bot (gọi nhiều queries riêng biệt)
        List<BotGridItemDTO> botGridItems = new ArrayList<>();
        for (Bot bot : allBots) {
            String botId = bot.getId().toString();

            try {
                // Gọi từng query riêng để tính từng metric
                Integer activeSubscribers = metricsRepo.countActiveSubsByBotId(botId);

                // Skip bot nếu không có subscribers
                if (activeSubscribers == null || activeSubscribers == 0) {
                    continue;
                }

                BigDecimal totalPnl = metricsRepo.calcBotPnl(botId, compareTime);
                BigDecimal averageRoi = metricsRepo.calcBotRoi(botId, compareTime);
                BigDecimal maxDrawdown = metricsRepo.calcBotMaxDrawdown(botId);
                BigDecimal maxDrawdownPct = metricsRepo.calcBotMaxDrawdownPct(botId);
                BigDecimal totalInvestment = metricsRepo.calcBotTotalInvestment(botId);
                BigDecimal totalEquity = metricsRepo.calcBotTotalEquity(botId);

                // Tạo DTO
                BotGridItemDTO dto = BotGridItemDTO.builder()
                        .botId(botId)
                        .name(bot.getName())
                        .coinSymbol(bot.getCoinSymbol())
                        .tradingPair(bot.getTradingPair())
                        .activeSubscribers(activeSubscribers)
                        .totalPnl(totalPnl != null ? totalPnl : BigDecimal.ZERO)
                        .averageRoi(averageRoi != null ? averageRoi : BigDecimal.ZERO)
                        .maxDrawdown(maxDrawdown != null ? maxDrawdown : BigDecimal.ZERO)
                        .maxDrawdownPercent(maxDrawdownPct != null ? maxDrawdownPct : BigDecimal.ZERO)
                        .totalNetInvestment(totalInvestment != null ? totalInvestment : BigDecimal.ZERO)
                        .totalEquity(totalEquity != null ? totalEquity : BigDecimal.ZERO)
                        .build();

                botGridItems.add(dto);

            } catch (Exception e) {
                log.error("Error calculating metrics for bot {}: {}", botId, e.getMessage());
                // Skip bot nếu có lỗi
            }
        }

        // 3. Sorting
        List<BotGridItemDTO> sortedBots = sortBots(botGridItems, sortBy);

        // 4. Pagination
        int start = (int) pageable.getOffset();
        int end = Math.min((start + pageable.getPageSize()), sortedBots.size());

        if (start > sortedBots.size()) {
            return new PageImpl<>(new ArrayList<>(), pageable, sortedBots.size());
        }

        List<BotGridItemDTO> pageContent = sortedBots.subList(start, end);

        return new PageImpl<>(pageContent, pageable, sortedBots.size());
    }

    /**
     * Lấy metrics của một bot cụ thể
     */
    public BotGridItemDTO getSingleBotMetrics(UUID botId, String timeframe) {
        Bot bot = botRepo.findById(botId)
                .orElseThrow(() -> new IdInvalidException("Bot not found: " + botId));

        Instant compareTime = getCompareTime(timeframe);
        String botIdStr = botId.toString();

        Integer activeSubscribers = metricsRepo.countActiveSubsByBotId(botIdStr);
        BigDecimal totalPnl = metricsRepo.calcBotPnl(botIdStr, compareTime);
        BigDecimal averageRoi = metricsRepo.calcBotRoi(botIdStr, compareTime);
        BigDecimal maxDrawdown = metricsRepo.calcBotMaxDrawdown(botIdStr);
        BigDecimal maxDrawdownPct = metricsRepo.calcBotMaxDrawdownPct(botIdStr);
        BigDecimal totalInvestment = metricsRepo.calcBotTotalInvestment(botIdStr);
        BigDecimal totalEquity = metricsRepo.calcBotTotalEquity(botIdStr);

        return BotGridItemDTO.builder()
                .botId(botIdStr)
                .name(bot.getName())
                .coinSymbol(bot.getCoinSymbol())
                .tradingPair(bot.getTradingPair())
                .activeSubscribers(activeSubscribers != null ? activeSubscribers : 0)
                .totalPnl(totalPnl != null ? totalPnl : BigDecimal.ZERO)
                .averageRoi(averageRoi != null ? averageRoi : BigDecimal.ZERO)
                .maxDrawdown(maxDrawdown != null ? maxDrawdown : BigDecimal.ZERO)
                .maxDrawdownPercent(maxDrawdownPct != null ? maxDrawdownPct : BigDecimal.ZERO)
                .totalNetInvestment(totalInvestment != null ? totalInvestment : BigDecimal.ZERO)
                .totalEquity(totalEquity != null ? totalEquity : BigDecimal.ZERO)
                .build();
    }

    /**
     * Lấy metrics của subscription
     * Return null values wrapped in a custom DTO implementation
     */
    public SubscriptionMetricsDTO getSubscriptionMetrics(UUID subscriptionId, String timeframe) {
        Instant compareTime = getCompareTime(timeframe);
        String subIdStr = subscriptionId.toString();

        BigDecimal pnl = metricsRepo.calcSubPnl(subIdStr, compareTime);
        BigDecimal roi = metricsRepo.calcSubRoi(subIdStr, compareTime);
        BigDecimal maxDrawdown = metricsRepo.calcSubMaxDrawdown(subIdStr);
        BigDecimal maxDrawdownPct = metricsRepo.calcSubMaxDrawdownPct(subIdStr);
        BigDecimal netInvestment = metricsRepo.getLatestNetInvestment(subIdStr);
        BigDecimal totalEquity = metricsRepo.getLatestTotalEquity(subIdStr);

        // Get subscription details (userId, botId)
        // For now, return simple DTO
        return SubscriptionMetricsDTO.builder()
                .subscriptionId(subIdStr)
                .userId("") // TODO: Get from subscription entity
                .botId("") // TODO: Get from subscription entity
                .netInvestment(netInvestment != null ? netInvestment : BigDecimal.ZERO)
                .totalEquity(totalEquity != null ? totalEquity : BigDecimal.ZERO)
                .pnl(pnl != null ? pnl : BigDecimal.ZERO)
                .roi(roi != null ? roi : BigDecimal.ZERO)
                .maxDrawdown(maxDrawdown != null ? maxDrawdown : BigDecimal.ZERO)
                .maxDrawdownPercent(maxDrawdownPct != null ? maxDrawdownPct : BigDecimal.ZERO)
                .build();
    }

    /**
     * Get bot detail with chart data for detail page
     * 
     * @param botId     Bot UUID
     * @param timeframe "1d" | "7d" for chart data
     * @return BotDetailDTO with metrics and chart data
     */
    public com.web.TradeApp.feature.aibot.dto.Bot.BotDetailDTO getBotDetailWithChart(
            UUID botId,
            String timeframe) {

        Bot bot = botRepo.findById(botId)
                .orElseThrow(() -> new IdInvalidException("Bot not found with id: " + botId));

        String botIdStr = botId.toString();
        Instant compareTime = getCompareTime(timeframe);

        // 1. Tính các metrics (reuse existing queries)
        Integer activeSubscribers = metricsRepo.countActiveSubsByBotId(botIdStr);
        BigDecimal totalPnl = metricsRepo.calcBotPnl(botIdStr, compareTime);
        BigDecimal averageRoi = metricsRepo.calcBotRoi(botIdStr, compareTime);
        BigDecimal maxDrawdown = metricsRepo.calcBotMaxDrawdown(botIdStr);
        BigDecimal maxDrawdownPct = metricsRepo.calcBotMaxDrawdownPct(botIdStr);
        BigDecimal totalNetInvestment = metricsRepo.calcBotTotalInvestment(botIdStr);
        BigDecimal totalEquity = metricsRepo.calcBotTotalEquity(botIdStr);

        // 2. Lấy chart data
        List<Object[]> rawChartData = metricsRepo.getBotChartData(botIdStr, compareTime);
        List<com.web.TradeApp.feature.aibot.dto.Bot.ChartDataPoint> chartData = rawChartData.stream()
                .map(row -> {
                    // Convert java.sql.Timestamp to java.time.Instant
                    Instant timestamp = row[0] instanceof java.sql.Timestamp
                            ? ((java.sql.Timestamp) row[0]).toInstant()
                            : (Instant) row[0];

                    return com.web.TradeApp.feature.aibot.dto.Bot.ChartDataPoint.builder()
                            .timestamp(timestamp)
                            .totalPnl((BigDecimal) row[1])
                            .build();
                })
                .collect(Collectors.toList());

        return com.web.TradeApp.feature.aibot.dto.Bot.BotDetailDTO.builder()
                .botId(botIdStr)
                .name(bot.getName())
                .description(bot.getDescription())
                .coinSymbol(bot.getCoinSymbol())
                .tradingPair(bot.getTradingPair() != null ? bot.getTradingPair() : bot.getCoinSymbol() + "/USDT")
                .riskLevel(bot.getRiskLevel() != null ? bot.getRiskLevel().name() : null)
                .category(bot.getCategory() != null ? bot.getCategory().name() : null)
                .status(bot.getStatus() != null ? bot.getStatus().name() : null)
                .fee(bot.getFee() != null ? bot.getFee() : BigDecimal.ZERO)
                .activeSubscribers(activeSubscribers != null ? activeSubscribers : 0)
                .totalPnl(totalPnl != null ? totalPnl : BigDecimal.ZERO)
                .averageRoi(averageRoi != null ? averageRoi : BigDecimal.ZERO)
                .maxDrawdown(maxDrawdown != null ? maxDrawdown : BigDecimal.ZERO)
                .maxDrawdownPercent(maxDrawdownPct != null ? maxDrawdownPct : BigDecimal.ZERO)
                .totalNetInvestment(totalNetInvestment != null ? totalNetInvestment : BigDecimal.ZERO)
                .totalEquity(totalEquity != null ? totalEquity : BigDecimal.ZERO)
                .chartData(chartData)
                .build();
    }

    /**
     * Helper: Sort bots theo field
     */
    private List<BotGridItemDTO> sortBots(List<BotGridItemDTO> bots, String sortBy) {
        return switch (sortBy.toLowerCase()) {
            case "pnl" -> bots.stream()
                    .sorted(Comparator.comparing(BotGridItemDTO::getTotalPnl).reversed())
                    .collect(Collectors.toList());
            case "roi" -> bots.stream()
                    .sorted(Comparator.comparing(BotGridItemDTO::getAverageRoi).reversed())
                    .collect(Collectors.toList());
            case "copied" -> bots.stream()
                    .sorted(Comparator.comparing(BotGridItemDTO::getActiveSubscribers).reversed())
                    .collect(Collectors.toList());
            default -> bots; // No sorting
        };
    }

    /**
     * Helper: Convert timeframe string to Instant
     */
    private Instant getCompareTime(String timeframe) {
        return switch (timeframe.toLowerCase()) {
            case "1d" -> Instant.now().minus(1, ChronoUnit.DAYS);
            case "7d" -> Instant.now().minus(7, ChronoUnit.DAYS);
            case "current" -> Instant.EPOCH;
            default -> throw new IllegalArgumentException("Invalid timeframe: " + timeframe);
        };
    }

    /**
     * Inner DTO class for SubscriptionMetrics
     */
    @lombok.Data
    @lombok.Builder
    @lombok.NoArgsConstructor
    @lombok.AllArgsConstructor
    public static class SubscriptionMetricsDTO implements SubscriptionMetrics {
        private String subscriptionId;
        private String userId;
        private String botId;
        private BigDecimal netInvestment;
        private BigDecimal totalEquity;
        private BigDecimal pnl;
        private BigDecimal roi;
        private BigDecimal maxDrawdown;
        private BigDecimal maxDrawdownPercent;
    }
}
