"use client";

import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/app/ui/shadcn/button";

import toast from "react-hot-toast";
import { BasicInformationSection } from "./BasicInformationSection";
import { TradingConfigurationSection } from "./TradingConfigurationSection";
import { EngineSettingsSection } from "./EngineSettingsSection";
import { InitialStatusSection } from "./InitialStatusSection";
import { useRouter } from "next/navigation";

interface Props {
  //   onBack: () => void;
}

export default function AdminBotCreateEdit({}: Props) {
  // All state here
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");

  const [tags, setTags] = useState<string[]>([]);
  const [riskLevel, setRiskLevel] = useState("Medium");

  const [tradingCoin, setTradingCoin] = useState("");
  const [allocation, setAllocation] = useState("25");
  const [frequency, setFrequency] = useState("5m");
  const [tradeType, setTradeType] = useState("Both");

  const [apiUrl, setApiUrl] = useState("");
  const [websocketUrl, setWebsocketUrl] = useState("");
  const [healthUrl, setHealthUrl] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [apiSecret, setApiSecret] = useState("");

  const [enabled, setEnabled] = useState(true);
  const [autoError, setAutoError] = useState(true);
  const [autoUnsupported, setAutoUnsupported] = useState(true);

  const handleSubmit = () => {
    if (!name || !category || !tradingCoin || !apiUrl) {
      toast.error("Please fill in required fields");
      return;
    }

    toast.success("Bot created successfully");
  };
  const router = useRouter();
  const handleBackToList = () => {
    router.push("/my/dashboard/ai-bots/overview");
  };

  return (
    <div className="space-y-6">
      <Button variant="ghost" onClick={handleBackToList} className="gap-2">
        <ArrowLeft className="h-4 w-4" />
        Back to Bot List
      </Button>

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

      <InitialStatusSection
        enabled={enabled}
        setEnabled={setEnabled}
        autoError={autoError}
        setAutoError={setAutoError}
        autoUnsupported={autoUnsupported}
        setAutoUnsupported={setAutoUnsupported}
      />

      {/* Create Button */}
      <div className="flex justify-end gap-3">
        <Button variant="outline" onClick={handleBackToList}>
          Cancel
        </Button>

        <Button size="lg" onClick={handleSubmit}>
          Create Bot
        </Button>
      </div>
    </div>
  );
}
