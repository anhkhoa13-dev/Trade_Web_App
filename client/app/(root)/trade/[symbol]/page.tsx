import { searchCoins } from "@/actions/gecko.actions";
import SearchCommand from "../_components/SearchCommand";
import SymbolDetailWidget from "../_components/SymbolDetailWidget";
import AdvanceChartWidget from "../_components/AdvanceChartWidget";
import RecentTradesWidget from "../_components/RecentTradesWidget";
import TradingSection from "../_components/TradingSection";
import { auth } from "@/auth";

interface TradePageProps {
  params: Promise<{ symbol: string }>;
}

export default async function TradePage({ params }: TradePageProps) {
  const { symbol } = await params;
  const initialCoins = await searchCoins();

  const session = await auth();
  const isLoggedIn = !!session?.user;

  return (
    <div className="flex flex-col bg-background text-foreground gap-2">
      {/* TITLE */}
      <div className="flex justify-between relative">
        <SymbolDetailWidget symbol={symbol} className="border-2 rounded-sm" />
        <div className="hidden md:block absolute right-3 top-27">
          <SearchCommand initial={initialCoins} />
        </div>
      </div>

      {/*  MAIN LAYOUT */}
      <div className="flex flex-col lg:grid lg:grid-cols-13 lg:grid-rows-1 xl:flex xl:flex-col gap-2">
        {/* CHART SECTION */}
        <section className="lg:col-span-9 border rounded-sm flex flex-col overflow-hidden h-auto xl:h-[500px]">
          {/* CHART WRAPPER */}
          <div className="w-full h-[400px] xl:h-full">
            <AdvanceChartWidget symbol={symbol} />
          </div>

          {/* HISTORY (LG only) */}
          <div className="hidden lg:block xl:hidden h-[250px] p-4 border-t bg-background">
            <RecentTradesWidget />
          </div>
        </section>

        {/* TRADING TOOLS SECTION */}
        <section className="flex-1 lg:col-span-4 lg:flex lg:flex-col xl:flex-row">
          <TradingSection symbol={symbol} isLoggedIn={isLoggedIn} />
        </section>
      </div>
    </div>
  );
}
