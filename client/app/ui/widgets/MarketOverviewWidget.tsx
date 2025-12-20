"use client"

import { useTheme } from "next-themes";
import dynamic from "next/dynamic";
import { CopyrightStyles } from "react-ts-tradingview-widgets";

const MarketOverviewNoSSR = dynamic(
    () => import("react-ts-tradingview-widgets").then((w) => w.MarketOverview),
    {
        ssr: false,
    }
);

export default function MarketOverviewWidget() {
    const { resolvedTheme } = useTheme();
    const theme = resolvedTheme === "dark" ? "dark" : "light";

    const styles: CopyrightStyles = {
        parent: {
            display: "none",
        },
    };

    return (
        <MarketOverviewNoSSR
            colorTheme={theme}
            width="100%"
            showFloatingTooltip
            isTransparent={true}
            height="100%"
            copyrightStyles={styles}
        >
        </MarketOverviewNoSSR>
    )
}

