"use client";

import {
  Computer,
  CreditCard,
  Dot,
  LogOut,
  Moon,
  Settings2,
  Sun,
} from "lucide-react";
// Language switching removed — Vietnamese only

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTheme } from "next-themes";
import Link from "next/link";
import { SidebarMenuButton } from "@/components/ui/sidebar";
import { useUser } from "@/features/users/contexts/user-context";

export function NavUser() {
  const { user } = useUser();
  const { setTheme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <SidebarMenuButton
          size="lg"
          className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
        >
          <Avatar className="h-8 w-8 rounded-4xl">
            <AvatarImage src={user?.avatar} alt={user?.name} />
            <AvatarFallback className="rounded-lg">CN</AvatarFallback>
          </Avatar>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-medium">{user?.name}</span>
            <span className="text-muted-foreground truncate text-xs">
              {user?.email}
            </span>
          </div>
          <Dot className="ml-auto size-4" />
        </SidebarMenuButton>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
        align="end"
        sideOffset={4}
      >
        <DropdownMenuLabel className="text-muted-foreground p-2 py-3 text-sm font-normal">
          {user?.email}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => setTheme("dark")}>
          <Moon />
          Chế độ tối
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("light")}>
          <Sun />
          Chế độ sáng
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")}>
          <Computer />
          Theo hệ thống
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link
              prefetch={false}
              href="/dashboard/plans-billing"
              className="flex h-full w-full cursor-pointer items-center gap-2"
            >
              <CreditCard />
              Thanh toán
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link
            prefetch={false}
            href="/dashboard/settings"
            className="flex h-full w-full cursor-pointer items-center gap-2"
          >
            <Settings2 />
            Cài đặt
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link
            prefetch={false}
            href="/api/auth/logout"
            className="flex h-full w-full cursor-pointer items-center gap-2"
          >
            <LogOut />
            Đăng xuất
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
