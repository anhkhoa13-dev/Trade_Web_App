// app/admin/bots/create/_components/CreateBotForm.tsx
"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft } from "lucide-react";
import toast from "react-hot-toast";

import { Button } from "@/app/ui/shadcn/button";
import { BotFormInputs, BotFormSchema } from "@/schema/botSchema";
import { createBotAction } from "@/actions/bot.actions";


// Các components con
import { BasicInformationSection } from "./BasicInformationSection";
import { EngineSettingsSection } from "./EngineSettingsSection";
import { TradingConfigurationSection } from "./TradingConfigurationSection";
import { BotSecretsDialog } from "./BotSecretsDialog";
import { BotSecretResponse } from "@/backend/bot/bot.types";
import { error } from "console";

export default function CreateBotForm() {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [createdBotData, setCreatedBotData] = useState<BotSecretResponse | null>(null);

    const form = useForm<BotFormInputs>({
        resolver: zodResolver(BotFormSchema),
        defaultValues: {
            name: "",
            description: "",
            category: "AI_PREDICTIVE",
            riskLevel: "LOW",
            coinSymbol: "",
            tradingPair: "",
            websocketUrl: "",
            healthUrl: "",
        },
    });

    const handleBackToList = () => {
        router.push("/my/dashboard/ai-bots/overview");
    };

    const handleSecretsDialogClose = () => {
        setCreatedBotData(null);
        router.push("/my/dashboard/ai-bots/overview");
    };

    const onSubmit = (data: BotFormInputs) => {
        const apiPayload: BotFormInputs = {
            ...data,
            websocketUrl: data.websocketUrl || undefined,
            healthUrl: data.healthUrl || undefined,
        };

        startTransition(async () => {
            try {
                const result = await createBotAction(apiPayload);

                if (result.status == "success") {
                    toast.success("Bot created successfully!");
                    setCreatedBotData(result.data);
                } else {
                    toast.error(result.message);
                }
            } catch (error: any) {
                toast.error(error.message || "Failed to create bot");
            }
        });
    };

    return (
        <>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="flex items-center justify-between">
                    <Button
                        variant="ghost"
                        onClick={handleBackToList}
                        className="gap-2"
                        type="button"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back to Bot List
                    </Button>
                    <h1 className="text-xl font-semibold">Create New Bot</h1>
                </div>

                <BasicInformationSection form={form} />
                <TradingConfigurationSection form={form} />
                <EngineSettingsSection form={form} />

                <div className="flex justify-end gap-3 pt-4">
                    <Button
                        variant="outline"
                        onClick={handleBackToList}
                        disabled={isPending}
                        type="button"
                    >
                        Cancel
                    </Button>
                    <Button size="lg" type="submit" disabled={isPending}>
                        {isPending ? "Creating..." : "Create Bot"}
                    </Button>
                </div>
            </form>

            <BotSecretsDialog
                open={!!createdBotData}
                data={createdBotData}
                onClose={handleSecretsDialogClose}
            />
        </>
    );
}