"use client"

import { useTheme } from "next-themes";
import dynamic from "next/dynamic";
import { CopyrightStyles } from "react-ts-tradingview-widgets";

const SingleTickerNoSSR = dynamic(
    () => import("react-ts-tradingview-widgets").then((w) => w.SingleTicker),
    {
        ssr: false,
    }
);

export default function SingleTickerWidget({ symbol }: { symbol: string }) {
    const { resolvedTheme } = useTheme();
    const theme = resolvedTheme === "dark" ? "dark" : "light";

    const styles: CopyrightStyles = {
        parent: {
            display: "none",
        },
    };
    return (
        <SingleTickerNoSSR
            symbol={symbol}
            colorTheme={theme}
            isTransparent={true}
            copyrightStyles={styles}
            autosize
        >
        </SingleTickerNoSSR>
    )
}

