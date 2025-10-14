import { AppSidebar } from "@/components/dashboard/sidebar/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { getUser } from "@/lib/auth/auth-server";
import { UserProvider } from "@/contexts/user-context";
import { forbidden } from "next/navigation";
import { AppHeader } from "@/components/dashboard/sidebar/app-header";
import AppLogo from "@/components/shared/logo";
import { NavUser } from "@/components/dashboard/sidebar/nav-user";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";

export default async function DashboardLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const { user } = await getUser();
  if (!user) {
    forbidden();
  }

  return (
    <div className="min-h-screen-patched max-h-screen-patched flex flex-col">
      <UserProvider user={user}>
        <header className="@container/chat-header relative z-20 flex h-16 w-full shrink-0 items-center justify-between gap-2 px-3 align-middle">
          <AppLogo
            width={40}
            height={40}
            className="text-foreground h-max w-auto"
          />
          <div className="flex items-center justify-between gap-2 justify-self-end align-middle">
            <Button variant="outline" size="sm">
              Notification
            </Button>
            <NavUser user={user} />
          </div>
        </header>
        <div className="flex min-h-0 flex-1 overflow-hidden">
          <SidebarProvider className="flex min-h-0 flex-1 overflow-hidden">
            <AppSidebar
              variant="inset"
              className="sticky top-0 hidden origin-left sm:block"
            />
            <SidebarInset className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-xl border">
              <div className="shrink-0">
                <AppHeader />
              </div>
              <div className="no-scrollbar flex min-h-0 flex-1 flex-col overflow-auto">
                <div className="@container/main flex flex-col gap-2 px-3 py-4 sm:px-4 md:px-8 md:py-6 lg:px-10">
                  {children}
                </div>
              </div>
            </SidebarInset>
          </SidebarProvider>
        </div>
      </UserProvider>
    </div>
  );
}
