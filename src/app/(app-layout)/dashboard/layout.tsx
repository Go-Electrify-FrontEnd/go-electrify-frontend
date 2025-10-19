// app/dashboard/layout.tsx
import { AppSidebar } from "@/components/dashboard/sidebar/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { getUser } from "@/lib/auth/auth-server";
import { UserProvider } from "@/contexts/user-context";
import { forbidden } from "next/navigation";
import { AppHeader } from "@/components/dashboard/sidebar/app-header";
import AppLogo from "@/components/shared/logo";
import { NavUser } from "@/components/dashboard/sidebar/nav-user";
import { NotificationButton } from "@/components/dashboard/header/notification-button";
import { Suspense } from "react";
import { Button } from "@/components/ui/button";
import { Bell } from "lucide-react";
import { Notification } from "@/types/notification";

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
    <div className="min-h-screen-patched max-h-screen-patched flex flex-col">
      <UserProvider user={user}>
        <header className="@container/chat-header relative z-20 flex h-16 w-full shrink-0 items-center justify-between gap-2 px-3 align-middle">
          <AppLogo
            width={40}
            height={40}
            className="text-foreground h-max w-auto"
          />
          <div className="flex items-center justify-between gap-2 justify-self-end align-middle">
            <Suspense fallback={<NotificationButtonSkeleton />}>
              {/* Pass notifications data as prop */}
              <NotificationButton notifications={notifications} />
            </Suspense>
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
