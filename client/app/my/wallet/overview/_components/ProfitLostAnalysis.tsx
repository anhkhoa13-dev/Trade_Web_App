"use client";

import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/app/ui/shadcn/card";
import { TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";
import PortfolioPerformanceChart from "@/app/my/dashboard/(admin)/coins/_components/PortfolioPerformanceChart";
import { mockPortfolioPerformance } from "@/entities/mockPortfolioPerformance";

// Mock data (temporary, replace later with API)
const profitData = {
  today: 12.47,
  week: -3.84,
  month: 26.92,
};

export default function ProfitLostAnalysis() {
  return (
    <Card className="w-full shadow-sm border border-border bg-card">
      {/* Chart */}
      <CardContent>
        <PortfolioPerformanceChart
          data={mockPortfolioPerformance}
          title="Profit / Loss Analysis"
        />

        {/* Profit boxes */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
          {Object.entries(profitData).map(([period, value]) => {
            const isPositive = value >= 0;
            const Icon = isPositive ? TrendingUp : TrendingDown;

            return (
              <div
                key={period}
                className={cn(
                  `rounded-xl p-4 flex flex-col items-center justify-center
                  border`,
                  isPositive
                    ? "border-emerald-300/40 bg-emerald-100/10"
                    : "border-rose-300/40 bg-rose-100/10",
                )}
              >
                <div className="flex items-center gap-2">
                  <Icon
                    className={cn(
                      "w-4 h-4",
                      isPositive ? "text-emerald-500" : "text-rose-500",
                    )}
                  />
                  <span
                    className={cn(
                      "font-semibold text-lg",
                      isPositive ? "text-emerald-500" : "text-rose-500",
                    )}
                  >
                    {isPositive ? "+" : ""}
                    {Math.abs(value).toFixed(2)} USDT
                  </span>
                </div>
                <span className="text-sm text-muted-foreground capitalize mt-1">
                  {period === "today"
                    ? "Today"
                    : period === "week"
                      ? "This Week"
                      : "This Month"}
                </span>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
