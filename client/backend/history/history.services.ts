import { PaginatedResult } from "../constants/ApiResponse";
import { api } from "../fetch";
import {
  BotTradeHistoryDTO,
  BotTransactionParams,
  ManualTransactionParams,
  TransactionHistoryDTO,
  DepositTransactionDTO,
  DepositTransactionParams,
} from "./history.types";

export const HistoryService = {
  async getManualTransactions(params: ManualTransactionParams) {
    const queryParams = new URLSearchParams();

    if (params.page !== undefined)
      queryParams.append("page", params.page.toString());
    if (params.size !== undefined)
      queryParams.append("size", params.size.toString());

    if (params.sort) queryParams.append("sort", params.sort);
    if (params.type) queryParams.append("type", params.type);
    if (params.coinName) queryParams.append("coinName", params.coinName);
    if (params.fromDate) queryParams.append("fromDate", params.fromDate);
    if (params.toDate) queryParams.append("toDate", params.toDate);

    const endpoint = `/history/transactions/user?${queryParams.toString()}`;

    console.log(endpoint);

    const res = await api.get<PaginatedResult<TransactionHistoryDTO>>({
      endpoint: endpoint,
      options: {
        cache: "no-store",
      },
      withAuth: true,
    });

    return res;
  },

  async getBotTransactions(params: BotTransactionParams) {
    const queryParams = new URLSearchParams();

    queryParams.append("botSubId", params.botSubId);
    if (params.page !== undefined)
      queryParams.append("page", params.page.toString());
    if (params.size !== undefined)
      queryParams.append("size", params.size.toString());
    if (params.sort) queryParams.append("sort", params.sort);
    if (params.type) queryParams.append("type", params.type);
    if (params.coinName) queryParams.append("coinName", params.coinName);
    if (params.fromDate) queryParams.append("fromDate", params.fromDate);
    if (params.toDate) queryParams.append("toDate", params.toDate);

    const endpoint = `/history/transactions/bot?${queryParams.toString()}`;

    const res = await api.get<PaginatedResult<BotTradeHistoryDTO>>({
      endpoint: endpoint,
      options: {
        cache: "no-store",
      },
      withAuth: true,
    });

    return res;
  },

  async getDepositTransactions(params: DepositTransactionParams) {
    const queryParams = new URLSearchParams();

    if (params.page !== undefined)
      queryParams.append("page", params.page.toString());
    if (params.size !== undefined)
      queryParams.append("size", params.size.toString());
    if (params.sort) queryParams.append("sort", params.sort);
    if (params.status) queryParams.append("status", params.status);

    const endpoint = `/history/payments?${queryParams.toString()}`;

    const res = await api.get<PaginatedResult<DepositTransactionDTO>>({
      endpoint: endpoint,
      options: {
        cache: "no-store",
      },
      withAuth: true,
    });

    return res;
  },
};
