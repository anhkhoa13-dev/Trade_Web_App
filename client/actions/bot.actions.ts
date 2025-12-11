"use server";


import { BotService } from "@/backend/bot/bot.services";
import { BotFilterParams, TimeWindow } from "@/backend/bot/bot.types";
import { BotFormInputs } from "@/schema/bot";

import { revalidatePath } from "next/cache";

// --- Public / Fetch Actions ---

export async function getPublicBotsAction(params: BotFilterParams) {
    try {
        const res = await BotService.fetchBots(params);
        return { success: true, data: res.data }; // Trả về data đã unwrap từ ApiResponse
    } catch (error: any) {
        console.error("getPublicBotsAction Error:", error);
        return { success: false, error: error.message };
    }
}

export async function getBotDetailAction(botId: string, timeframe: TimeWindow = "7d") {
    try {
        const res = await BotService.fetchBotDetail(botId, timeframe);
        return { success: true, data: res.data };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

// --- Admin / Fetch Actions ---

export async function getAllBotsAction() {
    try {
        const res = await BotService.getAllBots();
        return { success: true, data: res };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

export async function getBotForEditAction(botId: string) {
    try {
        const res = await BotService.getBotForEdit(botId);
        return { success: true, data: res };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

// --- Mutations (Create/Update/Delete) ---

export async function createBotAction(data: BotFormInputs) {
    try {
        const res = await BotService.createBot(data);

        // Làm mới cache các trang danh sách
        revalidatePath("/admin/bots");
        revalidatePath("/bots"); // Ví dụ trang public

        return { success: true, data: res, message: `Bot "${res.data?.name}" created successfully!` };
    } catch (error: any) {
        return {
            success: false,
            error: error.message || "Failed to create bot"
        };
    }
}

export async function updateBotAction(id: string, data: BotFormInputs) {
    try {
        const res = await BotService.updateBot(id, data);

        revalidatePath("/admin/bots");
        revalidatePath(`/admin/bots/${id}`);

        return { success: true, data: res, message: "Bot updated successfully!" };
    } catch (error: any) {
        return { success: false, error: error.message || "Failed to update bot" };
    }
}

export async function deleteBotAction(botId: string) {
    try {
        await BotService.deleteBot(botId);

        revalidatePath("/admin/bots");

        return { success: true, message: "Bot deleted successfully" };
    } catch (error: any) {
        return { success: false, error: error.message || "Failed to delete bot" };
    }
}