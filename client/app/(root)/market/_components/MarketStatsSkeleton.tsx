import { Skeleton } from "@/app/ui/shadcn/skeleton";
import { Card, CardContent, CardHeader } from "@/app/ui/shadcn/card";

function TopBoxSkeleton() {
    return (
        <Card>
            <CardHeader className="pb-3">
                <Skeleton className="h-5 w-28" />
            </CardHeader>
            <CardContent className="space-y-3">
                {[...Array(3)].map((_, i) => (
                    <div key={i} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Skeleton className="h-6 w-6 rounded-full" />
                            <Skeleton className="h-4 w-16" />
                        </div>
                        <Skeleton className="h-4 w-14" />
                    </div>
                ))}
            </CardContent>
        </Card>
    );
}

export default function MarketStatsSkeleton() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <TopBoxSkeleton />
            <TopBoxSkeleton />
            <TopBoxSkeleton />
            <TopBoxSkeleton />
        </div>
    );
}
