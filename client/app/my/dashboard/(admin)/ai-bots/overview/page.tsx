import { Bot, Activity, Users } from "lucide-react";
import { StatsCard } from "./_components/StatsCard";
import BotTable from "./_components/BotTable";
import { BotFilterBar } from "./_components/BotFilterBar";
import { BotStatus } from "@/backend/bot/botConstant";
import { BotMetricsDTO, BotResponse } from "@/backend/bot/bot.types";
import { getPublicBotsAction } from "@/actions/bot.actions";

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function AdminBotPage(props: PageProps) {
  const searchParams = await props.searchParams;

  const statusFilter = (searchParams.status as BotStatus | "all") || "all";
  const coinFilter = (searchParams.coin as string) || "all";
  const sortBy = (searchParams.sort as string) || "copying-users";

  const botsReponse = await getPublicBotsAction({
    page: 1,
    size: 10,
  });

  if (botsReponse.status == "error") throw new Error(botsReponse.message);

  const allBots = botsReponse.data;
  const allBotsData = allBots.result;
  const meta = allBots.meta;
  // Calculate Stats (Server Side)
  const totalBots = meta.total;
  const activeBots = allBotsData.filter((b) => b.status === "ACTIVE").length;
  const totalUsers = allBotsData.reduce(
    (sum, b) => sum + (b.activeSubscribers || 0),
    0
  );

  // Extract Unique Coins
  const uniqueCoins = Array.from(
    new Set(
      allBotsData
        .map((b) => b.coinSymbol)
        .filter((symbol): symbol is string => !!symbol)
    )
  );

  // 6. Filter & Sort Logic (Chuyển từ useMemo client sang xử lý Server)
  let filteredBots = allBotsData.filter((bot) => {
    const statusMatch = statusFilter === "all" || bot.status === statusFilter;
    const coinMatch = coinFilter === "all" || bot.coinSymbol === coinFilter;
    return statusMatch && coinMatch;
  });

  filteredBots.sort((a, b) => {
    const getRoi = (bot: BotMetricsDTO) => bot.averageRoi ?? 0;
    const getPnl = (bot: BotMetricsDTO) => bot.totalPnl ?? 0;
    const getUsers = (bot: BotMetricsDTO) => bot.activeSubscribers ?? 0;

    switch (sortBy) {
      case "roi-24h":
        return getRoi(b) - getRoi(a);
      case "pnl-24h":
        return getPnl(b) - getPnl(a);
      case "status": {
        const order: Record<string, number> = {
          ACTIVE: 1,
          PAUSED: 2,
          ERROR: 3,
        };
        return (order[a.status] || 99) - (order[b.status] || 99);
      }
      default: // "copying-users"
        return getUsers(b) - getUsers(a);
    }
  });

  return (
    <div className="flex flex-col space-y-8 max-w-7xl mx-auto px-6 py-10">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold">Admin Dashboard</h1>
        <p className="text-muted-foreground">
          Monitor and manage all AI trading bots across the platform
        </p>
      </div>

      {/* Overview Cards */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <StatsCard
          label="Total Bots"
          value={totalBots}
          icon={<Bot className="h-6 w-6 text-primary" />}
          accent="bg-primary"
        />
        <StatsCard
          label="Active Bots"
          value={activeBots}
          icon={<Activity className="h-6 w-6 text-[var(--chart-3)]" />}
          accent="bg-[var(--chart-3)]"
        />
        <StatsCard
          label="Total Copying Users"
          value={totalUsers.toLocaleString()}
          icon={<Users className="h-6 w-6 text-[var(--chart-2)]" />}
          accent="bg-[var(--chart-2)]"
        />
      </div>

      {/* Filter Bar & Table */}
      <BotFilterBar
        uniqueCoins={uniqueCoins}
        coinFilter={coinFilter}
        statusFilter={statusFilter as any}
        sortBy={sortBy}
      />

      <BotTable bots={filteredBots} />
    </div>
  );
}
