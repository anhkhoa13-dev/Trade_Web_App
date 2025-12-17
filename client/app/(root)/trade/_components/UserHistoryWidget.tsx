"use client";

import { useRef, useState, useEffect } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { getManualTransactions } from "@/actions/history.actions";
import { TransactionHistoryDTO } from "@/backend/history/history.types";

interface UserHistoryWidgetProps {
  symbol: string;
}

// Mapping from coin symbol to coin name for API filtering
const SYMBOL_TO_NAME_MAP: Record<string, string> = {
  BTC: "Bitcoin",
  ETH: "Ethereum",
  BNB: "Binance Coin",
  SOL: "Solana",
  XRP: "XRP",
  ADA: "Cardano",
  DOGE: "Dogecoin",
  DOT: "Polkadot",
  MATIC: "Polygon",
  LTC: "Litecoin",
};

export default function UserHistoryWidget({ symbol }: UserHistoryWidgetProps) {
  const parentRef = useRef<HTMLDivElement>(null);
  const [allData, setAllData] = useState<TransactionHistoryDTO[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  // --- FETCH REAL DATA FROM API ---
  const fetchMoreData = async (page: number) => {
    setIsLoading(true);

    try {
      // Convert symbol to coin name for API filtering
      const coinName =
        symbol !== "all" ? SYMBOL_TO_NAME_MAP[symbol] || symbol : undefined;

      const result = await getManualTransactions({
        page: page,
        size: 20,
        sort: "createdAt,desc",
        coinName: coinName,
      });

      console.log(result);

      if (result.status === "error") {
        console.error("Failed to fetch transactions:", result.message);
        setIsLoading(false);
        setHasMore(false);
        return;
      }

      const { result: transactions, meta } = result.data;

      setAllData((prev) => [...prev, ...transactions]);
      setCurrentPage(meta.page);
      setTotalPages(meta.pages);
      setHasMore(meta.page < meta.pages - 1);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching transactions:", error);
      setIsLoading(false);
      setHasMore(false);
    }
  };

  // Load lần đầu
  useEffect(() => {
    setAllData([]);
    setCurrentPage(0);
    setHasMore(true);
    fetchMoreData(0);
  }, [symbol]);

  // --- VIRTUALIZER SETUP ---
  const rowVirtualizer = useVirtualizer({
    count: hasMore ? allData.length + 1 : allData.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 32,
    overscan: 5,
  });

  useEffect(() => {
    const [lastItem] = [...rowVirtualizer.getVirtualItems()].reverse();
    if (!lastItem) return;

    if (lastItem.index >= allData.length - 1 && hasMore && !isLoading) {
      fetchMoreData(currentPage + 1);
    }
  }, [
    hasMore,
    isLoading,
    allData.length,
    currentPage,
    rowVirtualizer.getVirtualItems(),
  ]);

  return (
    <div className="h-full flex flex-col text-xs">
      {/* HEADER */}
      <div className="grid grid-cols-6 gap-2 px-4 py-2 font-bold text-muted-foreground border-b bg-secondary/10 shrink-0">
        <div>Time</div>
        <div>Symbol</div>
        <div>Side</div>
        <div className="text-right">Price</div>
        <div className="text-right">Amount</div>
        <div className="text-right">Total</div>
      </div>

      {/* VIRTUAL SCROLL CONTAINER */}
      <div
        ref={parentRef}
        className="flex-1 overflow-y-auto w-full relative"
        style={{ contain: "strict" }}
      >
        <div
          style={{
            height: `${rowVirtualizer.getTotalSize()}px`,
            width: "100%",
            position: "relative",
          }}
        >
          {rowVirtualizer.getVirtualItems().map((virtualRow) => {
            const isLoaderRow = virtualRow.index > allData.length - 1;
            const item = allData[virtualRow.index];

            return (
              <div
                key={virtualRow.key}
                className="absolute top-0 left-0 w-full"
                style={{
                  height: `${virtualRow.size}px`,
                  transform: `translateY(${virtualRow.start}px)`,
                }}
              >
                {isLoaderRow ? (
                  <div className="flex justify-center items-center h-full text-muted-foreground">
                    {hasMore ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : (
                      "End of history"
                    )}
                  </div>
                ) : (
                  <div className="grid grid-cols-6 gap-2 px-4 items-center h-full hover:bg-secondary/10 border-b border-secondary/5 transition-colors">
                    <span className="text-muted-foreground font-mono">
                      {new Date(item.createdAt).toLocaleTimeString()}
                    </span>
                    <span className="font-bold">{item.coinSymbol}</span>
                    <span
                      className={cn(
                        "uppercase font-bold",
                        item.type === "BUY"
                          ? "text-[#0ecb81]"
                          : "text-[#f6465d]"
                      )}
                    >
                      {item.type}
                    </span>
                    <span className="text-right font-mono">
                      {item.priceAtExecution.toLocaleString(undefined, {
                        maximumFractionDigits: 2,
                      })}
                    </span>
                    <span className="text-right font-mono">
                      {item.quantity.toFixed(4)}
                    </span>
                    <span className="text-right font-mono text-muted-foreground">
                      {item.notionalValue.toFixed(2)}
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
