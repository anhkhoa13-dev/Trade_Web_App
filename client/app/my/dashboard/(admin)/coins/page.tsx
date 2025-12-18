import React from "react";
import AssetsCard from "./_components/AssetsCard";
import PnLLineChart from "@/app/ui/my_components/charts/PnLLineChart";
import AdminPortfolioTable from "./_components/AdminPortfolioTable";
import { getAdminAssets } from "@/actions/admin.actions";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/app/ui/shadcn/card";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Activity,
  AlertCircle,
} from "lucide-react";
import { Badge } from "@/app/ui/shadcn/badge";

export default async function page() {
  const result = await getAdminAssets();

  if (result.status !== "success" || !result.data) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center justify-center py-8 space-y-3">
            <AlertCircle className="h-12 w-12 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              {result.message || "Failed to load admin assets"}
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const assets = result.data;
  // console.log(assets);
  const isPnlPositive = assets.pnl >= 0;
  const isRoiPositive = assets.roi >= 0;

  return (
    <div className="flex flex-col gap-6">
      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {/* Total Balance */}
        <Card>
          <CardContent className="space-y-3">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-primary/10 rounded-lg">
                <DollarSign className="h-5 w-5 text-primary" />
              </div>
              <div className="flex flex-col">
                <h3 className="text-sm font-medium text-muted-foreground">
                  Total Balance
                </h3>
              </div>
            </div>
            <div className="flex justify-between items-end">
              <span className="text-2xl font-bold">
                $
                {assets.balance.toLocaleString(undefined, {
                  maximumFractionDigits: 2,
                })}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Total Equity */}
        <Card>
          <CardContent className="space-y-3">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-blue-500/10 rounded-lg">
                <Activity className="h-5 w-5 text-blue-500" />
              </div>
              <div className="flex flex-col">
                <h3 className="text-sm font-medium text-muted-foreground">
                  Total Equity
                </h3>
              </div>
            </div>
            <div className="flex justify-between items-end">
              <span className="text-2xl font-bold">
                $
                {assets.totalEquity.toLocaleString(undefined, {
                  maximumFractionDigits: 2,
                })}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* PnL */}
        <Card>
          <CardContent className="space-y-3">
            <div className="flex items-center space-x-2">
              <div
                className={`p-2 rounded-lg ${isPnlPositive ? "bg-green-500/10" : "bg-red-500/10"}`}
              >
                {isPnlPositive ? (
                  <TrendingUp className="h-5 w-5 text-green-500" />
                ) : (
                  <TrendingDown className="h-5 w-5 text-red-500" />
                )}
              </div>
              <div className="flex flex-col">
                <h3 className="text-sm font-medium text-muted-foreground">
                  PnL
                </h3>
              </div>
            </div>
            <div className="flex justify-between items-end">
              <span
                className={`text-2xl font-bold ${isPnlPositive ? "text-green-600 dark:text-green-500" : "text-red-600 dark:text-red-500"}`}
              >
                {isPnlPositive ? "+" : ""}$
                {assets.pnl.toLocaleString(undefined, {
                  maximumFractionDigits: 2,
                })}
              </span>
              <Badge variant={isPnlPositive ? "positive" : "negative"}>
                {isPnlPositive ? "▲" : "▼"}{" "}
                {Math.abs(assets.pnl).toLocaleString(undefined, {
                  maximumFractionDigits: 0,
                })}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* ROI */}
        <Card>
          <CardContent className="space-y-3">
            <div className="flex items-center space-x-2">
              <div
                className={`p-2 rounded-lg ${isRoiPositive ? "bg-green-500/10" : "bg-red-500/10"}`}
              >
                {isRoiPositive ? (
                  <TrendingUp className="h-5 w-5 text-green-500" />
                ) : (
                  <TrendingDown className="h-5 w-5 text-red-500" />
                )}
              </div>
              <div className="flex flex-col">
                <h3 className="text-sm font-medium text-muted-foreground">
                  ROI
                </h3>
              </div>
            </div>
            <div className="flex justify-between items-end">
              <span
                className={`text-2xl font-bold ${isRoiPositive ? "text-green-600 dark:text-green-500" : "text-red-600 dark:text-red-500"}`}
              >
                {isRoiPositive ? "+" : ""}
                {assets.roi.toFixed(2)}%
              </span>
              <Badge variant={isRoiPositive ? "positive" : "negative"}>
                {isRoiPositive ? "▲" : "▼"} {Math.abs(assets.roi).toFixed(2)}%
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* PnL Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Performance Overview</CardTitle>
          <CardDescription>
            Your portfolio performance over time
          </CardDescription>
        </CardHeader>
        <CardContent>
          <PnLLineChart
            chartData={assets.pnlChartData.map((point) => ({
              timestamp: point.timestamp,
              pnl: point.value,
            }))}
            timeframe="7d"
            height="400px"
          />
        </CardContent>
      </Card>

      {/* Holdings Table */}
      <div>
        <AdminPortfolioTable coinHoldings={assets.coinHoldings} />
      </div>
    </div>
  );
}
