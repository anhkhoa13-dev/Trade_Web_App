"use server";

import { BotCopyRequest, BotSubService, BotUpdateRequest } from "@/backend/bot/botSub.services";
import { SubscriptionFilterParams } from "@/backend/bot/botSub.types";

import { revalidatePath } from "next/cache";

export async function getUserSubscriptions(params: SubscriptionFilterParams) {
    return await BotSubService.getAllSubscriptions(params);

}

export async function getSubscriptionDetail(
    subscriptionId: string,
    timeframe: "current" | "1d" | "7d" = "current"
) {

    return await BotSubService.getSubscriptionDetail(subscriptionId, timeframe);

}

export async function getBotSubOverview() {
    return await BotSubService.getBotSubOverview()
}

// --- Mutations ---

export async function copyBot(data: BotCopyRequest) {
    const res = await BotSubService.copyBot(data);

    // Invalidate cache
    revalidatePath("/dashboard/subscriptions")

    return res
}

export async function updateBotSub(id: string, payload: BotUpdateRequest) {
    const res = await BotSubService.updateBotSub(id, payload)

    revalidatePath("/dashboard/subscriptions");
    revalidatePath(`/dashboard/subscriptions/${id}`)

    return res
}

export async function toggleBotStatus(id: string, enable: boolean) {
    const res = await BotSubService.toggleBotSubscriptionStatus(id, enable)

    revalidatePath("/dashboard/subscriptions");
    revalidatePath(`/dashboard/subscriptions/${id}`)

    return res
}
