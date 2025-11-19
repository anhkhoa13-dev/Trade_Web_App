"use client";

import { useState, useMemo } from "react";
import { Bot, Activity, Users } from "lucide-react";

import {
  AdminBot,
  adminBotDatabase,
  AdminBotStatus,
} from "@/entities/mockAdminAiBots";
import { StatsCard } from "./_components/StatsCard";
import BotTable from "./_components/BotTable";
import { BotFilterBar } from "./_components/BotFilterBar";

export default function AdminOverview() {
  const [statusFilter, setStatusFilter] = useState<AdminBotStatus | "all">(
    "all",
  );
  const [coinFilter, setCoinFilter] = useState("all");
  const [sortBy, setSortBy] = useState("copying-users");

  // Stats
  const totalBots = adminBotDatabase.length;
  const activeBots = adminBotDatabase.filter(
    (b) => b.status === "healthy",
  ).length;
  const totalUsers = adminBotDatabase.reduce(
    (sum, b) => sum + b.copyingUsers,
    0,
  );

  const uniqueCoins = Array.from(
    new Set(adminBotDatabase.map((bot) => bot.coin)),
  );

  // Filtering + Sorting
  const filteredBots: AdminBot[] = useMemo(() => {
    return adminBotDatabase
      .filter((bot) => {
        const search = bot.name.toLowerCase();
        const status = statusFilter === "all" || bot.status === statusFilter;
        const coin = coinFilter === "all" || bot.coin === coinFilter;
        return search && status && coin;
      })
      .sort((a, b) => {
        switch (sortBy) {
          case "roi-24h":
            return b.roi1d - a.roi1d;
          case "pnl-24h":
            return b.pnl1d - a.pnl1d;
          case "status": {
            const order: Record<AdminBotStatus, number> = {
              healthy: 1,
              warning: 2,
              critical: 3,
            };
            return order[a.status] - order[b.status];
          }
          default:
            return b.copyingUsers - a.copyingUsers;
        }
      });
  }, [statusFilter, coinFilter, sortBy]);

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

      <BotFilterBar
        uniqueCoins={uniqueCoins}
        coinFilter={coinFilter}
        statusFilter={statusFilter}
        sortBy={sortBy}
        onCoinChange={setCoinFilter}
        onStatusChange={setStatusFilter}
        onSortChange={setSortBy}
      />
      <BotTable bots={adminBotDatabase} />
    </div>
  );
}
