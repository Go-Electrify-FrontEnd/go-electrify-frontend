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
  Settings2,
  TicketCheckIcon,
  Wallet2Icon,
  Zap,
} from "lucide-react";
// Translations removed: landing and admin UI converted to Vietnamese

import { Sidebar, SidebarContent } from "@/components/ui/sidebar";
import { NavSection } from "./nav-section";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const overview = {
    title: "Tổng quan",
    items: [
      {
        title: "Trang chính",
        url: "/dashboard",
        icon: House,
      },
      {
        title: "Bắt đầu sạc",
        url: "/dashboard/start-charging",
        icon: Zap,
      },
    ],
  };

  const charging = {
    title: "Trạm & Sạc",
    items: [
      {
        title: "Trạm gần đây",
        url: "/dashboard/stations-nearby",
        icon: Map,
      },
      {
        title: "Đặt chỗ",
        url: "/dashboard/reservations",
        icon: TicketCheckIcon,
      },
      {
        title: "Lịch sử sạc",
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
        title: "Gói & Thanh toán",
        url: "/dashboard/plans-billing",
        icon: BookOpen,
      },
    ],
  };

  const admin = {
    title: "Quản trị",
    items: [
      {
        title: "Quản lý trạm",
        url: "/dashboard/admin/stations",
        icon: Command,
      },
      {
        title: "Quản lý người dùng",
        url: "/dashboard/admin/users",
        icon: GalleryVerticalEnd,
      },
      {
        title: "Quản lý gói",
        url: "/dashboard/admin/subscriptions",
        icon: AudioWaveform,
      },
      {
        title: "Loại kết nối",
        url: "/dashboard/admin/connector-type",
        icon: Plug,
      },
      {
        title: "Mẫu xe",
        url: "/dashboard/admin/vehicle-models",
        icon: Car,
      },
    ],
  };

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarContent>
        <NavSection items={overview} />
        <NavSection items={charging} />
        <NavSection items={payment} />
        <NavSection items={admin} />
      </SidebarContent>
    </Sidebar>
  );
}
