import { AppSidebar } from "@/components/dashboard/sidebar/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { getUser } from "@/lib/auth/auth-server";
import { UserProvider } from "@/contexts/user-context";
import { forbidden } from "next/navigation";
import { AppHeader } from "@/components/dashboard/sidebar/app-header";

export const dynamic = "force-dynamic";

export default async function DashboardLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const { user } = await getUser();
  if (!user) {
    forbidden();
  }
  return (
    <UserProvider user={user}>
      <SidebarProvider
        style={
          {
            "--header-height": "calc(var(--spacing) * 16)",
          } as React.CSSProperties
        }
      >
        <AppSidebar variant="inset" />
        <SidebarInset>
          <AppHeader />
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
