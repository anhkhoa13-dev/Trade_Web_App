
import {
    BotSecretResponse,
    BotResponse,
    BotFilterParams,
    BotMetricsPaginatedResponse,
    BotDetailResponse,
    TimeWindow,
} from "./bot.types";
import { api } from "../fetch";
import { BotFormInputs } from "@/schema/botSchema";

export const BotService = {
    // --- Admin / CRUD Operations ---

    async createBot(formData: BotFormInputs) {
        const payload = {
            name: formData.name,
            description: formData.description || null,
            coinSymbol: formData.coinSymbol,
            tradingPair: formData.tradingPair || null,
            category: formData.category,
            riskLevel: formData.riskLevel,
            // Operational URLs
            websocketUrl: formData.websocketUrl || null,
            healthCheckUrl: formData.healthUrl || null,
        };

        const res = await api.post<BotSecretResponse>({
            endpoint: "/admin/bots",
            body: payload,
            withAuth: true,
        });

        return res;
    },

    async getAllBots() {
        const res = await api.get<BotResponse[]>({
            endpoint: "/admin/bots?includesStats=true",
            withAuth: true,
        });
        return res;
    },

    async getBotForEdit(botId: string) {
        const res = await api.get<BotResponse>({
            endpoint: `/admin/bots/${botId}?includeStats=true`,
            withAuth: true,
        });
        return res;
    },

    async updateBot(botId: string, formData: BotFormInputs) {
        const payload = {
            name: formData.name,
            description: formData.description || null,
            coinSymbol: formData.coinSymbol,
            tradingPair: formData.tradingPair || null,
            category: formData.category,
            riskLevel: formData.riskLevel,
            websocketUrl: formData.websocketUrl || null,
            healthCheckUrl: formData.healthUrl || null,
        };

        const res = await api.put<BotResponse>({
            endpoint: `/admin/bots/${botId}`,
            body: payload,
            withAuth: true,
        });
        return res;
    },

    async deleteBot(botId: string) {
        const res = await api.delete<void>({
            endpoint: `/admin/bots/${botId}`,
            withAuth: true,
        });
        return res;
    },

    // --- Public / Metrics Operations ---

    async fetchBots(params: BotFilterParams) {
        const queryParams = new URLSearchParams();

        // Pagination (0-indexed for backend)
        queryParams.append("page", Math.max(0, params.page - 1).toString());
        queryParams.append("size", params.size.toString());

        // Timeframe
        const timeframe = params.timeWindow || "1d";
        queryParams.append("timeframe", timeframe);

        // Sort by
        const sortBy = params.sort || "pnl";
        queryParams.append("sortBy", sortBy);

        // Search
        if (params.search && params.search.trim()) {
            queryParams.append("search", params.search.trim());
        }

        const res = await api.get<BotMetricsPaginatedResponse>({
            endpoint: `/metrics/bots?${queryParams.toString()}`,
            withAuth: false,
        });

        return res;
    },

    async fetchBotDetail(botId: string, timeframe: TimeWindow = "7d") {
        const res = await api.get<BotDetailResponse>({
            endpoint: `/metrics/bots/${botId}/detail?timeframe=${timeframe}`,
            withAuth: false,
        });
        return res;
    },
};