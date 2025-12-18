"use client";

import { useCallback, useState, useTransition } from "react"; // Thêm useTransition
import { ColDef, ICellRendererParams } from "ag-grid-community";
import { useRouter } from "next/navigation";
import {
  Eye,
  Pencil,
  Pause,
  Play,
  Trash2,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";

import DataTable from "@/app/ui/my_components/data-table/AgDataTable";
import { Button } from "@/app/ui/shadcn/button";
import { Badge, BadgeVariant } from "@/app/ui/shadcn/badge";
import { BotStatus } from "@/backend/bot/botConstant";
import { format, isValid } from "date-fns";
import { DeleteBotModal } from "./DeleteBotModal";

import { deleteBotAction } from "@/actions/bot.actions";
import toast from "react-hot-toast";
import { BotMetricsDTO, BotResponse } from "@/backend/bot/bot.types";

interface BotTableProps {
  bots: BotMetricsDTO[];
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

  // Thay thế React Query mutation bằng useTransition
  const [isPending, startTransition] = useTransition();
  const [botToDelete, setBotToDelete] = useState<BotMetricsDTO | null>(null);

  const handleEdit = useCallback(
    (bot: BotMetricsDTO) => {
      router.push(`/my/dashboard/ai-bots/${bot.botId}/edit`);
    },
    [router]
  );

  const handleDeleteClick = (bot: BotMetricsDTO) => {
    setBotToDelete(bot);
  };

  const handleConfirmDelete = () => {
    if (!botToDelete) return;

    startTransition(async () => {
      try {
        await deleteBotAction(botToDelete.botId);

        toast.success("Bot deleted successfully");
        setBotToDelete(null);
      } catch (error: any) {
        toast.error(error.message || "Failed to delete bot");
      }
    });
  };

  const handlePauseResume = (bot: BotMetricsDTO) =>
    console.log("Toggle", bot.botId);

  const ActionsRenderer = (params: ICellRendererParams<BotMetricsDTO>) => {
    const bot = params.data;
    if (!bot) return null;

    return (
      <div className="flex items-center justify-end gap-1 pr-2">
        {/* <Button variant="ghost" size="icon" onClick={() => handleView(bot)}>
          <Eye className="h-4 w-4" />
        </Button> */}
        <Button variant="ghost" size="icon" onClick={() => handleEdit(bot)}>
          <Pencil className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => handlePauseResume(bot)}
        >
          {bot.status === "PAUSED" ? (
            <Pause className="h-4 w-4" />
          ) : (
            <Play className="h-4 w-4" />
          )}
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="text-red-500 hover:text-red-500"
          onClick={() => handleDeleteClick(bot)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    );
  };

  const columns: ColDef<BotMetricsDTO>[] = [
    // ... Copy y nguyên phần columns definition của bạn vào đây
    {
      headerName: "Bot Name",
      field: "name",
      flex: 1,
      minWidth: 160,
    },
    {
      headerName: "Coin",
      valueGetter: (p) => p.data?.coinSymbol,
      width: 90,
      cellRenderer: (params: ICellRendererParams) => (
        <div className="px-2 py-1 rounded-full border text-xs font-medium">
          {params.value}
        </div>
      ),
    },
    {
      headerName: "Status",
      field: "status",
      width: 130,
      sortable: enableSorting,
      cellRenderer: (params: ICellRendererParams<BotResponse>) => {
        const value = params.value as BotStatus;
        const variant: Record<BotStatus, BadgeVariant> = {
          ACTIVE: "positive",
          PAUSED: "warning",
          ERROR: "negative",
        };
        return <Badge variant={variant[value] || "secondary"}>{value}</Badge>;
      },
    },
    {
      headerName: "ROI (24h)",
      valueGetter: (p) => p.data?.averageRoi ?? 0,
      width: 120,
      sortable: enableSorting,
      cellRenderer: (params: ICellRendererParams) => {
        const value = params.value as number;
        const isPositive = value >= 0;
        const color = isPositive ? "text-green-500" : "text-red-500";
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
      valueGetter: (p) => p.data?.totalPnl ?? 0,
      width: 120,
      sortable: enableSorting,
      cellRenderer: (params: ICellRendererParams) => {
        const value = params.value as number;
        const isPositive = value >= 0;
        const color = isPositive ? "text-green-500" : "text-red-500";
        return (
          <div className={`flex items-center gap-1 font-medium ${color}`}>
            {isPositive ? (
              <ArrowUpRight className="w-4 h-4" />
            ) : (
              <ArrowDownRight className="w-4 h-4" />
            )}
            ${value.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </div>
        );
      },
    },
    {
      headerName: "Copying Users",
      valueGetter: (p) => p.data?.activeSubscribers ?? 0,
      width: 150,
      sortable: enableSorting,
      cellRenderer: (params: ICellRendererParams) =>
        params.value?.toLocaleString(),
    },
    {
      headerName: "Max dd (%)",
      valueGetter: (p) => p.data?.maxDrawdownPercent ?? 0,
      flex: 1,
      minWidth: 160,
      valueFormatter: (params) => {
        if (!params.value) return "-";
        const date = new Date(params.value);
        if (!isValid(date)) return "-";
        return format(date, "MMM dd, HH:mm");
      },
    },
    {
      headerName: "Actions",
      width: 180,
      sortable: false,
      cellRenderer: ActionsRenderer,
    },
  ];

  return (
    <>
      <DataTable<BotMetricsDTO>
        title="All Bots"
        columns={columns}
        rowData={bots}
        enableSorting={enableSorting}
        enableSearch={enableSearch}
        enablePagination={enablePagination}
        paginationPageSize={paginationPageSize}
        fallback="No bots found..."
        getRowId={(p) => p.data.botId}
      />
      {/* Delete Confirmation Modal */}
      <DeleteBotModal
        isOpen={!!botToDelete}
        onClose={() => setBotToDelete(null)}
        onConfirm={handleConfirmDelete}
        botName={botToDelete?.name || ""}
        isDeleting={isPending}
      />
    </>
  );
}
