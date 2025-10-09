"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Image from "next/image";

export default function LandingHero() {
  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center pt-20">
      <div className="absolute inset-0">
        <Image
          src="/assets/images/charging-station-clean.webp"
          alt="Hero Background"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/50" />
      </div>

      <div className="relative z-10 container mx-auto">
        <div className="mx-auto max-w-[800px] space-y-12 text-center">
          <h1 className="text-5xl leading-tight font-bold tracking-tight text-white drop-shadow-2xl md:text-6xl lg:text-7xl">
            <span className="bg-green-400 bg-gradient-to-r bg-clip-text text-transparent">
              Đảm Bảo Hành Trình
            </span>
            <br />
            <span className="text-white drop-shadow-lg">Luôn Sẵn Sàng</span>
          </h1>

          <p className="mx-auto max-w-[600px] text-lg leading-relaxed font-medium text-white/95 drop-shadow-lg md:text-xl">
            Tham gia mạng lưới trạm sạc xe điện lớn nhất. Nhanh chóng, đáng tin
            cậy và ở khắp nơi bạn cần.
          </p>

          <div className="flex items-center justify-center gap-4 pt-4">
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
          </div>

          <div className="mt-20 grid grid-cols-3 gap-12">
            <div className="space-y-3">
              <div className="text-4xl font-bold text-white drop-shadow-lg md:text-5xl">
                100+
              </div>
              <div className="text-sm leading-relaxed font-medium text-white/90 drop-shadow-md md:text-base">
                Trạm Khắp TPHCM
              </div>
            </div>
            <div className="space-y-3">
              <div className="text-4xl font-bold text-white drop-shadow-lg md:text-5xl">
                30p
              </div>
              <div className="text-sm leading-relaxed font-medium text-white/90 drop-shadow-md md:text-base">
                Thời Gian Sạc TB
              </div>
            </div>
            <div className="space-y-3">
              <div className="text-4xl font-bold text-white drop-shadow-lg md:text-5xl">
                60%
              </div>
              <div className="text-sm leading-relaxed font-medium text-white/90 drop-shadow-md md:text-base">
                Tiết Kiệm Chi Phí
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
