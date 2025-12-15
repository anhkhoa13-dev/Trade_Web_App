"use client";

import { Input } from "@/app/ui/shadcn/input";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/app/ui/shadcn/select";
import { SortOption, TimeWindow } from "@/backend/bot/bot.types";
import { cn } from "@/lib/utils";
import { SlidersHorizontal } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

interface FilterSortBarProps {
  enableSearch?: boolean;
  searchValue: string;
  sortValue: SortOption;
  timeWindow: TimeWindow;
  pageNumber?: number;
  className?: string;
}

export function FilterSortBar({
  enableSearch = true,
  searchValue,
  sortValue,
  timeWindow,
  pageNumber,
  className,
}: FilterSortBarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const updateParams = (updates: Record<string, string>) => {
    const params = new URLSearchParams(searchParams.toString());

    Object.entries(updates).forEach(([key, value]) => {
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    });

    // Reset to page 1 when filters change
    if (
      updates.search !== undefined ||
      updates.sort !== undefined ||
      updates.timeWindow !== undefined
    ) {
      params.set("page", "1");
    }

    router.push(`?${params.toString()}`);
  };

  return (
    <div
      className={cn(
        `w-full flex flex-col md:flex-row md:items-center md:justify-between
        gap-4 `,
        className
      )}
    >
      {/* Left side: Search */}
      {enableSearch && (
        <Input
          placeholder="Search bots..."
          value={searchValue}
          onChange={(e) => updateParams({ search: e.target.value })}
          className="w-full md:max-w-xs"
        />
      )}

      {pageNumber && <div> Page {pageNumber} </div>}

      {/* Right side: Dropdowns */}
      <div className="flex items-center gap-3">
        {/* Sort Dropdown */}
        <Select
          value={sortValue}
          onValueChange={(v) => updateParams({ sort: v })}
        >
          <SelectTrigger className="w-[150px]">
            <SlidersHorizontal className="w-5 h-5" />
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="pnl">Top PnL</SelectItem>
            <SelectItem value="roi">Top ROI</SelectItem>
            <SelectItem value="copied">Most Copied</SelectItem>
          </SelectContent>
        </Select>

        {/* Time Window Dropdown */}
        <Select
          value={timeWindow}
          onValueChange={(v) => updateParams({ timeWindow: v })}
        >
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Time Range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1d">24 Hours</SelectItem>
            <SelectItem value="7d">7 Days</SelectItem>
            <SelectItem value="current">All Time</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
