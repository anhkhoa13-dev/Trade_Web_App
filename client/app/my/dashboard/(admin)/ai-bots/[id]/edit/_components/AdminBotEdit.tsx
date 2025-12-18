"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";

import { Button } from "@/app/ui/shadcn/button";
import { BasicInformationSection } from "../../../create/_components/BasicInformationSection";
import { TradingConfigurationSection } from "../../../create/_components/TradingConfigurationSection";
import { EngineSettingsSection } from "../../../create/_components/EngineSettingsSection";
import { EditQuickActions } from "./EditQuickActions";
import { EditStatistics } from "./EditStatistics";
import { DeleteBotModal } from "../../../overview/_components/DeleteBotModal";

import { BotCategory, RiskLevel } from "@/backend/bot/botConstant";
import { BotFormInputs, BotFormSchema } from "@/schema/botSchema";

import { updateBotAction, deleteBotAction } from "@/actions/bot.actions";
import { BotResponse } from "@/backend/bot/bot.types";


function BotEditForm({ bot, botId }: { bot: BotResponse; botId: string }) {
  const router = useRouter();

  const [isPending, startTransition] = useTransition();

  const safeBot = bot as any;

  const initialValues: BotFormInputs = {
    name: bot.name,
    description: bot.description || "",
    category: (bot.category as BotCategory) || "AI_PREDICTIVE",
    coinSymbol: bot.tradingConfig?.coinSymbol || safeBot.coinSymbol || "",
    tradingPair: bot.tradingConfig?.tradingPair || safeBot.tradingPair || "",
    riskLevel: (bot.tradingConfig?.riskLevel as RiskLevel) || "LOW",
    websocketUrl: bot.integrationConfig?.websocketUrl || safeBot.websocketUrl || "",
    healthUrl: bot.integrationConfig?.healthCheckUrl || safeBot.healthCheckUrl || "",
  };

  const form = useForm<BotFormInputs>({
    resolver: zodResolver(BotFormSchema),
    defaultValues: initialValues,
  });

  // 2. Handle Submit với Server Action
  const onSubmit = (data: BotFormInputs) => {

    startTransition(async () => {
      try {
        const response = await updateBotAction(botId, data);

        if (response.status == "success")
          toast.success(`Bot "${data.name}" updated successfully!`);
        else
          toast.error(response.message)

      } catch (error: any) {
        console.error("Update failed:", error);
        toast.error(error.message || "Failed to update bot");
      }
    });
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <BasicInformationSection form={form} />
      <TradingConfigurationSection form={form} />
      <EngineSettingsSection form={form} />

      {/* Actions */}
      <div className="flex justify-end gap-3 pt-4 border-t">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/my/dashboard/ai-bots/overview")}
          disabled={isPending}
        >
          Cancel
        </Button>

        <Button type="submit" size="lg" disabled={isPending}>
          {isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...
            </>
          ) : (
            "Save Changes"
          )}
        </Button>
      </div>
    </form>
  );
}

// --- MAIN COMPONENT ---
interface AdminBotEditProps {
  bot: BotResponse;
  botId: string;
}

export default function AdminBotEdit({ bot, botId }: AdminBotEditProps) {
  const router = useRouter();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // 3. useTransition cho Delete Action
  const [isDeleting, startDeleteTransition] = useTransition();

  const handleBackToList = () => {
    router.push("/my/dashboard/ai-bots/overview");
  };

  // 4. Handle Delete với Server Action
  const handleDeleteConfirm = () => {
    startDeleteTransition(async () => {
      try {
        await deleteBotAction(botId);
        toast.success("Bot deleted successfully");
        setIsDeleteModalOpen(false);
        // Chuyển hướng về trang danh sách (Server Action đã revalidate list)
        // router.push sẽ thấy dữ liệu mới ngay lập tức
        router.push("/my/dashboard/ai-bots/overview");
      } catch (error: any) {
        toast.error(error.message || "Failed to delete bot");
      }
    });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={handleBackToList} className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back to Bots
        </Button>
      </div>

      <div className="flex justify-between items-end border-b pb-4">
        <div>
          <h1 className="text-2xl font-bold">Edit Bot: {bot.name}</h1>
          <p className="text-muted-foreground">
            Update configuration for ID:{" "}
            <span className="font-mono text-xs">{botId}</span>
          </p>
        </div>
      </div>

      {/* Quick Actions */}
      <EditQuickActions
        botName={bot.name}
        botStatus={bot.status}
        copyingUsers={bot.stats?.copyingUsers ?? 0}
        onResetApi={() => toast.success("Feature coming soon")}
        onPauseResume={() => toast.success("Feature coming soon")}
        onDelete={() => setIsDeleteModalOpen(true)}
      />

      {/* Statistics Section */}
      <EditStatistics
        createdAt={bot.createdAt}
        totalTrades={bot.stats?.totalTrades ?? 0}
        uptime={bot.stats?.uptime ?? 0}
        copyingUsers={bot.stats?.copyingUsers ?? 0}
      />

      {/* Form Section */}
      <BotEditForm bot={bot} botId={botId} />

      {/* Delete Confirmation Modal */}
      <DeleteBotModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        botName={bot.name}
        isDeleting={isDeleting}
      />
    </div>
  );
}