"use client";

import { Plus, SlidersHorizontal } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/ui/shadcn/select";
import { Button } from "@/app/ui/shadcn/button";
import { useRouter, useSearchParams } from "next/navigation";

interface BotFilterBarProps {
  uniqueCoins: string[];
  coinFilter: string;
  statusFilter: string;
  sortBy: string;
}

export function BotFilterBar({
  uniqueCoins,
  coinFilter,
  statusFilter,
  sortBy,
}: BotFilterBarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const updateParam = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value && value !== "all") {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`?${params.toString()}`);
  };

  const handleCreateBot = () => {
    router.push("/my/dashboard/ai-bots/create");
  };

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 w-full">
      <div className="flex flex-wrap gap-3">
        {/* Coin Filter */}
        <Select
          value={coinFilter}
          onValueChange={(val) => updateParam("coin", val)}
        >
          <SelectTrigger className="w-[130px]">
            <SelectValue placeholder="Coin" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Coins</SelectItem>
            {uniqueCoins.map((c) => (
              <SelectItem key={c} value={c}>
                {c}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Status Filter */}
        <Select
          value={statusFilter}
          onValueChange={(val) => updateParam("status", val)}
        >
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="ACTIVE">Healthy (Active)</SelectItem>
            <SelectItem value="PAUSED">Warning (Paused)</SelectItem>
            <SelectItem value="ERROR">Critical (Error)</SelectItem>
          </SelectContent>
        </Select>

        {/* Sort Menu */}
        <Select
          value={sortBy}
          onValueChange={(val) => updateParam("sort", val)}
        >
          <SelectTrigger className="w-[180px]">
            <SlidersHorizontal className="mr-2 h-4 w-4" />
            <SelectValue placeholder="Sort" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="copying-users">Copying Users</SelectItem>
            <SelectItem value="roi-24h">ROI (24h)</SelectItem>
            <SelectItem value="pnl-24h">PnL (24h)</SelectItem>
            <SelectItem value="status">Status</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Button onClick={handleCreateBot} className="flex items-center gap-2">
        <Plus className="w-4 h-4" />
        Create Bot
      </Button>
    </div>
  );
}