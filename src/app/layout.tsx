import "./globals.css";
import { AppSidebar } from "@/components/app-sidebar";
import { NavigationMenuComponent } from "@/components/NavigationMenu";
import { ThemeProvider } from "@/components/theme-provider";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/sonner";
import { cookies } from "next/headers";
import { Footer } from "@/components/footer";

export default async function Layout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies()
  const defaultOpen = cookieStore.get("sidebar_state")?.value === "true"
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning={true} className="flex flex-col min-h-screen">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <SidebarProvider defaultOpen={defaultOpen}>
            <div className="flex flex-1">
              <AppSidebar />
              <div className="flex flex-col flex-1">
                <header className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur-sm">
                  <NavigationMenuComponent />
                </header>
                <main className="flex-1 p-6">
                  {children}
                </main>
                <Footer />
              </div>
            </div>
            <Toaster
              position="top-right"
              richColors
              closeButton />
          </SidebarProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}