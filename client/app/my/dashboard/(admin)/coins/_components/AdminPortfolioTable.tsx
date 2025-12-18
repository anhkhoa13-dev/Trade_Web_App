"use client";

import { DataTable } from "@/app/ui/my_components/data-table/data-table";
import React, { useState, useMemo, useCallback } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/app/ui/shadcn/checkbox";
import { Input } from "@/app/ui/shadcn/input";
import { Button } from "@/app/ui/shadcn/button";
import { Save, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { CoinHolding } from "@/backend/admin/admin.types";
import { COIN_LOGOS } from "@/services/constants/coinConstant";
import Image from "next/image";
import { updateCoinFees } from "@/actions/admin.actions";

interface AdminPortfolioTableProps {
  coinHoldings: CoinHolding[];
}

export default function AdminPortfolioTable({
  coinHoldings,
}: AdminPortfolioTableProps) {
  const [data, setData] = useState<CoinHolding[]>(
    coinHoldings.map((coin) => ({
      ...coin,
      fee: coin.fee,
    }))
  );
  const [isSaving, setIsSaving] = useState(false);

  const handleFeeChange = useCallback((coinSymbol: string, newFee: string) => {
    const feeValue = parseFloat(newFee);
    if (isNaN(feeValue) || feeValue < 0) return;

    setData((prev) =>
      prev.map((coin) =>
        coin.coinSymbol === coinSymbol ? { ...coin, fee: feeValue } : coin
      )
    );
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updateCoinFees({
        coins: data.map((coin) => ({
          symbol: coin.coinSymbol,
          fee: coin.fee,
        })),
      });

      toast.success("Fees updated successfully!");
    } catch (error) {
      toast.error("Failed to update fees");
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  const columns: ColumnDef<CoinHolding>[] = useMemo(
    () => [
      {
        id: "select",
        header: ({ table }) => (
          <Checkbox
            checked={
              table.getIsAllPageRowsSelected() ||
              (table.getIsSomePageRowsSelected() && "indeterminate")
            }
            onCheckedChange={(value) =>
              table.toggleAllPageRowsSelected(!!value)
            }
            aria-label="Select all"
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="Select row"
          />
        ),
        enableSorting: false,
        enableHiding: false,
      },
      {
        accessorKey: "coinName",
        header: "Coin",
        enableGlobalFilter: true,
        cell: ({ row }) => {
          const coin = row.original;
          const logoUrl = COIN_LOGOS[coin.coinSymbol];

          return (
            <div className="flex items-center gap-3">
              {logoUrl ? (
                <Image
                  src={logoUrl}
                  alt={coin.coinName}
                  width={32}
                  height={32}
                  className="rounded-full"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary text-xs">
                  {coin.coinSymbol.substring(0, 2)}
                </div>
              )}
              <div>
                <div className="font-medium">{coin.coinName}</div>
                <div className="text-xs text-muted-foreground uppercase">
                  {coin.coinSymbol}
                </div>
              </div>
            </div>
          );
        },
      },
      {
        accessorKey: "amount",
        header: "Amount",
        cell: ({ row }) => (
          <div className="font-medium">
            {row.original.amount.toLocaleString(undefined, {
              maximumFractionDigits: 8,
            })}{" "}
            {row.original.coinSymbol.toUpperCase()}
          </div>
        ),
      },
      {
        accessorKey: "sellFee",
        header: "Sell Fee (%)",
        cell: ({ row }) => {
          const coin = row.original;
          return (
            <Input
              type="number"
              step="0.01"
              min="0"
              max="100"
              value={coin.fee}
              onChange={(e) => handleFeeChange(coin.coinSymbol, e.target.value)}
              className="w-24 h-9"
            />
          );
        },
      },
    ],
    [handleFeeChange]
  );

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold">Coin Management</h2>
          <p className="text-sm text-muted-foreground">
            Update sell fees for all coins
          </p>
        </div>
        <Button onClick={handleSave} disabled={isSaving}>
          {isSaving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Save Changes
            </>
          )}
        </Button>
      </div>
      <DataTable columns={columns} data={data} title="" />
    </div>
  );
}
