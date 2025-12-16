import { Skeleton } from "@/app/ui/shadcn/skeleton";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/app/ui/shadcn/table";

export default function Loading() {
    return (
        <div className="mx-auto max-w-[1600px] space-y-6">
            {/* Header Skeleton */}
            <div className="flex items-center justify-between">
                <div className="space-y-2">
                    <Skeleton className="h-8 w-48" /> {/* Title */}
                    <Skeleton className="h-4 w-96" /> {/* Description */}
                </div>
            </div>

            {/* Table Skeleton Container */}
            <div className="overflow-hidden rounded-xl border border-border bg-card">
                <Table>
                    <TableHeader>
                        <TableRow>
                            {/* Giả lập các cột Header */}
                            {Array.from({ length: 6 }).map((_, i) => (
                                <TableHead key={i} className="px-6 h-12">
                                    <Skeleton className="h-4 w-24" />
                                </TableHead>
                            ))}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {/* Giả lập 5 hàng dữ liệu */}
                        {Array.from({ length: 5 }).map((_, i) => (
                            <TableRow key={i}>
                                <TableCell className="px-6 py-4">
                                    <div className="space-y-2">
                                        <Skeleton className="h-5 w-32" />
                                        <Skeleton className="h-4 w-20" />
                                    </div>
                                </TableCell>
                                <TableCell className="px-6">
                                    <div className="flex items-center gap-2">
                                        <Skeleton className="h-8 w-8 rounded-full" />
                                        <Skeleton className="h-5 w-16" />
                                    </div>
                                </TableCell>
                                <TableCell className="px-6">
                                    <Skeleton className="h-6 w-20 rounded-full" />
                                </TableCell>
                                <TableCell className="px-6">
                                    <Skeleton className="h-5 w-24" />
                                </TableCell>
                                <TableCell className="px-6">
                                    <Skeleton className="h-5 w-24" />
                                </TableCell>
                                <TableCell className="px-6">
                                    <div className="flex gap-2">
                                        <Skeleton className="h-9 w-24" />
                                        <Skeleton className="h-9 w-12" />
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>

                {/* Pagination Skeleton */}
                <div className="flex items-center justify-end p-4 border-t gap-2">
                    <Skeleton className="h-8 w-20" />
                    <Skeleton className="h-8 w-20" />
                </div>
            </div>
        </div>
    );
}