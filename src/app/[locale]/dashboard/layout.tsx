import { AppSidebar } from "@/components/dashboard/sidebar/app-sidebar";
import HeaderBreadcrumb from "@/components/dashboard/sidebar/header-breadcrumb";
import { NotificationButton } from "@/components/dashboard/header/notification-button";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { getUser } from "@/lib/auth/auth-server";
import { UserProvider } from "@/contexts/user-context";
import { forbidden } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function DashboardLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const { user } = await getUser();
  if (!user) {
    forbidden();
  }
  return (
    <UserProvider user={user ?? null}>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset className="flex h-screen flex-col">
          <header className="bg-background sticky top-0 z-10 flex h-16 shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
            <div className="flex w-full items-center justify-between gap-2 px-4">
              <div className="flex items-center gap-2">
                <SidebarTrigger className="-ml-1" />
                <Separator
                  orientation="vertical"
                  className="mr-2 data-[orientation=vertical]:h-4"
                />
                <HeaderBreadcrumb />
              </div>
              <NotificationButton />
            </div>
          </header>
          <main className="flex-1 overflow-y-auto">
            <div className="flex flex-1 flex-col gap-4 px-4 pt-4 pb-4 md:px-10">
              {children}
            </div>
          </main>
        </SidebarInset>
      </SidebarProvider>
    </UserProvider>
  );
}
