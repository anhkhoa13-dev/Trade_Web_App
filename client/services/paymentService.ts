import useAxiosAuth from "@/hooks/useAxiosAuth";
import { ApiResponse } from "@/services/constants/type";
import { AxiosInstance } from "axios";

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

export const PaymentService = (client: AxiosInstance) => ({
  async initiateDeposit(request: DepositRequest): Promise<DepositResponse> {
    const res = await client.post<ApiResponse<DepositResponse>>(
      `/payments/deposit`,
      request,
    );

    if (!res.data.data) {
      throw new Error(res.data.message || "Failed to initiate payment");
    }

    return res.data.data;
  },

  async verifyVnPayCallback(
    queryParams: URLSearchParams,
  ): Promise<VnPayCallbackResponse> {
    const res = await client.post<ApiResponse<VnPayCallbackResponse>>(
      `/payments/vnpay-callback?${queryParams.toString()}`,
    );

    if (!res.data.data) {
      throw new Error(res.data.message || "Failed to verify payment");
    }

    return res.data.data;
  },
});

export function usePaymentService() {
  const axiosAuth = useAxiosAuth();
  return PaymentService(axiosAuth);
}
