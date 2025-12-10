import { Card, CardContent, CardHeader } from "@/app/ui/shadcn/card";
import { Skeleton } from "@/app/ui/shadcn/skeleton";

export default function PortfolioAllocationSkeleton() {
    return (
        <Card className="w-full h-full flex flex-col">
            {/* Header Skeleton */}
            <CardHeader className="pb-2 flex-shrink-0">
                <Skeleton className="h-6 w-[180px] mb-2" /> {/* Title */}
                <Skeleton className="h-4 w-[250px]" />      {/* Subtitle */}
            </CardHeader>

            {/* Content Skeleton */}
            <CardContent className="flex-1 min-h-0 pb-6">
                <div className="grid grid-cols-1 md:grid-cols-[40%_60%] gap-4 items-center h-[280px]">

                    {/* Cột 1: Chart Placeholder */}
                    <div className="relative w-full flex items-center justify-center h-[300px] md:h-[200px]">
                        {/* Vòng tròn Donut giả lập */}
                        <Skeleton className="h-40 w-40 rounded-full" />
                    </div>

                    {/* Cột 2: Legend List Placeholder */}
                    <div className="hidden md:flex flex-col h-full pr-2 space-y-2 overflow-hidden">
                        {/* Tạo 5 dòng giả lập cho danh sách */}
                        {[...Array(5)].map((_, index) => (
                            <div
                                key={index}
                                className="flex items-center justify-between px-2 py-1"
                            >
                                {/* Left: Icon + Label */}
                                <div className="flex items-center gap-2 px-7">
                                    <Skeleton className="h-3 w-3 rounded-full shrink-0" /> {/* Dot */}
                                    <Skeleton className="h-4 w-16" /> {/* Name (BTC, ETH...) */}
                                </div>

                                {/* Right: Percent + Value */}
                                <div className="flex flex-col items-end gap-1">
                                    <Skeleton className="h-4 w-12" /> {/* Percent */}
                                    <Skeleton className="h-3 w-16" /> {/* Value ($) */}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}