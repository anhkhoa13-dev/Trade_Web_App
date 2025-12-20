
// Trade side color classes using CSS tokens from globals.css
export const TRADE_STYLES = {
    buy: "text-trade-up",
    sell: "text-trade-down",
} as const;

export const TRADE_BG_STYLES = {
    buy: "bg-trade-up hover:bg-trade-up/90",
    sell: "bg-trade-down hover:bg-trade-down/90",
} as const;

// Symbol to coin name mapping for API calls
export const SYMBOL_TO_NAME: Record<string, string> = {
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
    AVAX: "Avalanche",
    LINK: "Chainlink",
    UNI: "Uniswap",
    ATOM: "Cosmos",
    XLM: "Stellar",
};

// Order types
export type OrderType = "limit" | "market";
export type TradeSide = "buy" | "sell";
export type TradeStatus = "filled" | "canceled" | "open";

// Percentage steps for slider
export const PERCENTAGE_STEPS = [0, 25, 50, 75, 100] as const;

// Default currency
export const DEFAULT_CURRENCY = "USD";

// Get text color class for trade side
export function getTradeTextClass(side: TradeSide): string {
    return TRADE_STYLES[side];
}

// Get background color class for trade side
export function getTradeBgClass(side: TradeSide): string {
    return TRADE_BG_STYLES[side];
}

// Format price for display
export function formatPrice(value: number, decimals = 2): string {
    return value.toLocaleString(undefined, {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
    });
}

// Format amount for display
export function formatAmount(value: number, decimals = 4): string {
    return value.toFixed(decimals);
}

// Format time for trade history
export function formatTradeTime(date: string | Date): string {
    return new Date(date).toLocaleTimeString("en-GB", { hour12: false });
}
