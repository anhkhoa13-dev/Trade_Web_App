"use client"

import { useEffect } from "react"
import { AlertCircle, RotateCcw, Home } from "lucide-react"
import Link from "next/link"
import { Button } from "./ui/shadcn/button";

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error("Critical Error caught by error.tsx:", error);
    }, [error]);

    return (
        <div className="flex min-h-[60vh] flex-col items-center justify-center p-6 text-center animate-in fade-in zoom-in duration-300">

            <div className="bg-red-100 p-4 rounded-full mb-6">
                <AlertCircle className="w-12 h-12 text-red-600" />
            </div>

            <h2 className="text-3xl font-bold tracking-tight text-gray-900 mb-2">
                Something went wrong
            </h2>


            <p className="text-gray-500 max-w-md mb-8">
                {error.message || "System error"}
                {error.digest && (
                    <span className="block mt-2 text-xs text-gray-400 font-mono">
                        Error ID: {error.digest}
                    </span>
                )}
            </p>


            <div className="flex flex-col sm:flex-row gap-4">
                <Button
                    onClick={() => reset()}
                >
                    <RotateCcw className="w-4 h-4" />
                    Try again
                </Button>

                <Button asChild>
                    <Link
                        href="/"
                    >
                        <Home className="w-4 h-4" />
                        Home page
                    </Link>
                </Button>
            </div>
        </div>
    );
}