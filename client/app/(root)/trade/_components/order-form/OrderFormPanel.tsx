"use client";

import { useState, useEffect, useTransition, useCallback } from "react";
import { toast } from "react-hot-toast";
import { executeMarketOrder } from "@/actions/trade.actions";
import { useTradeContext } from "../TradeContext";
import { TradeSide, OrderType } from "../trade.constants";
import { PriceInput, AmountInput, BalanceDisplay, SubmitButton } from "./OrderInputs";
import { PercentageSlider } from "./PercentageSlider";
import { TPSLInputs } from "./TPSLInputs";

interface OrderFormPanelProps {
    side: TradeSide;
    orderType: OrderType;
    balance: number;
    currentPrice: number;
}

export function OrderFormPanel({
    side,
    orderType,
    balance,
    currentPrice,
}: OrderFormPanelProps) {
    const { symbol, currency, isLoggedIn, triggerRefresh } = useTradeContext();
    const isMarket = orderType === "market";
    const isBuy = side === "buy";

    // Form state
    const [priceVal, setPriceVal] = useState("");
    const [amountVal, setAmountVal] = useState("");
    const [percentage, setPercentage] = useState([0]);
    const [isPending, startTransition] = useTransition();

    // Reset form when order type changes
    useEffect(() => {
        setAmountVal("");
        setPercentage([0]);
        setPriceVal(isMarket ? "" : currentPrice.toString());
    }, [orderType, currentPrice, isMarket]);

    // Sync slider with amount
    const handlePercentageChange = useCallback(
        (newPercentage: number[]) => {
            setPercentage(newPercentage);

            if (newPercentage[0] === 0) return;

            const percent = newPercentage[0] / 100;
            const activePrice = isMarket ? currentPrice : parseFloat(priceVal) || 0;

            if (activePrice <= 0) return;

            const computedAmount = isBuy
                ? (balance * percent * 0.99) / activePrice
                : balance * percent;

            setAmountVal(computedAmount.toFixed(6));
        },
        [isMarket, currentPrice, priceVal, balance, isBuy]
    );

    // Handle amount input (resets slider)
    const handleAmountChange = (value: string) => {
        setAmountVal(value);
        setPercentage([0]);
    };

    // Submit order
    const handleSubmit = () => {
        if (!isLoggedIn) {
            toast.error("Please log in to trade");
            return;
        }

        const amount = parseFloat(amountVal);
        if (!amount || amount <= 0) {
            toast.error("Enter a valid amount");
            return;
        }

        startTransition(async () => {
            if (isMarket) {
                const result = await executeMarketOrder({
                    symbol,
                    side,
                    quantity: amount,
                });

                if (result.success) {
                    toast.success(result.message);
                    setAmountVal("");
                    setPercentage([0]);
                    triggerRefresh();
                } else {
                    toast.error(result.message);
                }
            } else {
                toast("Limit orders coming soon");
            }
        });
    };

    return (
        <div className="flex flex-col gap-4">
            <PriceInput
                value={priceVal}
                onChange={setPriceVal}
                currentPrice={currentPrice}
                currency={currency}
                isMarket={isMarket}
                disabled={!isLoggedIn}
            />

            <AmountInput
                value={amountVal}
                onChange={handleAmountChange}
                symbol={symbol}
                disabled={!isLoggedIn}
            />

            <PercentageSlider
                value={percentage}
                onChange={handlePercentageChange}
                side={side}
            />

            <TPSLInputs side={side} />

            <BalanceDisplay
                balance={balance}
                label={isBuy ? currency : symbol}
                side={side}
            />

            <SubmitButton
                side={side}
                symbol={symbol}
                isPending={isPending}
                disabled={!isLoggedIn}
                onClick={handleSubmit}
            />
        </div>
    );
}
