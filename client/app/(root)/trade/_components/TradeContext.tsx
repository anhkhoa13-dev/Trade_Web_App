"use client";

import { createContext, useContext, useState, useCallback, ReactNode } from "react";

interface TradeContextValue {
    symbol: string;
    currency: string;
    isLoggedIn: boolean;
    refreshKey: number;
    triggerRefresh: () => void;
}

const TradeContext = createContext<TradeContextValue | null>(null);

interface TradeProviderProps {
    symbol: string;
    currency?: string;
    isLoggedIn: boolean;
    children: ReactNode;
}

export function TradeProvider({
    symbol,
    currency = "USD",
    isLoggedIn,
    children,
}: TradeProviderProps) {
    const [refreshKey, setRefreshKey] = useState(0);

    const triggerRefresh = useCallback(() => {
        setRefreshKey((prev) => prev + 1);
    }, []);

    return (
        <TradeContext.Provider
            value={{
                symbol,
                currency,
                isLoggedIn,
                refreshKey,
                triggerRefresh,
            }}
        >
            {children}
        </TradeContext.Provider>
    );
}

export function useTradeContext() {
    const context = useContext(TradeContext);
    if (!context) {
        throw new Error("useTradeContext must be used within a TradeProvider");
    }
    return context;
}
