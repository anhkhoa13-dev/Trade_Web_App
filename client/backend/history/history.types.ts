import { ApiResponse, PaginatedResult } from "../constants/ApiResponse";

export interface TransactionHistoryDTO {
    id: string;
    createdAt: string;
    type: "BUY" | "SELL";
    coinName: string;
    coinSymbol: string;
    coinGeckoId: string;
    quantity: number;
    priceAtExecution: number;
    notionalValue: number;
    feeTradeApplied: number;
}

export interface BotTradeHistoryDTO {
    id: string;
    createdAt: string;
    type: "BUY" | "SELL";
    botName: string;
    coinName: string;
    coinSymbol: string;
    coinGeckoId: string;
    quantity: number;
    priceAtExecution: number;
    notionalValue: number;
    feeBotApplied: number;
}

export type HistoryResponse<T> = ApiResponse<PaginatedResult<T>>;

export interface ManualTransactionParams {
    page?: number;
    size?: number;
    sort?: string;
    type?: "BUY" | "SELL" | null;
    coinName?: string;
    fromDate?: string;
    toDate?: string;
}

export interface BotTransactionParams {
    botSubId: string;
    page?: number;
    size?: number;
    sort?: string;
    type?: "BUY" | "SELL" | null;
    coinName?: string;
    fromDate?: string;
    toDate?: string;
}