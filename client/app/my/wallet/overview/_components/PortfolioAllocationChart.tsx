"use client";

import React, { useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { useTheme } from "next-themes";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/app/ui/shadcn/card";
import { Loader2, PieChart } from "lucide-react";

import { useLiveMarket } from "@/hooks/ws/useLiveMarketStream";
import { AssetDTO } from "@/backend/wallet/wallet.types";
import { MarketCoin } from "@/entities/Coin/MarketCoin";

// Avoid SSR issues
const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

type AllocationItem = {
  symbol: string;
  name: string;
  value: number;
};

type LegendItem = {
  label: string;
  value: number;
  percent: number;
  color: string;
};

interface PortfolioAllocationChartProps {
  title?: string;
  subtitle?: string;
  topN?: number;
  walletData: AssetDTO; // Đã bỏ | null
}

export default function PortfolioAllocationChart({
  title = "Portfolio Allocation",
  subtitle = "Distribution of your assets by percentage",
  topN = 5,
  walletData,
}: PortfolioAllocationChartProps) {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  // --- 1. ADAPTER ---
  const initialCoins = useMemo<MarketCoin[]>(() => {
    if (!walletData.coinHoldings) return [];
    return walletData.coinHoldings.map((coin) => ({
      id: coin.coinSymbol,
      symbol: coin.coinSymbol,
      name: coin.coinName,
      image: "",
      market_cap_rank: 0,
      price: 0,
      changePercent: 0,
      lastUpdate: Date.now(),
      quoteVolume: 0,
      history: [],
    }));
  }, [walletData]);

  const marketDataList = useLiveMarket(initialCoins);

  const tickers = useMemo(() => {
    const map: Record<string, MarketCoin> = {};
    marketDataList.forEach((coin) => {
      map[coin.symbol] = coin;
    });
    return map;
  }, [marketDataList]);

  // --- 2. LOGIC TÍNH TOÁN ---
  const items: AllocationItem[] = useMemo(() => {
    if (!walletData.coinHoldings) return [];

    return walletData.coinHoldings.map((coin) => {
      // Nếu chưa có ticker (WS chưa về), tạm tính value = 0 để không crash
      const ticker = tickers[coin.coinSymbol];
      const coinValue = ticker ? coin.amount * ticker.price : 0;
      return {
        symbol: coin.coinSymbol,
        name: coin.coinName,
        value: coinValue,
      };
    });
  }, [walletData, tickers]);

  // Colors
  const colors = [
    "#2563EB", "#10B981", "#F59E0B", "#8B5CF6", "#EF4444", "#6B7280",
  ];

  const { labels, series, legendData, totalPortfolioValue } = useMemo(() => {
    // Lọc bỏ các item có value <= 0 để tránh lỗi chart
    const activeItems = items
      .filter((i) => i.value > 0)
      .sort((a, b) => b.value - a.value);

    if (activeItems.length === 0) {
      return { labels: [], series: [], legendData: [], totalPortfolioValue: 0 };
    }

    const top = activeItems.slice(0, topN);
    const rest = activeItems.slice(topN);

    const total = activeItems.reduce((s, x) => s + x.value, 0) || 1;

    const topPercents = top.map((x) => (x.value / total) * 100);
    const otherValue = rest.reduce((s, x) => s + x.value, 0);
    const otherPercent = (otherValue / total) * 100;

    const finalLabels = top.map((x) => x.symbol);
    const finalSeries = topPercents;
    const finalValues = top.map((x) => x.value);

    if (rest.length > 0 && otherValue > 0) {
      finalLabels.push("Other");
      finalSeries.push(otherPercent);
      finalValues.push(otherValue);
    }

    // Làm tròn để tổng = 100%
    const sum = finalSeries.reduce((s, v) => s + v, 0);
    const diff = 100 - sum;
    if (Math.abs(diff) > 0.01) {
      finalSeries[finalSeries.length - 1] += diff;
    }

    const legendItems: LegendItem[] = finalLabels.map((label, index) => ({
      label: label,
      percent: parseFloat(finalSeries[index].toFixed(2)),
      value: finalValues[index],
      color: colors[index % colors.length],
    }));

    return {
      labels: finalLabels,
      series: finalSeries.map((v) => parseFloat(v.toFixed(2))),
      legendData: legendItems,
      totalPortfolioValue: total,
    };
  }, [items, topN]);

  const options: ApexCharts.ApexOptions = useMemo(
    () => ({
      chart: {
        type: "donut",
        background: "transparent",
        toolbar: { show: false },
        animations: { enabled: false },
        events: {
          dataPointMouseEnter: (event, chartContext, config) => {
            if (config.dataPointIndex !== undefined && config.dataPointIndex !== null) {
              setActiveIndex(config.dataPointIndex);
            }
          },
          dataPointMouseLeave: () => {
            setActiveIndex(null);
          },
        },
      },
      theme: { mode: isDark ? "dark" : "light" },
      labels,
      colors: colors.slice(0, series.length),
      legend: { show: false },
      dataLabels: { enabled: false },
      tooltip: {
        enabled: true,
        theme: isDark ? "dark" : "light",
        y: {
          formatter: (val: number) => `${val.toFixed(2)}%`,
        },
      },
      stroke: { show: false },
      plotOptions: {
        pie: {
          donut: {
            size: "70%",
            labels: {
              show: true,
              name: {
                show: true,
                fontSize: "14px",
                fontWeight: 400,
                color: isDark ? "#94a3b8" : "#64748b",
                offsetY: -4,
              },
              value: {
                show: true,
                fontSize: "20px",
                fontWeight: 500,
                color: isDark ? "#ffffff" : "#0f172a",
                offsetY: 8,
                formatter: (val: number) => {
                  return `$${val.toLocaleString(undefined, {
                    notation: "compact",
                    maximumFractionDigits: 1,
                  })}`;
                },
              },
              total: {
                show: true,
                showAlways: true,
                label:
                  activeIndex !== null && legendData[activeIndex]
                    ? legendData[activeIndex].label
                    : "Total Assets",
                fontSize: "14px",
                fontWeight: 500,
                color: isDark ? "#94a3b8" : "#64748b",
                formatter: () => {
                  const value =
                    activeIndex !== null && legendData[activeIndex]
                      ? legendData[activeIndex].value
                      : totalPortfolioValue;

                  return `$${value.toLocaleString(undefined, {
                    notation: "compact",
                    maximumFractionDigits: 1,
                  })}`;
                },
              },
            },
          },
        },
      },
    }),
    [isDark, labels, series, legendData, totalPortfolioValue, activeIndex]
  );

  // Determine State
  const hasHoldings = walletData.coinHoldings && walletData.coinHoldings.length > 0;
  const hasSeries = series.length > 0;

  return (
    <Card className="w-full h-full flex flex-col">
      <CardHeader className="pb-2 flex-shrink-0">
        <CardTitle className="text-lg font-semibold">{title}</CardTitle>
        <CardDescription className="text-sm text-muted-foreground">
          {subtitle}
        </CardDescription>
      </CardHeader>

      <CardContent className="flex-1 min-h-0 pb-6">
        {!hasHoldings ? (
          // Case 1: Ví rỗng
          <div className="flex flex-col items-center justify-center h-[280px] text-muted-foreground space-y-2">
            <PieChart className="h-10 w-10 opacity-20" />
            <span className="text-sm">No assets found</span>
          </div>
        ) : !hasSeries ? (
          // Case 2: Có coin nhưng chưa có giá (đang đợi WS)
          <div className="flex items-center justify-center h-[280px]">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : (
          // Case 3: Hiển thị Chart
          <div className="grid grid-cols-1 md:grid-cols-[40%_60%] gap-4 items-center h-[280px]">
            <div className="relative w-full flex items-center justify-center h-[300px] md:h-[200px]">
              <ReactApexChart
                options={options}
                series={series}
                type="donut"
                height={"100%"}
                width={"100%"}
              />
            </div>

            <div className="hidden md:flex flex-col h-full overflow-y-auto pr-2 custom-scrollbar">
              <div className="flex flex-col space-y-1">
                {legendData.map((item) => (
                  <div
                    key={item.label}
                    className="flex items-center justify-between px-2 py-1.5 rounded-lg hover:bg-muted/50 transition-colors text-sm border border-transparent shrink-0 cursor-default"
                  >
                    <div className="flex items-center gap-2.5">
                      <span
                        className="h-2.5 w-2.5 rounded-full shrink-0"
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="font-medium truncate max-w-[80px]">
                        {item.label}
                      </span>
                    </div>

                    <div className="text-right">
                      <div className="font-semibold tabular-nums text-foreground text-xs">
                        {item.percent.toFixed(2)}%
                      </div>
                      <div className="text-[10px] text-muted-foreground">
                        ${item.value.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}