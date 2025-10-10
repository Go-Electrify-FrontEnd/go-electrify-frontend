"use client";

import { type LucideIcon } from "lucide-react";

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Link } from "@/i18n/navigation";

export function NavSection({
  items,
}: {
  items: {
    title: string;
    items: {
      title: string;
      url: string;
      icon?: LucideIcon;
    }[];
  };
}) {
  return (
    <SidebarGroup>
      <SidebarGroupLabel className="font-bold uppercase">
        {items.title}
      </SidebarGroupLabel>
      <SidebarMenu>
        {items.items.map((item) => (
          <SidebarMenuItem key={item.title}>
            <SidebarMenuButton tooltip={item.title} asChild>
              <Link prefetch={false} href={item.url}>
                {item.icon && <item.icon />}
                <span>{item.title}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
