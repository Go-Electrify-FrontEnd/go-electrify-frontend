"use client";

import Link from "next/link";
import { HelpCircle, UserCircle } from "lucide-react";

export default function LandingHeader() {
  return (
    <header className="absolute inset-x-0 top-0 z-50 flex h-25 items-center justify-center border-b border-transparent bg-transparent align-middle">
      <div className="relative container mx-auto flex items-center justify-between px-6 py-3">
        {/* Logo */}
        <div className="flex items-center gap-2.5 text-2xl">GoElectrify</div>

        {/* Action Icons & CTA */}
        <div className="flex items-center gap-3">
          {/* LanguageSwitcher removed: landing page converted to Vietnamese */}
          <button
            className="hover:text-foreground hover:bg-accent flex h-9 w-9 items-center justify-center rounded-full text-white transition-all duration-200"
            aria-label="Trợ giúp"
          >
            <HelpCircle className="h-4.5 w-4.5" />
          </button>
          <Link
            href="/login"
            prefetch={false}
            className="hover:text-foreground hover:bg-accent flex h-9 w-9 items-center justify-center rounded-full text-white transition-all duration-200"
            aria-label="Tài khoản"
          >
            <UserCircle className="h-4.5 w-4.5" />
          </Link>
        </div>
      </div>
    </header>
  );
}
