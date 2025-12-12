"use client";

import React from "react";
import dynamic from "next/dynamic";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import { Button } from "@/app/ui/shadcn/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/app/ui/shadcn/card";

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

const ranges = ["Monthly", "Quarterly", "Annually"] as const;
type Range = (typeof ranges)[number];

interface PortfolioPerformanceChartProps {
  data: { month: string; totalValue: number }[];
  title?: string;
  subtitle?: string;
}

export default function PortfolioPerformanceChart({
  data,
  title = "Portfolio Performance",
  subtitle,
}: PortfolioPerformanceChartProps) {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [range, setRange] = React.useState<Range>("Monthly");

  const series = [
    {
      name: "Portfolio Value",
      data: data.map((d) => d.totalValue / 1000), // normalize to k
    },
  ];

  const options: ApexCharts.ApexOptions = {
    chart: {
      type: "area",
      background: "transparent",
      toolbar: { show: false },
      zoom: { enabled: false },
    },
    theme: { mode: isDark ? "dark" : "light" },
    stroke: { curve: "smooth", width: 2 },
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.4,
        opacityTo: 0.05,
        stops: [0, 90, 100],
      },
    },
    grid: {
      borderColor: isDark ? "#1e293b" : "#e5e7eb",
      strokeDashArray: 3,
      padding: {
        left: 10,
        right: 0,
      }
    },
    dataLabels: { enabled: false },
    xaxis: {
      categories: data.map((d) => d.month),
      labels: {
        style: { colors: isDark ? "#9ca3af" : "#6b7280", fontSize: "12px" },
      },
      tooltip: { enabled: false },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: {
      labels: {
        formatter: (val) => `${val.toFixed(1)}k`,
        style: { colors: isDark ? "#9ca3af" : "#6b7280", fontSize: "12px" },
      },
    },
    colors: [isDark ? "#60a5fa" : "#3b82f6"],
    tooltip: {
      theme: isDark ? "dark" : "light",
      y: { formatter: (val) => `$${(val * 1000).toLocaleString()}` },
    },
    responsive: [
      {
        breakpoint: 768,
        options: {
          xaxis: {
            labels: {
              show: false,
            },
            axisBorder: { show: false },
            axisTicks: { show: false },
          },
        },
      },
    ],
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-col gap-4 space-y-0 sm:flex-row sm:items-center sm:justify-between pb-4">
        <div className="space-y-1">
          <CardTitle className="text-lg font-semibold tracking-tight">{title}</CardTitle>
          {subtitle && (
            <CardDescription className="text-sm text-muted-foreground">
              {subtitle}
            </CardDescription>
          )}
        </div>

        {/* Responsive Toolbar */}
        <div className="flex items-center p-1 bg-muted/50 rounded-lg w-full sm:w-auto overflow-x-auto">
          {ranges.map((r) => (
            <Button
              key={r}
              variant="ghost"
              size="sm"
              className={cn(
                "flex-1 sm:flex-none text-xs sm:text-sm font-medium rounded-md transition-all",
                "hover:bg-background hover:text-foreground",
                range === r
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground"
              )}
              onClick={() => setRange(r)}
            >
              {r}
            </Button>
          ))}
        </div>
      </CardHeader>

      <CardContent className="px-1 sm:px-6 pb-4">
        <div className="w-full h-[300px] sm:h-[350px]">
          <ReactApexChart
            key={theme}
            options={options}
            series={series}
            type="area"
            width="100%"
            height="100%"
          />
        </div>
      </CardContent>
    </Card>
  );
}