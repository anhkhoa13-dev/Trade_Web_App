"use client";

import { useMemo, useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
  CardAction,
} from "@/app/ui/shadcn/card";
import { Badge } from "@/app/ui/shadcn/badge";
import { Button } from "@/app/ui/shadcn/button";
import {
  TrendingUp,
  TrendingDown,
  Wallet,
  Eye,
  EyeOff,
  Plus,
  Router,
} from "lucide-react";
import { useLiveMarketStream } from "@/hooks/ws/useLiveMarketStream-v1";
import { AssetDTO } from "@/backend/wallet/wallet.types";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

const VND_TO_USDT = 24300;

export function TotalAssetCard({ walletData }: { walletData: AssetDTO }) {
  const [isVisible, setIsVisible] = useState(true);
  const router = useRouter();

  // --- LOGIC ---
  const symbols = useMemo(() => {
    if (!walletData.coinHoldings) return [];
    return walletData.coinHoldings.map((coin) => coin.coinSymbol);
  }, [walletData]);

  const tickers = useLiveMarketStream(symbols);

  const { totalValue, weightedChange } = useMemo(() => {
    if (!walletData.coinHoldings || Object.keys(tickers).length === 0) {
      return { totalValue: walletData.balance, weightedChange: 0 };
    }

    let total = walletData.balance;
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
  const formatHidden = (value: string | number) =>
    isVisible ? value : "******";

  const handleToDepositPage = () => {
    router.push("/deposit");
  };

  return (
    <Card className="h-full p-0 gap-0 overflow-hidden border-muted-foreground/15">
      <CardHeader className="p-6 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
          Total Net Worth
        </CardTitle>
        <CardAction>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-foreground -mr-2"
            onClick={() => setIsVisible(!isVisible)}
          >
            {isVisible ? (
              <Eye className="h-4 w-4" />
            ) : (
              <EyeOff className="h-4 w-4" />
            )}
          </Button>
        </CardAction>
      </CardHeader>

      <CardContent className="p-6 pt-0 flex-grow flex flex-col justify-center gap-4">
        <div className="flex items-baseline gap-1.5">
          <span className="text-4xl md:text-5xl font-bold tracking-tight text-foreground">
            {isVisible ? totalValue.toFixed(2) : "********"}
          </span>
          <span className="text-xl font-medium text-muted-foreground">
            USDT
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
          <Badge
            variant="outline"
            className={cn(
              "px-2.5 py-0.5 text-sm font-medium border-0 ring-1 ring-inset",
              isPositive
                ? "bg-green-500/10 text-green-700 ring-green-600/20 dark:bg-green-500/10 dark:text-green-400 dark:ring-green-500/20"
                : "bg-red-500/10 text-red-700 ring-red-600/20 dark:bg-red-900/10 dark:text-red-400 dark:ring-red-900/20"
            )}
          >
            {isPositive ? (
              <TrendingUp className="mr-1 h-3.5 w-3.5" />
            ) : (
              <TrendingDown className="mr-1 h-3.5 w-3.5" />
            )}
            {Math.abs(weightedChange).toFixed(2)}%
          </Badge>

          <p className="text-sm text-muted-foreground font-medium">
            ≈ {formatHidden((totalValue * VND_TO_USDT).toLocaleString())} VNĐ
          </p>
        </div>
      </CardContent>

      <CardFooter className="p-4 px-6 bg-muted/40 border-t flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full border flex items-center justify-center">
            <Wallet className="h-5 w-5 text-primary" />
          </div>
          <div className="flex flex-col">
            <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
              Available Balance
            </span>
            <div className="flex items-baseline gap-1">
              <span className="text-lg font-bold tabular-nums leading-none">
                {formatHidden(walletData.balance.toFixed(2))}
              </span>
              <span className="text-xs font-medium text-muted-foreground">
                USDT
              </span>
            </div>
          </div>
        </div>

        <Button
          size="sm"
          className="h-8 px-3 gap-1 shadow-none"
          onClick={handleToDepositPage}
        >
          <Plus className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Deposit</span>
        </Button>
      </CardFooter>
    </Card>
  );
}
