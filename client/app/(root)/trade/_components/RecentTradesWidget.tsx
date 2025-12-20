"use client";

import { useEffect, useState, memo, useMemo, useRef } from "react";
import { cn } from "@/lib/utils";
import { getTradeTextClass, formatPrice, formatAmount, TradeSide } from "./trade.constants";
import { useBinanceWebSocket, BinanceTrade } from "@/hooks/ws/useBinaceWebSocket";


interface MarketTrade {
    id: string;
    price: number;
    amount: number;
    time: string;
    side: TradeSide;
}

interface RecentTradesWidgetProps {
    symbol?: string;
    maxTrades?: number;
}

const TradeRow = memo(function TradeRow({ trade }: { trade: MarketTrade }) {
    return (
        <div className="grid grid-cols-3 gap-2 px-4 py-1 hover:bg-secondary/10 transition-colors">
            <div className={cn("font-mono font-medium tabular-nums", getTradeTextClass(trade.side))}>
                {formatPrice(trade.price)}
            </div>
            <div className="text-right font-mono tabular-nums text-foreground/90">
                {formatAmount(trade.amount)}
            </div>
            <div className="text-right font-mono tabular-nums text-muted-foreground">
                {trade.time}
            </div>
        </div>
    );
});

function TradeListHeader() {
    return (
        <div className="grid grid-cols-3 gap-2 px-4 py-2.5 font-semibold text-[11px] uppercase tracking-wide text-muted-foreground border-b shrink-0">
            <div>Price</div>
            <div className="text-right">Amount</div>
            <div className="text-right">Time</div>
        </div>
    );
}

// ─────────────────────────────────────────────────────────────
// Hook: Market trades from Binance WebSocket
// ─────────────────────────────────────────────────────────────

function useMarketTrades(symbol: string, maxTrades = 50) {
    const [trades, setTrades] = useState<MarketTrade[]>([]);
    const processedTradeIds = useRef<Set<number>>(new Set());

    // Memoize symbols array to prevent new reference on every render
    const symbols = useMemo(() => [symbol], [symbol]);

    const { data, isConnected } = useBinanceWebSocket({
        symbols,
        streamType: 'trade',
        throttleTime: 100, // Throttle to prevent too many updates
    });

    // Reset trades when symbol changes
    useEffect(() => {
        setTrades([]);
        processedTradeIds.current.clear();
    }, [symbol]);

    useEffect(() => {
        if (!data || data.e !== 'trade') return;

        const trade = data as BinanceTrade;

        // Skip if we've already processed this trade
        if (processedTradeIds.current.has(trade.t)) return;
        processedTradeIds.current.add(trade.t);

        // Keep the set from growing too large
        if (processedTradeIds.current.size > maxTrades * 2) {
            const ids = Array.from(processedTradeIds.current);
            processedTradeIds.current = new Set(ids.slice(-maxTrades));
        }

        const newTrade: MarketTrade = {
            id: trade.t.toString(),
            price: parseFloat(trade.p),
            amount: parseFloat(trade.q),
            time: new Date(trade.T).toLocaleTimeString("en-GB", { hour12: false }),
            side: trade.m ? "sell" : "buy",
        };

        setTrades((prev) => {
            const updated = [newTrade, ...prev];
            return updated.slice(0, maxTrades);
        });
    }, [data, maxTrades]);

    return { trades, isConnected };
}

// ─────────────────────────────────────────────────────────────
// Main Component
// ─────────────────────────────────────────────────────────────

export default function RecentTradesWidget({ symbol = "BTC", maxTrades = 14 }: RecentTradesWidgetProps) {
    const { trades, isConnected } = useMarketTrades(symbol, maxTrades);

    return (
        <div className="flex flex-col text-xs overflow-hidden rounded-md bg-card">
            {/* Header */}
            <div className="px-3 py-1.5 flex items-center justify-between">
                <h3 className="font-semibold text-sm text-foreground">Market Trades</h3>
                <span className={cn(
                    "w-2 h-2 rounded-full",
                    isConnected ? "bg-success" : "bg-destructive"
                )} />
            </div>

            {/* Column Headers */}
            <div className="border rounded-md">
                <TradeListHeader />

                {/* Trade List */}
                <div>
                    {trades.length === 0 ? (
                        <div className="flex items-center justify-center h-20 text-muted-foreground">
                            Waiting for trades...
                        </div>
                    ) : (
                        trades.map((trade) => <TradeRow key={trade.id} trade={trade} />)
                    )}
                </div>
            </div>

        </div>
    );
}