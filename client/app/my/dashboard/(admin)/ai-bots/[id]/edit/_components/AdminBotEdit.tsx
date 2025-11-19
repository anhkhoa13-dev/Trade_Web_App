"use client";

import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/app/ui/shadcn/button";
import toast from "react-hot-toast";

import {
  adminBotDatabase,
  adminBotDetailDatabase,
} from "@/entities/mockAdminAiBots";
import { EditQuickActions } from "./EditQuickActions";
import { EditStatistics } from "./EditStatistics";
import { BasicInformationSection } from "../../../create/_components/BasicInformationSection";
import { EngineSettingsSection } from "../../../create/_components/EngineSettingsSection";
import { InitialStatusSection } from "../../../create/_components/InitialStatusSection";
import { TradingConfigurationSection } from "../../../create/_components/TradingConfigurationSection";
import { useRouter } from "next/navigation";

interface Props {
  botId: string;
}

export default function AdminBotEdit({ botId }: Props) {
  const bot = adminBotDetailDatabase.find((b) => b.id === botId);

  if (!bot) return <p>Bot not found</p>;

  // Setup state from bot
  const [name, setName] = useState(bot.name);
  const [description, setDescription] = useState(bot.description ?? "");
  const [category, setCategory] = useState(bot.category ?? "");
  const [tags, setTags] = useState<string[]>(bot.tags ?? []);
  const [riskLevel, setRiskLevel] = useState(bot.riskLevel ?? "Medium");

  const [tradingCoin, setTradingCoin] = useState(bot.coin);
  const [allocation, setAllocation] = useState(
    bot.allocationPercentage?.toString(),
  );
  const [frequency, setFrequency] = useState(bot.tradingFrequency ?? "5m");
  const [tradeType, setTradeType] = useState(bot.tradeType ?? "Both");

  const [apiUrl, setApiUrl] = useState(bot.apiUrl ?? "");
  const [websocketUrl, setWebsocketUrl] = useState(bot.websocketUrl ?? "");
  const [healthUrl, setHealthUrl] = useState(bot.healthCheckUrl ?? "");
  const [apiKey, setApiKey] = useState(bot.apiKey ?? "");
  const [apiSecret, setApiSecret] = useState(bot.apiSecret ?? "");

  const [autoError, setAutoError] = useState(bot.autoPauseOnErrors);
  const [autoUnsupported, setAutoUnsupported] = useState(false);
  // bot.autoPauseOnUnsupportedCoins,

  const handleSubmit = () => {
    if (!name || !category || !tradingCoin || !apiUrl) {
      toast.error("Please fill in all required fields");
      return;
    }

    toast.success(`${name} updated successfully`);
  };

  const router = useRouter();
  function handleBackToList() {
    router.push("/my/dashboard/ai-bots/overview");
  }
  function handleNavigateToDashboard() {}

  return (
    <div className="space-y-6">
      {/* Header */}
      <Button variant="ghost" onClick={handleBackToList} className="gap-2">
        <ArrowLeft className="h-4 w-4" />
        Back to Bots
      </Button>

      <div className="flex justify-between items-center">
        <div>
          <h1>Edit Bot: {bot.name}</h1>
          <p className="text-muted-foreground">Update bot configuration</p>
        </div>

        <Button variant="outline" onClick={handleNavigateToDashboard}>
          View Dashboard
        </Button>
      </div>

      {/* Edit-only actions */}
      <EditQuickActions
        botName={bot.name}
        botStatus={bot.status}
        copyingUsers={bot.copyingUsers}
        onResetApi={() => toast.success("API key reset")}
        onPauseResume={() =>
          toast.success(bot.status === "healthy" ? "Bot paused" : "Bot resumed")
        }
        onDelete={() => {
          if (confirm("Delete this bot?")) {
            toast.success("Bot deleted");
            handleBackToList();
          }
        }}
      />

      {/* Shared sections */}
      <BasicInformationSection
        name={name}
        setName={setName}
        description={description}
        setDescription={setDescription}
        category={category}
        setCategory={setCategory}
        tags={tags}
        setTags={setTags}
        riskLevel={riskLevel}
        setRiskLevel={setRiskLevel}
      />

      <TradingConfigurationSection
        tradingCoin={tradingCoin}
        setTradingCoin={setTradingCoin}
        allocation={allocation}
        setAllocation={setAllocation}
        frequency={frequency}
        setFrequency={setFrequency}
        tradeType={tradeType}
        setTradeType={setTradeType}
      />

      <EngineSettingsSection
        apiUrl={apiUrl}
        setApiUrl={setApiUrl}
        websocketUrl={websocketUrl}
        setWebsocketUrl={setWebsocketUrl}
        healthUrl={healthUrl}
        setHealthUrl={setHealthUrl}
        apiKey={apiKey}
        setApiKey={setApiKey}
        apiSecret={apiSecret}
        setApiSecret={setApiSecret}
      />

      {/* Edit-only auto-pause controls */}
      <InitialStatusSection
        enabled={true} // always enabled for edit mode
        setEnabled={() => {}} // disabled
        autoError={autoError}
        setAutoError={setAutoError}
        autoUnsupported={autoUnsupported}
        setAutoUnsupported={setAutoUnsupported}
      />

      {/* Edit-only bot stats */}
      <EditStatistics
        createdAt={bot.createdAt}
        totalTrades={bot.totalTrades}
        uptime={bot.uptime}
        copyingUsers={bot.copyingUsers}
      />

      {/* Save */}
      <div className="flex justify-end gap-3">
        <Button variant="outline" onClick={handleBackToList}>
          Cancel
        </Button>
        <Button size="lg" onClick={handleSubmit}>
          Save Changes
        </Button>
      </div>
    </div>
  );
}
