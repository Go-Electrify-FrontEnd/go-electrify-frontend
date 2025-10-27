import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Zap, MapPin, Clock, Sparkles } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="flex flex-1 flex-col justify-between gap-12 overflow-x-hidden pt-32 pb-16 sm:gap-16 sm:pt-36 lg:gap-24 lg:pt-40">
      {/* Hero Content */}
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-8 px-4 text-center sm:px-6 lg:px-8">
        <div className="border-border bg-muted/50 flex items-center gap-2.5 rounded-full border px-4 py-1.5">
          <div className="bg-foreground flex h-5 w-5 items-center justify-center rounded-full">
            <Sparkles className="text-background h-3 w-3" />
          </div>
          <span className="text-muted-foreground text-sm font-medium">
            Công nghệ AI • Sạc thông minh
          </span>
        </div>

        <h1 className="text-4xl leading-tight font-bold text-balance sm:text-5xl lg:text-6xl xl:text-7xl">
          Sạc Xe Điện
          <br />
          Nhanh & Tiện Lợi
          <br />
          <span className="relative inline-block">
            Mọi Lúc Mọi Nơi
            <svg
              width="320"
              height="12"
              viewBox="0 0 320 12"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="absolute inset-x-0 bottom-0 left-0 w-full translate-y-2 max-sm:hidden"
            >
              <path
                d="M1 10C60 4 120 2 180 1.5C220 1.2 260 0.8 300 2.5C305 2.7 310 3 318 3.5"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                className="text-foreground"
              />
            </svg>
          </span>
        </h1>

        <p className="text-muted-foreground max-w-2xl text-lg leading-relaxed">
          Tìm kiếm và đặt chỗ tại hơn 100+ trạm sạc khắp TP.HCM. Thanh toán dễ
          dàng, theo dõi real-time, tiết kiệm chi phí.
        </p>

        <div className="flex flex-col items-center gap-3 sm:flex-row">
          <Button
            size="lg"
            className="bg-foreground text-background hover:bg-foreground/90 h-12 px-8 text-base"
            asChild
          >
            <a href="/dashboard">Bắt Đầu Sạc Ngay</a>
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="h-12 px-8 text-base"
            asChild
          >
            <a href="#stations">Tìm Trạm Sạc</a>
          </Button>
        </div>

        {/* Stats */}
        <div className="mt-12 grid w-full max-w-2xl grid-cols-3 gap-8 sm:gap-12">
          <div className="flex flex-col items-center gap-2">
            <div className="text-3xl font-bold sm:text-4xl">100+</div>
            <div className="text-muted-foreground text-sm">Trạm Sạc</div>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="text-3xl font-bold sm:text-4xl">24/7</div>
            <div className="text-muted-foreground text-sm">Hoạt Động</div>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="text-3xl font-bold sm:text-4xl">-30%</div>
            <div className="text-muted-foreground text-sm">Tiết Kiệm</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
