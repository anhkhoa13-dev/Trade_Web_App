import { Skeleton } from "@/app/ui/shadcn/skeleton";

export function PortfolioAssetSkeleton() {
    return (
        <div
            className="flex flex-col gap-4 justify-between w-full h-full border border-border bg-card
        rounded-xl overflow-hidden p-6"
        >
            {/* Header Section Skeleton */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2">
                <div className="space-y-2">
                    {/* Title*/}
                    <Skeleton className="h-8 w-[180px]" />
                    {/* Subtitle */}
                    <Skeleton className="h-4 w-[280px]" />
                </div>

                {/* View More Button */}
                <Skeleton className="h-9 w-[110px] mt-3 sm:mt-0 rounded-md" />
            </div>

            {/* Table Skeleton Simulation */}
            <div className="overflow-hidden rounded-xl border border-border bg-card mt-2">
                {/* Table Header Simulation */}
                <div className="flex items-center gap-4 p-4 border-b border-border/50 bg-muted/30 h-12 px-10">
                    <Skeleton className="h-4 w-[20%]" /> {/* Coin */}
                    <Skeleton className="h-4 w-[20%]" /> {/* Amount */}
                    <Skeleton className="h-4 w-[20%]" /> {/* Value */}
                    <Skeleton className="h-4 w-[15%]" /> {/* % */}
                </div>

                {/* Table Body Simulation (5 rows for TOP_NUMBER = 5) */}
                <div className="flex flex-col">
                    {[...Array(5)].map((_, i) => (
                        <div
                            key={i}
                            className="flex items-center gap-4 px-10 h-[72px] border-b border-border/50 last:border-0"
                        >
                            {/* Column 1: Coin (Image + Text) */}
                            <div className="flex items-center gap-3 w-[25%]">
                                <Skeleton className="h-7 w-7 rounded-full shrink-0" />
                                <div className="space-y-1.5">
                                    <Skeleton className="h-4 w-20" />
                                    <Skeleton className="h-3 w-10" />
                                </div>
                            </div>

                            {/* Column 2: Amount */}
                            <div className="w-[20%]">
                                <Skeleton className="h-4 w-24" />
                            </div>

                            {/* Column 3: Value */}
                            <div className="w-[20%]">
                                <Skeleton className="h-4 w-20" />
                            </div>

                            {/* Column 4: Percent */}
                            <div className="w-[15%]">
                                <Skeleton className="h-4 w-12" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}