"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { BotSubscriptionsList } from "./BotSubscriptionsList";
import { BotTransactionsTable } from "./BotTransactionsTable";
import { Card } from "@/app/ui/shadcn/card";
import { BotSubscription } from "@/backend/bot/botSub.types";
import { BotTradeHistoryDTO } from "@/backend/history/history.types";
import { Inbox } from "lucide-react";
import { PaginatedResult } from "@/backend/constants/ApiResponse";

interface BotTransactionsViewProps {
  data: PaginatedResult<BotTradeHistoryDTO>;
  subscriptions: BotSubscription[];
  selectedBotId?: string;
  currentPage: number;
  pageSize: number;
}

export function BotTransactionsView({
  data,
  subscriptions,
  selectedBotId,
  currentPage,
  pageSize,
}: BotTransactionsViewProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // URL-driven bot selection
  const handleSelectSubscription = (id: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("botId", id);
    // Reset page when switching bots
    params.set("page", "0");
    router.replace(`${pathname}?${params.toString()}`);
  };

  const selectedBot = subscriptions.find(
    (sub) => sub.subscriptionId === selectedBotId,
  );

  // Case 0: No bot subscription
  if (!subscriptions || subscriptions.length === 0) {
    return (
      <Card className="flex flex-col items-center justify-center p-12 text-center text-muted-foreground border-dashed">
        <div className="p-4 bg-muted/50 rounded-full mb-4">
          <Inbox className="w-8 h-8 opacity-50" />
        </div>
        <h3 className="text-lg font-semibold text-foreground">No Bot Subscriptions</h3>
        <p className="max-w-xs mt-2 text-sm">
          You haven't subscribed to any trading bots yet. Start a subscription to see transactions here.
        </p>
      </Card>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[300px_minmax(0,1fr)] items-start">
      {/* Left Column: List Bot */}
      <BotSubscriptionsList
        subscriptions={subscriptions}
        selectedSubscription={selectedBotId || ""}
        onSelectSubscription={handleSelectSubscription}
      />

      {/* Right Column: Table Transactions */}
      {/* FIX: overflow-hidden + min-w-0 are crucial for table responsiveness in Grid */}
      <div className="flex flex-col overflow-hidden min-w-0">
        {!data ? (
          <Card className="flex flex-col items-center justify-center min-h-[300px] text-muted-foreground border-dashed shadow-sm">
            <p>Select a bot subscription to view transactions</p>
          </Card>
        ) : (
          <BotTransactionsTable
            data={data}
            selectedBotName={selectedBot?.botName}
            currentPage={currentPage}
            pageSize={pageSize}
          />
        )}
      </div>
    </div>
  );
}