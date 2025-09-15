"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  Battery,
  Home,
  Settings,
  Zap,
  Users,
  AlertTriangle,
  TrendingUp,
  Star,
  CoinsIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { SidebarSeparator } from "../ui/sidebar";

export const general = [
  { name: "Trang Chủ", href: "/dashboard", icon: Home },
  { name: "Tìm Điểm Sạc", href: "/dashboard/find-stations", icon: Zap },
  { name: "Đặt Chỗ", href: "/dashboard/booking", icon: BarChart3 },
  { name: "Phiên Sạc", href: "/dashboard/users", icon: Users },
  { name: "Nạp Tiền", href: "/dashboard/donate", icon: CoinsIcon },
];

export const admin = [
  {
    name: "Quản Lý Người Dùng",
    href: "/dashboard/manage-users",
    icon: AlertTriangle,
  },
  { name: "Báo Cáo", href: "/dashboard/reports", icon: TrendingUp },
  { name: "Quản Lý Trạm", href: "/dashboard/stations", icon: Battery },
];

export const additional = [
  { name: "Đánh Giá", href: "/dashboard/reviews", icon: Star },
  { name: "Cài Đặt", href: "/dashboard/settings", icon: Settings },
];

export function DashboardSidebar() {
  const [collapsed, setCollapsed] = useState(true);
  const pathname = usePathname();

  const handleMouseEnter = () => {
    setCollapsed(false);
  };

  const handleMouseLeave = () => {
    setCollapsed(true);
  };

  return (
    <div
      className={cn(
        "hidden md:flex flex-col h-screen border-r fixed top-16 left-0 z-40 border-border bg-sidebar transition-all duration-300 ease-in-out overflow-hidden",
        collapsed ? "w-16" : "w-52"
      )}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      suppressHydrationWarning
    >
      <nav className="flex-1 space-y-1 px-2 py-4">
        {general.map((item) => {
          const isCurrent = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "group flex items-center rounded-md px-2 py-2 text-sm font-medium transition-all duration-200",
                isCurrent
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              )}
            >
              <item.icon
                className={cn(
                  "h-5 w-5 flex-shrink-0 transition-all duration-200",
                  collapsed ? "mx-auto" : "mr-3"
                )}
                aria-hidden="true"
              />
              <span
                className={cn(
                  "transition-all duration-200 overflow-hidden whitespace-nowrap",
                  collapsed ? "w-0 opacity-0" : "w-auto opacity-100"
                )}
              >
                {item.name}
              </span>
            </Link>
          );
        })}

        <SidebarSeparator />

        {admin.map((item) => {
          const isCurrent = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "group flex items-center rounded-md px-2 py-2 text-sm font-medium transition-all duration-200",
                isCurrent
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              )}
            >
              <item.icon
                className={cn(
                  "h-5 w-5 flex-shrink-0 transition-all duration-200",
                  collapsed ? "mx-auto" : "mr-3"
                )}
                aria-hidden="true"
              />
              <span
                className={cn(
                  "transition-all duration-200 overflow-hidden whitespace-nowrap",
                  collapsed ? "w-0 opacity-0" : "w-auto opacity-100"
                )}
              >
                {item.name}
              </span>
            </Link>
          );
        })}

        <SidebarSeparator />

        {additional.map((item) => {
          const isCurrent = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "group flex items-center rounded-md px-2 py-2 text-sm font-medium transition-all duration-200",
                isCurrent
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              )}
            >
              <item.icon
                className={cn(
                  "h-5 w-5 flex-shrink-0 transition-all duration-200",
                  collapsed ? "mx-auto" : "mr-3"
                )}
                aria-hidden="true"
              />
              <span
                className={cn(
                  "transition-all duration-200 overflow-hidden whitespace-nowrap",
                  collapsed ? "w-0 opacity-0" : "w-auto opacity-100"
                )}
              >
                {item.name}
              </span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
