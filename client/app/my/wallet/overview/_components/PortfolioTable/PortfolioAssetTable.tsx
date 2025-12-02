"use client";

import React, { useMemo } from "react";
import { DataTable } from "@/app/ui/my_components/data-table/data-table";
import {
  userPortfolioColumns,
  UserPortfolioCoin,
} from "./UserPortfolioColumns";
import { Button } from "@/app/ui/shadcn/button";
import { ArrowRight, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useWallet } from "@/hooks/useWallet";
import { COIN_LOGOS } from "@/services/constants/coinConstant";
import { useLiveMarketStream } from "@/hooks/ws/useLiveMarketStream-v1";

const TOP_NUMBER = 5;

export default function PortfolioAssetTable() {
  const router = useRouter();
  const { data: walletData, isLoading } = useWallet();

  // Extract coin symbols from wallet holdings
  const symbols = useMemo(() => {
    if (!walletData?.coinHoldings) return [];
    return walletData.coinHoldings.map((coin) => coin.coinSymbol);
  }, [walletData]);

  // Get live prices for all wallet coins
  const tickers = useLiveMarketStream(symbols);

  // Calculate portfolio data with real-time prices
  const portfolioData: UserPortfolioCoin[] = useMemo(() => {
    if (!walletData?.coinHoldings || Object.keys(tickers).length === 0) {
      return [];
    }

    // Calculate total portfolio value first
    let totalValue = walletData.balance; // Include USDT balance
    walletData.coinHoldings.forEach((coin) => {
      const ticker = tickers[coin.coinSymbol];
      if (ticker) {
        totalValue += coin.amount * ticker.price;
      }
    });

    // Map each coin to portfolio item with calculated values
    const items = walletData.coinHoldings.map((coin) => {
      const ticker = tickers[coin.coinSymbol];
      const coinValue = ticker ? coin.amount * ticker.price : 0;
      const percent = totalValue > 0 ? (coinValue / totalValue) * 100 : 0;

      return {
        id: coin.coinSymbol,
        symbol: coin.coinSymbol,
        name: coin.coinName,
        image: COIN_LOGOS[coin.coinSymbol] || "",
        amount: coin.amount,
        value: coinValue,
        percent,
      };
    });

    return items;
  }, [walletData, tickers]);

  // Get top 5 by value
  const topFive = useMemo(() => {
    return [...portfolioData]
      .sort((a, b) => b.value - a.value)
      .slice(0, TOP_NUMBER);
  }, [portfolioData]);

  const handleViewMore = () => {
    router.push("/my/wallet/portfolio");
  };

  if (isLoading) {
    return (
      <div
        className="flex flex-col gap-4 w-full h-full border border-border
          bg-card rounded-xl overflow-hidden p-6"
      >
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </div>
    );
  }

  return (
    <div
      className="flex flex-col gap-4 w-full h-full border border-border bg-card
        rounded-xl overflow-hidden p-6"
    >
      {/* Header Section */}
      <div
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between"
      >
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">
            My Portfolio
          </h2>
          <p className="text-sm text-muted-foreground">
            Your most valuable crypto holdings at a glance
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          className="mt-3 sm:mt-0"
          onClick={handleViewMore}
        >
          View More
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>

      {/* Table (overview only) */}
      <DataTable
        columns={userPortfolioColumns}
        data={topFive}
        enableSearch={false}
        enablePagination={false}
        enableSorting={false}
      />
    </div>
  );
}
