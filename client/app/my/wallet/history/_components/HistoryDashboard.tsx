"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Download } from "lucide-react";
import { Button } from "@/app/ui/shadcn/button";
import { Card } from "@/app/ui/shadcn/card";
import toast from "react-hot-toast";
import { BotTransactionsView } from "./BotTransactionsView";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/ui/shadcn/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/ui/shadcn/tabs";

import { ManualTransactionsTable } from "./ManualTransactionsTable";
import { BotTradeHistoryDTO, TransactionHistoryDTO } from "@/backend/history/history.types";
import { PaginatedResult } from "@/backend/constants/ApiResponse";
import { BotSubscription } from "@/backend/bot/botSub.types";

interface HistoryDashboardProps {
  activeTab: "manual" | "bot";
  manualData?: PaginatedResult<TransactionHistoryDTO>;
  botData?: PaginatedResult<BotTradeHistoryDTO>;
  botSubscriptions: BotSubscription[];
  availableCoins: string[];
  currentFilters: {
    coinSymbol: string;
    side: string;
    timeRange: string;
    page: number;
    size: number;
    botId?: string;
  };
}

export function HistoryDashboard({
  activeTab,
  manualData,
  botData,
  botSubscriptions,
  availableCoins,
  currentFilters,
}: HistoryDashboardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const manualTradesCount = manualData?.meta.total;
  const botTradesCount = botData?.meta.total;

  const updateFilter = (key: string, value: string) => {
    const currentParam = searchParams.get(key);
    if (currentParam === value) return;

    const params = new URLSearchParams(searchParams.toString());

    if (value === "all") {
      params.delete(key);
    } else {
      params.set(key, value);
    }

    if (key !== "page") {
      params.set("page", "0");
    }

    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const handleExport = () => {
    toast.success("Transaction history exported successfully");
  };

  return (
    <div className="mx-auto max-w-[1600px] space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="mb-2 text-3xl font-bold">Transaction History</h1>
          <p className="text-muted-foreground">
            View and manage all your trading activity
          </p>
        </div>
        <Button variant="outline" className="gap-2" onClick={handleExport}>
          <Download className="h-4 w-4" />
          Export Data
        </Button>
      </div>

      {/* Filter & Control Bar */}
      <Tabs
        className="w-full"
        value={activeTab}
        onValueChange={(val) => updateFilter("tab", val)}
      >
        <Card className="shadow-sm">
          <div className="space-y-4 p-6">

            <TabsList className="grid w-full max-w-md grid-cols-2">
              <TabsTrigger value="manual">
                Manual Orders{" "}
                {manualTradesCount !== undefined && `(${manualTradesCount})`}
              </TabsTrigger>
              <TabsTrigger value="bot">
                Bot Transactions{" "}
                {botTradesCount !== undefined && `(${botTradesCount})`}
              </TabsTrigger>
            </TabsList>


            <div className="flex flex-wrap gap-4">
              {/* Time Range Filter */}
              <Select
                value={currentFilters.timeRange}
                onValueChange={(val) => updateFilter("timeRange", val)}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Time Range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Time</SelectItem>
                  <SelectItem value="5m">Last 5 Minutes</SelectItem>
                  <SelectItem value="1h">Last 1 Hour</SelectItem>
                  <SelectItem value="24h">Last 24 Hours</SelectItem>
                  <SelectItem value="7d">Last 7 Days</SelectItem>
                </SelectContent>
              </Select>

              {/* Coin Filter - Only show for manual tab */}
              {activeTab === "manual" && (
                <Select
                  value={currentFilters.coinSymbol}
                  onValueChange={(val) => updateFilter("coinSymbol", val)}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Coin" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Coins</SelectItem>
                    {availableCoins.map((coin) => (
                      <SelectItem key={coin} value={coin}>
                        {coin}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}

              {/* Side Filter */}
              <Select
                value={currentFilters.side}
                onValueChange={(val) => updateFilter("side", val)}
              >
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Side" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Sides</SelectItem>
                  <SelectItem value="BUY">Buy</SelectItem>
                  <SelectItem value="SELL">Sell</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </Card>

        {/* Main Content - Render based on Active Tab with Smooth Transition */}
        <TabsContent value="manual" className="mt-0">
          {manualData ? (
            <ManualTransactionsTable
              data={manualData}
              currentPage={currentFilters.page}
              pageSize={currentFilters.size}
            />
          ) : (
            <div className="p-4 text-center">Loading manual data...</div>
          )}
        </TabsContent>

        <TabsContent value="bot" className="mt-0">
          {botData ? (
            <BotTransactionsView
              data={botData}
              subscriptions={botSubscriptions}
              selectedBotId={currentFilters.botId}
              currentPage={currentFilters.page}
              pageSize={currentFilters.size}
            />
          ) : (
            <div className="p-4 text-center">Loading bot data...</div>
          )
          }
        </TabsContent>
      </Tabs>
    </div >
  );
}