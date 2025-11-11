"use client";

import { useEffect, useRef, useState } from "react";

interface LiveTickerData {
  price: number;
  change24h: number;
  changePercent: number;
  high: number;
  low: number;
  volume: number;
  symbol: string;
  lastUpdate: number;
}
// for single coin
export function useLiveBinancePrice(symbol: string) {
  const [data, setData] = useState<LiveTickerData | null>(null);
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    if (!symbol) return;

    const pair = symbol.toLowerCase() + "usdt"; // e.g. btc -> btcusdt
    const url = `wss://stream.binance.com:9443/ws/${pair}@ticker`;
    const ws = new WebSocket(url);
    wsRef.current = ws;

    ws.onopen = () => console.log(`[WS] Connected to Binance for ${pair}`);
    ws.onclose = () =>
      console.log(`[WS] Disconnected from Binance for ${pair}`);

    ws.onmessage = (event) => {
      try {
        const json = JSON.parse(event.data);
        setData({
          symbol: json.s,
          price: parseFloat(json.c),
          change24h: parseFloat(json.p),
          changePercent: parseFloat(json.P),
          high: parseFloat(json.h),
          low: parseFloat(json.l),
          volume: parseFloat(json.v),
          lastUpdate: json.E,
        });
      } catch (err) {
        console.error("Failed to parse Binance data:", err);
      }
    };

    return () => {
      ws.close();
      wsRef.current = null;
    };
  }, [symbol]);

  return data;
}
