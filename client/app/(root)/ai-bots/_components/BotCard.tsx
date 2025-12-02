import { Badge } from "@/app/ui/shadcn/badge";
import { Button } from "@/app/ui/shadcn/button";
import { Card } from "@/app/ui/shadcn/card";
import { SortOption, TimeWindow } from "@/services/interfaces/botInterfaces";
import { Users, Copy } from "lucide-react";

// Priority type: determines which metric should be highlighted
// "roi" → ROI becomes the main large metric
// "pnl" → PnL becomes the main large metric
export type MetricPriority = "roi" | "pnl";
// export type timeSlot = "1d" | "7d" | "30d" | "all";

interface BotCardProps {
  id: string;
  name: string;
  roi: number; // Average ROI for selected timeframe
  pnl: number; // Total PnL for selected timeframe
  maxDrawdown: number;
  coin: string;
  activeUsers: number;
  onCopy: (id: string) => void;
  onClick: (id: string) => void;
  timeWindow: TimeWindow;
  priority?: SortOption;
}

export function BotCard({
  id,
  name,
  roi,
  pnl,
  maxDrawdown,
  coin,
  activeUsers,
  onCopy,
  onClick,
  timeWindow,
  priority = "roi",
}: BotCardProps) {
  // Get label based on selected time window
  const getLabel = () => {
    switch (timeWindow) {
      case "1d":
        return "24H";
      case "7d":
        return "7D";
      case "current":
        return "All Time";
      default:
        return "7D";
    }
  };

  const label = getLabel();

  const mainMetric = priority === "roi" ? roi : pnl;
  const mainMetricLabel =
    priority === "roi" ? `ROI (${label})` : `PnL (${label})`;
  const mainMetricFormatted =
    priority === "roi"
      ? `${roi >= 0 ? "+" : ""}${roi.toFixed(2)}%`
      : `${pnl >= 0 ? "+" : ""}${pnl.toFixed(2)}`;

  return (
    <Card
      className="group cursor-pointer overflow-hidden border border-border
        bg-card p-5 transition-all hover:-translate-y-1
        hover:shadow-[var(--shadow-lg)] hover:border-[var(--primary)]"
      onClick={() => onClick(id)}
    >
      {/* Header */}
      <div className="mb-4 flex justify-between">
        <div>
          <h3 className="mb-2 text-lg font-semibold">{name}</h3>
          <div
            className="flex items-center gap-1.5 text-xs text-muted-foreground"
          >
            <Users className="h-3.5 w-3.5" />
            <span>{activeUsers.toLocaleString()} users copying this bot</span>
          </div>
        </div>
        {/* Copy Button */}
        <Button
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            onCopy(id);
          }}
          className="p-2"
        >
          <Copy className="h-3.5 w-3.5" />
          Copy
        </Button>
      </div>

      {/* MAIN METRIC (Priority-based) */}
      <div className="mb-4 space-y-3">
        <div className="rounded-lg border border-border bg-muted/50 p-4">
          <p className="mb-1 text-xs text-muted-foreground">
            {mainMetricLabel}
          </p>
          <p
            className={`text-3xl font-bold ${
              mainMetric >= 0
                ? "text-[var(--chart-3)]"
                : "text-[var(--destructive)]"
              }`}
          >
            {mainMetricFormatted}
          </p>
        </div>

        {/* SECONDARY METRIC (Opposite of priority) */}
        <div className="grid grid-cols-2 gap-2">
          {priority === "roi" ? (
            <div className="rounded-lg border border-border bg-muted/30 p-2.5">
              <p className="mb-1 text-xs text-muted-foreground">
                PnL ({label})
              </p>
              <p
                className={`${
                  pnl >= 0
                    ? "text-[var(--chart-3)]"
                    : "text-[var(--destructive)]"
                  }`}
              >
                {pnl >= 0 ? "+" : ""}${pnl.toFixed(2)}
              </p>
            </div>
          ) : (
            <div className="rounded-lg border border-border bg-muted/30 p-2.5">
              <p className="mb-1 text-xs text-muted-foreground">
                ROI ({label})
              </p>
              <p
                className={`${
                  roi >= 0
                    ? "text-[var(--chart-3)]"
                    : "text-[var(--destructive)]"
                  }`}
              >
                {roi >= 0 ? "+" : ""}
                {roi.toFixed(2)}%
              </p>
            </div>
          )}

          {/* Max Drawdown */}
          <div className="rounded-lg border border-border bg-muted/30 p-2.5">
            <p className="mb-1 text-xs text-muted-foreground">Max DD</p>
            <p className="text-[var(--destructive)]">
              {maxDrawdown.toFixed(1)}%
            </p>
          </div>
        </div>
      </div>

      {/* Assets */}
      <div className="mb-4 flex flex-wrap gap-1.5">
        <Badge
          key={coin}
          variant="outline"
          className="rounded-full border-border bg-accent/50 text-xs"
        >
          {coin}
        </Badge>
      </div>
    </Card>
  );
}
