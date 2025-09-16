"use client";

import * as React from "react";
import {
  AudioWaveform,
  BookOpen,
  Bot,
  Command,
  Frame,
  GalleryVerticalEnd,
  House,
  Map,
  PieChart,
  Settings2,
  SquareTerminal,
  TicketCheckIcon,
  Wallet2Icon,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { TeamSwitcher } from "./team-switcher";
import { NavUser } from "./nav-user";
import { NavSection } from "./nav-section";
import { NavSecondary } from "./nav-secondary";

// User data
const user = {
  name: "shadcn",
  email: "m@example.com",
  avatar: "/avatars/shadcn.jpg",
};

const overview = {
  title: "Tổng quan",
  items: [
    {
      title: "Bảng điều khiển",
      url: "/dashboard",
      icon: House,
      isActive: false,
    },
  ],
};

const charging = {
  title: "Sạc",
  items: [
    {
      title: "Bản đồ trạm",
      url: "/dashboard/find-stations",
      icon: Map,
      isActive: false,
    },
    {
      title: "Đặt chỗ",
      url: "/dashboard/reservations",
      icon: TicketCheckIcon,
      isActive: false,
    },
    {
      title: "Lịch sử sạc",
      url: "/dashboard/charging-history",
      icon: PieChart,
      isActive: false,
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
      isActive: false,
    },
    {
      title: "Giao dịch",
      url: "/dashboard/transactions",
      icon: SquareTerminal,
      isActive: false,
    },
    {
      title: "Gói & Thanh toán",
      url: "/dashboard/plans-billing",
      icon: BookOpen,
      isActive: false,
    },
  ],
};

const secondary = [
  {
    title: "Cài đặt",
    url: "#",
    icon: Settings2,
  },
  {
    title: "Trợ giúp",
    url: "#",
    icon: Bot,
  },
];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher />
      </SidebarHeader>
      <SidebarContent>
        <NavSection items={overview} />
        <NavSection items={charging} />
        <NavSection items={payment} />
        <NavSecondary items={secondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
