"use server"

import { HistoryService } from "@/backend/history/history.services"
import { BotTransactionParams, ManualTransactionParams } from "@/backend/history/history.types"

export async function getManualTransactions(params: ManualTransactionParams) {
    return await HistoryService.getManualTransactions(params)
}

export async function getBotTransactions(params: BotTransactionParams) {
    return await HistoryService.getBotTransactions(params)
}