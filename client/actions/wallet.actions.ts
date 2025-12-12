"use server"

import { WalletService } from "@/backend/wallet/wallet.services"

export const getWallet = async () => {
    return await WalletService.getUserAssets()
}