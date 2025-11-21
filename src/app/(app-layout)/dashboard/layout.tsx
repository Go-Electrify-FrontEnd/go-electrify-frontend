import { AppSidebar } from "@/features/dashboard/components/sidebar/app-sidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { getUser } from "@/lib/auth/auth-server";
import { UserProvider } from "@/features/users/contexts/user-context";
import { forbidden } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import HeaderBreadcrumb from "@/features/dashboard/components/sidebar/header-breadcrumb";
import { NotificationButton } from "@/features/dashboard/components/header/notification-button";
import { Notification } from "@/features/dashboard/types/notification";
import { API_BASE_URL } from "@/lib/api-config";
import { ChatPopup } from "@/features/chatbot/components/chat-popup";

export const dynamic = "force-dynamic";

async function getNotifications(token: string): Promise<Notification[]> {
  try {
    const url = `${API_BASE_URL}/notifications/dashboard`;
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      return [];
    }

    const data = await response.json();
    return data.items || [];
  } catch (error) {
    return [];
  }
}

export default async function DashboardLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const { user, token } = await getUser();

  if (!user) {
    forbidden();
  }

  const notifications = await getNotifications(token);

  return (
    <SidebarProvider>
      <UserProvider user={user} token={token}>
        <AppSidebar />
        <SidebarInset>
          <header className="bg-background/95 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 flex h-16 shrink-0 items-center gap-2 border-b px-4 backdrop-blur">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <HeaderBreadcrumb />
            <div className="ml-auto flex items-center gap-2">
              <ChatPopup />
              <NotificationButton notifications={notifications} />
            </div>
          </header>
          <div className="flex flex-1 flex-col gap-4 p-4 pt-0">{children}</div>
        </SidebarInset>
      </UserProvider>
    </SidebarProvider>
  );
}
