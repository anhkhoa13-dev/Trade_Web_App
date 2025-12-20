"use client";

import Link from "next/link";
import { ModeToggle } from "@/app/ui/my_components/Theme/ModeToggle";
import NavMenu from "./NavMenu";
import { menuData } from "./menuData";
import { UserNav } from "./UserNav";
import { MobileNav } from "./MobileNav";
import { DesktopAuthActions } from "./DesktopAuthActions";
import { useHeaderScroll, getHeaderStyles } from "./header.hooks";
import TickerTapeWidget from "@/app/ui/widgets/TickerTapeWidget";
import { memo } from "react";

const TickerTapeMemo = memo(TickerTapeWidget);

interface HeaderProps {
  user?: {
    email: string;
    username: string;
    fullname: string;
    avatarUrl?: string | null;
  };
}

const LOGO_TEXT = {
  primary: "COIN",
  secondary: "SANTRA",
} as const;

export default function SiteHeader({ user }: HeaderProps) {
  const isScrolled = useHeaderScroll();
  const isAuthenticated = !!user;

  const mappedUser = user
    ? {
      name: user.fullname,
      username: user.username,
      email: user.email,
      image: user.avatarUrl,
    }
    : undefined;

  return (
    <header className={getHeaderStyles({ isScrolled })}>
      {/* Desktop Ticker Tape */}
      <div className="hidden lg:block border-b">
        <TickerTapeMemo />
      </div>

      {/* Main Header Content */}
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo & Desktop Menu */}
        <div className="flex items-center gap-8 min-w-0">
          {/* Logo */}
          <Link
            href="/"
            className="flex-shrink-0 inline-flex items-center transition-opacity duration-200 hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-md"
            aria-label="Coinsantra home"
          >
            <span className="text-lg font-extrabold tracking-tight">
              <span className="text-primary">{LOGO_TEXT.primary}</span>
              <span className="text-foreground">{LOGO_TEXT.secondary}</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:block">
            <NavMenu menu={menuData} />
          </nav>
        </div>

        {/* Right Section: Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Theme Toggle */}
          <ModeToggle />

          {/* Desktop Auth Actions */}
          <div className="hidden lg:block">
            <DesktopAuthActions
              isAuthenticated={isAuthenticated}
              user={mappedUser || null}
            >
              {isAuthenticated && mappedUser && <UserNav user={mappedUser} />}
            </DesktopAuthActions>
          </div>

          {/* Mobile Navigation */}
          <div className="lg:hidden">
            <MobileNav
              isAuthenticated={isAuthenticated}
              user={mappedUser || null}
            />
          </div>
        </div>
      </div>
    </header>
  );
}
