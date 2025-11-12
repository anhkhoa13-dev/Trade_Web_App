"use client";

import React, { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/ui/shadcn/card";
import { useLiveMarketStream } from "@/hooks/ws/useLiveMarketStream";
import { MarketTable } from "../ui/widgets/MarketTable";
import { SYMBOLS } from "../ui/widgets/constant";

export default function MarketPage() {
  const tickers = useLiveMarketStream(SYMBOLS);

  // 🧠 Compute top categories
  const list = Object.values(tickers);

  const topGainers = useMemo(
    () =>
      [...list].sort((a, b) => b.changePercent - a.changePercent).slice(0, 3),
    [list],
  );

  const topVolume = useMemo(
    () =>
      [...list]
        .sort((a, b) => (b.quoteVolume ?? 0) - (a.quoteVolume ?? 0))
        .slice(0, 3),
    [list],
  );

  const newCoins = useMemo(() => list.slice(-3), [list]);
  const hotCoins = useMemo(() => topGainers.slice(0, 3), [topGainers]);

  return (
    <main className="flex flex-col items-center w-full bg-background">
      {/* Centered content wrapper */}
      <div
        className="w-full max-w-[1200px] px-4 sm:px-6 lg:px-8 py-10 space-y-10"
      >
        {/* --- Top coin boxes --- */}
        <section
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          <TopBox title="🔥 Hot" coins={hotCoins} />
          <TopBox title="🆕 New" coins={newCoins} />
          <TopBox title="📈 Top Gainers" coins={topGainers} />
          <TopBox title="💰 Top Volume" coins={topVolume} />
        </section>

        {/* --- Market Table --- */}
        <MarketTable
          symbols={SYMBOLS}
          enableActions={true}
          enableSorting={true}
          enableSearch={true}
          enablePagination={true}
        />
      </div>
    </main>
  );
}

/* --- Helper component for Top Boxes --- */
function TopBox({ title, coins }: { title: string; coins: any[] }) {
  return (
    <Card className="border border-border bg-card shadow-sm h-full">
      <CardHeader>
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        {coins.length > 0 ? (
          coins.map((c) => (
            <div
              key={c.symbol}
              className="flex justify-between text-sm items-center"
            >
              <span className="font-medium">{c.symbol}</span>
              <span
                className={`font-semibold ${
                  c.changePercent >= 0 ? "text-green-500" : "text-red-500"
                }`}
              >
                {c.changePercent.toFixed(2)}%
              </span>
            </div>
          ))
        ) : (
          <div className="text-muted-foreground text-sm">Loading...</div>
        )}
      </CardContent>
    </Card>
  );
}
