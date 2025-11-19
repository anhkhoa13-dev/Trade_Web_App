"use client";

import { Label } from "@/app/ui/shadcn/label";
import { Input } from "@/app/ui/shadcn/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/app/ui/shadcn/select";
import { SectionCard } from "@/app/ui/my_components/Card/SectionCard";
import { TradeType } from "@/entities/mockAdminAiBots";

interface Props {
  tradingCoin: string;
  setTradingCoin: (v: string) => void;

  allocation: string;
  setAllocation: (v: string) => void;

  frequency: string;
  setFrequency: (v: string) => void;

  tradeType: TradeType;
  setTradeType: (v: TradeType) => void;
}

export function TradingConfigurationSection({
  tradingCoin,
  setTradingCoin,
  allocation,
  setAllocation,
  frequency,
  setFrequency,
  tradeType,
  setTradeType,
}: Props) {
  return (
    <SectionCard title="Trading Configuration">
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <Label>Trading Coin *</Label>
          <Select value={tradingCoin} onValueChange={setTradingCoin}>
            <SelectTrigger>
              <SelectValue placeholder="Select coin" />
            </SelectTrigger>
            <SelectContent>
              {["BTC", "ETH", "BNB", "SOL", "AVAX", "DOT", "LINK"].map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Allocation (%)</Label>
          <Input
            type="number"
            min={1}
            max={100}
            value={allocation}
            onChange={(e) => setAllocation(e.target.value)}
          />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <Label>Trading Frequency</Label>
          <Select value={frequency} onValueChange={setFrequency}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1m">1 Minute</SelectItem>
              <SelectItem value="5m">5 Minutes</SelectItem>
              <SelectItem value="10m">10 Minutes</SelectItem>
              <SelectItem value="15m">15 Minutes</SelectItem>
              <SelectItem value="30m">30 Minutes</SelectItem>
              <SelectItem value="1h">1 Hour</SelectItem>
              <SelectItem value="4h">4 Hours</SelectItem>
              <SelectItem value="1d">1 Day</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Trade Type</Label>
          <Select value={tradeType} onValueChange={setTradeType}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Buy">Buy Only</SelectItem>
              <SelectItem value="Sell">Sell Only</SelectItem>
              <SelectItem value="Both">Both</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </SectionCard>
  );
}
