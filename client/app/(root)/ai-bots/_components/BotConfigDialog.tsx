"use client";

import { useEffect, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { DialogTitle } from "@radix-ui/react-dialog";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/app/ui/shadcn/form";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
} from "@/app/ui/shadcn/dialog";
import { Input } from "@/app/ui/shadcn/input";
import { Button } from "@/app/ui/shadcn/button";

import { botConfigSchema, type BotConfigFormValues } from "./botConfigSchema";
import { copyBot } from "@/actions/botSub.actions";
import { BotCopyRequest } from "@/backend/bot/botSub.services";

interface BotConfigDialogProps {
  isOpen: boolean;
  onClose: () => void;
  botId: string;
}

export function BotConfigDialog({
  isOpen,
  onClose,
  botId,
}: BotConfigDialogProps) {
  const [isPending, startTransition] = useTransition();

  const form = useForm({
    resolver: zodResolver(botConfigSchema),
    mode: "onChange",
    defaultValues: {
      botId: botId,
      allocatedAmount: 0,
      allocatedCoin: 0,
      tradePercentage: 10,
      maxDailyLossPercentage: 5,
    },
  });

  // Reset form when dialog opens
  useEffect(() => {
    if (isOpen) {
      form.reset({
        botId: botId,
        allocatedAmount: 0,
        allocatedCoin: 0,
        tradePercentage: 10,
        maxDailyLossPercentage: 5,
      });
    }
  }, [isOpen, botId, form]);

  const onSubmit = (values: BotConfigFormValues) => {
    // Transform UI percentages (1-100) to API decimals (0.01-1.0)
    const payload: BotCopyRequest = {
      botId: values.botId,
      botWalletBalance: values.allocatedAmount,
      botWalletCoin: values.allocatedCoin,
      tradePercentage: values.tradePercentage / 100,
      maxDailyLossPercentage: values.maxDailyLossPercentage / 100,
    };

    startTransition(async () => {
      try {
        const result = await copyBot(payload);

        if (result.status === "success") {
          toast.success("Bot copied successfully!");
          onClose();
          form.reset();
        } else {
          toast.error(result.message || "Failed to copy bot");
        }
      } catch (error) {
        console.error("Error copying bot:", error);
        toast.error(
          error instanceof Error ? error.message : "Failed to copy bot"
        );
      }
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] bg-card text-card-foreground border-border">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-foreground">
            Copy Bot Strategy
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Configure parameters to start copying this trading bot.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-5 py-4"
          >
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="allocatedAmount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Allocated Capital ($)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="1000.00"
                        className="bg-input border-input
                          focus-visible:ring-ring"
                        {...field}
                        value={field.value as string | number}
                      />
                    </FormControl>
                    <FormMessage className="text-destructive font-medium" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="allocatedCoin"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Allocated Coin</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.0001"
                        placeholder="0.5"
                        className="bg-input border-input
                          focus-visible:ring-ring"
                        {...field}
                        value={field.value as string | number}
                      />
                    </FormControl>
                    <FormMessage className="text-destructive font-medium" />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="tradePercentage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Trade Size (%)</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type="number"
                          step="0.1"
                          max={100}
                          className="pr-8 bg-input border-input"
                          {...field}
                          value={field.value as string | number}
                        />
                        <span
                          className="absolute right-3 top-2 text-sm
                            text-muted-foreground"
                        >
                          %
                        </span>
                      </div>
                    </FormControl>
                    <FormDescription className="text-xs">
                      % of capital per trade
                    </FormDescription>
                    <FormMessage className="text-destructive" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="maxDailyLossPercentage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Max Daily Loss (%)</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type="number"
                          step="0.1"
                          max={100}
                          className="pr-8 bg-input border-input"
                          {...field}
                          value={field.value as string | number}
                        />
                        <span
                          className="absolute right-3 top-2 text-sm
                            text-muted-foreground"
                        >
                          %
                        </span>
                      </div>
                    </FormControl>
                    <FormDescription className="text-xs">
                      Stop trading if loss hits
                    </FormDescription>
                    <FormMessage className="text-destructive" />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter className="pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="border-border text-foreground hover:bg-muted"
                disabled={isPending}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isPending}
                className="bg-primary text-primary-foreground
                  hover:bg-primary/90"
              >
                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Start Copying
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
