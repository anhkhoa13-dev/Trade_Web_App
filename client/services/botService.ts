import useAxiosAuth from "@/hooks/useAxiosAuth";
import { BotFormInputs } from "./schemas/bot";
import axios, { AxiosInstance } from "axios";
import { ApiResponse } from "@/services/constants/type";

import { sfAnd, sfLike } from "spring-filter-query-builder";
import {
  BotSecretResponse,
  BotResponse,
  BotFilterParams,
  BotPaginatedResponse,
  BotMetricsPaginatedResponse,
  BotDetailResponse,
} from "./interfaces/botInterfaces";
import api from "@/lib/api";

export const BotService = (client: AxiosInstance) => ({
  async createBot(formData: BotFormInputs): Promise<BotSecretResponse> {
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

    // 2. Make the request
    console.log(payload);
    const res = await client.post<ApiResponse<BotSecretResponse>>(
      "/admin/bots",
      payload,
      {
        headers: { "Content-Type": "application/json" },
      },
    );
    if (!res.data.data) {
      throw new Error(res.data.message || "Server returned no data");
    }
    return res.data.data;
  },

  async getAllBots(): Promise<BotResponse[]> {
    const res = await client.get<ApiResponse<BotResponse[]>>(`/admin/bots`, {
      params: { includesStats: true },
    });
    if (!res.data.data) return [];
    return res.data.data;
  },

  async getBotForEdit(botId: string): Promise<BotResponse> {
    const res = await client.get<ApiResponse<BotResponse>>(
      `/admin/bots/${botId}`,
      {
        params: { includeStats: true },
      },
    );

    if (!res.data.data) throw new Error("Bot not found");
    return res.data.data;
  },

  async updateBot(
    botId: string,
    formData: BotFormInputs,
  ): Promise<BotResponse> {
    // Map form data to backend DTO
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

    const res = await client.put<ApiResponse<BotResponse>>(
      `/admin/bots/${botId}`,
      payload,
    );

    if (!res.data.data) throw new Error("Failed to update bot");
    return res.data.data;
  },

  async deleteBot(botId: string): Promise<void> {
    await client.delete(`/admin/bots/${botId}`);
  },
});

// Hook to expose the service with the authenticated client
export function useBotService() {
  const axiosAuth = useAxiosAuth();
  return BotService(axiosAuth);
}

// Public api - Fetch bots with metrics
export const fetchBots = async (
  params: BotFilterParams,
): Promise<BotMetricsPaginatedResponse> => {
  const queryParams = new URLSearchParams();

  // Pagination (0-indexed for backend)
  queryParams.append("page", Math.max(0, params.page - 1).toString());
  queryParams.append("size", params.size.toString());

  // Timeframe (backend supports: current, 1d, 7d)
  const timeframe = params.timeWindow || "1d";
  queryParams.append("timeframe", timeframe);

  // Sort by (default to "pnl")
  const sortBy = params.sort || "pnl";
  queryParams.append("sortBy", sortBy);

  // Search by bot name
  if (params.search && params.search.trim()) {
    queryParams.append("search", params.search.trim());
  }

  const response = await api.get<BotMetricsPaginatedResponse>(
    `/metrics/bots?${queryParams.toString()}`,
  );
  return response.data;
};

// Public api - Fetch bot detail with chart data
export const fetchBotDetail = async (
  botId: string,
  timeframe: "1d" | "7d" = "7d",
): Promise<BotDetailResponse> => {
  const response = await api.get<BotDetailResponse>(
    `/metrics/bots/${botId}/detail?timeframe=${timeframe}`,
  );
  return response.data;
};
