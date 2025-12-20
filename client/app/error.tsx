"use client";

import { useEffect } from "react";
import { AlertTriangle, Home, RotateCcw } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

import { SectionCard } from "@/app/ui/my_components/Card/SectionCard";
import { Button } from "@/app/ui/shadcn/button";

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error(error);
    }, [error]);

    return (
        <div className="flex min-h-[80vh] items-center justify-center bg-background p-4">
            <motion.div
                className="w-full max-w-lg"
                initial={{ opacity: 0, scale: 0.95, y: -20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
            >
                <SectionCard title="An Unexpected Error Occurred">
                    <div className="flex flex-col items-center space-y-6 text-center">
                        <div className="rounded-full bg-destructive/10 p-4">
                            <AlertTriangle className="h-10 w-10 text-destructive" />
                        </div>

                        <div className="space-y-2">
                            <p className="text-muted-foreground">
                                We've encountered a problem and our team has been notified.
                                Please try again in a few moments.
                            </p>
                            {error.digest && (
                                <p className="font-mono text-xs text-muted-foreground/80">
                                    Error ID: {error.digest}
                                </p>
                            )}
                        </div>

                        <div className="flex w-full flex-col gap-4 sm:flex-row sm:justify-center">
                            <Button
                                variant="outline"
                                onClick={() => reset()}
                                className="w-full sm:w-auto"
                            >
                                <RotateCcw className="mr-2 h-4 w-4" />
                                Try Again
                            </Button>
                            <Button asChild className="w-full sm:w-auto">
                                <Link href="/">
                                    <Home className="mr-2 h-4 w-4" />
                                    Go to Homepage
                                </Link>
                            </Button>
                        </div>
                    </div>
                </SectionCard>
            </motion.div>
        </div>
    );
}