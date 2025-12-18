"use client";

import { cn } from "@/lib/utils";
import { Button } from "../shadcn/button";
import { useRouter, useSearchParams } from "next/navigation";

interface PaginationProps {
  totalItems: number;
  itemsPerPage?: number;
  currentPage: number;
  className?: string;
}

export function PaginationBar({
  totalItems,
  itemsPerPage = 9,
  currentPage,
  className,
}: PaginationProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page.toString());
    router.push(`?${params.toString()}`);
  };

  if (totalPages <= 1) return null;

  const createPageArray = () => {
    const pages: (number | "...")[] = [];

    if (totalPages <= 6) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    if (currentPage <= 3) {
      return [1, 2, 3, "...", totalPages];
    }

    if (currentPage >= totalPages - 2) {
      return [1, "...", totalPages - 2, totalPages - 1, totalPages];
    }

    return [
      1,
      "...",
      currentPage - 1,
      currentPage,
      currentPage + 1,
      "...",
      totalPages,
    ];
  };

  const pages = createPageArray();

  return (
    <div
      className={cn("flex items-center justify-center gap-2 py-6", className)}
    >
      {/* Previous Button */}
      <Button
        variant="outline"
        size="sm"
        disabled={currentPage === 1}
        onClick={() => handlePageChange(currentPage - 1)}
        className="min-w-[80px]"
      >
        Previous
      </Button>

      {/* Page Buttons */}
      <div className="flex items-center gap-1">
        {pages.map((page, index) =>
          typeof page === "string" ? (
            <span
              key={index}
              className="px-2 text-muted-foreground select-none"
            >
              ...
            </span>
          ) : (
            <Button
              key={page}
              variant={page === currentPage ? "default" : "outline"}
              size="sm"
              className={cn(
                "w-9 h-9 p-0",
                page === currentPage && "font-semibold"
              )}
              onClick={() => handlePageChange(page)}
            >
              {page}
            </Button>
          )
        )}
      </div>

      {/* Next Button */}
      <Button
        variant="outline"
        size="sm"
        disabled={currentPage === totalPages}
        onClick={() => handlePageChange(currentPage + 1)}
        className="min-w-[80px]"
      >
        Next
      </Button>
    </div>
  );
}
