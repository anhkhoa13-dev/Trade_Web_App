"use client";

import React, { useMemo } from "react";
import { DataTable } from "@/app/ui/my_components/data-table/data-table";
import {
  userPortfolioColumns,
  UserPortfolioCoin,
} from "./UserPortfolioColumns";
import { Button } from "@/app/ui/shadcn/button";
import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { COIN_LOGOS } from "@/services/constants/coinConstant";
import { useLiveMarketStream } from "@/hooks/ws/useLiveMarketStream-v1";
import { AssetDTO } from "@/backend/wallet/wallet.types";
import { Card, CardHeader } from "@/app/ui/shadcn/card";

const TOP_NUMBER = 5;

export default function PortfolioAssetTable({ walletData }: { walletData: AssetDTO }) {
  const router = useRouter();

  // Extract coin symbols from wallet holdings
  const symbols = useMemo(() => {

    if (!walletData.coinHoldings) return [];
    return walletData.coinHoldings.map((coin) => coin.coinSymbol);
  }, [walletData]);

  // Get live prices for all wallet coins
  const tickers = useLiveMarketStream(symbols);

  // Calculate portfolio data with real-time prices
  const portfolioData: UserPortfolioCoin[] = useMemo(() => {
    if (!walletData.coinHoldings) {
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

  return (
    <Card
      className="flex flex-col gap-4 justify-between w-full h-full border border-border bg-card
        rounded-xl overflow-hidden p-6"
    >
      {/* Header Section */}
      <CardHeader
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-0"
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
      </CardHeader>

      <DataTable
        columns={userPortfolioColumns}
        data={topFive}
        enableSearch={false}
        enablePagination={false}
        enableSorting={false}
      />
    </Card>
  );
}