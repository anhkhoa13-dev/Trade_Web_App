import React from "react";
import { Card, CardContent } from "@/app/ui/shadcn/card";
import { Skeleton } from "@/app/ui/shadcn/skeleton"; // Hãy đảm bảo đường dẫn này đúng với dự án của bạn

// 1. Component con để tái sử dụng cho các ô MetricBox
function MetricBoxSkeleton() {
    // Giả lập cấu trúc của MetricBox: một border box với label nhỏ và value lớn
    return (
        <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-6 flex flex-col gap-2">
            {/* Label Skeleton (ví dụ: "Total Equity") */}
            <Skeleton className="h-4 w-24" />
            {/* Value Skeleton (ví dụ: "$123.45") */}
            <Skeleton className="h-8 w-32 mt-1" />
        </div>
    );
}

// 2. Component Skeleton chính
export default function ProfitLostAnalysisSkeleton() {
    return (
        <Card>
            <CardContent className="pt-6">
                {/* Title Skeleton: Giả lập thẻ h3 */}
                <Skeleton className="h-7 w-48 mb-4 rounded-md" />

                {/* Chart Skeleton: Giả lập khu vực biểu đồ cao 300px */}
                <div className="mb-6">
                    <Skeleton className="h-[300px] w-full rounded-xl" />
                </div>

                {/* Metrics Grid 1 Skeleton: Sử dụng lại đúng class grid của component gốc */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <MetricBoxSkeleton />
                    <MetricBoxSkeleton />
                    <MetricBoxSkeleton />
                    <MetricBoxSkeleton />
                </div>

                {/* Max Drawdown Section Skeleton: Sử dụng lại đúng class grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                    <MetricBoxSkeleton />
                    <MetricBoxSkeleton />
                </div>
            </CardContent>
        </Card>
    );
}