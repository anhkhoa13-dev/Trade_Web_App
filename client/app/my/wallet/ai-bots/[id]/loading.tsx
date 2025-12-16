// app/my/wallet/ai-bots/[id]/loading.tsx

import { Card, CardContent, CardHeader } from "@/app/ui/shadcn/card";
import { Skeleton } from "@/app/ui/shadcn/skeleton";

export default function Loading() {
    return (
        <div className="mx-auto max-w-[1600px] space-y-6 animate-in fade-in duration-500">
            {/* 1. Back Button Skeleton */}
            <Skeleton className="h-10 w-32" />

            {/* 2. Header Skeleton (SubscriptionHeader) */}
            <Card>
                <div className="flex flex-col gap-4 p-6 md:flex-row md:items-center md:justify-between">
                    <div className="flex items-center gap-4">
                        {/* Logo */}
                        <Skeleton className="h-12 w-12 rounded-full" />
                        <div className="space-y-2">
                            {/* Bot Name */}
                            <Skeleton className="h-6 w-48" />
                            {/* Badges */}
                            <div className="flex gap-2">
                                <Skeleton className="h-5 w-16" />
                                <Skeleton className="h-5 w-16" />
                            </div>
                        </div>
                    </div>

                    {/* Toggle Switch Area */}
                    <div className="flex flex-col items-end gap-2 border-t pt-4 md:border-t-0 md:pt-0">
                        <Skeleton className="h-4 w-20" />
                        <div className="flex items-center gap-2">
                            <Skeleton className="h-5 w-12" />
                            <Skeleton className="h-6 w-10 rounded-full" />
                        </div>
                    </div>
                </div>
            </Card>

            {/* 3. Performance Dashboard Skeleton */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <Skeleton className="h-6 w-48" /> {/* Title */}
                    <Skeleton className="h-10 w-48" /> {/* Tabs */}
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* Metrics Grid */}
                    <div className="grid gap-4 md:grid-cols-3">
                        {/* Metric Box 1 */}
                        <div className="rounded-xl border bg-card text-card-foreground shadow p-6 space-y-2">
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className="h-8 w-32" />
                        </div>
                        {/* Metric Box 2 */}
                        <div className="rounded-xl border bg-card text-card-foreground shadow p-6 space-y-2">
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className="h-8 w-32" />
                        </div>
                        {/* Metric Box 3 */}
                        <div className="rounded-xl border bg-card text-card-foreground shadow p-6 space-y-2">
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className="h-8 w-32" />
                        </div>
                    </div>

                    {/* Chart Area */}
                    <div className="pt-4">
                        <Skeleton className="h-[300px] w-full rounded-lg" />
                    </div>
                </CardContent>
            </Card>

            {/* 4. Bottom Grid (Wallet & Config) */}
            <div className="grid gap-6 lg:grid-cols-2">
                {/* Wallet Allocation Skeleton */}
                <Card>
                    <CardHeader>
                        <Skeleton className="h-6 w-40 mb-2" />
                        <Skeleton className="h-4 w-64" />
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-3">
                            <Skeleton className="h-5 w-32" />
                            <div className="rounded-lg border p-4 space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Skeleton className="h-3 w-20" />
                                        <Skeleton className="h-5 w-32" />
                                        <Skeleton className="h-5 w-32" />
                                    </div>
                                </div>
                                <div className="border-t pt-3 grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Skeleton className="h-3 w-20" />
                                        <Skeleton className="h-6 w-24" />
                                    </div>
                                    <div className="space-y-2">
                                        <Skeleton className="h-3 w-20" />
                                        <Skeleton className="h-6 w-24" />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <Skeleton className="h-16 w-full rounded-lg" />
                    </CardContent>
                </Card>

                {/* Bot Configuration Skeleton */}
                <Card>
                    <CardHeader>
                        <Skeleton className="h-6 w-40 mb-2" />
                        <Skeleton className="h-4 w-64" />
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-5 py-4">
                            {/* Row 1 Inputs */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Skeleton className="h-4 w-24" />
                                    <Skeleton className="h-10 w-full" />
                                </div>
                                <div className="space-y-2">
                                    <Skeleton className="h-4 w-24" />
                                    <Skeleton className="h-10 w-full" />
                                </div>
                            </div>
                            {/* Row 2 Inputs */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Skeleton className="h-4 w-24" />
                                    <Skeleton className="h-10 w-full" />
                                </div>
                                <div className="space-y-2">
                                    <Skeleton className="h-4 w-24" />
                                    <Skeleton className="h-10 w-full" />
                                </div>
                            </div>
                            {/* Button */}
                            <div className="pt-2">
                                <Skeleton className="h-10 w-full" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}