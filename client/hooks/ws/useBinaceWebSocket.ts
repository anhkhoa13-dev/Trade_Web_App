'use client';

import { useEffect, useRef, useState, useMemo } from 'react';
import useWebSocket, { ReadyState } from "react-use-websocket";

type StreamType = 'ticker' | 'trade';

export interface BinanceTrade {
    e: 'trade';      // Event type
    E: number;       // Event time (Unix timestamp)
    s: string;       // Symbol (e.g., "BTCUSDT")
    t: number;       // Trade ID
    p: string;       // Price
    q: string;       // Quantity
    b: number;       // Buyer order ID
    a: number;       // Seller order ID
    T: number;       // Trade time
    m: boolean;      // Is the buyer the market maker?
    M: boolean;      // Ignore
}

export interface BinanceTicker {
    e: '24hrTicker'; // Event type
    E: number;       // Event time
    s: string;       // Symbol
    p: string;       // Price change
    P: string;       // Price change percent
    w: string;       // Weighted average price
    x: string;       // First trade(F)-1 price (previous day's close price)
    c: string;       // Last price (Current price)
    Q: string;       // Last quantity
    b: string;       // Best bid price
    B: string;       // Best bid quantity
    a: string;       // Best ask price
    A: string;       // Best ask quantity
    o: string;       // Open price
    h: string;       // High price
    l: string;       // Low price
    v: string;       // Total traded base asset volume
    q: string;       // Total traded quote asset volume
    O: number;       // Statistics open time
    C: number;       // Statistics close time
    F: number;       // First trade ID
    L: number;       // Last trade ID
    n: number;       // Total number of trades
}

export type BinanceStreamData = BinanceTrade | BinanceTicker;

interface UseBinanceWebSocketProps {
    symbols: string[];
    quote?: string;
    streamType?: StreamType;
    throttleTime?: number; // in milliseconds
}

export const useBinanceWebSocket = ({
    symbols,
    quote = 'USDT',
    streamType = 'ticker',
    throttleTime = 0,
}: UseBinanceWebSocketProps) => {
    const [data, setData] = useState<BinanceStreamData | null>(null);

    // 1. Memoize the stream list to prevent unnecessary re-calculations
    // We join them to create a stable string dependency for useEffect
    const streamParams = useMemo(() => {
        return symbols.map((s) => `${s.toLowerCase()}${quote.toLowerCase()}@${streamType}`);
    }, [symbols, quote, streamType]);

    // 2. Keep track of current subscriptions to handle cleanup (UNSUBSCRIBE)
    const activeSubs = useRef<string[]>([]);
    const lastThrottleTime = useRef<number>(0);

    // 3. Initialize WebSocket
    const { sendMessage, lastJsonMessage, readyState } = useWebSocket(
        'wss://stream.binance.com:9443/ws',
        {
            share: true, // Optimizes if multiple components use this hook
            shouldReconnect: () => true,
        }
    );

    // 4. Handle Subscriptions & Unsubscriptions
    useEffect(() => {
        if (readyState !== ReadyState.OPEN) return;

        // Identify what needs to change
        const newSubs = streamParams;
        const oldSubs = activeSubs.current;

        // Determine diffs
        const toSubscribe = newSubs.filter(s => !oldSubs.includes(s));
        const toUnsubscribe = oldSubs.filter(s => !newSubs.includes(s));

        if (toUnsubscribe.length > 0) {
            sendMessage(JSON.stringify({
                method: 'UNSUBSCRIBE',
                params: toUnsubscribe,
                id: Date.now(),
            }));
        }

        if (toSubscribe.length > 0) {
            sendMessage(JSON.stringify({
                method: 'SUBSCRIBE',
                params: toSubscribe,
                id: Date.now(),
            }));
        }

        // Update active ref
        activeSubs.current = newSubs;

    }, [readyState, streamParams, sendMessage]);

    // 5. Handle Incoming Data with Throttling
    useEffect(() => {
        if (!lastJsonMessage) return;

        // Ignore subscription confirmation messages (which usually contain "result": null)
        if ('result' in (lastJsonMessage as object)) return;

        const now = Date.now();
        if (throttleTime > 0 && now - lastThrottleTime.current < throttleTime) {
            return;
        }

        lastThrottleTime.current = now;
        setData(lastJsonMessage as BinanceStreamData);
    }, [lastJsonMessage, throttleTime]);

    return {
        data,
        readyState,
        isConnected: readyState === ReadyState.OPEN,
    };
};