"use client";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/app/ui/shadcn/collapsible";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/app/ui/shadcn/sidebar";
import { ChevronRight, LucideIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export interface NavMainProps {
  items: {
    title: string;
    url: string;
    icon?: LucideIcon;
    isActive?: boolean;
    adminOnly?: boolean;
    items?: {
      title: string;
      url: string;
      adminOnly?: boolean;
    }[];
  }[];
}

export default function NavMain({ items }: NavMainProps) {
  const pathname = usePathname();

  const isActiveLink = (itemUrl: string, subUrl?: string) => {
    const fullUrl = subUrl ? `${itemUrl}${subUrl}` : itemUrl;
    return pathname === fullUrl || pathname.startsWith(`${fullUrl}/`);
  };

  return (
    <SidebarGroup>
      <SidebarGroupLabel>MENU</SidebarGroupLabel>

      <SidebarMenu>
        {items.map((item) => {
          const hasSubItems = item.items && item.items.length > 0;
          const isParentActive = !hasSubItems && isActiveLink(item.url);

          return (
            <SidebarMenuItem key={item.title}>
              {hasSubItems ? (
                // Nếu có submenu, dùng Collapsible
                <Collapsible
                  asChild
                  defaultOpen={item.isActive}
                  className="group/collapsible"
                >
                  <div>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton
                        className="text-base h-10"
                        tooltip={item.title}
                      >
                        {item.icon && <item.icon />}
                        <span className="pl-2">{item.title}</span>
                        <ChevronRight
                          className="ml-auto transition-transform duration-200
                            group-data-[state=open]/collapsible:rotate-90"
                        />
                      </SidebarMenuButton>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <SidebarMenuSub className="pl-5">
                        {item.items?.map((subItem) => {
                          const isSubActive = isActiveLink(
                            item.url,
                            subItem.url
                          );
                          return (
                            <SidebarMenuSubItem key={subItem.title}>
                              <SidebarMenuSubButton
                                asChild
                                className={cn(
                                  "text-base h-8",
                                  isSubActive &&
                                    "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                                )}
                              >
                                <Link href={`${item.url}${subItem.url}`}>
                                  <span>{subItem.title}</span>
                                </Link>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          );
                        })}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </div>
                </Collapsible>
              ) : (
                // Nếu không có submenu, render như một link bình thường
                <SidebarMenuButton
                  asChild
                  className={cn(
                    "text-base h-10",
                    isParentActive &&
                      "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                  )}
                  tooltip={item.title}
                >
                  <Link href={`${item.url}`}>
                    {item.icon && <item.icon />}
                    <span className="pl-2">{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              )}
            </SidebarMenuItem>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}
