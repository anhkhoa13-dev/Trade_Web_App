"use client";

import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/app/ui/shadcn/card";
import { Badge } from "@/app/ui/shadcn/badge";
import { TrendingUp, TrendingDown } from "lucide-react";

export function TotalAssetCard() {
  const [value, setValue] = useState(2450.73);
  const [change24h, setChange24h] = useState(3.2);
  const isPositive = change24h >= 0;

  useEffect(() => {
    const interval = setInterval(() => {
      setValue((prev) => prev + (Math.random() - 0.5) * 0.5);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Card
      className="w-full h-full flex flex-col justify-between rounded-lg border
        gap-2 border-border shadow-sm bg-card"
    >
      {/* Header */}
      <CardHeader className="px-6">
        <CardTitle className="text-base text-muted-foreground">
          Total Asset Value
        </CardTitle>
      </CardHeader>

      {/* Content */}
      <CardContent className="px-6 flex flex-col justify-between flex-grow">
        <div className="flex items-end gap-3">
          <h2 className="text-4xl font-semibold leading-tight">
            {value.toFixed(2)}{" "}
            <span className="text-muted-foreground text-lg">USDT</span>
          </h2>

          <Badge
            variant={isPositive ? "default" : "destructive"}
            className="mb-1 flex items-center gap-1 shrink-0"
          >
            {isPositive ? (
              <TrendingUp className="h-3 w-3" />
            ) : (
              <TrendingDown className="h-3 w-3" />
            )}
            {isPositive ? "+" : ""}
            {change24h.toFixed(2)}%
          </Badge>
        </div>

        <div className="mt-2 space-y-1">
          <p className="text-sm text-muted-foreground leading-snug">
            24h change compared to yesterday
          </p>
          <p className="text-sm text-muted-foreground leading-snug">
            ≈ 59,500,000&nbsp;VNĐ
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
