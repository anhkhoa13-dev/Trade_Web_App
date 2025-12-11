"use server";

import { BotCopyRequest, BotSubService, BotUpdateRequest } from "@/backend/bot/botSub.services"; // Import Service tĩnh (đã làm ở bước trước)
import { SubscriptionFilterParams } from "@/backend/bot/botSub.types";

import { revalidatePath } from "next/cache";

// --- Fetch Actions ---

export async function getUserSubscriptionsAction(params: SubscriptionFilterParams) {
    try {
        const res = await BotSubService.getAllSubscriptions(params);
        return { success: true, data: res };
    } catch (error: any) {
        console.error("getUserSubscriptionsAction Error:", error);
        return { success: false, error: error.message };
    }
}

export async function getSubscriptionDetailAction(
    subscriptionId: string,
    timeframe: "current" | "1d" | "7d" = "current"
) {
    try {
        const res = await BotSubService.getSubscriptionDetail(subscriptionId, timeframe);
        return { success: true, data: res };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

// --- Mutations ---

export async function copyBotAction(data: BotCopyRequest) {
    try {
        const res = await BotSubService.copyBot(data);

        // Invalidate cache trang danh sách subscription
        revalidatePath("/dashboard/subscriptions"); // Sửa lại path thực tế của bạn

        return { success: true, data: res, message: "Bot copied successfully" };
    } catch (error: any) {
        return {
            success: false,
            error: error.message || "Failed to copy bot strategy"
        };
    }
}

export async function updateBotSubAction(id: string, payload: BotUpdateRequest) {
    try {
        const res = await BotSubService.updateBotSub(id, payload);

        revalidatePath("/dashboard/subscriptions");
        revalidatePath(`/dashboard/subscriptions/${id}`);

        return { success: true, data: res, message: "Configuration updated successfully" };
    } catch (error: any) {
        return {
            success: false,
            error: error.message || "Failed to update configuration"
        };
    }
}

export async function toggleBotStatusAction(id: string, enable: boolean) {
    try {
        const res = await BotSubService.toggleBotSubscriptionStatus(id, enable);

        revalidatePath("/dashboard/subscriptions");
        revalidatePath(`/dashboard/subscriptions/${id}`);

        return { success: true, data: res, message: "Bot status toggled successfully" };
    } catch (error: any) {
        return {
            success: false,
            error: error.message || "Failed to toggle bot status"
        };
    }
}