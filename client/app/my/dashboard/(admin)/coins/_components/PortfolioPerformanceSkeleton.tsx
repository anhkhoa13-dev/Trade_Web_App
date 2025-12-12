import { Card, CardContent, CardHeader } from "@/app/ui/shadcn/card";
import { Skeleton } from "@/app/ui/shadcn/skeleton";

export default function PortfolioPerformanceSkeleton() {
    return (
        <Card className="w-full">
            {/* Header Skeleton */}
            <CardHeader className="flex flex-col gap-4 space-y-0 sm:flex-row sm:items-center sm:justify-between pb-4">
                <div className="space-y-2">
                    <Skeleton className="h-6 w-48" /> {/* Title */}
                    <Skeleton className="h-4 w-64" /> {/* Subtitle */}
                </div>

                {/* Toolbar Skeleton */}
                <div className="flex items-center p-1 bg-muted/50 rounded-lg w-full sm:w-auto overflow-hidden">
                    <Skeleton className="h-8 flex-1 sm:w-20 rounded-md bg-background shadow-sm" />
                    <Skeleton className="h-8 flex-1 sm:w-20 rounded-md ml-1 bg-background/50" />
                    <Skeleton className="h-8 flex-1 sm:w-20 rounded-md ml-1 bg-background/50" />
                </div>
            </CardHeader>

            {/* Chart Content Skeleton */}
            <CardContent className="px-1 sm:px-6 pb-4">
                <div className="w-full h-[300px] sm:h-[350px]">
                    <Skeleton className="w-full h-full rounded-lg" />
                </div>
            </CardContent>
        </Card>
    );
}