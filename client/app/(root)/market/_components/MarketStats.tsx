"use client"

import { useMemo } from "react";
import { ArrowDownRight, Flame, BarChart3, TrendingUp } from "lucide-react";
import TopBox from "./TopBox";
import { useLiveMarket } from "@/hooks/ws/useLiveMarketStream";
import { MarketCoin } from "@/entities/Coin/MarketCoin";

interface MarketStatsProps {
    initialData: MarketCoin[];
}
export default function MarketStats({ initialData }: MarketStatsProps) {
    const data = useLiveMarket(initialData);
    const stats = useMemo(() => {
        const clone = [...data];

        return {
            hot: clone.slice(0, 3),
            gainers: [...clone].sort((a, b) => b.changePercent - a.changePercent).slice(0, 3),
            volume: [...clone].sort((a, b) => b.quoteVolume - a.quoteVolume).slice(0, 3),
            losers: [...clone].sort((a, b) => a.changePercent - b.changePercent).slice(0, 3),
        };
    }, [data]);

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <TopBox
                title="🔥Hot Coins"
                coins={stats.hot}
            />
            <TopBox
                title="📈 Top Gainers"
                coins={stats.gainers}
            />
            <TopBox
                title="💰 Top Volume"
                coins={stats.volume}
            />
            <TopBox
                title="🆕 Top Losers"
                coins={stats.losers}
            />
        </div>
    );
}