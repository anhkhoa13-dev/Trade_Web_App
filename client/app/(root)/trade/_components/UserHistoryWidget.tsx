"use client";

import { useRef, useState, useEffect, memo, useCallback } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import { cn } from "@/lib/utils";
import { Loader2, History } from "lucide-react";
import { getManualTransactions } from "@/actions/history.actions";
import { TransactionHistoryDTO } from "@/backend/history/history.types";
import { useTradeContext } from "./TradeContext";
import {
  SYMBOL_TO_NAME,
  getTradeTextClass,
  formatPrice,
  formatAmount,
  formatTradeTime,
} from "./trade.constants";

function HistoryHeader() {
  return (
    <div className="grid grid-cols-6 gap-2 px-4 py-2.5 font-semibold text-[11px] uppercase tracking-wide text-muted-foreground border-b bg-secondary/5 shrink-0">
      <div>Time</div>
      <div>Symbol</div>
      <div>Side</div>
      <div className="text-right">Price</div>
      <div className="text-right">Amount</div>
      <div className="text-right">Total</div>
    </div>
  );
}

const HistoryRow = memo(function HistoryRow({ item }: { item: TransactionHistoryDTO }) {
  const isBuy = item.type === "BUY";

  return (
    <div className="grid grid-cols-6 gap-2 px-4 items-center h-full hover:bg-secondary/10 border-b border-secondary/5 transition-colors">
      <span className="text-muted-foreground font-mono tabular-nums">
        {formatTradeTime(item.createdAt)}
      </span>
      <span className="font-semibold">{item.coinSymbol}</span>
      <span className={cn("uppercase font-semibold", getTradeTextClass(isBuy ? "buy" : "sell"))}>
        {item.type}
      </span>
      <span className="text-right font-mono tabular-nums">
        {formatPrice(item.priceAtExecution)}
      </span>
      <span className="text-right font-mono tabular-nums">
        {formatAmount(item.quantity)}
      </span>
      <span className="text-right font-mono tabular-nums text-muted-foreground">
        {formatPrice(item.notionalValue)}
      </span>
    </div>
  );
});

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-3 text-muted-foreground py-10">
      <div className="rounded-full bg-secondary/20 p-4">
        <History className="h-6 w-6 opacity-50" />
      </div>
      <div className="text-center space-y-1">
        <p className="text-sm font-medium text-foreground">No trades yet</p>
        <p className="text-xs">Your trade history will appear here</p>
      </div>
    </div>
  );
}

function LoadingIndicator({ hasMore }: { hasMore: boolean }) {
  return (
    <div className="flex justify-center items-center h-full text-xs text-muted-foreground gap-2">
      {hasMore ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>Loading more...</span>
        </>
      ) : (
        <span>End of history</span>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Hook: Fetch trade history with pagination
// ─────────────────────────────────────────────────────────────

function useTradeHistory(symbol: string, refreshKey: number) {
  const [data, setData] = useState<TransactionHistoryDTO[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);

  const fetchPage = useCallback(async (page: number) => {
    setIsLoading(true);

    try {
      const coinName = symbol !== "all" ? SYMBOL_TO_NAME[symbol] || symbol : undefined;

      const result = await getManualTransactions({
        page,
        size: 20,
        sort: "createdAt,desc",
        coinName,
      });

      if (result.status === "error") {
        console.error("Failed to fetch transactions:", result.message);
        setHasMore(false);
        return;
      }

      const { result: transactions, meta } = result.data;

      setData((prev) => (page === 0 ? transactions : [...prev, ...transactions]));
      setCurrentPage(meta.page);
      setHasMore(meta.page < meta.pages - 1);
    } catch (error) {
      console.error("Error fetching transactions:", error);
      setHasMore(false);
    } finally {
      setIsLoading(false);
    }
  }, [symbol]);

  // Reset and fetch on symbol or refresh change
  useEffect(() => {
    setData([]);
    setCurrentPage(0);
    setHasMore(true);
    fetchPage(0);
  }, [symbol, refreshKey, fetchPage]);

  const loadMore = useCallback(() => {
    if (!isLoading && hasMore) {
      fetchPage(currentPage + 1);
    }
  }, [isLoading, hasMore, currentPage, fetchPage]);

  return { data, isLoading, hasMore, loadMore };
}

// ─────────────────────────────────────────────────────────────
// Main Component
// ─────────────────────────────────────────────────────────────

export default function UserHistoryWidget() {
  const { symbol, refreshKey } = useTradeContext();
  const parentRef = useRef<HTMLDivElement>(null);
  const { data, isLoading, hasMore, loadMore } = useTradeHistory(symbol, refreshKey);

  const rowVirtualizer = useVirtualizer({
    count: hasMore ? data.length + 1 : data.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 36,
    overscan: 5,
  });

  // Infinite scroll detection
  useEffect(() => {
    const items = rowVirtualizer.getVirtualItems();
    const lastItem = items[items.length - 1];

    if (lastItem && lastItem.index >= data.length - 1 && hasMore && !isLoading) {
      loadMore();
    }
  }, [rowVirtualizer.getVirtualItems(), data.length, hasMore, isLoading, loadMore]);

  return (
    <div className="h-full flex flex-col text-xs rounded-md border bg-card overflow-hidden">
      <HistoryHeader />

      {/* Virtual scroll container */}
      <div
        ref={parentRef}
        className="flex-1 overflow-y-auto w-full relative"
        style={{ contain: "strict" }}
      >
        {data.length === 0 && !isLoading ? (
          <EmptyState />
        ) : (
          <div
            style={{
              height: `${rowVirtualizer.getTotalSize()}px`,
              width: "100%",
              position: "relative",
            }}
          >
            {rowVirtualizer.getVirtualItems().map((virtualRow) => {
              const isLoaderRow = virtualRow.index > data.length - 1;
              const item = data[virtualRow.index];

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
                    <LoadingIndicator hasMore={hasMore} />
                  ) : (
                    <HistoryRow item={item} />
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
