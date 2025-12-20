"use client";

import Link from "next/link";
import { Button } from "@/app/ui/shadcn/button";
import { Lock } from "lucide-react";
import SpotOrderForm from "./SpotOrderForm";
import UserHistoryWidget from "./UserHistoryWidget";
import { useTradeContext } from "./TradeContext";
import RecentTradesWidget from "./RecentTradesWidget";

// ─────────────────────────────────────────────────────────────
// Sub-components
// ─────────────────────────────────────────────────────────────

function LoginPrompt() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 rounded-lg border border-dashed border-border/60 bg-secondary/5 p-6 text-muted-foreground">
      <div className="rounded-full bg-secondary/20 p-4">
        <Lock className="h-5 w-5 opacity-50" />
      </div>
      <div className="space-y-1.5 text-center">
        <p className="text-sm font-medium text-foreground">Login required</p>
        <p className="text-xs opacity-70">Sign in to view your trade history</p>
      </div>
      <Link href="/login">
        <Button size="sm" className="px-6">
          Log In
        </Button>
      </Link>
    </div>
  );
}

function TradeHistoryPanel() {
  const { isLoggedIn } = useTradeContext();

  return (
    <div className="flex flex-col gap-2 h-full ">
      <h3 className="text-sm font-semibold text-muted-foreground px-1">My Trades</h3>
      {isLoggedIn ? <UserHistoryWidget /> : <LoginPrompt />}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Main Component
// ─────────────────────────────────────────────────────────────

export default function TradingSection() {
  return (
    <div className="flex w-full flex-col gap-4">
      {/* Top Row: Order Form + Recent Trades (side by side on larger screens) */}
      <div className="flex flex-col gap-4 lg:flex-row">
        {/* Order Form */}
        <div className="w-full lg:flex-1 bg-card">
          <SpotOrderForm />
        </div>

        {/* Recent Trades - visible on md and up, next to form on lg+ */}
        <div className="hidden xl:block">
          <RecentTradesWidget />
        </div>
      </div>

      {/* Trade History - full width below */}
      <div className="w-full lg:hidden xl:block">
        <TradeHistoryPanel />
      </div>
    </div>
  );
}
