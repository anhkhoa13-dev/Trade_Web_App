"use client";

import { useMemo } from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  createColumnHelper,
} from "@tanstack/react-table";
import { Card } from "@/app/ui/shadcn/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/app/ui/shadcn/table";
import { Badge } from "@/app/ui/shadcn/badge";
import { Button } from "@/app/ui/shadcn/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DepositTransactionDTO } from "@/backend/history/history.types";
import { PaginatedResult } from "@/backend/constants/ApiResponse";
import { formatDate } from "@/lib/utils";
import { useTableState } from "@/hooks/useTableState";
import SortableHeader from "./SortableHeader";
import { Spinner } from "@/app/ui/shadcn/spinner";

interface DepositTransactionsTableProps {
  data: PaginatedResult<DepositTransactionDTO>;
  currentPage: number;
  pageSize: number;
}

const columnHelper = createColumnHelper<DepositTransactionDTO>();

export function DepositTransactionsTable({
  data,
  currentPage,
  pageSize,
}: DepositTransactionsTableProps) {
  const { isPending, handlePageChange, handleSort, getSortDirection } =
    useTableState();

  const totalPages = data.meta.pages;
  const hasNextPage = currentPage < totalPages - 1;
  const hasPrevPage = currentPage > 0;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "SUCCESS":
        return (
          <Badge
            variant="outline"
            className="border-green-500/30 bg-green-500/10 text-green-700 dark:text-green-400"
          >
            Success
          </Badge>
        );
      case "PENDING":
        return (
          <Badge
            variant="outline"
            className="border-yellow-500/30 bg-yellow-500/10 text-yellow-700 dark:text-yellow-400"
          >
            Pending
          </Badge>
        );
      case "FAILED":
        return (
          <Badge
            variant="outline"
            className="border-red-500/30 bg-red-500/10 text-red-700 dark:text-red-400"
          >
            Failed
          </Badge>
        );
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const columns = useMemo(
    () => [
      columnHelper.accessor("createdAt", {
        header: () => (
          <SortableHeader
            label="Date & Time"
            columnId="createdAt"
            direction={getSortDirection("createdAt")}
            onSort={handleSort}
          />
        ),
        cell: (info) => {
          const formattedString = formatDate(info.getValue());
          return <div className="text-sm">{formattedString}</div>;
        },
      }),
      columnHelper.accessor("amount", {
        header: () => (
          <SortableHeader
            label="Amount (VND)"
            columnId="amount"
            direction={getSortDirection("amount")}
            onSort={handleSort}
          />
        ),
        cell: (info) => {
          const amount = info.getValue();
          return (
            <span className="font-mono text-sm">
              {amount.toLocaleString()} ₫
            </span>
          );
        },
      }),
      columnHelper.accessor("exchangeRate", {
        header: () => (
          <SortableHeader
            label="Exchange Rate"
            columnId="exchangeRate"
            direction={getSortDirection("exchangeRate")}
            onSort={handleSort}
          />
        ),
        cell: (info) => {
          const rate = info.getValue();
          return (
            <span className="font-mono text-sm">
              {rate
                ? rate.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })
                : "—"}
            </span>
          );
        },
      }),
      columnHelper.accessor("convertedAmount", {
        header: () => (
          <SortableHeader
            label="Converted (USD)"
            columnId="convertedAmount"
            direction={getSortDirection("convertedAmount")}
            onSort={handleSort}
          />
        ),
        cell: (info) => {
          const converted = info.getValue();
          return (
            <span className="font-mono text-sm">
              {converted
                ? `$${converted.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}`
                : "—"}
            </span>
          );
        },
      }),
      columnHelper.accessor("status", {
        header: () => (
          <SortableHeader
            label="Status"
            columnId="status"
            direction={getSortDirection("status")}
            onSort={handleSort}
          />
        ),
        cell: (info) => {
          const status = info.getValue();
          return getStatusBadge(status);
        },
      }),
    ],
    [handleSort, getSortDirection]
  );

  const table = useReactTable({
    data: data.result,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <Card className="shadow-sm flex flex-col justify-between relative">
      {isPending && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-background/50 backdrop-blur-sm rounded-lg">
          <Spinner />
        </div>
      )}
      <div className="overflow-x-auto px-6">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-32 text-center text-muted-foreground"
                >
                  No deposit transactions found
                </TableCell>
              </TableRow>
            ) : (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Footer */}
      <div className="flex items-center justify-between p-4 px-6 border-t">
        <div className="text-sm text-muted-foreground">
          Page {currentPage + 1} of {totalPages}
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={!hasPrevPage}
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={!hasNextPage}
          >
            Next
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </div>
    </Card>
  );
}
