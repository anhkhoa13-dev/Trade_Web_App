"use client";

import { useMemo, useTransition } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { PaginationState } from "@tanstack/react-table";
import toast from "react-hot-toast";

import { DataTable } from "@/app/ui/my_components/data-table/data-table";
import { getSubscriptionColumns } from "./subscription-columns";
import { toggleBotStatus } from "@/actions/botSub.actions";
import { BotSubscription } from "@/backend/bot/botSub.types";
import { PaginatedResult } from "@/backend/constants/ApiResponse";

interface SubscriptionListClientProps {
    data: PaginatedResult<BotSubscription>
    currentPage: number;
    pageSize: number;
}

export default function SubscriptionListClient({
    data,
    currentPage,
    pageSize,
}: SubscriptionListClientProps) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [isPending, startTransition] = useTransition();

    // 1. Handle Navigation (Pagination) via URL
    const createQueryString = (name: string, value: string) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set(name, value);
        return params.toString();
    };

    const handlePaginationChange = (updater: any) => {
        // TanStack table trả về functional update hoặc value
        const newPagination = typeof updater === 'function'
            ? updater({ pageIndex: currentPage - 1, pageSize })
            : updater;

        // Server dùng page bắt đầu từ 1, Tanstack dùng index 0
        const newPage = newPagination.pageIndex + 1;
        router.push(`${pathname}?${createQueryString("page", newPage.toString())}`);
    };

    // 2. Handle Actions (Toggle & Detail)
    const handleNavigateToDetail = (subscriptionId: string) => {
        router.push(`/my/wallet/ai-bots/${subscriptionId}`);
    };

    const handleToggleSubscription = (
        subscriptionId: string,
        currentStatus: boolean
    ) => {
        startTransition(async () => {
            try {
                await toggleBotStatus(subscriptionId, !currentStatus);

                const action = !currentStatus ? "started" : "paused";
                toast.success(`Bot ${action} successfully`);
                // Không cần invalidate, server action tự revalidatePath
            } catch (error: any) {
                toast.error(error.message || "Failed to update bot status");
            }
        });
    };

    // 3. Columns Configuration
    const columns = useMemo(
        () =>
            getSubscriptionColumns({
                onNavigateToDetail: handleNavigateToDetail,
                onToggleSubscription: handleToggleSubscription,
            }),
        []
    );

    // 4. Pagination State cho DataTable
    const paginationState: PaginationState = {
        pageIndex: currentPage - 1, // Convert 1-based to 0-based
        pageSize: pageSize,
    };

    return (
        <DataTable<BotSubscription, any>
            columns={columns}
            data={data.result || []}
            enableSearch={false} // Tắt search client tạm thời hoặc implement server-search sau
            enablePagination={true}
            enableSorting={false} // Logic sort server nên được implement qua URL tương tự pagination

            // Server-side Pagination Props
            pageCount={data.meta.pages}
            pagination={paginationState}
            onPaginationChange={handlePaginationChange}

            fallback="No active subscriptions found."
        />
    );
}