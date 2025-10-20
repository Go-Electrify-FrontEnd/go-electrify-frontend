"use client";

import { Button, buttonVariants } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

export default function LandingHero() {
  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden">
      {/* Background image with overlay */}
      <div className="absolute inset-0 -z-10">
        <Image
          src="/assets/images/charging-station-clean.webp"
          alt="Hero Background"
          fill
          priority
          className="object-cover"
          decoding="async"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70" />
        {/* Subtle decorative overlays */}
        <div className="absolute inset-0">
          <div className="bg-primary/10 absolute top-1/4 -left-48 h-96 w-96 rounded-full blur-3xl" />
          <div className="bg-accent/10 absolute -right-48 bottom-1/4 h-96 w-96 rounded-full blur-3xl" />
        </div>
      </div>

      <div className="container mx-auto px-4 py-15">
        <div className="mx-auto flex max-w-4xl flex-col items-center space-y-8 text-center">
          {/* Main headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-5xl leading-tight font-bold tracking-tight text-balance text-white sm:text-6xl lg:text-7xl"
          >
            Nền tảng sạc
            <br />
            <span>xe điện thông minh</span>
          </motion.h1>

          {/* Supporting description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mx-auto max-w-2xl text-lg leading-relaxed text-balance text-white/90 sm:text-xl"
          >
            Tìm trạm sạc gần nhất, quản lý phiên sạc và thanh toán an toàn — tất
            cả trong một nền tảng hiện đại
          </motion.p>

          {/* CTA buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col items-center gap-6 pt-4 sm:flex-row"
          >
            <Link
              href="/login"
              className={buttonVariants({
                size: "lg",
                className:
                  "group h-12 w-[180px] gap-2 px-8 shadow-lg transition-all",
              })}
            >
              Bắt đầu ngay
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href="/learn-more"
              className={buttonVariants({
                size: "lg",
                className:
                  "h-12 w-[180px] border border-white/30 bg-white/10 px-8 text-white backdrop-blur-sm transition-all hover:border-white/50 hover:bg-white/20",
              })}
            >
              Tìm hiểu thêm
            </Link>
          </motion.div>

          {/* Optional: subtle trust indicators or metrics */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-wrap items-center justify-center gap-6 pt-12 text-sm text-white/70 sm:gap-12"
          >
            <div className="flex flex-col items-center gap-1">
              <div className="text-2xl font-bold text-white">10+</div>
              <div className="text-xs">Trạm sạc</div>
            </div>
            <div className="flex flex-col items-center gap-1">
              <div className="text-2xl font-bold text-white">25 phút</div>
              <div className="text-xs">Thời lượng TB</div>
            </div>
            <div className="flex flex-col items-center gap-1">
              <div className="text-2xl font-bold text-white">15%</div>
              <div className="text-xs">Tiết kiệm chi phí</div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
