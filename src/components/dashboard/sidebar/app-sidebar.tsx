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
import { useTranslations } from "next-intl";

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

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = useUser();
  const t = useTranslations("navigation");

  const overview = {
    title: t("dashboard"),
    items: [
      {
        title: t("dashboard"),
        url: "/dashboard",
        icon: House,
      },
      {
        title: t("start-charging"),
        url: "/dashboard/start-charging",
        icon: Zap,
      },
    ],
  };

  const charging = {
    title: t("stations-nearby"),
    items: [
      {
        title: t("stations-nearby"),
        url: "/dashboard/stations-nearby",
        icon: Map,
      },
      {
        title: t("reservations"),
        url: "/dashboard/reservations",
        icon: TicketCheckIcon,
      },
      {
        title: t("charging-history"),
        url: "/dashboard/charging-history",
        icon: PieChart,
      },
    ],
  };

  const payment = {
    title: t("wallet"),
    items: [
      {
        title: t("wallet"),
        url: "/dashboard/wallet",
        icon: Wallet2Icon,
      },
      {
        title: t("plans-billing"),
        url: "/dashboard/plans-billing",
        icon: BookOpen,
      },
    ],
  };

  const admin = {
    title: t("admin"),
    items: [
      {
        title: t("manage-stations"),
        url: "/dashboard/admin/stations",
        icon: Command,
      },
      {
        title: t("manage-users"),
        url: "/dashboard/admin/users",
        icon: GalleryVerticalEnd,
      },
      {
        title: t("manage-subscriptions"),
        url: "/dashboard/admin/subscriptions",
        icon: AudioWaveform,
      },
      {
        title: t("manage-connector-types"),
        url: "/dashboard/admin/connector-type",
        icon: Plug,
      },
      {
        title: t("manage-car-models"),
        url: "/dashboard/admin/vehicle-models",
        icon: Car,
      },
    ],
  };

  const secondary = [
    {
      title: t("settings"),
      url: "/dashboard/settings",
      icon: Settings2,
    },
  ];
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
