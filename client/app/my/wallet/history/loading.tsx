// loading.tsx
import { Skeleton } from "@/app/ui/shadcn/skeleton";
import { Card } from "@/app/ui/shadcn/card";

export default function Loading() {
    return (
        <div className="mx-auto max-w-[1600px] space-y-6">
            {/* Header Skeleton */}
            <div className="flex items-center justify-between">
                <div className="space-y-2">
                    <Skeleton className="h-8 w-64" />
                    <Skeleton className="h-4 w-96" />
                </div>
                <Skeleton className="h-10 w-32" />
            </div>

            {/* Filter Bar Skeleton */}
            <Card className="p-6">
                <div className="space-y-4">
                    <Skeleton className="h-10 w-full max-w-md" /> {/* Tabs */}
                    <div className="flex gap-4">
                        <Skeleton className="h-10 w-[180px]" />
                        <Skeleton className="h-10 w-[180px]" />
                        <Skeleton className="h-10 w-[140px]" />
                    </div>
                </div>
            </Card>

            {/* Content Skeleton */}
            <Card className="h-[500px] p-6 space-y-4">
                <div className="space-y-2">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                </div>
            </Card>
        </div>
    );
}