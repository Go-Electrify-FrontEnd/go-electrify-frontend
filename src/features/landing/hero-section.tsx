import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { HeroHeader } from "./header";
import { InfiniteSlider } from "@/components/ui/infinite-slider";
import { ProgressiveBlur } from "@/components/ui/progressive-blur";
import { Zap, MapPin, ShieldCheck } from "lucide-react";

export default function HeroSection() {
  return (
    <>
      <HeroHeader />
      <main className="overflow-x-hidden">
        {/* HERO SECTION */}
        <section className="via-background to-background relative border-b bg-gradient-to-b from-emerald-50/60 dark:from-emerald-900/20">
          {/* Glow effect */}
          <div className="pointer-events-none absolute inset-x-0 -top-32 flex justify-center">
            <div className="h-64 w-[32rem] rounded-full bg-emerald-500/20 blur-3xl dark:bg-emerald-400/15" />
          </div>

          <div className="relative mx-auto flex max-w-6xl flex-col items-center gap-16 px-6 py-20 lg:flex-row lg:py-32">
            {/* LEFT – Heading + CTA */}
            <div className="max-w-xl flex-1 space-y-8">
              {/* Badge */}
              <div className="bg-background/60 inline-flex items-center gap-2 rounded-full border border-emerald-500/20 px-3 py-1 text-xs font-medium text-emerald-700 shadow-sm backdrop-blur dark:bg-slate-900/70 dark:text-emerald-300">
                <span className="flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500 text-[10px] text-white">
                  <Zap className="h-3 w-3" />
                </span>
                Sạc xe điện nhanh • Quản lý tập trung
              </div>

              {/* Title */}
              <h1 className="font-Inter text-4xl font-semibold tracking-tight text-slate-900 md:text-5xl lg:text-6xl xl:text-7xl dark:text-white">
                <span className="block">Nền tảng sạc xe điện</span>
                <span className="bg-gradient-to-r from-emerald-500 to-sky-500 bg-clip-text text-transparent">
                  thông minh
                </span>
              </h1>

              {/* Description */}
              <p className="max-w-xl text-base text-slate-600 md:text-lg dark:text-slate-300">
                Tìm trạm sạc gần nhất, đặt chỗ, quản lý phiên sạc và thanh toán
                an toàn — tất cả trong một nền tảng hiện đại dành cho người dùng
                xe điện tại Việt Nam.
              </p>

              {/* Trust indicators */}
              <div className="flex flex-wrap items-center gap-4 pt-3 text-xs text-slate-500 dark:text-slate-400">
                <div className="flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5" />
                  <span>Hàng trăm trạm sạc trên toàn quốc</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  <span>Thanh toán an toàn & minh bạch</span>
                </div>
              </div>
            </div>

            {/* RIGHT – Hero Image */}
            <div className="flex flex-1 justify-center">
              <Image
                src="/assets/images/canva-1.png"
                alt="Hero Illustration"
                height={1000}
                width={1000}
                className="w-full max-w-lg object-contain dark:mix-blend-lighten"
              />
            </div>
          </div>
        </section>

        {/* BRAND SLIDER */}
        <section className="bg-background pt-6 pb-16 md:pb-24">
          <div className="group relative m-auto max-w-6xl px-6">
            <div className="flex flex-col items-center gap-4 md:flex-row md:gap-8">
              <div className="md:max-w-44 md:border-r md:pr-6">
                <p className="text-center text-xs font-medium text-slate-500 md:text-end dark:text-slate-400">
                  Được tin dùng bởi các hãng xe điện
                </p>
              </div>

              <div className="relative py-4 md:w-[calc(100%-11rem)]">
                <InfiniteSlider speedOnHover={20} speed={40} gap={112}>
                  <div className="flex">
                    <Image
                      className="mx-auto h-10 dark:invert"
                      src="/assets/images/Vinfast.svg"
                      alt="VinFast Logo"
                      height={20}
                      width={80}
                    />
                  </div>

                  <div className="flex">
                    <Image
                      className="mx-auto h-10 dark:invert"
                      src="/assets/images/Porsche.svg"
                      alt="Porsche Logo"
                      height={20}
                      width={80}
                    />
                  </div>

                  <div className="flex">
                    <Image
                      className="mx-auto h-10 dark:invert"
                      src="/assets/images/Volvo.svg"
                      alt="Volvo Logo"
                      height={20}
                      width={80}
                    />
                  </div>
                </InfiniteSlider>

                {/* Fades */}
                <ProgressiveBlur
                  className="pointer-events-none absolute top-0 left-0 h-full w-20"
                  direction="left"
                  blurIntensity={1}
                />
                <ProgressiveBlur
                  className="pointer-events-none absolute top-0 right-0 h-full w-20"
                  direction="right"
                  blurIntensity={1}
                />
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
