"use client";

import {
  AudioWaveform,
  BookOpen,
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

const overview = {
  title: "Tổng Quan",
  items: [
    {
      title: "Trang Chính",
      url: "/dashboard",
      icon: House,
    },
  ],
};

const charging = {
  title: "Trạm & Sạc",
  items: [
    {
      title: "Bắt Đầu Sạc",
      url: "/dashboard/charging",
      icon: Zap,
      roles: ["driver"],
    },
    {
      title: "Trạm Gần Đây",
      url: "/dashboard/stations-nearby",
      icon: Map,
      roles: ["driver", "admin"],
    },
    {
      title: "Đặt Chỗ",
      url: "/dashboard/reservations",
      icon: TicketCheckIcon,
      roles: ["driver"],
    },
    {
      title: "Lịch Sử Sạc",
      url: "/dashboard/charging-history",
      icon: PieChart,
      roles: ["driver"],
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
      roles: ["driver"],
    },
    {
      title: "Gói & Thanh Toán",
      url: "/dashboard/plans-billing",
      icon: BookOpen,
      roles: ["driver"],
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
      roles: ["admin"],
    },
    {
      title: "Quản Lý Người Dùng",
      url: "/dashboard/admin/users",
      icon: GalleryVerticalEnd,
      roles: ["admin"],
    },
    {
      title: "Quản Lý Gói",
      url: "/dashboard/admin/subscriptions",
      icon: AudioWaveform,
      roles: ["admin"],
    },
    {
      title: "Quản Lý Loại Kết Nối",
      url: "/dashboard/admin/connector-type",
      icon: Plug,
      roles: ["admin"],
    },
    {
      title: "Phí Đặt Chỗ",
      url: "/dashboard/admin/booking-fee",
      icon: ReceiptText,
      roles: ["admin"],
    },
    {
      title: "Báo Cáo Sự Cố",
      url: "/dashboard/admin/incident-reports",
      icon: Package,
      roles: ["admin"],
    },
    {
      title: "Tài liệu (Experimental)",
      url: "/dashboard/admin/documents",
      icon: BookOpen,
      roles: ["admin"],
    },
  ],
};

const staff = {
  title: "Nhân Viên",
  items: [
    {
      title: "Quản Lý Trạm",
      url: "/dashboard/staff/station-me",
      icon: Command,
      roles: ["staff"],
    },
    {
      title: "Báo Cáo Sự Cố",
      url: "/dashboard/staff/incident-reports",
      icon: Package,
      roles: ["staff"],
    },
    {
      title: "Nạp tiền cho khách hàng",
      url: "/dashboard/staff/deposit-customers",
      icon: Wallet2Icon,
      roles: ["staff"],
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

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { NavSection } from "./nav-section";
import { useUser } from "@/features/users/contexts/user-context";
import { NavSecondary } from "./nav-secondary";
import { NavUser } from "./nav-user";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = useUser();

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader className="h-16 border-b">
        <NavUser />
      </SidebarHeader>
      <SidebarContent>
        <NavSection items={overview} user={user} />
        <NavSection items={charging} user={user} />
        <NavSection items={payment} user={user} />
        <NavSection items={admin} user={user} />
        <NavSection items={staff} user={user} />
      </SidebarContent>
      <SidebarFooter>
        <NavSecondary items={navSecondary} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
