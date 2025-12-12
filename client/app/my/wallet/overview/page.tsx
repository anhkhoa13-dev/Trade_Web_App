import React from "react";
import { TotalAssetCard } from "./_components/TotalAssetCard";
import PortfolioAssetTable from "./_components/PortfolioTable/PortfolioAssetTable";
import ProfitLostAnalysis from "./_components/ProfitLostAnalysis";
import AITradeStatus from "./_components/AITradeStatus";
import PortfolioAllocationChart from "./_components/PortfolioAllocationChart";
import MarketTable from "@/app/ui/my_components/market-table/MarketTable";
import { getCachedMarketData } from "@/actions/gecko.actions";
import { getWallet } from "@/actions/wallet.actions";
// import { historyService } from "@/services/historyService";
import { auth } from "@/auth";
import { forbidden } from "next/navigation";
// import { getBotSubOverviewSSR } from "@/services/botSubService";
import { Card } from "@/app/ui/shadcn/card";
import Link from "next/link";
import { Button } from "@/app/ui/shadcn/button";
import { ArrowRight } from "lucide-react";
import { ManualTransactionsTable } from "../history/_components/ManualTransactionsTable";
import { getManualTransactions } from "@/actions/history.actions";
import { getBotSubOverview } from "@/actions/botSub.actions";

export default async function page() {
  const session = await auth()

  if (!session || !session.accessToken)
    forbidden()

  const historyFilter = { page: 0, size: 5, sort: "createdAt,desc" };

  const [initialCoins, walletResponse, historyResponse, botOverviewResponse] = await Promise.all([
    getCachedMarketData(5),
    getWallet(),
    getManualTransactions(
      historyFilter,
    ),
    getBotSubOverview()
  ]);

  const walletData = walletResponse.data!
  const recentHistory = historyResponse.data!
  const botOverview = botOverviewResponse.data!


  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
      {/* Row 1: Total Assets */}
      <div className="col-span-1 md:col-span-12 w-full">
        <TotalAssetCard walletData={walletData} />
      </div>

      {/* Row 2: Portfolio Assets + Allocation */}
      <div className="col-span-1 md:col-span-8 w-full">
        <PortfolioAssetTable walletData={walletData} />
      </div>
      <div className="col-span-1 md:col-span-4 w-full">
        <PortfolioAllocationChart walletData={walletData} />
      </div>

      {/* Row 3: Profit/Loss Analysis */}
      <div className="col-span-1 md:col-span-12 w-full">
        <ProfitLostAnalysis walletData={walletData} />
      </div>

      {/* Row 4: Market + AI Trade Status */}
      <div className="col-span-1 md:col-span-8 w-full">
        <MarketTable
          initialData={initialCoins}
          defaultPageSize={5}
        // symbols={SYMBOLS}
        // showLimit={6}
        // enableActions={true}
        // enablePagination={false}
        // enableSearch={false}
        // enableSorting={false}
        />
      </div>
      <div className="col-span-1 md:col-span-4 w-full">
        <AITradeStatus data={botOverview} />
      </div>

      {/* Row 5: Activity History */}
      <Card className="shadow-sm col-span-1 md:col-span-12 w-full p-6">
        <div className="flex items-center justify-between py-2">
          <h2 className="text-2xl font-bold">Recent Activity</h2>
          <Link href="/my/wallet/history">
            <Button variant="outline">
              View More <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
        <ManualTransactionsTable
          data={recentHistory}
          currentPage={historyFilter.page}
          pageSize={historyFilter.size}
          showPagination={false}
        />
      </Card>
    </div>
  );
}
