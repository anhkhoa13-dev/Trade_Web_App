import React from "react";
import { Button } from "../../../ui/shadcn/button";
import Link from "next/link";
import MarketOverviewWidget from "@/app/ui/widgets/MarketOverviewWidget";

export default function Hero() {
  return (
    <section
      className="relative mx-auto max-w-6xl px-6 pb-24 pt-12 md:pb-32 lg:grid
        lg:grid-cols-2 lg:items-center lg:gap-40 lg:pt-10 space-y-10"
    >
      {/* Left: Text + CTA */}
      <div className="mx-auto max-w-2xl text-center lg:mx-0 lg:text-left">
        <h1
          className="mt-4 text-balance text-5xl font-bold leading-tight
             lg:text-6xl"
        >
          <span className="block">Trade hundreds of pairs with</span>
          <span className="block text-primary">institutional-grade controls.</span>
        </h1>
        <p className="mt-6 text-pretty text-lg text-muted-foreground md:text-xl">
          Deep liquidity, transparent fees, and risk tooling for Spot &amp;
          Perps — on desktop and mobile.
        </p>
        <div
          className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:justify-center
            lg:justify-start"
        >
          <Button asChild size="lg" className="px-6 text-base">
            <Link href="#link">Create Account</Link>
          </Button>
          <Button asChild size="lg" variant="ghost" className="px-6 text-base">
            <Link href="#link">Browse Market</Link>
          </Button>
        </div>
      </div>

      {/* Right: Market Overview */}
      <div className="lg:h-full w-full border h-200">
        <MarketOverviewWidget />
      </div>
    </section>
  );
}
