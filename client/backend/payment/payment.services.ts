import { api } from "../fetch";
import {
  DepositRequest,
  DepositResponse,
  VnPayCallbackResponse,
} from "./payment.types";

export const PaymentService = {
  async initiateDeposit(request: DepositRequest) {
    const res = await api.post<DepositResponse>({
      endpoint: `/payments/deposit`,
      body: request,
      withAuth: true,
    });
    return res;
  },
  async verifyVnPayCallback(queryParams: URLSearchParams) {
    const res = await api.post<VnPayCallbackResponse>({
      endpoint: `/payments/vnpay-callback?${queryParams.toString()}`,
      withAuth: true,
    });
    return res;
  },
};
