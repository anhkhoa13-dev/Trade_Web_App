"use client";

import { useState } from "react";
import SpotOrderForm from "./SpotOrderForm";
import UserHistoryWidget from "./UserHistoryWidget";
import Link from "next/link";
import { Button } from "@/app/ui/shadcn/button";
import { Lock } from "lucide-react";

interface TradingSectionProps {
  symbol: string;
  isLoggedIn: boolean;
}

export default function TradingSection({
  symbol,
  isLoggedIn,
}: TradingSectionProps) {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleOrderSuccess = () => {
    setRefreshTrigger(Date.now());
  };

  return (
    <div className="flex flex-col w-full h-full xl:flex-row border-2 rounded-sm p-2 gap-2">
      {/* Order Form */}
      <div className="shrink-0 lg:flex-none xl:w-[700px] xl:h-full">
        <SpotOrderForm
          symbol={symbol}
          currency={"USD"}
          price={0}
          isLoggedIn={isLoggedIn}
          onOrderSuccess={handleOrderSuccess}
        />
      </div>

      {/* History (xl only) */}
      <div className="hidden xl:block flex-1 p-4 border-l-2 ">
        <div className="font-bold text-muted-foreground mb-2 px-2 text-xs">
          My Trades
        </div>
        {isLoggedIn ? (
          <UserHistoryWidget symbol={symbol} refreshTrigger={refreshTrigger} />
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center gap-3 text-muted-foreground bg-secondary/5 rounded-lg border border-dashed border-secondary/30 m-1">
            <div className="p-3 bg-secondary/20 rounded-full">
              <Lock className="w-5 h-5 opacity-50" />
            </div>

            <div className="text-center space-y-1">
              <p className="text-sm font-medium text-foreground">
                Login Required
              </p>
              <p className="text-xs opacity-70">
                Please log in to view your trade history
              </p>
            </div>

            <Link href="/login">
              <Button variant="default" size="sm" className="px-6">
                Log In
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
