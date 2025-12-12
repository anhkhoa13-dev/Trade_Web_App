"use server";

import { BotService } from "@/backend/bot/bot.services";
import { BotFilterParams, TimeWindow } from "@/backend/bot/bot.types";
import { BotFormInputs } from "@/schema/botSchema";
import { revalidatePath } from "next/cache";

// --- Public / Fetch Actions ---

export async function getPublicBotsAction(params: BotFilterParams) {
    return await BotService.fetchBots(params)
}

export async function getBotDetailAction(botId: string, timeframe: TimeWindow = "7d") {
    return await BotService.fetchBotDetail(botId, timeframe)

}

// --- Admin / Fetch Actions ---

export async function getAllBotsAction() {
    return await BotService.getAllBots()
}

export async function getBotForEditAction(botId: string) {
    return await BotService.getBotForEdit(botId)
}

// --- Mutations (Create/Update/Delete) ---

export async function createBotAction(data: BotFormInputs) {
    const res = await BotService.createBot(data);

    // Làm mới cache các trang danh sách
    revalidatePath("/admin/bots")
    revalidatePath("/bots")

    return res
}


export async function updateBotAction(id: string, data: BotFormInputs) {
    const res = await BotService.updateBot(id, data);

    revalidatePath("/admin/bots");
    revalidatePath(`/admin/bots/${id}`);

    return res
}

export async function deleteBotAction(botId: string) {
    await BotService.deleteBot(botId);

    revalidatePath("/admin/bots");
}