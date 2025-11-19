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
import Link from "next/link";

export function NavSection({
  items,
  userRole,
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
  userRole?: string;
}) {
  const pathname = usePathname();

  // Filter items based on user role
  const filteredItems = items.items.filter((item) => {
    // If no roles specified, show to everyone
    if (!item.roles || item.roles.length === 0) {
      return true;
    }

    // If user role is not available, hide items with role restrictions
    if (!userRole) {
      return false;
    }

    // Check if user role matches any allowed role (case-insensitive)
    const normalizedUserRole = userRole.toLowerCase();
    const normalizedAllowedRoles = item.roles.map((role) =>
      role.toLowerCase()
    );

    return normalizedAllowedRoles.includes(normalizedUserRole);
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
