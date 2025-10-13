"use client";

import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Image from "next/image";
import { useTranslations } from "next-intl";

export function DashboardLogo() {
  const t = useTranslations("app");

  return (
    <SidebarMenu className="bg-background">
      <SidebarMenuItem>
        <SidebarMenuButton size="lg" className="cursor-default">
          <Image
            src="/assets/images/logo01.png"
            alt="Electrify Logo"
            width={30}
            height={30}
            className="object-contain"
          />
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-semibold">{t("name")}</span>
            <span className="text-muted-foreground truncate text-xs">
              {t("tagline")}
            </span>
          </div>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
