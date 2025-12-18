"use client";

import * as React from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  PaginationState,
  useReactTable,
  OnChangeFn,
} from "@tanstack/react-table";
import { DataTablePagination } from "./data-table-pagination"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../shadcn/table";
import { Input } from "../../shadcn/input";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  title?: string;
  enableSearch?: boolean;
  enablePagination?: boolean;
  enableSorting?: boolean;
  fallback?: string;

  // --- Props cho Server-Side Pagination ---
  pageCount?: number;
  pagination?: PaginationState;
  onPaginationChange?: OnChangeFn<PaginationState>;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  title,
  enableSearch = true,
  enablePagination = true,
  enableSorting = true,
  fallback = "No results.",

  // Server-side control props
  pageCount,
  pagination: controlledPagination, // Đổi tên để tránh trùng
  onPaginationChange: setControlledPagination, // Đổi tên để tránh trùng
}: DataTableProps<TData, TValue>) {

  // 1. State nội bộ cho Client-Side Pagination (Fallback)
  const [internalPagination, setInternalPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const [globalFilter, setGlobalFilter] = React.useState("");
  const [sorting, setSorting] = React.useState<SortingState>([]);

  // 2. Xác định state thực tế sẽ dùng (Ưu tiên props truyền vào, nếu không có thì dùng state nội bộ)
  const finalPagination = controlledPagination ?? internalPagination;
  const finalPaginationChange = setControlledPagination ?? setInternalPagination;

  const table = useReactTable({
    data,
    columns,
    // -1 kích hoạt client-side calculation, số dương kích hoạt server-side logic
    pageCount: pageCount ?? -1,

    state: {
      globalFilter,
      sorting,
      // QUAN TRỌNG: Luôn đảm bảo pagination có giá trị, không bao giờ undefined
      pagination: finalPagination,
    },

    // Kích hoạt chế độ Server nếu có pageCount
    manualPagination: !!pageCount,

    // Handler thay đổi trang
    onPaginationChange: finalPaginationChange,

    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(), // Hàm này yêu cầu state.pagination phải tồn tại
    getSortedRowModel: enableSorting ? getSortedRowModel() : undefined,
    onSortingChange: enableSorting ? setSorting : undefined,
    onGlobalFilterChange: setGlobalFilter,
  });

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card">
      {/* Toolbar */}
      {enableSearch && (
        <div className="flex items-center justify-between p-4 border-b border-border/50">
          <h1 className="text-lg font-semibold px-2">{title}</h1>
          <Input
            placeholder="Search..."
            value={globalFilter ?? ""}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="w-64"
          />
        </div>
      )}

      {/* Table content */}
      <div className="overflow-x-auto">
        <Table className="min-w-full text-sm">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  const sorted = header.column.getIsSorted();

                  return (
                    <TableHead
                      key={header.id}
                      className="h-12 text-left font-medium text-muted-foreground bg-muted/30 px-10 select-none"
                      onClick={
                        enableSorting && header.column.getCanSort()
                          ? header.column.getToggleSortingHandler()
                          : undefined
                      }
                    >
                      <div className="flex items-center gap-1 cursor-pointer">
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                        {/* Sorting indicators */}
                        {enableSorting && header.column.getCanSort() && (
                          <span className="ml-1 text-xs">
                            {sorted === "asc" ? "↑" : sorted === "desc" ? "↓" : "↕"}
                          </span>
                        )}
                      </div>
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="hover:bg-muted/30 transition-colors"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="px-10">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center text-muted-foreground"
                >
                  {fallback}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {enablePagination && (
        <div className="border-t border-border bg-muted/10">
          <DataTablePagination table={table} />
        </div>
      )}
    </div>
  );
}