"use client";

import { Home, type LucideIcon } from "lucide-react";

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Link } from "@/i18n/navigation";
import { ReactNode } from "react";

function NavItem({
  href,
  icon: Icon,
  children,
}: {
  href: string;
  icon: typeof Home;
  children: ReactNode;
}) {
  return (
    <Link
      prefetch={false}
      href={href}
      className="text-muted-foreground hover:text-foreground hover:bg-muted flex items-center rounded-md px-2 py-2 text-sm transition-colors"
    >
      <Icon className="mr-2 h-4 w-4 flex-shrink-0" />
      {children}
    </Link>
  );
}

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
      <SidebarGroupLabel className="font-medium capitalize">
        {items.title}
      </SidebarGroupLabel>
      <SidebarMenu>
        {items.items.map((item) => (
          <SidebarMenuItem key={item.title}>
            <SidebarMenuButton tooltip={item.title} asChild>
              <NavItem href={item.url} icon={item.icon ?? Home}>
                {item.title}
              </NavItem>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
