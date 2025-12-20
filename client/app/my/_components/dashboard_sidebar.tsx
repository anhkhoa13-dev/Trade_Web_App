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
      <SidebarHeader>
        <Link
          href="/"
          className="flex flex-col transition-all hover:opacity-80"
        >
          <span className="text-xl font-black tracking-tight group-data-[state=collapsed]:text-lg">
            <span className="text-primary group-data-[state=collapsed]:hidden">COIN</span>
            <span className="text-foreground group-data-[state=collapsed]:hidden">SANTRA</span>
          </span>
          <span className="text-[11px] text-muted-foreground font-semibold tracking-widest uppercase mt-0.5 group-data-[state=collapsed]:hidden">
            Dashboard
          </span>
        </Link>
      </SidebarHeader>

      <SidebarContent>
        <NavMain items={filteredNavItems} />
      </SidebarContent>

      <SidebarFooter>
        <Button
          variant="outline"
          className="w-full justify-start group-data-[collapsible=icon]:w-8 group-data-[collapsible=icon]:h-8 group-data-[collapsible=icon]:p-0 group-data-[collapsible=icon]:justify-center"
          title="Home"
          asChild
        >
          <Link href="/" className="w-full">

            <Home className="h-4 w-4 group-data-[collapsible=icon]:mr-0" />
            <span className="group-data-[collapsible=icon]:hidden">Home</span>

          </Link>
        </Button>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
