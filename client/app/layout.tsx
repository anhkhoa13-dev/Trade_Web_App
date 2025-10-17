"use client";
import "./globals.css";

import Header from "./ui/my_components/Header";
import { ThemeProvider } from "./ui/my_components/Theme/theme-provider";
import Footer from "./ui/my_components/Footer";
import { SessionProvider } from "next-auth/react";
import QueryProvider from "@/context/QueryProvider";
import { Toaster } from "react-hot-toast";
import { usePathname } from "next/navigation";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();

  const noRootLayoutRoutes = ["/dashboard"];

  const shouldHideLayout = noRootLayoutRoutes.some((route) =>
    pathname.startsWith(route)
  );

  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange={false}
        >
          <Toaster position="top-center" />
          <SessionProvider>
            <QueryProvider>
              {shouldHideLayout ? (
                children
              ) : (
                <>
                  <Header />
                  <main className="overflow-x-hidden">{children}</main>
                  <Footer className="px-20" />
                </>
              )}
            </QueryProvider>
          </SessionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
