"use client";

import { ArrowLeft } from "lucide-react";
import { Button } from "@/app/ui/shadcn/button";
import { useRouter } from "next/navigation";


export default function BotHeaderActions(
) {
    const router = useRouter();

    const handleBack = () => {
        router.push("/ai-bots");
    };


    return (
        <Button variant="ghost" onClick={handleBack} >
            < ArrowLeft className="h-4 w-4" />
            Back to Marketplace
        </Button >
    );
}
