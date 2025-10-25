"use client";

import {
  AudioWaveform,
  BookOpen,
  Car,
  Command,
  GalleryVerticalEnd,
  House,
  Map,
  PieChart,
  Plug,
  Settings2Icon,
  TicketCheckIcon,
  Wallet2Icon,
  Zap,
  ReceiptText,
  Package,
} from "lucide-react";
// Translations removed: landing and admin UI converted to Vietnamese

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { NavSection } from "./nav-section";
import { useUser } from "@/features/users/contexts/user-context";
import { NavSecondary } from "./nav-secondary";
import { NavUser } from "./nav-user";
import AppLogo from "@/components/shared/logo";
import { url } from "inspector";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = useUser();
  const overview = {
    title: "Tổng Quan",
    items: [
      {
        title: "Trang Chính",
        url: "/dashboard",
        icon: House,
      },
      {
        title: "Bắt Đầu Sạc",
        url: "/dashboard/start-charging",
        icon: Zap,
      },
    ],
  };

  const charging = {
    title: "Trạm & Sạc",
    items: [
      {
        title: "Trạm Gần Đây",
        url: "/dashboard/stations-nearby",
        icon: Map,
      },
      {
        title: "Đặt Chỗ",
        url: "/dashboard/reservations",
        icon: TicketCheckIcon,
      },
      {
        title: "Lịch Sử Sạc",
        url: "/dashboard/charging-history",
        icon: PieChart,
      },
    ],
  };

  const payment = {
    title: "Ví",
    items: [
      {
        title: "Ví",
        url: "/dashboard/wallet",
        icon: Wallet2Icon,
      },
      {
        title: "Gói & Thanh Toán",
        url: "/dashboard/plans-billing",
        icon: BookOpen,
      },
    ],
  };

  const admin = {
    title: "Quản Trị",
    items: [
      {
        title: "Quản Lý Trạm",
        url: "/dashboard/admin/stations",
        icon: Command,
      },
      {
        title: "Quản Lý Người Dùng",
        url: "/dashboard/admin/users",
        icon: GalleryVerticalEnd,
      },
      {
        title: "Quản Lý Gói",
        url: "/dashboard/admin/subscriptions",
        icon: AudioWaveform,
      },
      {
        title: "Quản Lý Loại Kết Nối",
        url: "/dashboard/admin/connector-type",
        icon: Plug,
      },
      {
        title: "Quản Lý Mẫu Xe",
        url: "/dashboard/admin/vehicle-models",
        icon: Car,
      },
      {
        title: "Phí Đặt Chỗ",
        url: "/dashboard/admin/booking-fee",
        icon: ReceiptText,
      },
      {
        title: "Báo Cáo Sự Cố",
        url: "/dashboard/admin/incident-reports",
        icon: Package,
      },
    ],
  };

  const navSecondary = [
    {
      title: "Cài Đặt",
      url: "/dashboard/settings",
      icon: Settings2Icon,
    },
  ];

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader className="h-16 border-b">
        <SidebarMenu>
          <NavUser />
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavSection items={overview} />
        <NavSection items={charging} />
        <NavSection items={payment} />
        {user?.role.toLowerCase() === "admin" && <NavSection items={admin} />}
      </SidebarContent>
      <SidebarFooter>
        <NavSecondary items={navSecondary} />
      </SidebarFooter>
    </Sidebar>
  );
}
