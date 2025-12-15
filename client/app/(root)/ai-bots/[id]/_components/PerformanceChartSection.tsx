"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/app/ui/shadcn/button";
import { Card } from "@/app/ui/shadcn/card";
import PnLLineChart from "@/app/ui/my_components/charts/PnLLineChart";
import MetricBox from "@/app/ui/my_components/MetricBox";
import { TimeWindow } from "@/backend/bot/bot.types";

interface PerformanceChartSectionProps {
  chartData: any;
  totalPnl: number;
  averageRoi: number;
  maxDrawdownPercent: number;
  totalNetInvestment: number;
  totalEquity: number;
  initialTimeframe: TimeWindow;
}

export default function PerformanceChartSection({
  chartData,
  totalPnl,
  averageRoi,
  maxDrawdownPercent,
  totalNetInvestment,
  totalEquity,
  initialTimeframe,
}: PerformanceChartSectionProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const timeframe =
    (searchParams.get("timeframe") as TimeWindow) || initialTimeframe;

  const handleTimeframeChange = (newTimeframe: TimeWindow) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("timeframe", newTimeframe);
    router.push(`?${params.toString()}`);
  };

  return (
    <Card className="border border-border bg-card p-6">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">PnL Performance</h2>
          <div className="flex gap-2">
            <Button
              variant={timeframe === "1d" ? "default" : "outline"}
              size="sm"
              onClick={() => handleTimeframeChange("1d")}
            >
              1D
            </Button>
            <Button
              variant={timeframe === "7d" ? "default" : "outline"}
              size="sm"
              onClick={() => handleTimeframeChange("7d")}
            >
              7D
            </Button>
          </div>
        </div>
        <PnLLineChart chartData={chartData} timeframe={timeframe} />
      </div>

      {/* Metrics Summary Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <MetricBox
          label={`PnL (${timeframe === "1d" ? "24H" : "7D"})`}
          value={`${totalPnl >= 0 ? "+" : ""}$${totalPnl.toFixed(2)}`}
          showTrend={true}
        />
        <MetricBox
          label={`ROI (${timeframe === "1d" ? "24H" : "7D"})`}
          value={`${averageRoi >= 0 ? "+" : ""}${averageRoi.toFixed(2)}%`}
          showTrend={true}
        />
        <MetricBox
          label="Max Drawdown"
          value={`${maxDrawdownPercent.toFixed(2)}%`}
          showTrend={false}
        />
        <MetricBox
          label="Total Net Investment"
          value={`$${totalNetInvestment.toFixed(2)}`}
          showTrend={false}
        />
        <MetricBox
          label="Total Equity"
          value={`$${totalEquity.toFixed(2)}`}
          showTrend={false}
        />
      </div>
    </Card>
  );
}
