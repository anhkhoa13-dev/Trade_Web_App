import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useTransition } from "react";

export function useTableState() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [isPending, startTransition] = useTransition();

    const currentSortParam = searchParams.get("sort") || "";
    const [sortCol, sortDir] = currentSortParam.split(",");


    const getSortDirection = (columnId: string) => {
        if (sortCol !== columnId) return null;
        return sortDir as "asc" | "desc";
    };

    const handlePageChange = (newPage: number) => {
        startTransition(() => {
            const params = new URLSearchParams(searchParams.toString());
            params.set("page", newPage.toString());
            router.replace(`${pathname}?${params.toString()}`, { scroll: false });
        });
    };

    const handleSort = (columnId: string) => {
        startTransition(() => {
            const params = new URLSearchParams(searchParams.toString());


            let newSort = "";

            if (sortCol === columnId && sortDir === "desc") {
                newSort = `${columnId},asc`;
                params.set("sort", newSort);
            } else if (sortCol === columnId && sortDir === "asc") {

                params.delete("sort");
            } else {

                newSort = `${columnId},desc`;
                params.set("sort", newSort);
            }

            params.set("page", "0");
            router.replace(`${pathname}?${params.toString()}`, { scroll: false });
        });
    };

    return {
        isPending,
        handlePageChange,
        handleSort,
        getSortDirection,
    };
}