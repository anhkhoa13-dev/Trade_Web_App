"use client";

import { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/app/ui/shadcn/tabs";
import { cn } from "@/lib/utils";
import { OrderFormPanel } from "./order-form";
import { OrderType, TradeSide } from "./trade.constants";

// ─────────────────────────────────────────────────────────────
// Sub-components
// ─────────────────────────────────────────────────────────────

function OrderTypeTabs({
  value,
  onChange,
}: {
  value: OrderType;
  onChange: (v: OrderType) => void;
}) {
  return (
    <Tabs value={value} onValueChange={(v) => onChange(v as OrderType)} className="w-full">
      <TabsList className="border-b-0 gap-6 bg-transparent p-0">
        <TabsTrigger
          value="limit"
          className="px-0 py-2 font-semibold text-muted-foreground data-[state=active]:text-foreground data-[state=active]:shadow-none"
        >
          Limit
        </TabsTrigger>
        <TabsTrigger
          value="market"
          className="px-0 py-2 font-semibold text-muted-foreground data-[state=active]:text-foreground data-[state=active]:shadow-none"
        >
          Market
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
}

function BuySellTabs({
  value,
  onChange,
  children,
}: {
  value: TradeSide;
  onChange: (v: TradeSide) => void;
  children: React.ReactNode;
}) {
  return (
    <Tabs value={value} onValueChange={(v) => onChange(v as TradeSide)} className="flex-1 flex flex-col">
      <TabsList className="w-full grid grid-cols-2 h-10 mb-4 bg-transparent p-0 gap-1">
        <TabsTrigger
          value="buy"
          className="data-[state=active]:bg-trade-up data-[state=active]:text-white bg-secondary/30 h-full rounded-sm -skew-x-12"
        >
          <span className="skew-x-12 font-bold text-xs uppercase">Buy</span>
        </TabsTrigger>
        <TabsTrigger
          value="sell"
          className="data-[state=active]:bg-trade-down data-[state=active]:text-white bg-secondary/30 h-full rounded-sm -skew-x-12"
        >
          <span className="skew-x-12 font-bold text-xs uppercase">Sell</span>
        </TabsTrigger>
      </TabsList>
      {children}
    </Tabs>
  );
}

// ─────────────────────────────────────────────────────────────
// Main Component
// ─────────────────────────────────────────────────────────────

interface SpotOrderFormProps {
  price?: number;
}

export default function SpotOrderForm({ price = 0 }: SpotOrderFormProps) {
  const [orderType, setOrderType] = useState<OrderType>("market");
  const [activeSide, setActiveSide] = useState<TradeSide>("buy");

  // TODO: Fetch real balances from wallet API
  const fakeBalanceUSDT = 1250.0;
  const fakeBalanceCoin = 0.45;

  return (
    <div className="flex flex-col h-full w-full bg-card text-foreground p-4 rounded-lg border">
      {/* Order Type Selector */}
      <OrderTypeTabs value={orderType} onChange={setOrderType} />

      <div className="h-px bg-border my-3" />

      {/* Mobile: Tabbed Buy/Sell */}
      <div className="xl:hidden flex-1">
        <BuySellTabs value={activeSide} onChange={setActiveSide}>
          <TabsContent value="buy" className="mt-0 flex-1">
            <OrderFormPanel
              side="buy"
              orderType={orderType}
              balance={fakeBalanceUSDT}
              currentPrice={price}
            />
          </TabsContent>
          <TabsContent value="sell" className="mt-0 flex-1">
            <OrderFormPanel
              side="sell"
              orderType={orderType}
              balance={fakeBalanceCoin}
              currentPrice={price}
            />
          </TabsContent>
        </BuySellTabs>
      </div>

      {/* Desktop: Side-by-side Buy/Sell */}
      <div className="hidden xl:grid xl:grid-cols-2 gap-8">
        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-trade-up">Buy</h3>
          <OrderFormPanel
            side="buy"
            orderType={orderType}
            balance={fakeBalanceUSDT}
            currentPrice={price}
          />
        </div>
        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-trade-down">Sell</h3>
          <OrderFormPanel
            side="sell"
            orderType={orderType}
            balance={fakeBalanceCoin}
            currentPrice={price}
          />
        </div>
      </div>
    </div>
  );
}
