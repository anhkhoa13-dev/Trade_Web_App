import { Users, CheckCircle2, XCircle, Shield } from "lucide-react";
import { Card } from "@/app/ui/shadcn/card";
import { Badge } from "@/app/ui/shadcn/badge";
import { COIN_LOGOS } from "@/services/constants/coinConstant";
import { getBotDetailAction } from "@/actions/bot.actions";
import { TimeWindow } from "@/backend/bot/bot.types";
import BotDetailsActions from "./BotDetailsActions";
import PerformanceChartSection from "./PerformanceChartSection";

interface BotDetailsContentProps {
  botId: string;
  timeframe: TimeWindow;
}

export default async function BotDetailsContent({
  botId,
  timeframe,
}: BotDetailsContentProps) {
  const data = await getBotDetailAction(botId, timeframe);

  if (!data?.data) {
    return (
      <div className="py-20 text-center text-muted-foreground">
        Bot not found.
      </div>
    );
  }

  const bot = data.data;

  return (
    <div className="space-y-4">
      <BotDetailsActions />

      {/* Header Section */}
      <Card className="border border-border bg-card p-6">
        <div
          className="flex flex-col gap-6 lg:flex-row lg:items-start
            lg:justify-between"
        >
          <div className="flex-1 flex gap-4">
            {/* Coin Logo */}
            <img
              src={COIN_LOGOS[bot.coinSymbol] || COIN_LOGOS.BTC}
              alt={bot.coinSymbol}
              className="w-16 h-16 rounded-full object-cover flex-shrink-0"
            />

            <div className="flex-1">
              <div className="flex items-center gap-3 mb-1">
                <h1 className="text-2xl font-semibold">{bot.name}</h1>
                {bot.status && (
                  <Badge
                    variant={
                      bot.status === "ACTIVE"
                        ? "default"
                        : bot.status === "PAUSED"
                          ? "secondary"
                          : "outline"
                    }
                    className={
                      bot.status === "ACTIVE"
                        ? `bg-green-500/10 text-green-500 border-green-500/20
                          hover:bg-green-500/20`
                        : bot.status === "PAUSED"
                          ? `bg-yellow-500/10 text-yellow-500
                            border-yellow-500/20 hover:bg-yellow-500/20`
                          : bot.status === "MAINTENANCE"
                            ? `bg-orange-500/10 text-orange-500
                              border-orange-500/20 hover:bg-orange-500/20`
                            : ""
                    }
                  >
                    {bot.status}
                  </Badge>
                )}
              </div>

              {bot.description && (
                <p className="mb-3 text-muted-foreground text-sm max-w-2xl">
                  {bot.description}
                </p>
              )}

              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="secondary" className="gap-1.5">
                  <Users className="h-3.5 w-3.5" />
                  {bot.activeSubscribers.toLocaleString()} active users
                </Badge>
                <Badge variant="outline">Trading: {bot.tradingPair}</Badge>
                {bot.riskLevel && (
                  <Badge
                    variant="outline"
                    className={
                      bot.riskLevel === "LOW"
                        ? "bg-blue-500/10 text-blue-500 border-blue-500/20"
                        : bot.riskLevel === "MEDIUM"
                          ? `bg-yellow-500/10 text-yellow-500
                            border-yellow-500/20`
                          : "bg-red-500/10 text-red-500 border-red-500/20"
                    }
                  >
                    {bot.riskLevel} RISK
                  </Badge>
                )}
                {bot.category && (
                  <Badge variant="outline">
                    {bot.category.replace("_", " ")}
                  </Badge>
                )}
                {bot.fee > 0 && (
                  <Badge variant="outline">
                    Fee: {(bot.fee * 100).toFixed(2)}%
                  </Badge>
                )}
              </div>
            </div>
          </div>

          <BotDetailsActions />
        </div>
      </Card>

      {/* Performance Chart */}
      <PerformanceChartSection
        chartData={bot.chartData}
        totalPnl={bot.totalPnl}
        averageRoi={bot.averageRoi}
        maxDrawdownPercent={bot.maxDrawdownPercent}
        totalNetInvestment={bot.totalNetInvestment}
        totalEquity={bot.totalEquity}
        initialTimeframe={timeframe}
      />

      {/* Strategy Section */}
      <Card className="border border-border bg-card p-6">
        <h2 className="mb-4 text-xl font-semibold">Bot Strategy Overview</h2>
        <p className="mb-6 text-muted-foreground text-sm leading-relaxed">
          Trading bot for {bot.coinSymbol} with automated entry and exit
          signals.
        </p>

        <div className="space-y-6">
          {/* Entry Conditions */}
          <div>
            <h3 className="mb-2 flex items-center gap-2 text-lg font-medium">
              <CheckCircle2 className="h-5 w-5 text-[var(--chart-3)]" />
              Entry Conditions
            </h3>
            <ul className="ml-7 space-y-2 text-muted-foreground text-sm">
              <li>• Multi-timeframe trend confirmation (1H, 4H, 1D)</li>
              <li>• Volume analysis to measure trend strength</li>
              <li>• RSI & MACD alignment with momentum bias</li>
              <li>• Breakout confirmation near key support/resistance</li>
            </ul>
          </div>

          {/* Exit Conditions */}
          <div>
            <h3 className="mb-2 flex items-center gap-2 text-lg font-medium">
              <XCircle className="h-5 w-5 text-[var(--destructive)]" />
              Exit Conditions
            </h3>
            <ul className="ml-7 space-y-2 text-muted-foreground text-sm">
              <li>• Trend reversal signals</li>
              <li>• Dynamic trailing stop-loss triggered</li>
              <li>• Multi-tier profit-taking targets achieved</li>
              <li>• Volume divergence or loss of trend momentum</li>
            </ul>
          </div>

          {/* Risk Logic */}
          <div>
            <h3 className="mb-2 flex items-center gap-2 text-lg font-medium">
              <Shield className="h-5 w-5 text-[var(--chart-2)]" />
              Risk Control Logic
            </h3>
            <ul className="ml-7 space-y-2 text-muted-foreground text-sm">
              <li>• Max 2% risk per trade</li>
              <li>• Daily stop-loss limit of 5%</li>
              <li>• ATR-based volatility position sizing</li>
              <li>• Correlation-adjusted position exposure</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
}
