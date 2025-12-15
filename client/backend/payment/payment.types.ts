export interface DepositRequest {
  amount: number;
}

export interface DepositResponse {
  url: string;
}

export interface VnPayCallbackResponse {
  amount: number;
  convertedAmount: number;
  status: "SUCCESS" | "FAILED" | "PENDING";
  exchangeRate: number;
  description: string;
}
