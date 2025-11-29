import React from "react";

import MarketTable from "@/app/ui/my_components/market-table/MarketTable";
import { getCachedMarketData } from "@/lib/actions/gecko.actions";
import MarketStats from "./_components/MarketStats";

export default async function MarketPage() {
  const initialCoins = await getCachedMarketData(1000);

  return (
    <main className="flex flex-col items-center w-full bg-background">
      {/* Centered content wrapper */}
      <div
        className="w-full max-w-[1200px] px-4 sm:px-6 lg:px-8 py-10 space-y-10"
      >
        {/* --- Top coin boxes --- */}
        <section>
          <MarketStats initialData={initialCoins} />
        </section>

        {/* --- Market Table --- */}
        <section>
          <MarketTable initialData={initialCoins} />
        </section>

      </div>
    </main>
  );
}
