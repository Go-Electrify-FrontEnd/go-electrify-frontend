"use client";

import { type LucideIcon } from "lucide-react";
import { usePathname } from "next/navigation";

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { hasRoles } from "@/lib/auth/role-check";
import Link from "next/link";
import type { User } from "@/features/users/schemas/user.types";

export function NavSection({
  items,
  user,
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
  user?: User | null;
}) {
  const pathname = usePathname();

  // Filter items based on user role
  const filteredItems = items.items.filter((item) => {
    // If no roles specified, show to everyone
    if (!item.roles || item.roles.length === 0) {
      return true;
    }

    // Check if user has any of the allowed roles
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
