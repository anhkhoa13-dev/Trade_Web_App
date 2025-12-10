import { Card, CardContent, CardFooter, CardHeader } from "@/app/ui/shadcn/card";
import { Skeleton } from "@/app/ui/shadcn/skeleton";

export function TotalAssetSkeleton() {
    return (
        <Card className="h-full p-0 gap-0 overflow-hidden border-muted-foreground/15 shadow-sm flex flex-col">

            {/* 1. HEADER: Title + Eye Button Placeholder */}
            <CardHeader className="p-6 pb-2 flex flex-row items-center justify-between space-y-0">
                <Skeleton className="h-3.5 w-[100px]" /> {/* Title */}
                <Skeleton className="h-8 w-8 rounded-md" /> {/* Eye Button */}
            </CardHeader>

            {/* 2. CONTENT: Big Numbers */}
            <CardContent className="p-6 pt-0 flex-grow flex flex-col justify-center gap-4">
                {/* Big Value + Unit */}
                <div className="flex items-baseline gap-2">
                    <Skeleton className="h-10 md:h-12 w-[180px]" />
                    <Skeleton className="h-6 w-[40px]" />
                </div>

                {/* Badge + Subtext row */}
                <div className="flex flex-wrap items-center gap-3">
                    <Skeleton className="h-6 w-[80px] rounded-full" /> {/* Badge */}
                    <Skeleton className="h-4 w-[120px]" /> {/* VND Value */}
                </div>
            </CardContent>

            {/* 3. FOOTER: Available Balance (Khớp style background xám) */}
            <CardFooter className="p-4 px-6 bg-muted/40 border-t flex items-center justify-between">
                <div className="flex items-center gap-3">
                    {/* Wallet Icon Circle */}
                    <Skeleton className="h-10 w-10 rounded-full" />

                    <div className="flex flex-col gap-1.5">
                        <Skeleton className="h-2.5 w-[80px]" /> {/* Label */}
                        <div className="flex items-baseline gap-2">
                            <Skeleton className="h-5 w-[100px]" /> {/* Balance */}
                            <Skeleton className="h-3 w-[30px]" />  {/* Unit */}
                        </div>
                    </div>
                </div>

                {/* Deposit Button Placeholder */}
                <Skeleton className="h-8 w-[80px] rounded-md" />
            </CardFooter>

        </Card>
    );
}