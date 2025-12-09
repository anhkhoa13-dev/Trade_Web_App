"use client";

import { useMemo } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/app/ui/shadcn/card";
import { Badge } from "@/app/ui/shadcn/badge";
import { TrendingUp, TrendingDown, Loader2 } from "lucide-react";
import { useWallet } from "@/hooks/useWallet";
import { useLiveMarketStream } from "@/hooks/ws/useLiveMarketStream-v1";
import { AssetDTO } from "@/backend/wallet/wallet.types";

const VND_TO_USDT = 24300; // Approximate conversion rate

export function TotalAssetCard({ walletData }: { walletData: AssetDTO | null }) {
  // Extract coin symbols from wallet holdings
  const symbols = useMemo(() => {
    if (!walletData?.coinHoldings) return [];
    return walletData.coinHoldings.map((coin) => coin.coinSymbol);
  }, [walletData]);

  // Get live prices for all wallet coins
  const tickers = useLiveMarketStream(symbols);

  // Calculate total portfolio value and weighted 24h change
  const { totalValue, weightedChange } = useMemo(() => {
    if (!walletData?.coinHoldings || Object.keys(tickers).length === 0) {
      return { totalValue: 0, weightedChange: 0 };
    }

    let total = walletData.balance; // Start with USDT balance
    let totalChangeValue = 0;

    walletData.coinHoldings.forEach((coin) => {
      const ticker = tickers[coin.coinSymbol];
      if (ticker) {
        const coinValue = coin.amount * ticker.price;
        total += coinValue;
        totalChangeValue += coinValue * (ticker.changePercent / 100);
      }
    });

    const change = total > 0 ? (totalChangeValue / total) * 100 : 0;
    return { totalValue: total, weightedChange: change };
  }, [walletData, tickers]);

  const isPositive = weightedChange >= 0;

  if (!walletData) {
    return (
      <Card
        className="w-full h-full flex flex-col justify-between rounded-lg border
          gap-2 border-border shadow-sm bg-card"
      >
        <CardHeader className="px-6">
          <CardTitle className="text-base text-muted-foreground">
            Total Asset Value
          </CardTitle>
        </CardHeader>
        <CardContent className="px-6 flex items-center justify-center flex-grow">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

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
      <CardContent className="px-6 flex justify-between items-start flex-grow">
        <div className="flex flex-col justify-between h-full">
          <div className="flex items-end gap-3">
            <h2 className="text-4xl font-semibold leading-tight">
              {totalValue.toFixed(2)}{" "}
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
              {weightedChange.toFixed(2)}%
            </Badge>
          </div>

          <div className="mt-2 space-y-1">
            <p className="text-sm text-muted-foreground leading-snug">
              24h change compared to yesterday
            </p>
            <p className="text-sm text-muted-foreground leading-snug">
              ≈ {(totalValue * VND_TO_USDT).toLocaleString()}&nbsp;VNĐ
            </p>
          </div>
        </div>

        {/* Wallet Balance Display */}
        <div className="flex flex-col items-end justify-center">
          <div className="text-right">
            <p
              className="text-xs font-medium text-muted-foreground uppercase
                tracking-wide mb-2"
            >
              Wallet Balance
            </p>
            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl font-bold tabular-nums">
                {walletData?.balance.toFixed(2)}
              </span>
              <span className="text-sm font-medium text-muted-foreground">
                USDT
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
