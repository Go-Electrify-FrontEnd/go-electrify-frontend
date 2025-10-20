// app/dashboard/layout.tsx
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
import { NotificationButton } from "@/components/dashboard/header/notification-button";
import { Suspense } from "react";
import { Button } from "@/components/ui/button";
import { NotificationButton } from "@/components/dashboard/header/notification-button";
import { Separator } from "@/components/ui/separator";
import HeaderBreadcrumb from "@/components/dashboard/sidebar/header-breadcrumb";

export const dynamic = "force-dynamic";

// Fetch notifications directly in layout
async function getNotifications(): Promise<Notification[]> {
  try {
    console.log("🔔 [Layout] Fetching notifications from external API...");

    const response = await fetch(
      "https://api.go-electrify.com/api/v1/notifications",
      {
        method: "GET",
        headers: {
          accept: "*/*",
          // Có thể thêm auth headers nếu cần
          // "Authorization": `Bearer ${process.env.EXTERNAL_API_TOKEN}`,
        },
        cache: "no-store",
        next: { revalidate: 0 }, // Always fetch fresh data
      },
    );

    if (!response.ok) {
      console.error("❌ [Layout] External API error:", response.status);
      return [];
    }

    const data = await response.json();
    console.log(
      "✅ [Layout] Notifications fetched:",
      Array.isArray(data) ? data.length : 0,
    );

    return data || [];
  } catch (error) {
    console.error("❌ [Layout] Error fetching notifications:", error);
    return [];
  }
}

// Loading fallback cho notification button
function NotificationButtonSkeleton() {
  return (
    <Button variant="ghost" size="icon" className="relative">
      <Bell className="h-5 w-5 animate-pulse" />
    </Button>
  );
}

export default async function DashboardLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const { user } = await getUser();
  if (!user) {
    forbidden();
  }

  // Fetch notifications directly in layout (server-side)
  const notifications = await getNotifications();

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
