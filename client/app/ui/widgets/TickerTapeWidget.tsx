"use client"

import { useTheme } from "next-themes";
import dynamic from "next/dynamic";
import { CopyrightStyles } from "react-ts-tradingview-widgets";

const TickerTapeNoSSR = dynamic(
    () => import("react-ts-tradingview-widgets").then((w) => w.TickerTape),
    {
        ssr: false,
    }
);

export default function TickerTapeWidget() {
    const { resolvedTheme } = useTheme();
    const theme = resolvedTheme === "dark" ? "dark" : "light";

    const styles: CopyrightStyles = {
        parent: {
            display: "none",
        },
    };
    return (
        <TickerTapeNoSSR
            colorTheme={theme}
            isTransparent={true}
            copyrightStyles={styles}
        >
        </TickerTapeNoSSR>
    )
}

