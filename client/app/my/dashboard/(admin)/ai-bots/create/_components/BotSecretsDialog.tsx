"use client";

import { useState } from "react";
import { Copy, Check, AlertTriangle, Eye, EyeOff } from "lucide-react";
import { Button } from "@/app/ui/shadcn/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/app/ui/shadcn/dialog";
import { Input } from "@/app/ui/shadcn/input";
// Add Textarea import
import { Textarea } from "@/app/ui/shadcn/textarea";
import { Label } from "@/app/ui/shadcn/label";
import { BotSecretResponse } from "@/services/botService";

interface Props {
  open: boolean;
  data: BotSecretResponse | null;
  onClose: () => void;
}

export function BotSecretsDialog({ open, data, onClose }: Props) {
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [showSecret, setShowSecret] = useState(false);

  if (!data) return null;

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  return (
    <Dialog open={open} onOpenChange={(val) => !val && onClose()}>
      <DialogContent
        className="sm:max-w-xl"
        onInteractOutside={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-green-600">
            <Check className="h-5 w-5" />
            Bot Created Successfully
          </DialogTitle>
          <DialogDescription>
            The bot <strong>{data.name}</strong> has been registered.
            <br />
            <span
              className="mt-2 block rounded-md bg-amber-50 p-3 text-amber-900
                border border-amber-200"
            >
              <AlertTriangle className="mb-1 h-4 w-4 inline mr-2" />
              <strong>Important:</strong> Please copy these credentials now. The{" "}
              <strong>API Secret</strong> will NOT be shown again.
            </span>
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-6 py-4">
          {/* Webhook URL - Changed to Textarea for better wrapping */}
          <div className="grid gap-2">
            <Label className="text-base font-semibold">
              Webhook URL (For your Python Bot)
            </Label>
            <div className="flex items-start gap-2">
              <Textarea
                readOnly
                value={data.webhookUrl}
                className="font-mono text-sm bg-muted resize-none h-auto
                  min-h-[80px] p-3"
              />
              <Button
                size="icon"
                variant="outline"
                className="mt-1"
                onClick={() => copyToClipboard(data.webhookUrl, "webhookUrl")}
                title="Copy Webhook URL"
              >
                {copiedField === "webhookUrl" ? (
                  <Check className="h-4 w-4 text-green-500" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          {/* API Key - Changed to Textarea */}
          <div className="grid gap-2">
            <Label className="text-base font-semibold">API Key</Label>
            <div className="flex items-start gap-2">
              <Textarea
                readOnly
                value={data.apiKey}
                className="font-mono text-sm bg-muted resize-none h-auto
                  min-h-[60px] p-3"
                rows={2}
              />
              <Button
                size="icon"
                variant="outline"
                className="mt-1"
                onClick={() => copyToClipboard(data.apiKey, "apiKey")}
                title="Copy API Key"
              >
                {copiedField === "apiKey" ? (
                  <Check className="h-4 w-4 text-green-500" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          {/* API Secret - Kept as Input for password masking, but made larger */}
          <div className="grid gap-2">
            <Label className="text-base font-semibold text-destructive">
              API Secret
            </Label>
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Input
                  readOnly
                  type={showSecret ? "text" : "password"}
                  value={data.apiSecret}
                  // Increased height (h-14), padding (p-4), and font size (text-sm)
                  className="font-mono text-sm h-14 p-4 bg-red-50 border-red-200
                    text-red-900 pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowSecret(!showSecret)}
                  className="absolute right-4 top-1/2 -translate-y-1/2
                    text-red-700 hover:text-red-900"
                >
                  {showSecret ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
              <Button
                size="icon"
                variant="outline"
                className="h-14 w-14 border-red-200 hover:bg-red-50
                  hover:text-red-600"
                onClick={() => copyToClipboard(data.apiSecret, "apiSecret")}
                title="Copy Secret"
              >
                {copiedField === "apiSecret" ? (
                  <Check className="h-5 w-5 text-green-500" />
                ) : (
                  <Copy className="h-5 w-5" />
                )}
              </Button>
            </div>
          </div>
        </div>

        <DialogFooter className="sm:justify-between gap-4 items-center">
          <p className="text-sm text-muted-foreground font-medium">
            Make sure you have copied the API Secret.
          </p>
          <Button onClick={onClose} size="lg" className="w-full sm:w-auto">
            I have saved these credentials
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
