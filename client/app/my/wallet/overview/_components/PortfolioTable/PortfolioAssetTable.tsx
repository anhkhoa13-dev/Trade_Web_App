"use client";

import React from "react";
import { DataTable } from "@/app/ui/my_components/data-table/data-table";
import { userPortfolioColumns } from "./UserPortfolioColumns";
import { Button } from "@/app/ui/shadcn/button";
import { ArrowRight } from "lucide-react";
import { mockUserPortfolio } from "@/entities/Coin";
import { useRouter } from "next/navigation";

const TOP_NUMBER = 5;

export default function PortfolioAssetTable() {
  const router = useRouter();
  const topFive = [...mockUserPortfolio]
    .sort((a, b) => b.percent - a.percent)
    .slice(0, TOP_NUMBER);

  const handleViewMore = () => {
    router.push("/my/wallet/portfolio");
  };

  return (
    <div
      className="flex flex-col gap-4 w-full h-full border border-border bg-card
        rounded-xl overflow-hidden p-6"
    >
      {/* Header Section */}
      <div
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between"
      >
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">
            My Portfolio
          </h2>
          <p className="text-sm text-muted-foreground">
            Your most valuable crypto holdings at a glance
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          className="mt-3 sm:mt-0"
          onClick={handleViewMore}
        >
          View More
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>

      {/* Table (overview only) */}
      <DataTable
        columns={userPortfolioColumns}
        data={topFive}
        enableSearch={false}
        enablePagination={false}
        enableSorting={false}
      />
    </div>
  );
}
