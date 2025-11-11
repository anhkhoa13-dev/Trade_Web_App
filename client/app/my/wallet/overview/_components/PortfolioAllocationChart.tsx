"use client";

import React, { useMemo } from "react";
import dynamic from "next/dynamic";
import { useTheme } from "next-themes";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/app/ui/shadcn/card";
import { mockUserPortfolio } from "@/entities/Coin";

// Avoid SSR issues
const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

type AllocationItem = {
  symbol: string;
  name: string;
  value: number; // USDT value of this holding
};

interface PortfolioAllocationChartProps {
  data?: AllocationItem[]; // Optional: pass your own data. If not provided, uses mockUserPortfolio
  title?: string;
  subtitle?: string;
  topN?: number;
}

export default function PortfolioAllocationChart({
  data,
  title = "Portfolio Allocation",
  subtitle = "Distribution of your assets by percentage",
  topN = 5,
}: PortfolioAllocationChartProps) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  // Normalize input data: from props or mock
  const items: AllocationItem[] = useMemo(() => {
    if (data && data.length) return data;
    // fallback to mockUserPortfolio (which has value and percent)
    return mockUserPortfolio.map((c) => ({
      symbol: c.symbol,
      name: c.name,
      value: c.value,
    }));
  }, [data]);

  // Compute topN + Other from values (not from pre-rounded percents)
  const { labels, series } = useMemo(() => {
    const sorted = [...items].sort((a, b) => b.value - a.value);
    const top = sorted.slice(0, topN);
    const rest = sorted.slice(topN);

    const total = items.reduce((s, x) => s + x.value, 0) || 1; // avoid /0
    const topPercents = top.map((x) => (x.value / total) * 100);
    const otherValue = rest.reduce((s, x) => s + x.value, 0);
    const otherPercent = (otherValue / total) * 100;

    const labels = top.map((x) => x.symbol);
    const data = topPercents;

    if (rest.length > 0 && otherValue > 0) {
      labels.push("Other");
      data.push(otherPercent);
    }

    // Small rounding cleanup so total = ~100
    const sum = data.reduce((s, v) => s + v, 0);
    const diff = 100 - sum;
    if (Math.abs(diff) > 0.01) {
      data[data.length - 1] = data[data.length - 1] + diff;
    }

    return {
      labels,
      series: data.map((v) => parseFloat(v.toFixed(2))),
    };
  }, [items, topN]);

  // Professional, accessible palette (keeps “Other” neutral)
  const colors = [
    "#2563EB", // blue-600
    "#10B981", // emerald-500
    "#F59E0B", // amber-500
    "#8B5CF6", // violet-500
    "#EF4444", // red-500
    "#6B7280", // slate-500 (Other)
  ];

  const options: ApexCharts.ApexOptions = {
    chart: {
      type: "donut",
      background: "transparent",
      toolbar: { show: false },
    },
    theme: { mode: isDark ? "dark" : "light" },
    labels,
    colors: colors.slice(0, series.length),
    legend: {
      position: "bottom",
      fontSize: "13px",
      labels: {
        colors: isDark ? "#9ca3af" : "#6b7280",
      },
      itemMargin: { horizontal: 10, vertical: 4 },
    },
    dataLabels: {
      enabled: true,
      formatter: (val: number) => `${val.toFixed(1)}%`,
      style: { fontSize: "12px", fontWeight: 500 },
      dropShadow: { enabled: false },
    },
    tooltip: {
      theme: isDark ? "dark" : "light",
      y: {
        formatter: (val: number, opts) => {
          const label = labels[opts.seriesIndex] || "";
          return `${label}: ${val.toFixed(2)}% of portfolio`;
        },
      },
    },
    stroke: { show: false },
    plotOptions: {
      pie: {
        donut: {
          size: "70%",
          labels: {
            show: true,
            // total: {
            //   show: true,
            //   label: "Total",
            //   fontSize: "14px",
            //   color: isDark ? "#e5e7eb" : "#374151",
            //   formatter: () => "100%",
            // },
            value: {
              show: true,
              fontSize: "16px",
              color: isDark ? "#e5e7eb" : "#374151",
              formatter: (w: any) =>
                `${w.globals.seriesTotals
                  .reduce((a: number, b: number) => a + b, 0)
                  .toFixed(0)}%`,
            },
          },
        },
      },
    },
    responsive: [
      {
        breakpoint: 768,
        options: {
          chart: { height: 280 },
          legend: { position: "bottom" },
        },
      },
    ],
  };

  return (
    <Card className="w-full h-full">
      <CardHeader className="pb-0">
        <CardTitle className="text-lg font-semibold">{title}</CardTitle>
        <CardDescription className="text-sm text-muted-foreground">
          {subtitle}
        </CardDescription>
      </CardHeader>

      <CardContent>
        <ReactApexChart
          key={theme}
          options={options}
          series={series}
          type="donut"
          height={340}
        />
      </CardContent>
    </Card>
  );
}
