"use client";

import { type LucideIcon } from "lucide-react";

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { hasRoles } from "@/lib/auth/role-check";
import Link from "next/link";
import { useUser } from "@/features/users/contexts/user-context";

export function NavSection({
  items,
}: {
  items: {
    title: string;
    items: {
      title: string;
      url: string;
      icon?: LucideIcon;
      roles?: string[];
    }[];
  };
}) {
  const { user } = useUser();
  const filteredItems = items.items.filter((item) => {
    if (!item.roles || item.roles.length === 0) {
      return true;
    }

    return hasRoles(user, item.roles);
  });

  // Don't render section if no items are visible
  if (filteredItems.length === 0) {
    return null;
  }

  return (
    <SidebarGroup>
      <SidebarGroupLabel className="uppercase">{items.title}</SidebarGroupLabel>
      <SidebarMenu>
        {filteredItems.map((item) => {
          return (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton tooltip={item.title} asChild>
                <Link prefetch={false} href={item.url}>
                  {item.icon && <item.icon />}
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}
