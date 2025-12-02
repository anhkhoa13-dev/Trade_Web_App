import { useQuery } from "@tanstack/react-query";
import { fetchBotDetail } from "@/services/botService";
import { TimeWindow } from "@/services/interfaces/botInterfaces";

export const useBotDetail = (botId: string, timeframe: TimeWindow = "7d") => {
  return useQuery({
    queryKey: ["botDetail", botId, timeframe],
    queryFn: () => fetchBotDetail(botId, timeframe as "1d" | "7d"),
    enabled: !!botId,
    staleTime: 30000, // 30 seconds
    retry: 2,
  });
};
