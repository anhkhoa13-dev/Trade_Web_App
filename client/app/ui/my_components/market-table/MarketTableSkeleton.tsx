import { Skeleton } from "@/app/ui/shadcn/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/ui/shadcn/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/app/ui/shadcn/table";

export default function MarketTableSkeleton() {
    return (
        <Card>
            {/* Header Skeleton: Title + Search */}
            <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <CardTitle>
                    <Skeleton className="h-7 w-40" /> {/* Title: Live Crypto Market */}
                </CardTitle>
                <div>
                    <Skeleton className="h-10 w-full sm:w-64" /> {/* Search Input */}
                </div>
            </CardHeader>

            <CardContent>
                {/* Table Skeleton */}
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[50px]"><Skeleton className="h-4 w-4" /></TableHead>
                            <TableHead><Skeleton className="h-4 w-20" /></TableHead>
                            <TableHead><Skeleton className="h-4 w-16" /></TableHead>
                            <TableHead><Skeleton className="h-4 w-20" /></TableHead>
                            <TableHead className="hidden md:table-cell"><Skeleton className="h-4 w-32" /></TableHead>
                            <TableHead className="hidden md:table-cell"><Skeleton className="h-4 w-16" /></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {/* Generate 5 rows */}
                        {[...Array(5)].map((_, i) => (
                            <TableRow key={i}>
                                {/* Column 1: Rank # */}
                                <TableCell>
                                    <Skeleton className="h-4 w-4" />
                                </TableCell>

                                {/* Column 2: Coin (Image + Name + Symbol) */}
                                <TableCell>
                                    <div className="flex items-center gap-3">
                                        <Skeleton className="h-8 w-8 rounded-full" />
                                        <div className="flex flex-col gap-1">
                                            <Skeleton className="h-4 w-12" />
                                            <Skeleton className="h-3 w-8" />
                                        </div>
                                    </div>
                                </TableCell>

                                {/* Column 3: Price */}
                                <TableCell>
                                    <Skeleton className="h-4 w-20" />
                                </TableCell>

                                {/* Column 4: 24h Change */}
                                <TableCell>
                                    <Skeleton className="h-4 w-16" />
                                </TableCell>

                                {/* Column 5: Sparkline (Hidden on mobile) */}
                                <TableCell className="hidden md:table-cell">
                                    <Skeleton className="h-8 w-32" />
                                </TableCell>

                                {/* Column 6: Actions (Hidden on mobile) */}
                                <TableCell className="hidden md:table-cell">
                                    <div className="flex gap-2">
                                        <Skeleton className="h-8 w-8 rounded-md" />
                                        <Skeleton className="h-8 w-8 rounded-md" />
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>

                {/* Pagination Skeleton */}
                <div className="flex flex-col sm:flex-row items-center justify-between mt-4 gap-4 px-2">
                    {/* Left: Show Rows */}
                    <div className="hidden md:flex items-center gap-2">
                        <Skeleton className="h-4 w-10" />
                        <Skeleton className="h-8 w-16" />
                        <Skeleton className="h-4 w-10" />
                    </div>

                    {/* Right: Buttons */}
                    <div className="flex items-center gap-2">
                        <Skeleton className="h-9 w-20" /> {/* First */}
                        <Skeleton className="h-9 w-20" /> {/* Prev */}
                        <Skeleton className="h-4 w-24 mx-2" /> {/* Page Info */}
                        <Skeleton className="h-9 w-20" /> {/* Next */}
                        <Skeleton className="h-9 w-20" /> {/* Last */}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}