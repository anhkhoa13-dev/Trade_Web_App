"use client";

import { useTheme } from "next-themes";
import dynamic from "next/dynamic";
import { CopyrightStyles } from "react-ts-tradingview-widgets";

const AdvancedRealTimeChartNoSSR = dynamic(
    () => import("react-ts-tradingview-widgets").then((w) => w.AdvancedRealTimeChart),
    {
        ssr: false,
    }
);

export default function AdvancedRealTimeChartWidget({ symbol }: { symbol: string }) {
    const { resolvedTheme } = useTheme();
    const theme = resolvedTheme === "dark" ? "dark" : "light";

    const styles: CopyrightStyles = {
        parent: {
            display: "none",
        },
    };

    const backgroundColor = theme === "dark" ? "oklch(0.18 0.02 255)" : "oklch(0.99 0 0)";

    return (
        <AdvancedRealTimeChartNoSSR
            autosize
            symbol={symbol}
            theme={theme}
            backgroundColor={backgroundColor}
            allow_symbol_change={false}
            toolbar_bg={backgroundColor}
            details={true}
            hotlist={true}
            calendar={true}
            show_popup_button={true}
            copyrightStyles={styles}
        >
        </AdvancedRealTimeChartNoSSR>
    )
}
