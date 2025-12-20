"use client";

import Link from "next/link";
import { Button } from "@/app/ui/shadcn/button";

interface AuthActionsProps {
    isAuthenticated: boolean;
    user: {
        name: string;
        username: string;
        email: string;
        image?: string | null;
    } | null;
    children?: React.ReactNode;
}

export function DesktopAuthActions({
    isAuthenticated,
    user,
    children,
}: AuthActionsProps) {
    if (isAuthenticated && user) {
        return <>{children}</>;
    }

    return (
        <div className="flex items-center gap-3">
            <Button
                variant="ghost"
                asChild
                className="font-medium"
            >
                <Link href="/login">Log in</Link>
            </Button>
            <Button asChild className="font-medium">
                <Link href="/register">Sign up</Link>
            </Button>
        </div>
    );
}
