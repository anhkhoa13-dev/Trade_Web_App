// error.tsx
"use client";

import { useEffect } from "react";
import { AlertTriangle, RefreshCcw } from "lucide-react";
import { Button } from "@/app/ui/shadcn/button";
import { Card } from "@/app/ui/shadcn/card";

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error("History Page Error:", error);
    }, [error]);

    return (
        <div className="flex h-[80vh] w-full items-center justify-center p-4">
            <Card className="flex w-full max-w-md flex-col items-center p-8 text-center border-destructive/20 bg-destructive/5">
                <div className="mb-4 rounded-full bg-destructive/10 p-3">
                    <AlertTriangle className="h-8 w-8 text-destructive" />
                </div>
                <h2 className="mb-2 text-xl font-bold text-foreground">
                    Something went wrong!
                </h2>
                <p className="mb-6 text-sm text-muted-foreground">
                    {error.message || "We couldn't load your transaction history."}
                </p>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={() => window.location.reload()}>
                        Reload Page
                    </Button>
                    <Button onClick={() => reset()}>
                        <RefreshCcw className="mr-2 h-4 w-4" />
                        Try Again
                    </Button>
                </div>
            </Card>
        </div>
    );
}