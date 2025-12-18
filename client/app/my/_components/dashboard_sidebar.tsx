"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/app/ui/shadcn/sidebar";
import React from "react";
import NavMain, { NavMainProps } from "./nav_main";
import { Home, ShieldCheck } from "lucide-react";
import { Wallet } from "lucide-react";
import { User } from "lucide-react";
import Link from "next/link";
import { Button } from "@/app/ui/shadcn/button";
import { Session } from "next-auth";

const navData: NavMainProps = {
  items: [
    {
      title: "Profile",
      url: "/my/profile",
      isActive: true,
      icon: User,
    },
    {
      title: "Administration",
      url: "/my/dashboard",
      icon: ShieldCheck,
      isActive: true,
      adminOnly: true,

      items: [
        {
          title: "Coins",
          url: "/coins",
        },
        {
          title: "AI bots",
          url: "/ai-bots/overview",
        },
      ],
    },
    {
      title: "Wallet",
      url: "/my/wallet",
      icon: Wallet,
      items: [
        {
          title: "Overview",
          url: "/overview",
        },
        {
          title: "My Bots",
          url: "/ai-bots",
        },
        {
          title: "History",
          url: "/history",
        },
      ],
    },
  ],
};

interface DashboardSidebarProps extends React.ComponentProps<typeof Sidebar> {
  session: Session;
}

export default function DashboardSidebar({
  session,
  ...props
}: DashboardSidebarProps) {
  const isAdmin = session.user.roles.includes("ADMIN");

  const filteredNavItems = navData.items
    .map((item) => {
      const filteredChildren = item.items?.filter((child) => {
        if (child.adminOnly && !isAdmin) return false;
        return true;
      });

      return { ...item, items: filteredChildren };
    })
    .filter((item) => {
      if (item.adminOnly && !isAdmin) return false;
      if (item.items && item.items.length === 0) return false;
      return true;
    });

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader className="border-b border-sidebar-border px-4 py-4">
        <Link
          href="/"
          className="flex flex-col transition-all hover:opacity-80"
        >
          <span className="text-xl font-black tracking-tight">
            <span className="text-primary">COIN</span>
            <span className="text-foreground">SANTRA</span>
          </span>
          <span className="text-[11px] text-muted-foreground font-semibold tracking-widest uppercase mt-0.5">
            Dashboard
          </span>
        </Link>
      </SidebarHeader>

      <SidebarContent>
        <NavMain items={filteredNavItems} />
      </SidebarContent>

      <SidebarFooter>
        <Link href="/" className="w-full">
          <Button variant="outline" className="w-full justify-start">
            <Home className="mr-2 h-4 w-4" />
            Home
          </Button>
        </Link>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
