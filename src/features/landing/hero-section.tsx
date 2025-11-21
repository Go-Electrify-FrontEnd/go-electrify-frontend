import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { HeroHeader } from "./header";
import { InfiniteSlider } from "@/components/ui/infinite-slider";
import { ProgressiveBlur } from "@/components/ui/progressive-blur";

export default function HeroSection() {
  return (
    <>
      <HeroHeader />
      <main className="overflow-x-hidden">
        <section>
          <div className="pt-12 pb-24 md:pb-32 lg:pt-44 lg:pb-56">
            <div className="relative mx-auto flex max-w-6xl flex-col px-6 lg:block">
              <div className="mx-auto max-w-lg text-center lg:ml-0 lg:w-1/2 lg:text-left">
                <h1 className="mt-8 max-w-2xl text-5xl font-medium text-balance md:text-6xl lg:mt-16 xl:text-7xl">
                  Nền tảng sạc xe điện thông minh
                </h1>
                <p className="mt-8 max-w-2xl text-lg text-pretty">
                  Tìm trạm sạc gần nhất, quản lý phiên sạc và thanh toán an toàn
                  — tất cả trong một nền tảng hiện đại
                </p>

                <div className="mt-12 flex flex-col items-center justify-center gap-2 sm:flex-row lg:justify-start">
                  <Button asChild size="lg" className="px-5 text-base">
                    <Link href="#link">
                      <span className="text-nowrap">Bắt đầu</span>
                    </Link>
                  </Button>
                  <Button
                    key={2}
                    asChild
                    size="lg"
                    variant="ghost"
                    className="px-5 text-base"
                  >
                    <Link href="#link">
                      <span className="text-nowrap">Liên hệ</span>
                    </Link>
                  </Button>
                </div>
              </div>
              <Image
                className="z-0 order-first ml-auto w-full object-cover invert lg:absolute lg:inset-0 lg:-top-46 lg:-right-35 lg:order-last lg:h-max lg:w-2/3 lg:object-contain dark:mix-blend-lighten dark:invert-0"
                src="/assets/images/canva-1.png"
                alt="Abstract Object"
                height={4000}
                width={3000}
              />
            </div>
          </div>
        </section>
        <section className="bg-background pb-16 md:pb-32">
          <div className="group relative m-auto max-w-6xl px-6">
            <div className="flex flex-col items-center md:flex-row">
              <div className="md:max-w-44 md:border-r md:pr-6">
                <p className="text-end text-sm">Hỗ trợ nhiều hãng xe điện</p>
              </div>
              <div className="relative py-6 md:w-[calc(100%-11rem)]">
                <InfiniteSlider speedOnHover={20} speed={40} gap={112}>
                  <div className="flex">
                    <Image
                      className="mx-auto h-10 w-fit dark:invert"
                      src="/assets/images/Vinfast.svg"
                      alt="VinFast Logo"
                      height={20}
                      width={80}
                    />
                  </div>

                  <div className="flex">
                    <Image
                      className="mx-auto h-10 w-fit dark:invert"
                      src="/assets/images/Porsche.svg"
                      alt="Porsche Logo"
                      height={20}
                      width={80}
                    />
                  </div>
                  <div className="flex">
                    <Image
                      className="mx-auto h-13 w-fit dark:invert"
                      src="/assets/images/Volvo.svg"
                      alt="Volvo Logo"
                      height={20}
                      width={80}
                    />
                  </div>
                </InfiniteSlider>

                <div className="from-background absolute inset-y-0 left-0 w-20 bg-linear-to-r"></div>
                <div className="from-background absolute inset-y-0 right-0 w-20 bg-linear-to-l"></div>
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
