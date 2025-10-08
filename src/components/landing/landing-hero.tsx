"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import { motion } from "framer-motion";

export default function LandingHero() {
  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center pt-20">
      <div className="absolute inset-0">
        <Image
          src="/assets/images/charging-station-clean.webp"
          alt="Hero Background"
          fill
          priority
          className="object-cover brightness-65"
        />
        <div className="absolute inset-0 bg-black/70" />
      </div>

      <div className="relative z-10 container mx-auto">
        <div className="mx-auto max-w-[800px] space-y-8 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-5xl font-bold tracking-tight text-white drop-shadow-2xl md:text-6xl lg:text-7xl"
          >
            <span className="bg-green-400 bg-gradient-to-r bg-clip-text text-transparent">
              Đảm Bảo Hành Trình
            </span>
            <br />
            <span className="text-white drop-shadow-lg">Luôn Sẵn Sàng</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="mx-auto max-w-[600px] text-lg font-medium text-white/95 drop-shadow-lg md:text-xl"
          >
            Tham gia mạng lưới trạm sạc xe điện lớn nhất. Nhanh chóng, đáng tin
            cậy và ở khắp nơi bạn cần.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
            className="flex items-center justify-center gap-4 pt-4"
          >
            <Button
              size="lg"
              className="border border-green-500/20 bg-green-600 text-white shadow-2xl transition-all hover:scale-105 hover:bg-green-700 hover:shadow-green-500/25"
            >
              Bắt Đầu Ngay
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white/40 bg-white/15 text-white shadow-xl backdrop-blur-md hover:border-white/60 hover:bg-white/25"
            >
              Tìm Hiểu Thêm
            </Button>
          </motion.div>

          <motion.div
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: {
                  delayChildren: 0.6,
                  staggerChildren: 0.15,
                },
              },
            }}
            className="mt-16 grid grid-cols-3 gap-8"
          >
            <motion.div
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 },
              }}
              className="space-y-2"
            >
              <div className="text-4xl font-bold text-white drop-shadow-lg md:text-5xl">
                100+
              </div>
              <div className="text-sm font-medium text-white/90 drop-shadow-md md:text-base">
                Trạm Khắp TPHCM
              </div>
            </motion.div>
            <motion.div
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 },
              }}
              className="space-y-2"
            >
              <div className="text-4xl font-bold text-white drop-shadow-lg md:text-5xl">
                30p
              </div>
              <div className="text-sm font-medium text-white/90 drop-shadow-md md:text-base">
                Thời Gian Sạc TB
              </div>
            </motion.div>
            <motion.div
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 },
              }}
              className="space-y-2"
            >
              <div className="text-4xl font-bold text-white drop-shadow-lg md:text-5xl">
                60%
              </div>
              <div className="text-sm font-medium text-white/90 drop-shadow-md md:text-base">
                Tiết Kiệm Chi Phí
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
