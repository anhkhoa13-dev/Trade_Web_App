import { api } from "../fetch";
import { BotTradeHistoryDTO, BotTransactionParams, HistoryResponse, ManualTransactionParams, TransactionHistoryDTO } from "./history.types";

export const HistoryService = {
    async getManualTransactions(
        params: ManualTransactionParams,
    ) {
        const queryParams = new URLSearchParams();

        if (params.page !== undefined)
            queryParams.append("page", params.page.toString())
        if (params.size !== undefined)
            queryParams.append("size", params.size.toString())

        if (params.sort) queryParams.append("sort", params.sort)
        if (params.type) queryParams.append("type", params.type)
        if (params.coinName) queryParams.append("coinName", params.coinName)
        if (params.fromDate) queryParams.append("fromDate", params.fromDate)
        if (params.toDate) queryParams.append("toDate", params.toDate)

        const endpoint = `/history/transactions/user?${queryParams.toString()}`

        const res = await api.get<HistoryResponse<TransactionHistoryDTO>>({
            endpoint: endpoint,
            options: {
                cache: "no-store",
            },
            withAuth: true
        })

        return res
    },

    async getBotTransactions(
        params: BotTransactionParams,
    ) {
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

        const res = await api.get<HistoryResponse<BotTradeHistoryDTO>>({
            endpoint: endpoint,
            options: {
                cache: "no-store",
            },
            withAuth: true
        })

        return res
    }
}