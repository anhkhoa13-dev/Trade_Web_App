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

export interface BotTransactionParams {
  page?: number;
  size?: number;
  sort?: string;
  coinName?: string;
  fromDate?: string;
  toDate?: string;
}

export interface DepositTransactionDTO {
  id: string;
  createdAt: string;
  amount: number;
  convertedAmount: number | null;
  exchangeRate: number | null;
  status: "SUCCESS" | "PENDING" | "FAILED";
}

export interface DepositTransactionParams {
  page?: number;
  size?: number;
  sort?: string;
  status?: "SUCCESS" | "PENDING" | "FAILED" | null;
}
