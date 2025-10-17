import { DashboardSidebar } from "../ui/my_components/Dashboard/Sidebar";
import { SiteHeader } from "../ui/my_components/Dashboard/SiteHeader";
import { SidebarInset, SidebarProvider } from "../ui/shadcn/sidebar";

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <SidebarProvider
            style={
                {
                    "--sidebar-width": "calc(var(--spacing) * 72)",
                    "--header-height": "calc(var(--spacing) * 12)",
                } as React.CSSProperties
            }>
            <DashboardSidebar variant="inset" />
            <SidebarInset>
                <SiteHeader />
                <main>{children}</main>
            </SidebarInset>
        </SidebarProvider>
    )
}