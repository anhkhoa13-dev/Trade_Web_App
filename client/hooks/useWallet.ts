"use client";

import { useWalletService } from "@/services/walletService";
import { useQuery } from "@tanstack/react-query";
import { toast } from "react-hot-toast";

export function useWallet() {
  const walletService = useWalletService();

  const asset = useQuery({
    queryKey: ["wallet", "assets"],
    queryFn: async () => {
      try {
        const assets = await walletService.getUserAssets();
        console.log("Fetched wallet assets:", assets);
        return assets;
      } catch (error: any) {
        toast.error("Failed to load wallet assets");
        throw error;
      }
    },
    staleTime: 5 * 60 * 1000, // cache for 5 minutes
    retry: 1,
  });

  return asset;
}
