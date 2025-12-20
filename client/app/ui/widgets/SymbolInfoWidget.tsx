"use client"

import { useTheme } from "next-themes";
import dynamic from "next/dynamic";
import { CopyrightStyles } from "react-ts-tradingview-widgets";


const SymbolInfoWidgetNoSSR = dynamic(
    () => import("react-ts-tradingview-widgets").then((w) => w.SymbolInfo),
    {
        ssr: false,
    }
);

export default function SymbolInfoWidget({ symbol }: { symbol: string }) {
    const { resolvedTheme } = useTheme();

    const styles: CopyrightStyles = {
        parent: {
            display: "none",
        },
    };

    const theme = resolvedTheme === "dark" ? "dark" : "light";
    return (
        <SymbolInfoWidgetNoSSR
            autosize
            symbol={symbol}
            colorTheme={theme}
            isTransparent={true}
            copyrightStyles={styles}

        />
    )
}
