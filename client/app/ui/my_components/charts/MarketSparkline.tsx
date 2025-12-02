"use client";

import dynamic from "next/dynamic";
import { useTheme } from "next-themes";

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

interface MarketSparklineProps {
  data: number[];
  isPositive: boolean;
}

export function MarketSparkline({ data, isPositive }: MarketSparklineProps) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const options: ApexCharts.ApexOptions = {
    chart: {
      type: "line",
      sparkline: { enabled: true },
      animations: { enabled: false },
    },
    stroke: { width: 2, curve: "smooth" },
    tooltip: { enabled: false },
    colors: [isPositive ? "#10B981" : "#EF4444"],
    grid: { show: false },
    theme: { mode: isDark ? "dark" : "light" },
  };

  return (
    <ReactApexChart
      options={options}
      series={[{ data }]}
      type="line"
      height={35}
      width="100%"
    />
  );
}
