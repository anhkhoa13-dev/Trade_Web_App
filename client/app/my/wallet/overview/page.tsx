import React from "react";
import { TotalAssetCard } from "./_components/PortfolioTable/TotalAssetCard";
import PortfolioAssetTable from "./_components/PortfolioTable/PortfolioAssetTable";
import { MarketTable } from "@/app/ui/widgets/MarketTable";
import ProfitLostAnalysis from "./_components/ProfitLostAnalysis";
import AITradeStatus from "./_components/AITradeStatus";
import PortfolioAllocationChart from "./_components/PortfolioAllocationChart";

export default function page() {
  return (
    <div
      className="grid grid-cols-12 auto-rows-[minmax(100px,auto)] gap-6
        items-start items-stretch"
    >
      {/*Total Assets Card */}
      <div className="col-span-12">
        <TotalAssetCard />
      </div>
      <div className="col-span-8">
        <PortfolioAssetTable />
      </div>
      <div className="col-span-4">
        <PortfolioAllocationChart />
      </div>
      <div className="col-span-12">
        <ProfitLostAnalysis />
      </div>
      <div className="col-span-8">
        <MarketTable
          symbols={["BTC", "ETH", "BNB", "DOGE", "TRX"]}
          showLimit={5}
          showActions={true}
        />
      </div>
      <div className="col-span-4">
        <AITradeStatus />
      </div>
    </div>
  );
}
