"use client";

import { useState, useEffect } from "react";
import { Input } from "@/app/ui/shadcn/input";
import { Label } from "@/app/ui/shadcn/label";
import { Checkbox } from "@/app/ui/shadcn/checkbox";
import { TradeSide } from "../trade.constants";

interface TPSLInputsProps {
    side: TradeSide;
}

export function TPSLInputs({ side }: TPSLInputsProps) {
    const [showTPSL, setShowTPSL] = useState(false);
    const [tpValue, setTpValue] = useState("");
    const [slValue, setSlValue] = useState("");

    // Reset when side changes
    useEffect(() => {
        setTpValue("");
        setSlValue("");
    }, [side]);

    return (
        <div className="space-y-3">
            <div className="flex items-center gap-2">
                <Checkbox
                    id={`tpsl-${side}`}
                    checked={showTPSL}
                    onCheckedChange={(checked) => setShowTPSL(!!checked)}
                />
                <Label
                    htmlFor={`tpsl-${side}`}
                    className="text-xs font-medium text-muted-foreground cursor-pointer select-none"
                >
                    Take Profit / Stop Loss
                </Label>
            </div>

            {showTPSL && (
                <div className="space-y-2 animate-in slide-in-from-top-2 duration-200">
                    <div className="relative">
                        <label className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                            TP
                        </label>
                        <Input
                            className="h-9 pl-10 pr-4 text-right font-mono text-sm tabular-nums [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                            placeholder="Take Profit Price"
                            value={tpValue}
                            onChange={(e) => setTpValue(e.target.value)}
                            type="number"
                        />
                    </div>
                    <div className="relative">
                        <label className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                            SL
                        </label>
                        <Input
                            className="h-9 pl-10 pr-4 text-right font-mono text-sm tabular-nums [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                            placeholder="Stop Loss Price"
                            value={slValue}
                            onChange={(e) => setSlValue(e.target.value)}
                            type="number"
                        />
                    </div>
                </div>
            )}
        </div>
    );
}
