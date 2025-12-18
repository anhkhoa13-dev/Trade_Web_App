
import { PaginatedResult } from "../constants/ApiResponse";
import { api } from "../fetch";
import {
    BotSubscriptionDetail,
    SubscriptionFilterParams,
    BotSubOverview,
    BotSubscription,
} from "./botSub.types";

export type BotCopyRequest = {
    botId: string;
    botWalletBalance: number;
    botWalletCoin: number;
    tradePercentage: number;
    maxDailyLossPercentage: number;
};

export type BotUpdateRequest = {
    botWalletBalance: number;
    botWalletCoin: number;
    tradePercentage: number;
    maxDailyLossPercentage: number;
};

export type BotSubscriptionResponse = {
    id: string;
    botId: string;
    botName: string;
    userId: string;
    allocatedAmount: number;
    allocatedCoin: number;
    tradePercentage: number;
    status: string;
    totalProfit: number;
    startedAt: string;
};

export const BotSubService = {
    async copyBot(payload: BotCopyRequest) {
        const res = await api.post<BotSubscriptionResponse>({
            endpoint: "/bot-sub",
            body: payload,
            withAuth: true,
        });

        return res
    },

    async updateBotSub(
        botSubId: string,
        payload: BotUpdateRequest,
    ) {
        const res = await api.put<BotSubscriptionResponse>({
            endpoint: `/bot-sub/${botSubId}`,
            body: payload,
            withAuth: true,
        });

        return res
    },

    async getAllSubscriptions(
        params: SubscriptionFilterParams,
    ) {
        const queryParams = new URLSearchParams();

        // Pagination (0-indexed for backend)
        queryParams.append("page", Math.max(0, params.page - 1).toString());
        queryParams.append("size", params.size.toString());

        // Sort by
        if (params.sortBy) {
            queryParams.append("sortBy", params.sortBy);
        }

        const res = await api.get<PaginatedResult<BotSubscription>>({
            endpoint: `/bot-sub?${queryParams.toString()}`,
            options: {
                cache: "no-store",
            },
            withAuth: true,
        });


        return res
    },

    /**
     * Fetch detailed subscription metrics
     */
    async getSubscriptionDetail(
        subscriptionId: string,
        timeframe: "current" | "1d" | "7d" = "current",
    ) {
        const res = await api.get<BotSubscriptionDetail>({
            endpoint: `/bot-sub/${subscriptionId}?timeframe=${timeframe}`,
            withAuth: true,
        })

        return res
    },

    // Toggle activate or deactivate bot subscription
    async toggleBotSubscriptionStatus(
        subscriptionId: string,
        enable: boolean,
    ) {
        const endpoint = `/bot-sub/${subscriptionId}/status?active=${enable}`

        const res = await api.patch<BotSubscriptionResponse>({
            endpoint: endpoint,
            withAuth: true,
        })

        return res
    },

    async getBotSubOverview() {
        return await api.get<BotSubOverview>({
            endpoint: `/bot-sub/overview`,
            options: {
                cache: "no-store",
            },
            withAuth: true
        })
    }
};