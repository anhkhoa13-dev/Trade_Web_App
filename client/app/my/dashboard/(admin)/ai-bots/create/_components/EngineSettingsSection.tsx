"use client";

import { Label } from "@/app/ui/shadcn/label";
import { Input } from "@/app/ui/shadcn/input";
import { Info } from "lucide-react";
import { SectionCard } from "@/app/ui/my_components/Card/SectionCard";

interface Props {
  apiUrl: string;
  setApiUrl: (v: string) => void;

  websocketUrl: string;
  setWebsocketUrl: (v: string) => void;

  healthUrl: string;
  setHealthUrl: (v: string) => void;

  apiKey: string;
  setApiKey: (v: string) => void;

  apiSecret: string;
  setApiSecret: (v: string) => void;
}

export function EngineSettingsSection({
  apiUrl,
  setApiUrl,
  websocketUrl,
  setWebsocketUrl,
  healthUrl,
  setHealthUrl,
  apiKey,
  setApiKey,
  apiSecret,
  setApiSecret,
}: Props) {
  return (
    <SectionCard title="External Bot Engine Settings">
      <div className="space-y-2">
        <Label>API URL *</Label>
        <Input
          placeholder="https://api.my-bot.com"
          value={apiUrl}
          onChange={(e) => setApiUrl(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label>WebSocket URL</Label>
        <Input
          placeholder="wss://your-bot/ws"
          value={websocketUrl}
          onChange={(e) => setWebsocketUrl(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label>Health Check URL</Label>
        <Input
          placeholder="https://api.my-bot.com/health"
          value={healthUrl}
          onChange={(e) => setHealthUrl(e.target.value)}
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <Label>API Key</Label>
          <Input
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label>API Secret</Label>
          <Input
            type="password"
            value={apiSecret}
            onChange={(e) => setApiSecret(e.target.value)}
          />
        </div>
      </div>

      {/* schema */}
      <div className="rounded-lg border border-border bg-muted/50 p-4">
        <div className="mb-2 flex items-center gap-2">
          <Info className="h-4 w-4 text-primary" />
          <p className="text-sm">Required Signal Schema</p>
        </div>

        <pre className="text-xs bg-background p-3 rounded">
          {`{
            "buy": "BTC",
            "sell": "ETH",
            "timestamp": 1713452345
        }`}
        </pre>
      </div>
    </SectionCard>
  );
}
