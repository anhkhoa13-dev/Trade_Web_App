import Link from "next/link";
import { Button } from "@/app/ui/shadcn/button";
import { Coin } from "@/entities/Coin/Coin";
import SymbolInfoWidget from "@/app/ui/widgets/SymbolInfoWidget";
import SearchCommand from "./SearchCommand";
import { Card } from "@/app/ui/shadcn/card";
import SingleTickerWidget from "@/app/ui/widgets/SingleTickerWidget";

// ─────────────────────────────────────────────────────────────
// Sub-components
// ─────────────────────────────────────────────────────────────

function TitleSection({ symbol }: { symbol: string }) {
    return (
        <div className="space-y-1">
            <p className="text-xs uppercase tracking-wide text-muted-foreground font-medium">
                Spot Trading
            </p>
            <div className="flex items-baseline gap-2 flex-wrap">
                <h1 className="text-2xl font-semibold leading-tight">
                    {symbol.toUpperCase()} / USD
                </h1>
                <span className="text-xs text-muted-foreground">
                    Live pricing powered by TradingView
                </span>
            </div>
        </div>
    );
}

function ActionButtons({
    initialCoins,
    isLoggedIn,
}: {
    initialCoins: Coin[];
    isLoggedIn: boolean;
}) {
    return (
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <SearchCommand initial={initialCoins} />
            {!isLoggedIn && (
                <Link href="/register">
                    <Button size="sm" className="px-5 whitespace-nowrap">
                        Create account
                    </Button>
                </Link>
            )}
        </div>
    );
}

// ─────────────────────────────────────────────────────────────
// Main Component
// ─────────────────────────────────────────────────────────────

interface TradeHeaderProps {
    symbol: string;
    initialCoins: Coin[];
    isLoggedIn: boolean;
}

export default function TradeHeader({
    symbol,
    initialCoins,
    isLoggedIn,
}: TradeHeaderProps) {
    return (
        <Card className="pb-0">
            <div className="px-4 lg:px-5 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <TitleSection symbol={symbol} />
                <ActionButtons initialCoins={initialCoins} isLoggedIn={isLoggedIn} />
            </div>

            {/* Symbol info bar */}
            <div className="hidden md:block">
                <SymbolInfoWidget symbol={symbol} />
            </div>
            <div className="block md:hidden border-t">
                <SingleTickerWidget symbol={symbol} />
            </div>

        </Card>

    );
}
