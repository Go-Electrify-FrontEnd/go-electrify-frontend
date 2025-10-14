"use client";

import { type LucideIcon } from "lucide-react";

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Link from "next/link";

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
          <SidebarMenuItem
            className="!flex !items-center !justify-center !align-middle"
            key={item.title}
          >
            <SidebarMenuButton tooltip={item.title} asChild>
              <Link
                prefetch={false}
                href={item.url}
                className="text-electrify-gray-900 hover:text-foreground hover:bg-muted flex items-center rounded-md text-sm transition-colors group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:gap-0"
              >
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
