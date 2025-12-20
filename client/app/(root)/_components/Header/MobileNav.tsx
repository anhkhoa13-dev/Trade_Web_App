"use client";

import Link from "next/link";
import { Button } from "@/app/ui/shadcn/button";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/app/ui/shadcn/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/app/ui/shadcn/avatar";
import { Separator } from "@/app/ui/shadcn/separator";
import { Menu, User, Wallet, LogOut } from "lucide-react";
import { menuData } from "./menuData";
import { logout } from "@/actions/auth.actions";
import toast from "react-hot-toast";

interface MobileNavProps {
    isAuthenticated: boolean;
    user?: {
        name: string;
        username: string;
        email: string;
        image?: string | null;
    } | null;
}

export function MobileNav({ isAuthenticated, user }: MobileNavProps) {
    const handleLogout = async () => {
        const result = await logout()

        if (result && result.status === "error") {
            toast.error(result.message)
        }
    }

    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    className="lg:hidden"
                    aria-label="Toggle navigation menu"
                >
                    <Menu className="h-5 w-5" />
                </Button>
            </SheetTrigger>

            <SheetContent
                side="right"
            >
                <SheetHeader className="border-b px-6 py-4">
                    <SheetTitle className="text-left">
                        <span className="text-primary">COIN</span>
                        <span>SANTRA</span>
                    </SheetTitle>
                </SheetHeader>

                {/* User Profile Section - Show when authenticated */}
                {isAuthenticated && user && (
                    <>

                        <div className="flex items-center gap-2 rounded-full px-2 py-1">
                            <Avatar className="h-12 w-12">
                                <AvatarImage src={user.image!} alt={user.name} />
                                <AvatarFallback>
                                    {user.username
                                        ? user.username[0].toUpperCase()
                                        : user.name[0].toUpperCase()}
                                </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold truncate">
                                    {user.username}
                                </p>
                                <p className="text-xs text-muted-foreground truncate">
                                    {user.email}
                                </p>
                            </div>
                        </div>

                        <Separator />
                    </>
                )}

                <nav className="flex flex-col flex-1 overflow-y-auto">
                    {/* Menu Items */}
                    <div className="px-4 py-4 space-y-1 flex flex-col">
                        {menuData
                            .filter((item) => !!item.path)
                            .map((item) => (
                                <Button
                                    asChild
                                    variant="ghost"
                                    className="w-full justify-start"
                                    key={item.path!}
                                >
                                    <Link
                                        key={item.path!}
                                        href={item.path!}
                                    >
                                        {item.title}
                                    </Link>
                                </Button>

                            ))}
                    </div>

                    {/* User Actions or Auth Buttons */}
                    {isAuthenticated && user ? (
                        <div className="border-t px-4 py-4 space-y-2 mt-auto">
                            <Button
                                variant="ghost"
                                className="w-full justify-start"
                                asChild
                            >
                                <Link href="/my/profile">
                                    <User className="mr-2 h-4 w-4" />
                                    Profile
                                </Link>
                            </Button>
                            <Button
                                variant="ghost"
                                className="w-full justify-start"
                                asChild
                            >
                                <Link href="/my/wallet/overview">
                                    <Wallet className="mr-2 h-4 w-4" />
                                    Wallet
                                </Link>
                            </Button>
                            <Separator className="my-2" />
                            <Button
                                variant="destructive"
                                className="w-full justify-start"
                                onClick={handleLogout}
                            >
                                <LogOut className="mr-2 h-4 w-4" />
                                Log out
                            </Button>
                        </div>
                    ) : (
                        <div className="border-t px-4 py-4 space-y-3 mt-auto">
                            <Button
                                variant="outline"
                                className="w-full"
                                asChild
                            >
                                <Link href="/login">Log in</Link>
                            </Button>
                            <Button className="w-full" asChild>
                                <Link href="/register">Sign up</Link>
                            </Button>
                        </div>
                    )}
                </nav>
            </SheetContent>
        </Sheet>
    );
}
