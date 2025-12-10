import { TotalAssetSkeleton } from "./_components/TotalAssetSkeleton";
import { PortfolioAssetSkeleton } from "./_components/PortfolioTable/PortfolioAssetSkeleton";
import PortfolioAllocationSkeleton from "./_components/PortfolioAllocationSkeleton";
import PortfolioPerformanceSkeleton from "../../dashboard/(admin)/coins/_components/PortfolioPerformanceSkeleton";
import MarketTableSkeleton from "@/app/ui/my_components/market-table/MarketTableSkeleton";
import AITradeStatusSkeleton from "./_components/AITradeStatusSkeleton";
import ActivityHistorySkeleton from "./_components/ActivityHistorySkeleton";


export default function Loading() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch p-6">

            {/* Row 1: Total Assets Skeleton */}
            <div className="col-span-1 md:col-span-12 w-full">
                <TotalAssetSkeleton />
            </div>

            {/* Row 2: Portfolio Assets + Allocation */}
            <div className="col-span-1 md:col-span-8 w-full">
                {/* Table Skeleton Helper */}
                <PortfolioAssetSkeleton />
            </div>
            <div className="col-span-1 md:col-span-4 w-full">
                {/* Chart Skeleton */}
                <PortfolioAllocationSkeleton />
            </div>

            {/* Row 3: Profit/Loss Analysis */}
            <div className="col-span-1 md:col-span-12 w-full">
                <PortfolioPerformanceSkeleton />
            </div>

            {/* Row 4: Market + AI Trade Status */}
            <div className="col-span-1 md:col-span-8 w-full">
                <MarketTableSkeleton />
            </div>

            <div className="col-span-1 md:col-span-4 w-full">
                {/* AI Status Card Skeleton */}
                <AITradeStatusSkeleton />
            </div>

            {/* Row 5: Activity History */}
            <div className="col-span-1 md:col-span-12 w-full">
                <ActivityHistorySkeleton />
            </div>
        </div>
    );
}