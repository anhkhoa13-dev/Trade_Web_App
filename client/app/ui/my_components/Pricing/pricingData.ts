import { Pricing } from "@/app/types/Pricing";

export const pricingPlans: Pricing[] = [
    {
        id: "free",
        name: "Free",
        price: "$0 / mo",
        billing: "Per trader",
        description:
            "Access to essential trading tools and markets. Perfect for beginners exploring crypto trading.",
        features: [
            "Spot Trading Access",
            "Real-time Market Data",
            "Basic Portfolio Tracking",
            "Standard Security Features",
            "Community Support",
        ],
    },
    {
        id: "pro",
        name: "Pro",
        price: "$29 / mo",
        billing: "Per trader",
        description:
            "Unlock advanced trading tools with AI-powered insights and premium support.",
        highlight: true,
        features: [
            "Everything in Free Plan",
            "Margin & Futures Trading",
            "Advanced Charting Tools",
            "API Key Access for Bots",
            "Priority Customer Support",
            "Mobile App Access",
            "AI-Powered Trading Signals",
            "Automated Portfolio Insights",
            "Customizable Alerts & Notifications",
            "Exclusive Research Reports",
        ],
    },
];
