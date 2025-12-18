"use server";

import { AdminService } from "@/backend/admin/admin.services";
import { CoinFeeUpdateRequest } from "@/backend/admin/admin.types";

/**
 * Server action to fetch admin assets
 */
export async function getAdminAssets() {
  return await AdminService.getAdminAssets();
}

/**
 * Server action to update coin fees in bulk
 */
export async function updateCoinFees(request: CoinFeeUpdateRequest) {
  return await AdminService.updateCoinFees(request);
}
