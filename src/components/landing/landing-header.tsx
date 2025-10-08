"use client";

import Link from "next/link";
import { HelpCircle, UserCircle } from "lucide-react";
import AppLogo from "@/components/shared/logo";
import { motion } from "framer-motion";

export default function LandingHeader() {
  return (
    <motion.header
      initial={{ y: -12, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.32, ease: "easeOut" }}
      style={{ willChange: "transform, opacity" }}
      className="absolute inset-x-0 top-0 z-50 border-b border-transparent bg-transparent"
    >
      <div className="relative container mx-auto flex items-center justify-between px-6 py-3">
        {/* Logo */}
        <div className="flex items-center gap-2.5">
          <AppLogo className="text-white" />
        </div>

        {/* Navigation Menu - Absolutely centered */}
        <nav className="absolute left-1/2 hidden -translate-x-1/2 gap-10 text-white md:flex">
          <Link
            href="#features"
            className="group relative text-sm font-semibold transition-colors duration-200"
          >
            Tính năng
            <span className="absolute -bottom-1 left-0 h-0.5 w-0 bg-white transition-all duration-200 group-hover:w-full" />
          </Link>
          <Link
            href="#pricing"
            className="group relative text-sm font-semibold transition-colors duration-200"
          >
            Giá cả
            <span className="absolute -bottom-1 left-0 h-0.5 w-0 bg-white transition-all duration-200 group-hover:w-full" />
          </Link>
          <Link
            href="#testimonials"
            className="group relative text-sm font-semibold transition-colors duration-200"
          >
            Phản hồi
            <span className="absolute -bottom-1 left-0 h-0.5 w-0 bg-white transition-all duration-200 group-hover:w-full" />
          </Link>
          <Link
            href="#contact"
            className="group relative text-sm font-semibold transition-colors duration-200"
          >
            Liên hệ
            <span className="absolute -bottom-1 left-0 h-0.5 w-0 bg-white transition-all duration-200 group-hover:w-full" />
          </Link>
        </nav>

        {/* Action Icons & CTA */}
        <div className="flex items-center gap-3">
          <button
            className="hover:text-foreground hover:bg-accent flex h-9 w-9 items-center justify-center rounded-full text-white transition-all duration-200"
            aria-label="Help"
          >
            <HelpCircle className="h-4.5 w-4.5" />
          </button>
          <Link
            href="/login"
            className="hover:text-foreground hover:bg-accent flex h-9 w-9 items-center justify-center rounded-full text-white transition-all duration-200"
            aria-label="User Account"
          >
            <UserCircle className="h-4.5 w-4.5" />
          </Link>
        </div>
      </div>
    </motion.header>
  );
}
