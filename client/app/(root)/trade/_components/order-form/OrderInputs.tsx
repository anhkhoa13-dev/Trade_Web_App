"use client";

import { Input } from "@/app/ui/shadcn/input";
import { Button } from "@/app/ui/shadcn/button";
import { cn } from "@/lib/utils";
import { TradeSide, getTradeBgClass } from "../trade.constants";

interface PriceInputProps {
    value: string;
    onChange: (value: string) => void;
    currentPrice: number;
    currency: string;
    isMarket: boolean;
    disabled?: boolean;
}

export function PriceInput({
    value,
    onChange,
    currentPrice,
    currency,
    isMarket,
    disabled,
}: PriceInputProps) {
    return (
        <div className="flex items-center gap-2">
            <div className="group relative w-full">
                <label className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground transition-colors group-focus-within:text-foreground">
                    Price
                </label>
                <Input
                    className={cn(
                        "h-10 pl-14 pr-14 text-right font-mono text-sm tabular-nums",
                        isMarket && "cursor-not-allowed bg-secondary/20 text-muted-foreground",
                        "[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    )}
                    placeholder="Market Price"
                    value={isMarket ? "Market Price" : value}
                    onChange={(e) => !isMarket && onChange(e.target.value)}
                    disabled={disabled || isMarket}
                    readOnly={isMarket}
                    type={isMarket ? "text" : "number"}
                />
                {!isMarket && (
                    <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-muted-foreground">
                        {currency}
                    </span>
                )}
            </div>
            <Button
                variant="outline"
                size="sm"
                className="h-10 shrink-0 px-3 text-xs font-semibold"
                disabled={disabled || isMarket}
                onClick={() => onChange(currentPrice.toString())}
            >
                BBO
            </Button>
        </div>
    );
}

interface AmountInputProps {
    value: string;
    onChange: (value: string) => void;
    symbol: string;
    disabled?: boolean;
}

export function AmountInput({ value, onChange, symbol, disabled }: AmountInputProps) {
    return (
        <div className="group relative w-full">
            <label className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground transition-colors group-focus-within:text-foreground">
                Amount
            </label>
            <Input
                className="h-10 pl-16 pr-16 text-right font-mono text-sm tabular-nums [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                placeholder="0.00"
                value={value}
                disabled={disabled}
                onChange={(e) => onChange(e.target.value)}
                type="number"
            />
            <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-muted-foreground">
                {symbol}
            </span>
        </div>
    );
}

interface BalanceDisplayProps {
    balance: number;
    label: string;
    side: TradeSide;
}

export function BalanceDisplay({ balance, label, side }: BalanceDisplayProps) {
    return (
        <div className="flex items-center justify-between px-1 text-xs">
            <span className="text-muted-foreground">Available</span>
            <span className="font-mono tabular-nums text-foreground">
                {balance.toLocaleString()} {label}
            </span>
        </div>
    );
}

interface SubmitButtonProps {
    side: TradeSide;
    symbol: string;
    isPending: boolean;
    disabled?: boolean;
    onClick: () => void;
}

export function SubmitButton({ side, symbol, isPending, disabled, onClick }: SubmitButtonProps) {
    return (
        <Button
            onClick={disabled ? undefined : onClick}
            disabled={isPending}
            className={cn(
                "h-11 w-full text-base font-bold text-white transition-all hover:brightness-110",
                getTradeBgClass(side),
                disabled && "cursor-not-allowed opacity-80"
            )}
        >
            {disabled ? "Log In to Trade" : isPending ? "Processing..." : `${side === "buy" ? "Buy" : "Sell"} ${symbol}`}
        </Button>
    );
}
