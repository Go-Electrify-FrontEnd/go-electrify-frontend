import { AppSidebar } from "@/components/dashboard/sidebar/app-sidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { getUser } from "@/lib/auth/auth-server";
import { UserProvider } from "@/contexts/user-context";
import { forbidden } from "next/navigation";
import { AppHeader } from "@/components/dashboard/sidebar/app-header";
import AppLogo from "@/components/shared/logo";
import { NavUser } from "@/components/dashboard/sidebar/nav-user";
import { Button } from "@/components/ui/button";
import { NotificationButton } from "@/components/dashboard/header/notification-button";
import { Separator } from "@/components/ui/separator";
import HeaderBreadcrumb from "@/components/dashboard/sidebar/header-breadcrumb";

export const dynamic = "force-dynamic";

export default async function DashboardLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const { user } = await getUser();
  if (!user) {
    forbidden();
  }

  return (
    <SidebarProvider>
      <UserProvider user={user}>
        <AppSidebar />
        <SidebarInset>
          <header className="bg-background sticky top-0 z-50 flex h-16 shrink-0 items-center gap-2 border-b px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
            <HeaderBreadcrumb />
          </header>
          <div className="flex flex-1 flex-col gap-4 pb-4">{children}</div>
        </SidebarInset>
      </UserProvider>
    </SidebarProvider>
  );
}
