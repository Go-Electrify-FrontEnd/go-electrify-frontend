"use client";

import {
  AudioWaveform,
  BookOpen,
  Bot,
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

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { DashboardLogo } from "./dashboard-logo";
import { NavUser } from "./nav-user";
import { NavSection } from "./nav-section";
import { NavSecondary } from "./nav-secondary";
import { useUser } from "@/contexts/user-context";

const overview = {
  title: "Tổng quan",
  items: [
    {
      title: "Bảng điều khiển",
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
  title: "Sạc",
  items: [
    {
      title: "Trạm sạc gần đây",
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
  title: "Thanh toán",
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
      title: "Quản lý gói nạp",
      url: "/dashboard/admin/subscriptions",
      icon: AudioWaveform,
    },
    {
      title: "Quản lý loại cổng sạc",
      url: "/dashboard/admin/connector-type",
      icon: Plug,
    },
    {
      title: "Quản lý mẫu xe",
      url: "/dashboard/admin/car-models",
      icon: Car,
    },
  ],
};

const secondary = [
  {
    title: "Cài đặt",
    url: "/dashboard/settings",
    icon: Settings2,
  },
  {
    title: "Trợ giúp",
    url: "#",
    icon: Bot,
  },
];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = useUser();
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <DashboardLogo />
      </SidebarHeader>
      <SidebarContent>
        <NavSection items={overview} />
        <NavSection items={charging} />
        <NavSection items={payment} />
        <NavSection items={admin} />
        <NavSecondary items={secondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user!} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
