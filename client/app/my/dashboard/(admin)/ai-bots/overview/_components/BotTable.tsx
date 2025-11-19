"use client";

import { useCallback, useMemo } from "react";
import { ColDef, ICellRendererParams } from "ag-grid-community";

import DataTable from "@/app/ui/my_components/data-table/AgDataTable";
import { AdminBot, AdminBotStatus } from "@/entities/mockAdminAiBots";
import { type VariantProps } from "class-variance-authority";

import { Button } from "@/app/ui/shadcn/button";
import {
  Eye,
  Pencil,
  Pause,
  Play,
  Trash2,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import { Badge, BadgeVariant, badgeVariants } from "@/app/ui/shadcn/badge";
import { useRouter } from "next/navigation";

interface BotTableProps {
  bots: AdminBot[];
  enableSorting?: boolean;
  enableSearch?: boolean;
  enablePagination?: boolean;
  paginationPageSize?: number;
}

export default function BotTable({
  bots,
  enableSorting = true,
  enableSearch = true,
  enablePagination = false,
  paginationPageSize = 12,
}: BotTableProps) {
  const router = useRouter();
  const handlePauseResume = useCallback((bot: AdminBot) => {
    console.log("pause/resume", bot);
  }, []);

  const handleDelete = useCallback((bot: AdminBot) => {
    console.log("delete", bot);
  }, []);

  const handleEdit = useCallback((bot: AdminBot) => {
    router.push(`/my/dashboard/ai-bots/${bot.id}/edit`);
    console.log("edit", bot);
  }, []);

  const handleView = useCallback((bot: AdminBot) => {
    console.log("view", bot);
  }, []);

  const ActionsRenderer = (params: ICellRendererParams<AdminBot>) => {
    const bot = params.data;

    if (!bot) return null;

    return (
      <div className="flex items-center justify-end gap-1 pr-2">
        <Button variant="ghost" size="icon" onClick={() => handleView(bot)}>
          <Eye className="h-4 w-4" />
        </Button>

        <Button variant="ghost" size="icon" onClick={() => handleEdit(bot)}>
          <Pencil className="h-4 w-4" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          onClick={() => handlePauseResume(bot)}
        >
          {bot.status === "healthy" ? (
            <Pause className="h-4 w-4" />
          ) : (
            <Play className="h-4 w-4" />
          )}
        </Button>

        <Button
          variant="ghost"
          size="icon"
          className="text-red-500 hover:text-red-500"
          onClick={() => handleDelete(bot)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    );
  };
  const columns: ColDef<AdminBot>[] = [
    {
      headerName: "Bot Name",
      field: "name",
      flex: 1,
      minWidth: 160,
    },

    {
      headerName: "Coin",
      field: "coin",
      width: 70,
      cellRenderer: (params: ICellRendererParams<AdminBot>) => {
        return (
          <div className="px-2 py-1 rounded-full border text-xs">
            {params.value}
          </div>
        );
      },
    },

    {
      headerName: "Status",
      field: "status",
      width: 130,
      sortable: enableSorting,
      cellRenderer: (params: ICellRendererParams<AdminBot>) => {
        const value = params.value as AdminBotStatus;

        const variant: Record<AdminBotStatus, BadgeVariant> = {
          healthy: "positive",
          warning: "warning", // choose 'secondary' for yellow-ish style
          critical: "negative",
        };

        return <Badge variant={variant[value]}>{value}</Badge>;
      },
    },

    {
      headerName: "ROI (24h)",
      field: "roi1d",
      width: 120,
      sortable: enableSorting,
      cellRenderer: (params: ICellRendererParams<AdminBot>) => {
        const value = params.value as number;
        const isPositive = value >= 0;
        const color = isPositive ? "text-green-400" : "text-red-400";
        return (
          <div className={`flex items-center gap-1 font-medium ${color}`}>
            {isPositive ? (
              <ArrowUpRight className="w-4 h-4" />
            ) : (
              <ArrowDownRight className="w-4 h-4" />
            )}
            {value.toFixed(2)}%
          </div>
        );
      },
    },

    {
      headerName: "PnL (24h)",
      field: "pnl1d",
      width: 120,
      sortable: enableSorting,
      cellRenderer: (params: ICellRendererParams<AdminBot>) => {
        const value = params.value as number;
        const isPositive = value >= 0;
        const color = isPositive ? "text-green-400" : "text-red-400";
        return (
          <div className={`flex items-center gap-1 font-medium ${color}`}>
            {isPositive ? (
              <ArrowUpRight className="w-4 h-4" />
            ) : (
              <ArrowDownRight className="w-4 h-4" />
            )}
            {value.toFixed(2)}%
          </div>
        );
      },
    },

    {
      headerName: "Copying Users",
      field: "copyingUsers",
      width: 150,
      sortable: enableSorting,
      cellRenderer: (params: ICellRendererParams<AdminBot>) => {
        const value = params.value as number;
        return value.toLocaleString();
      },
    },

    {
      headerName: "Last Signal",
      field: "lastSignal",
      flex: 1,
      minWidth: 200,
      valueFormatter: (params) => {
        const signal = params.value as AdminBot["lastSignal"] | undefined;
        if (!signal) return "";
        return `${signal.type.toUpperCase()} • ${signal.timestamp}`;
      },
    },

    {
      headerName: "Actions",
      width: 180,
      sortable: false,
      cellRenderer: ActionsRenderer, // <= React component
    },
  ];

  //
  // RETURN TABLE
  //
  return (
    <DataTable<AdminBot>
      title="All Bots"
      columns={columns}
      rowData={bots}
      enableSorting={enableSorting}
      enableSearch={enableSearch}
      enablePagination={enablePagination}
      paginationPageSize={paginationPageSize}
      fallback="No bots found..."
      getRowId={(p) => p.data.id}
    />
  );
}
