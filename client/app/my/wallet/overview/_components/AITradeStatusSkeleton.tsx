import { Card, CardContent, CardHeader } from "@/app/ui/shadcn/card";
import { Skeleton } from "@/app/ui/shadcn/skeleton";

export default function AITradeStatusSkeleton() {
    return (
        <Card className="w-full h-full border border-border shadow-sm bg-card">
            {/* ---------- HEADER SKELETON ---------- */}
            <CardHeader
                className="flex flex-row flex-wrap items-center justify-between gap-3
          max-[1000px]:flex-col max-[1000px]:items-start"
            >
                <div className="flex items-center gap-3 w-full">
                    {/* Icon Circle */}
                    <Skeleton className="h-10 w-10 rounded-full shrink-0" />

                    {/* Title & Description */}
                    <div className="flex flex-col gap-2">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-3 w-32" />
                    </div>
                </div>
            </CardHeader>

            {/* ---------- CONTENT SKELETON ---------- */}
            <CardContent className="space-y-5">

                {/* Profit Overview Skeleton (Giữ class hidden để khớp responsive) */}
                <div className="grid grid-cols-2 gap-4 max-[1000px]:hidden">
                    {[1, 2].map((i) => (
                        <div key={i} className="rounded-xl border bg-muted/10 p-4">
                            <Skeleton className="h-3 w-20 mb-3" /> {/* Label */}
                            <div className="flex items-center gap-2">
                                <Skeleton className="h-4 w-4 rounded-full" /> {/* Icon */}
                                <Skeleton className="h-4 w-24" /> {/* Value */}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Active Strategies Skeleton */}
                <div className="rounded-xl border bg-muted/10 p-4">
                    <div
                        className="flex flex-col md:flex-row md:items-center
              md:justify-between gap-3"
                    >
                        <div className="space-y-2">
                            <Skeleton className="h-3.5 w-28" /> {/* Label */}
                            <Skeleton className="h-3 w-20" />   {/* Sub-label */}
                        </div>
                        <Skeleton className="h-6 w-16 rounded-full" /> {/* Badge */}
                    </div>
                </div>

                {/* Button Skeleton */}
                <Skeleton className="h-10 w-full rounded-md" />
            </CardContent>
        </Card>
    );
}