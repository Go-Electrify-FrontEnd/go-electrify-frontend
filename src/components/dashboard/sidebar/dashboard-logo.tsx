"use client";

import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Image from "next/image";

export function DashboardLogo() {
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
            <span className="truncate font-semibold">GoElectrify</span>
            <span className="text-muted-foreground truncate text-xs">
              Nền tảng sạc xe điện toàn diện
            </span>
          </div>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
