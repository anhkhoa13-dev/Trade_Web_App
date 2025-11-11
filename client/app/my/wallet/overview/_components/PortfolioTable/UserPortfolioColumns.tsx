"use client";

import { ColumnDef } from "@tanstack/react-table";

export type UserPortfolioCoin = {
  id: string;
  symbol: string;
  name: string;
  image: string;
  amount: number;
  value: number;
  percent: number;
};

export const userPortfolioColumns: ColumnDef<UserPortfolioCoin>[] = [
  {
    accessorKey: "name",
    header: "Coin",
    cell: ({ row }) => {
      const coin = row.original;
      return (
        <div className="flex items-center gap-3">
          <img
            src={coin.image}
            alt={coin.name}
            width={28}
            height={28}
            className="rounded-full"
          />
          <div>
            <div className="font-medium">{coin.name}</div>
            <div className="text-xs text-muted-foreground uppercase">
              {coin.symbol}
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
        {row.original.amount.toLocaleString()}{" "}
        {row.original.symbol.toUpperCase()}
      </div>
    ),
  },
  {
    accessorKey: "value",
    header: "Value (USDT)",
    cell: ({ row }) => (
      <div className="text-emerald-500 font-semibold">
        ${row.original.value.toLocaleString()}
      </div>
    ),
  },
  {
    accessorKey: "percent",
    header: "% of Portfolio",
    cell: ({ row }) => (
      <div className="text-muted-foreground">
        {row.original.percent.toFixed(2)}%
      </div>
    ),
  },
];
