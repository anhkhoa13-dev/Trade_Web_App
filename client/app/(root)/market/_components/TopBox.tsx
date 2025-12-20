"use client";

import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/ui/shadcn/card";
import { MarketCoin } from "@/entities/Coin/MarketCoin";
import { LucideIcon } from "lucide-react";
import { Spinner } from "@/app/ui/shadcn/spinner";

interface TopBoxProps {
  title: string,
  coins: MarketCoin[]
}

export default function TopBox({ title, coins }: TopBoxProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {coins.length > 0 ? (
          coins.map((c) => {
            const symbol = c.symbol.toUpperCase();

            return (
              <div
                key={symbol}
                className="flex items-center justify-between text-sm"
              >
                {/* Left: Logo + Symbol */}
                <div className="flex items-center gap-2">
                  <Image
                    src={c.image}
                    alt={symbol}
                    width={22}
                    height={22}
                    className="rounded-full"
                  />
                  <span className="font-medium">{symbol}</span>
                </div>

                {/* Middle: Price */}
                <span className="font-semibold text-muted-foreground">
                  $
                  {Number(c.price).toLocaleString(undefined, {
                    maximumFractionDigits: 4,
                  })}
                </span>

                {/* Right: % Change */}
                <span
                  className={`font-semibold ${c.changePercent >= 0 ? "text-trade-up" : "text-trade-down"
                    }`}
                >
                  {c.changePercent.toFixed(2)}%
                </span>
              </div>
            );
          })
        ) : (
          <Spinner />
        )}
      </CardContent>
    </Card>
  );
}
