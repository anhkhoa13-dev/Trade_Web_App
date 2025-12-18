"use client";

import { useState, useEffect, memo } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/app/ui/shadcn/button";
import { ModeToggle } from "@/app/ui/my_components/Theme/ModeToggle";
import NavMenu from "./NavMenu";
import { menuData } from "./menuData";
import { UserNav } from "./UserNav";

import TickerTape from "@/app/ui/widgets/TicketTape";
const TickerTapeMemo = memo(TickerTape);

interface HeaderProps {
  user?: {
    email: string;
    username: string;
    fullname: string;
    avatarUrl?: string | null;
  };
}

export default function SiteHeader({ user }: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isAuthenticated = !!user;

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300 ease-in-out",
        isScrolled
          ? "bg-background/80 backdrop-blur-md shadow-sm border-b"
          : "bg-transparent border-b border-transparent"
      )}
    >
      <div className="hidden md:block">
        <TickerTapeMemo />
      </div>

      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-8">
          <Link
            href="/"
            className="flex items-center gap-2 transition-opacity hover:opacity-90 font-bold text-lg"
          >
            <Image
              src="/logo.jpg"
              alt="Logo"
              width={100}
              height={48}
              className="dark:invert h-6 w-auto"
              priority
            />
            {/* COINSANTRA */}
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:block">
            <NavMenu menu={menuData} />
          </div>
        </div>

        {/* RIGHT: Actions */}
        <div className="flex items-center gap-1">
          {/* Theme Toggle */}
          <ModeToggle />

          {/* Auth State */}
          {isAuthenticated ? (
            <UserNav
              user={{
                name: user.fullname,
                username: user.username,
                email: user.email,
                image: user.avatarUrl,
              }}
            />
          ) : (
            <div className="hidden items-center gap-2 md:flex">
              <Button variant="ghost" asChild className="text-sm font-medium">
                <Link href="/login">Log in</Link>
              </Button>
              <Button asChild className="text-sm font-medium">
                <Link href="/register">Sign up</Link>
              </Button>
            </div>
          )}

          {/* Mobile Menu Toggle */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>

      {mobileOpen && (
        <div className="border-b bg-background p-4 md:hidden animate-in slide-in-from-top-2">
          <nav className="grid gap-2">
            {menuData.map((item, index) => (
              <Link
                key={index}
                href={item.path || "#"}
                className="flex w-full items-center rounded-md p-2 text-sm font-medium hover:bg-accent"
                onClick={() => setMobileOpen(false)}
              >
                {item.title}
              </Link>
            ))}
            {!isAuthenticated && (
              <div className="mt-4 grid gap-2">
                <Button w-full variant="outline" asChild>
                  <Link href="/login">Log in</Link>
                </Button>
                <Button w-full asChild>
                  <Link href="/register">Sign up</Link>
                </Button>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
