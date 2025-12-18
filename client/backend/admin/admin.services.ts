import { api } from "../fetch";
import { AdminAssetsDTO, CoinFeeUpdateRequest } from "./admin.types";

export const AdminService = {
  /**
   * Fetch admin assets including balance, holdings, and performance metrics
   */
  async getAdminAssets() {
    const response = await api.get<AdminAssetsDTO>({
      endpoint: "/admin/assets",
      withAuth: true,
    });
    console.log("response = ", response.data?.coinHoldings);
    return response;
  },

  /**
   * Update coin fees in bulk
   */
  async updateCoinFees(request: CoinFeeUpdateRequest) {
    console.log("Updating coin fees with request:", request);
    const response = await api.put({
      endpoint: "/admin/coins/fees",
      body: request,
      withAuth: true,
    });
    console.log("Update coin fees response:", response);
    return response;
  },
};
