import { BotCategory, BotStatus } from "./botConstant";
import { ApiResponse, PaginatedResult } from "../constants/ApiResponse";

export interface BotSecretResponse {
  botId: string;
  name: string;
  webhookToken: string;
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

// New interface for metrics API response
export interface BotMetricsDTO {
  botId: string;
  name: string;
  coinSymbol: string;
  tradingPair: string;
  status: BotStatus;
  activeSubscribers: number;
  totalPnl: number;
  averageRoi: number;
  maxDrawdown: number;
  maxDrawdownPercent: number;
  totalNetInvestment: number;
  totalEquity: number;
}

export type TimeWindow = "1d" | "7d" | "current";
export type SortOption = "pnl" | "roi" | "copied";

export interface BotFilterParams {
  page: number;
  size: number;
  search?: string;
  sort?: SortOption;
  timeWindow?: TimeWindow;
}

export interface ChartDataPoint {
  timestamp: string; // ISO 8601
  totalPnl: number;
}

export interface BotDetailDTO {
  botId: string;
  name: string;
  description?: string;
  coinSymbol: string;
  tradingPair: string;
  riskLevel?: string;
  category?: string;
  status?: string;
  fee: number;
  activeSubscribers: number;
  totalPnl: number;
  averageRoi: number;
  maxDrawdown: number;
  maxDrawdownPercent: number;
  totalNetInvestment: number;
  totalEquity: number;
  chartData: ChartDataPoint[];
}

export type BotPaginatedResponse = PaginatedResult<BotResponse>;
export type BotMetricsPaginatedResponse = PaginatedResult<BotMetricsDTO>;
// export type BotDetailResponse = ApiResponse<BotDetailDTO>;
