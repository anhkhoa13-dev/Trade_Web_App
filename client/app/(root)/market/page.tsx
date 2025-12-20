import React, { Suspense } from "react";

import MarketTable from "@/app/ui/my_components/market-table/MarketTable";
import MarketTableSkeleton from "@/app/ui/my_components/market-table/MarketTableSkeleton";
import { getCachedMarketData } from "@/actions/gecko.actions";
import MarketStats from "./_components/MarketStats";
import MarketStatsSkeleton from "./_components/MarketStatsSkeleton";

async function MarketStatsLoader() {
  const initialCoins = await getCachedMarketData(500);
  return <MarketStats initialData={initialCoins} />;
}

async function MarketTableLoader() {
  const initialCoins = await getCachedMarketData(500);
  return <MarketTable initialData={initialCoins} defaultPageSize={10} />;
}

export default function MarketPage() {
  return (
    <main className="flex flex-col items-center w-full bg-background">
      {/* Centered content wrapper */}
      <div
        className="w-full max-w-[1200px] px-4 sm:px-6 lg:px-8 py-10 space-y-10"
      >
        {/* --- Top coin boxes --- */}
        <section>
          <Suspense fallback={<MarketStatsSkeleton />}>
            <MarketStatsLoader />
          </Suspense>
        </section>

        {/* --- Market Table --- */}
        <section>
          <Suspense fallback={<MarketTableSkeleton />}>
            <MarketTableLoader />
          </Suspense>
        </section>

      </div>
    </main>
  );
}
