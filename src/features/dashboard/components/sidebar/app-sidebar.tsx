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
      url: "/dashboard/charging",
      icon: Zap,
      roles: ["driver", "admin"],
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
      roles: ["driver", "admin"],
    },
    {
      title: "Đặt Chỗ",
      url: "/dashboard/reservations",
      icon: TicketCheckIcon,
      roles: ["driver", "admin"],
    },
    {
      title: "Lịch Sử Sạc",
      url: "/dashboard/charging-history",
      icon: PieChart,
      roles: ["driver", "admin"],
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
      roles: ["driver", "admin"],
    },
    {
      title: "Gói & Thanh Toán",
      url: "/dashboard/plans-billing",
      icon: BookOpen,
      roles: ["driver", "admin"],
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
      title: "Quản Lý Mẫu Xe",
      url: "/dashboard/admin/vehicle-models",
      icon: Car,
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
  SidebarMenu,
} from "@/components/ui/sidebar";
import { NavSection } from "./nav-section";
import { useUser } from "@/features/users/contexts/user-context";
import { NavSecondary } from "./nav-secondary";
import { NavUser } from "./nav-user";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = useUser();
  const userRole = user?.role;

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader className="h-16 border-b">
        <SidebarMenu>
          <NavUser />
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        {/* All sections - items are filtered based on roles property */}
        <NavSection items={overview} userRole={userRole} />
        <NavSection items={charging} userRole={userRole} />
        <NavSection items={payment} userRole={userRole} />
        <NavSection items={admin} userRole={userRole} />
        <NavSection items={staff} userRole={userRole} />
      </SidebarContent>
      <SidebarFooter>
        <NavSecondary items={navSecondary} />
      </SidebarFooter>
    </Sidebar>
  );
}
