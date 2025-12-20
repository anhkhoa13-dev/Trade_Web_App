"use client";

import { cn } from "@/lib/utils";
import { Slider } from "@/app/ui/shadcn/slider";
import { TradeSide, PERCENTAGE_STEPS } from "../trade.constants";

interface PercentageSliderProps {
    value: number[];
    onChange: (value: number[]) => void;
    side: TradeSide;
}

export function PercentageSlider({ value, onChange, side }: PercentageSliderProps) {
    const isBuy = side === "buy";

    return (
        <div className="relative px-1 py-5">
            {/* Step markers */}
            <div className="pointer-events-none absolute left-0 top-1/2 z-0 flex w-full -translate-y-1/2 justify-between px-0.5">
                {PERCENTAGE_STEPS.map((step) => {
                    const isActive = value[0] >= step;
                    return (
                        <div
                            key={step}
                            className={cn(
                                "h-2 w-2 rotate-45 border-2 transition-all duration-200 bg-background",
                                isActive
                                    ? isBuy
                                        ? "border-trade-up bg-trade-up"
                                        : "border-trade-down bg-trade-down"
                                    : "border-muted-foreground/30"
                            )}
                        />
                    );
                })}
            </div>

            {/* Slider */}
            <Slider
                value={value}
                onValueChange={onChange}
                max={100}
                step={25}
                className={cn(
                    "relative z-10 cursor-pointer",
                    isBuy
                        ? "[&_span[data-slot=slider-range]]:bg-trade-up [&_span[data-slot=slider-thumb]]:border-trade-up [&_span[data-slot=slider-thumb]]:ring-trade-up/30"
                        : "[&_span[data-slot=slider-range]]:bg-trade-down [&_span[data-slot=slider-thumb]]:border-trade-down [&_span[data-slot=slider-thumb]]:ring-trade-down/30"
                )}
            />

        </div>
    );
}
