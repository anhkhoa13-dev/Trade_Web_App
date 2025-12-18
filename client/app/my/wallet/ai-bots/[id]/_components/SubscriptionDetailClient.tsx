// app/my/wallet/ai-bots/[id]/_components/SubscriptionDetailClient.tsx
"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import SubscriptionHeader from "./SubscriptionHeader";
import PerformanceDashboard from "./PerformanceDashboard";
import WalletAllocation from "./WalletAllocation";
import BotConfiguration from "./BotConfiguration";
import { Button } from "@/app/ui/shadcn/button";
import { ArrowLeft } from "lucide-react";
import { toggleBotStatus } from "@/actions/botSub.actions";
import { BotSubscriptionDetail } from "@/backend/bot/botSub.types";

interface SubscriptionDetailClientProps {
  subscription: BotSubscriptionDetail;
  subscriptionId: string;
  currentTimeframe: "current" | "1d" | "7d";
}

export default function SubscriptionDetailClient({
  subscription,
  subscriptionId,
  currentTimeframe,
}: SubscriptionDetailClientProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleBack = () => {
    router.push("/my/wallet/ai-bots");
  };

  const handleToggleBotStatus = (enabled: boolean) => {
    startTransition(async () => {
      try {
        const result = await toggleBotStatus(subscriptionId, enabled);

        if (result.status == "success") {
          if (enabled) {
            toast.success("Bot started successfully");
          } else {
            toast.success("Bot paused. New trades will not be opened.");
          }
        } else {
          toast.error(result.message);
        }
      } catch (error) {
        toast.error("Failed to update bot status");
      }
    });
  };

  const handleTimeframeChange = (newTimeframe: "current" | "1d" | "7d") => {
    router.push(`?timeframe=${newTimeframe}`, { scroll: false });
  };

  return (
    <div className="mx-auto max-w-[1600px] space-y-6 animate-in fade-in duration-500">
      <Button
        variant="ghost"
        onClick={handleBack}
        className="gap-2"
        type="button"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Bot List
      </Button>

      <SubscriptionHeader
        coin={subscription.coin}
        botName={subscription.botName}
        tradingPair={subscription.tradingPair}
        isActive={subscription.active}
        onToggleStatus={handleToggleBotStatus}
      />

      <PerformanceDashboard
        timeframe={currentTimeframe}
        pnl={subscription.pnl}
        roi={subscription.roi}
        maxDrawdown={subscription.maxDrawdown}
        maxDrawdownPercent={subscription.maxDrawdownPercent}
        chartData={subscription.chartData}
        onTimeframeChange={handleTimeframeChange}
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <WalletAllocation
          botWalletBalance={subscription.botWalletBalance}
          botWalletCoin={subscription.botWalletCoin}
          netInvestment={subscription.netInvestment}
          totalEquity={subscription.totalEquity}
          tradingPair={subscription.tradingPair}
        />

        <BotConfiguration
          subscriptionId={subscription.subscriptionId}
          botWalletCoin={subscription.botWalletCoin}
          botWalletBalance={subscription.botWalletBalance}
          tradePercentage={subscription.tradePercentage * 100}
          maxDailyLossPercentage={subscription.maxDailyLossPercentage}
        />
      </div>
    </div>
  );
}
