import { HistoryDashboard } from "./_components/HistoryDashboard";
import { getBotTransactions, getManualTransactions } from "@/actions/history.actions";
import { getUserSubscriptions } from "@/actions/botSub.actions";
import { BotSubscription } from "@/backend/bot/botSub.types";

export default async function HistoryPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {

  const params = await searchParams;
  const activeTab = (params.tab as "manual" | "bot") || "manual";
  const page = Number(params.page) || 0;
  const size = Number(params.size) || 10;
  const sort = (params.sort as string) || "createdAt,desc";
  const coinFilter = (params.coinSymbol as string) || "all";
  const sideFilter = (params.side as string) || "all";
  const timeRange = (params.timeRange as string) || "all";
  const botIdParam = (params.botId as string) || undefined;

  // Calculate fromDate and toDate based on timeRange
  let fromDate: string | undefined;
  let toDate: string | undefined;

  if (timeRange !== "all") {
    const now = new Date();
    toDate = now.toISOString();

    switch (timeRange) {
      case "5m":
        fromDate = new Date(now.getTime() - 5 * 60 * 1000).toISOString();
        break;
      case "1h":
        fromDate = new Date(now.getTime() - 60 * 60 * 1000).toISOString();
        break;
      case "24h":
        fromDate = new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString();
        break;
      case "7d":
        fromDate = new Date(
          now.getTime() - 7 * 24 * 60 * 60 * 1000,
        ).toISOString();
        break;
    }
  }

  // 2. Data Fetching Logic (Conditional SSR)
  let manualData = undefined;
  let botData = undefined;
  let botSubscriptions: BotSubscription[] = [];
  let activeBotId = botIdParam;

  // Common filters object
  const commonFilters = {
    page,
    size,
    sort,
    ...(coinFilter !== "all" &&
      activeTab === "manual" && { coinName: coinFilter }),
    ...(sideFilter !== "all" && { type: sideFilter as "BUY" | "SELL" }),
    ...(fromDate && { fromDate }),
    ...(toDate && { toDate }),
  };

  if (activeTab === "manual") {
    const manualResponse = await getManualTransactions(commonFilters);
    if (manualResponse.status === "error")
      throw new Error(manualResponse.message);

    manualData = manualResponse.data;

  } else if (activeTab === "bot") {
    const subResponse = await getUserSubscriptions({
      page: 1,
      size: 100,
      sortBy: "equity",
    });

    if (subResponse.status === "error")
      throw new Error(subResponse.message);

    botSubscriptions = subResponse.data.result;

    // botId URL param -> First bot at list-> undefined
    if (!activeBotId && botSubscriptions.length > 0) {
      activeBotId = botSubscriptions[0].subscriptionId;
    }

    // Fetch Transactions for Bot
    if (activeBotId) {
      const botResponse = await getBotTransactions({
        ...commonFilters,
        botSubId: activeBotId,
      });

      if (botResponse.status === "error") throw new Error(botResponse.message);

      botData = botResponse.data;
    }
  }

  const availableCoins = [
    "Bitcoin",
    "Ethereum",
    "Solana",
    "Avalanche",
    "Dogecoin",
    "Binance",
  ];

  return (
    <HistoryDashboard
      activeTab={activeTab}
      manualData={manualData}
      botData={botData}
      botSubscriptions={botSubscriptions}
      availableCoins={availableCoins}
      currentFilters={{
        coinSymbol: coinFilter,
        side: sideFilter,
        timeRange,
        page,
        size,
        botId: activeBotId
      }}
    />
  );
}
