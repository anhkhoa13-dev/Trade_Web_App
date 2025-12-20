"use client";

import { TradeProvider } from "./TradeContext";
import TradingSection from "./TradingSection";
import RecentTradesWidget from "./RecentTradesWidget";
import AdvancedRealTimeChartWidget from "@/app/ui/widgets/AdvancedRealTimeChartWidget";


interface TradePageContentProps {
    symbol: string;
    isLoggedIn: boolean;
}

export default function TradePageContent({
    symbol,
    isLoggedIn,
}: TradePageContentProps) {
    return (
        <TradeProvider symbol={symbol} isLoggedIn={isLoggedIn}>
            <div className="flex flex-col lg:grid lg:grid-cols-13 lg:grid-rows-1 xl:flex xl:flex-col gap-3">
                {/* Chart Section */}

                <section className="lg:col-span-9 rounded-lg flex flex-col overflow-hidden h-auto xl:h-[500px]">
                    {/* Chart (passed from server) */}
                    <div className="w-full h-[400px] xl:h-full border">
                        <AdvancedRealTimeChartWidget symbol={symbol} />
                    </div>

                    {/* Market Trades (LG breakpoint only) */}
                    <div className="hidden lg:block xl:hidden h-[280px] border-t">
                        <RecentTradesWidget />
                    </div>
                </section>

                {/* Trading Tools Section */}
                <section className="flex-1 lg:col-span-4 lg:flex lg:flex-col xl:flex-row ">
                    <TradingSection />
                </section>
            </div>
        </TradeProvider>
    );
}
