"use client";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import Link from "next/link";
import { Menu } from "lucide-react";
import { useState } from "react";
import NavbarLogo from "./navbar-logo";

const navigationLinks = [
  { name: "Sản phẩm", href: "/products" },
  { name: "Báo giá", href: "/pricing" },
  { name: "Tài liệu", href: "/docs" },
];

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="bg-background/95 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 w-full border-b backdrop-blur">
      <div className="container mx-auto flex h-16 items-center px-4 md:px-6">
        {/* Logo - Fixed width */}
        <div className="flex w-48 flex-shrink-0 items-center">
          <NavbarLogo />
        </div>

        {/* Desktop Navigation - Centered */}
        <div className="w-full">
          <nav className="hidden flex-1 items-center justify-center md:flex">
            <div className="flex items-center space-x-8">
              {navigationLinks.map((link) => (
                <Link
                  key={link.name}
                  prefetch={false}
                  href={link.href}
                  className="text-muted-foreground hover:text-foreground text-sm font-medium transition-colors"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </nav>
        </div>

        <div className="hidden w-48 flex-shrink-0 items-center justify-end md:flex">
          <Button asChild>
            <Link prefetch={false} href="/login">
              Đăng nhập
            </Link>
          </Button>
        </div>

        <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle navigation menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-80">
            <SheetHeader>
              <SheetTitle>Điều hướng</SheetTitle>
              <SheetDescription>
                Truy cập tất cả các phần của nền tảng
              </SheetDescription>
            </SheetHeader>
            <div className="grid auto-rows-min gap-6 px-4">
              {navigationLinks.map((link) => (
                <Link
                  key={link.name}
                  prefetch={false}
                  href={link.href}
                  className="text-muted-foreground hover:text-foreground block text-lg font-medium transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
              <div className="border-t pt-4">
                <Button asChild className="w-full" size="lg">
                  <Link
                    prefetch={false}
                    href="/login"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Đăng nhập
                  </Link>
                </Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
