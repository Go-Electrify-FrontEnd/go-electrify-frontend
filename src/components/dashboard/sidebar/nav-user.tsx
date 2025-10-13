"use client";

import {
  BadgeCheck,
  Bell,
  ChevronsUpDown,
  Computer,
  CreditCard,
  Languages,
  LogOut,
  Moon,
  Sparkles,
  Sun,
} from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

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
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { useTheme } from "next-themes";
import { User } from "@/types/user";
import { Link, usePathname, useRouter } from "@/i18n/navigation";
import { useTransition } from "react";

interface NavUserProps {
  user: User;
}

export function NavUser({ user }: NavUserProps) {
  const locale = useLocale();
  const t = useTranslations("user");
  const tAuth = useTranslations("auth");

  const router = useRouter();
  const pathname = usePathname();
  const { setTheme } = useTheme();
  const [, startTransition] = useTransition();

  const handleLocaleChange = (newLocale: "en" | "vi") => {
    startTransition(() => {
      if (newLocale === locale) return;
      router.replace(pathname, { locale: newLocale });
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar className="h-10 w-10">
          <AvatarImage
            src={user.avatar || "https://avatar.vercel.sh/rauchg"}
            alt={user.name || "User"}
          />
          <AvatarFallback className="rounded-lg">
            {(user.name || "User").charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
        align="end"
        sideOffset={4}
      >
        <DropdownMenuLabel className="text-muted-foreground p-2 py-3 text-sm font-normal">
          {user.email}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => setTheme("dark")}>
          <Moon />
          {t("darkMode")}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("light")}>
          <Sun />
          {t("lightMode")}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")}>
          <Computer />
          {t("systemMode")}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => handleLocaleChange("en")}>
          <Languages />
          English
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleLocaleChange("vi")}>
          <Languages />
          Tiếng Việt
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <CreditCard />
            {t("billing")}
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Bell />
            {t("notifications")}
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <a
            href="/api/auth/logout"
            className="flex h-full w-full cursor-pointer items-center gap-2"
          >
            <LogOut />
            {tAuth("logout")}
          </a>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
