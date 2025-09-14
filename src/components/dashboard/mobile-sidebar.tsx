"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { SidebarSeparator } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { general, admin, additional } from "./dashboard-sidebar";

export function MobileSidebar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const handleLinkClick = () => {
    setOpen(false);
  };

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle navigation menu</span>
        </Button>
      </DrawerTrigger>
      <DrawerContent className="max-h-[80vh] max-w-full">
        <DrawerHeader className="px-4">
          <DrawerTitle>Điều hướng</DrawerTitle>
          <DrawerDescription>
            Truy cập tất cả các phần của bảng điều khiển
          </DrawerDescription>
        </DrawerHeader>

        <nav className="mt-6 space-y-1 px-4 pb-6 overflow-y-auto overflow-x-hidden max-h-[60vh]">
          <div className="space-y-1">
            {general.map((item) => {
              const isCurrent = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={handleLinkClick}
                  className={cn(
                    "group flex items-center rounded-md px-3 py-3 text-sm font-medium transition-colors w-full",
                    isCurrent
                      ? "bg-sidebar-accent text-sidebar-accent-foreground"
                      : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                  )}
                >
                  <item.icon
                    className="h-5 w-5 flex-shrink-0 mr-3"
                    aria-hidden="true"
                  />
                  <span className="truncate">{item.name}</span>
                </Link>
              );
            })}
          </div>

          <SidebarSeparator />

          <div className="space-y-1">
            <div className="px-3 py-2">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Quản trị
              </h3>
            </div>
            {admin.map((item) => {
              const isCurrent = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={handleLinkClick}
                  className={cn(
                    "group flex items-center rounded-md px-3 py-3 text-sm font-medium transition-colors w-full",
                    isCurrent
                      ? "bg-sidebar-accent text-sidebar-accent-foreground"
                      : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                  )}
                >
                  <item.icon
                    className="h-5 w-5 flex-shrink-0 mr-3"
                    aria-hidden="true"
                  />
                  <span className="truncate">{item.name}</span>
                </Link>
              );
            })}
          </div>

          <SidebarSeparator />

          <div className="space-y-1">
            <div className="px-3 py-2">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Khác
              </h3>
            </div>
            {additional.map((item) => {
              const isCurrent = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={handleLinkClick}
                  className={cn(
                    "group flex items-center rounded-md px-3 py-3 text-sm font-medium transition-colors w-full",
                    isCurrent
                      ? "bg-sidebar-accent text-sidebar-accent-foreground"
                      : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                  )}
                >
                  <item.icon
                    className="h-5 w-5 flex-shrink-0 mr-3"
                    aria-hidden="true"
                  />
                  <span className="truncate">{item.name}</span>
                </Link>
              );
            })}
          </div>
        </nav>
      </DrawerContent>
    </Drawer>
  );
}
