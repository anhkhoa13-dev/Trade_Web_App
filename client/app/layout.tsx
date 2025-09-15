import "./globals.css";

import Header from "./ui/my_components/Header";
import { ThemeProvider } from "./ui/my_components/Theme/theme-provider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        {/* <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        > */}
        <Header />
        {children}
        {/* </ThemeProvider> */}
      </body>
    </html>
  );
}
