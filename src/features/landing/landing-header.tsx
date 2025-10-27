"use client";

import Link from "next/link";
import { Zap, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function LandingHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { name: "Trang Chủ", href: "#" },
    { name: "Trạm Sạc", href: "#stations" },
    { name: "Giá Cước", href: "#pricing" },
    { name: "Về Chúng Tôi", href: "#about" },
    { name: "Hỗ Trợ", href: "#support" },
  ];

  return (
    <header className="border-border/40 bg-background/80 supports-[backdrop-filter]:bg-background/60 fixed inset-x-0 top-0 z-50 border-b backdrop-blur-md">
      <nav className="mx-auto flex max-w-7xl items-center px-6 py-4 lg:px-8">
        {/* Left: Logo */}
        <div className="flex w-1/3 items-center">
          <Link href="/" className="group flex items-center gap-2">
            <span className="text-lg font-semibold">GoElectrify</span>
          </Link>
        </div>

        {/* Center: Navigation (centered on large screens) */}
        <div className="hidden w-1/3 justify-center gap-x-8 lg:flex">
          {navItems.map((item) => (
            <a
              key={item.name}
              href={item.href}
              className="text-muted-foreground hover:text-foreground text-sm font-medium transition-colors"
            >
              {item.name}
            </a>
          ))}
        </div>

        {/* Right: CTAs + mobile menu (right aligned) */}
        <div className="flex w-1/3 items-center justify-end gap-x-3">
          {/* Desktop CTA */}
          <div className="hidden lg:flex lg:items-center lg:gap-x-3">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/login">Đăng Nhập</Link>
            </Button>
            <Button
              size="sm"
              asChild
              className="bg-foreground text-background hover:bg-foreground/90"
            >
              <Link href="/dashboard">Bắt Đầu Ngay</Link>
            </Button>
          </div>

          {/* Mobile menu button */}
          <button
            type="button"
            className="lg:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Open mobile menu"
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="border-border/40 bg-background/95 border-t backdrop-blur lg:hidden">
          <div className="space-y-1 px-6 py-4">
            {navItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="text-muted-foreground hover:bg-accent hover:text-foreground block rounded-lg px-3 py-2 text-base font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.name}
              </a>
            ))}
            <div className="flex flex-col gap-2 pt-4">
              <Button variant="ghost" asChild className="w-full">
                <Link href="/login">Đăng Nhập</Link>
              </Button>
              <Button asChild className="bg-foreground text-background w-full">
                <Link href="/dashboard">Bắt Đầu Ngay</Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
