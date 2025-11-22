import useAxiosAuth from "@/hooks/useAxiosAuth";
import { BotFormInputs } from "./schemas/bot";
import { AxiosInstance } from "axios";
import { ApiResponse } from "@/lib/type";
import { BotCategory, BotStatus } from "./constants/botConstant";

export interface BotSecretResponse {
  botId: string;
  name: string;
  apiKey: string;
  apiSecret: string;
  webhookUrl: string;
}
export interface BotResponse {
  id: string;
  name: string;
  description?: string;
  category: BotCategory; // Matches BotCategory enum string
  status: BotStatus;
  createdAt: string;

  tradingConfig?: {
    coinSymbol: string;
    tradingPair?: string;
    riskLevel: string;
  };

  integrationConfig?: {
    websocketUrl?: string;
    healthCheckUrl?: string;
  };

  stats?: {
    totalTrades: number;
    uptime: number;
    copyingUsers: number;
    roi24h?: number;
    pnl24h?: number;
    lastSignalAt?: string;
  };
}

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
