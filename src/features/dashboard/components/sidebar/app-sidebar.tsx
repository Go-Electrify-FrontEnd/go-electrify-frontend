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
  BarChart3,
} from "lucide-react";
const overviewBase = {
  title: "Tổng Quan",
  items: [
    {
      title: "Trang Chính",
      url: "/dashboard",
      icon: House,
    },
    {
      title: "Bắt Đầu Sạc",
      url: "/dashboard/charging",
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

const staff = {
  title: "Nhân Viên",
  items: [
    {
      title: "Quản Lý Trạm",
      url: "/dashboard/staff/station-me",
      icon: Command,
    },
    {
      title: "Báo Cáo Sự Cố",
      url: "/dashboard/staff/incident-reports",
      icon: Package,
    },
    {
      title: "Nạp tiền cho khách hàng",
      url: "/dashboard/staff/deposit-customers",
      icon: Wallet2Icon,
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
  SidebarMenu,
} from "@/components/ui/sidebar";
import { NavSection } from "./nav-section";
import { useUser } from "@/features/users/contexts/user-context";
import { NavSecondary } from "./nav-secondary";
import { NavUser } from "./nav-user";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = useUser();

  const overview = {
    ...overviewBase,
    items: [
      ...overviewBase.items,
      ...(user?.role.toLowerCase() === "admin"
        ? [
            {
              title: "Insights",
              url: "/dashboard/admin/insights",
              icon: BarChart3,
            },
          ]
        : []),
    ],
  };

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader className="h-16 border-b">
        <SidebarMenu>
          <NavUser />
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavSection items={overview} />
        <>
          <NavSection items={charging} />
          <NavSection items={payment} />
        </>

        {user?.role.toLowerCase() === "admin" && <NavSection items={admin} />}
        {user?.role.toLowerCase() === "staff" && <NavSection items={staff} />}
      </SidebarContent>
      <SidebarFooter>
        <NavSecondary items={navSecondary} />
      </SidebarFooter>
    </Sidebar>
  );
}
