"use client"

import * as React from "react"
import {
    IconChartBar,
    IconDashboard,
    IconFolder,
    IconInnerShadowTop,
    IconListDetails,
    IconSettings,
    IconUsers,
    IconWallet,
} from "@tabler/icons-react"
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "../../shadcn/sidebar"
import { NavMain } from "./NavMain"
import { NavSecondary } from "./NavSecondary"
import Link from "next/link"


const data = {
    navMain: [
        {
            title: "Overview",
            url: "overview",
            icon: IconDashboard,
        },
        {
            title: "Portfolio",
            url: "portfolio",
            icon: IconWallet,
        },
        {
            title: "Analytics",
            url: "analytics",
            icon: IconChartBar,
        },
    ],
    navSecondary: [
        {
            title: "Settings",
            url: "#",
            icon: IconSettings,
        }
    ],
}

export function DashboardSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    return (
        <Sidebar collapsible="offcanvas" {...props}>
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton
                            asChild
                            className="data-[slot=sidebar-menu-button]:!p-1.5"
                        >
                            <Link href={`/dashboard`}>
                                <IconInnerShadowTop className="!size-5" />
                                <span className="text-base font-semibold">Next js</span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent>
                <NavMain items={data.navMain} />
                <NavSecondary items={data.navSecondary} className="mt-auto" />
            </SidebarContent>
            <SidebarFooter>
            </SidebarFooter>
        </Sidebar>
    )
}
