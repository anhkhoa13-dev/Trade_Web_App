import { api } from "../fetch"
import { AssetDTO } from "./wallet.types";

export const WalletService = {
    async getUserAssets() {
        const res = await api.get<AssetDTO>({
            endpoint: `/wallet/assets`,
        })
        return res
    },
}