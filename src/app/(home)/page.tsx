import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, Play, Battery, UserCircle } from "lucide-react";
import Image from "next/image";
import { HelpCircle } from "lucide-react";
import Link from "next/link";
import GlobeDemo from "@/components/GlobeDemo";
import { AppleCardsCarouselDemo } from "@/components/shared/apple-carousel-demo";
import AppLogo from "@/components/shared/logo";

export default function HomePage() {
  return (
    <div className="relative min-h-screen">
      <header className="absolute inset-x-0 top-0 z-50 border-b border-transparent bg-transparent">
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
              aria-label="Help"
            >
              <UserCircle className="h-4.5 w-4.5" />
            </Link>
          </div>
        </div>
      </header>

      {/* Add padding-top to account for fixed navbar */}
      <section className="relative flex min-h-screen flex-col items-center justify-center pt-20">
        <div className="absolute inset-0">
          <Image
            src="/assets/images/charging-station-clean.webp"
            alt="Hero Background"
            fill
            priority
            className="object-cover brightness-65"
          />
        </div>

        <div className="relative z-10 container mx-auto">
          <div className="mx-auto max-w-[800px] space-y-8 text-center">
            <h1 className="text-5xl font-bold tracking-tight text-white md:text-6xl lg:text-7xl">
              Sạc Nhanh <br />
              <span className="text-white">Cho Tất Cả</span>
            </h1>

            <p className="mx-auto max-w-[600px] text-lg text-white/90 md:text-xl">
              Tham gia mạng lưới trạm sạc xe điện lớn nhất. Nhanh chóng, đáng
              tin cậy và ở khắp nơi bạn cần.
            </p>

            <div className="flex items-center justify-center gap-4 pt-4">
              <Button
                size="lg"
                className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg transition-all hover:shadow-xl"
              >
                Tìm Trạm Sạc
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white/20 bg-white/10 text-white backdrop-blur-sm hover:bg-white/20"
              >
                Tìm Hiểu Thêm
              </Button>
            </div>

            <div className="mt-16 grid grid-cols-3 gap-8">
              <div className="space-y-2">
                <div className="text-4xl font-bold text-white md:text-5xl">
                  70k+
                </div>
                <div className="text-sm text-white/80 md:text-base">
                  Trạm Toàn Cầu
                </div>
              </div>
              <div className="space-y-2">
                <div className="text-4xl font-bold text-white md:text-5xl">
                  15m
                </div>
                <div className="text-sm text-white/80 md:text-base">
                  Thời Gian Sạc TB
                </div>
              </div>
              <div className="space-y-2">
                <div className="text-4xl font-bold text-white md:text-5xl">
                  60%
                </div>
                <div className="text-sm text-white/80 md:text-base">
                  Tiết Kiệm Chi Phí
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Locations Section */}
      <section className="relative overflow-hidden pt-20">
        <div className="relative container mx-auto px-6">
          <div className="grid items-center gap-16 lg:grid-cols-2">
            {/* Left Content */}
            <div className="space-y-8">
              <div className="space-y-4">
                <div className="bg-primary/10 text-primary inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold">
                  <div className="h-2 w-2 animate-pulse rounded-full bg-green-400"></div>
                  Thành phố Hồ Chí Minh
                </div>
                <h2 className="text-foreground text-4xl font-bold lg:text-5xl">
                  Trạm sạc khắp thành phố
                </h2>
                <p className="text-muted-foreground text-xl leading-relaxed">
                  Đi bất cứ đâu với mạng lưới trạm sạc rộng lớn của chúng tôi
                </p>
              </div>

              {/* Description */}
              <div className="space-y-6">
                <p className="text-muted-foreground leading-relaxed">
                  Chúng tôi vận hành một trong những mạng trạm sạc lớn nhất dành
                  cho xe điện. Được đặt chiến lược dọc theo các tuyến đường
                  chính và gần các tiện ích thuận tiện.
                </p>

                <div className="flex flex-col gap-4 sm:flex-row">
                  <Button
                    size="lg"
                    className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg transition-all duration-300 hover:shadow-xl"
                  >
                    Tìm Trạm Gần Nhất
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-primary/20 hover:bg-primary/5 transition-all duration-300"
                  >
                    Xem Bản Đồ
                  </Button>
                </div>
              </div>
            </div>

            {/* Right Visual */}
            <div className="relative">
              <div className="relative z-10 rounded-3xl border border-dashed">
                <div className="relative h-120 w-full overflow-hidden rounded-2xl md:h-[47rem]">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <GlobeDemo />
                  </div>
                </div>

                {/* Floating Cards */}
                <div className="bg-background border-border absolute -top-4 -right-4 rounded-xl border p-4 shadow-lg backdrop-blur-sm">
                  <div className="flex items-center gap-3">
                    <div className="h-3 w-3 animate-pulse rounded-full bg-green-500"></div>
                    <div>
                      <div className="text-sm font-medium">Hoạt động</div>
                      <div className="text-muted-foreground text-xs">
                        1,247 trạm
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Hero Product Section */}
      <div>
        <AppleCardsCarouselDemo />
      </div>

      {/* Charging Benefits */}
      <section className="container mx-auto px-6">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-3xl font-bold md:text-4xl">
            Trao Quyền Cho Hành Trình Của Bạn Với
            <br />
            Giải Pháp Sạc Thông Minh
          </h2>
          <p className="text-muted-foreground mx-auto max-w-2xl text-lg">
            Trải nghiệm tương lai của việc sạc xe điện với hệ sinh thái toàn
            diện các dịch vụ của chúng tôi.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          <Card className="border-border/50 group bg-card p-8 text-center shadow-lg transition-all hover:shadow-xl">
            <div className="bg-primary/10 group-hover:bg-primary/20 mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-xl transition-colors">
              <Battery className="text-primary h-8 w-8" />
            </div>
            <h3 className="text-foreground mb-3 text-lg font-semibold">
              Sạc Thông Minh
            </h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Tối ưu hóa sạc được hỗ trợ bởi AI thích ứng với lịch trình và chi
              phí năng lượng của bạn để đạt hiệu quả tối đa.
            </p>
          </Card>

          <Card className="border-border/50 group bg-card p-8 text-center shadow-lg transition-all hover:shadow-xl">
            <div className="bg-primary/10 group-hover:bg-primary/20 mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-xl transition-colors">
              <Battery className="text-primary h-8 w-8" />
            </div>
            <h3 className="text-foreground mb-3 text-lg font-semibold">
              Mạng Lưới Rộng
            </h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Truy cập hàng ngàn trạm sạc trên khắp đất nước với độ phủ sóng
              toàn diện và vị trí thuận tiện.
            </p>
          </Card>

          <Card className="border-border/50 group bg-card p-8 text-center shadow-lg transition-all hover:shadow-xl">
            <div className="bg-primary/10 group-hover:bg-primary/20 mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-xl transition-colors">
              <Battery className="text-primary h-8 w-8" />
            </div>
            <h3 className="text-foreground mb-3 text-lg font-semibold">
              Thanh Toán Dễ Dàng
            </h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Thanh toán an toàn và nhanh chóng với nhiều phương thức, từ thẻ
              tín dụng đến ví điện tử.
            </p>
          </Card>
        </div>
      </section>

      {/* Case Study */}
      <section className="container mx-auto px-6 py-24">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div className="bg-primary text-primary-foreground rounded-3xl p-12 shadow-2xl">
            <div className="mb-4 inline-block rounded-lg bg-white/10 px-4 py-2 text-sm font-semibold">
              Case Study
            </div>
            <h3 className="mb-6 text-3xl leading-tight font-bold md:text-4xl">
              Giảm Thời Gian Sạc Xuống 60% Với Định Tuyến Thông Minh
            </h3>
            <p className="text-primary-foreground/90 mb-8 text-lg leading-relaxed">
              Xem cách mạng lưới sạc thông minh của chúng tôi giúp người lái xe
              tiết kiệm thời gian và giảm chi phí trên toàn quốc.
            </p>
            <Button className="text-primary bg-white shadow-lg transition-all hover:bg-white/90 hover:shadow-xl">
              Đọc Nghiên Cứu Trường Hợp
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
          <div className="from-primary/10 to-primary/5 flex items-center justify-center rounded-3xl bg-gradient-to-br p-12 shadow-lg">
            <div className="bg-background/80 flex h-40 w-40 items-center justify-center rounded-full shadow-xl backdrop-blur-sm transition-transform hover:scale-105">
              <Play className="text-primary h-16 w-16" />
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="container mx-auto px-6 py-24">
        <div className="mb-20 text-center">
          <h2 className="text-foreground mb-6 text-3xl leading-tight font-bold md:text-4xl lg:text-5xl">
            Cuối Cùng, Việc Sạc Xe Điện
            <br />
            Hoạt Động Theo Phong Cách Sống Của Bạn
          </h2>
          <p className="text-muted-foreground mx-auto mb-12 max-w-3xl text-lg leading-relaxed">
            Chúng tôi không chỉ cung cấp trạm sạc, chúng tôi tạo ra một hệ sinh
            thái hiểu được các mẫu lái xe của bạn, tối ưu hóa các tuyến đường
            của bạn và đảm bảo bạn luôn được cung cấp năng lượng. Trải nghiệm sự
            khác biệt của cơ sở hạ tầng sạc thông minh thực sự.
          </p>
        </div>

        {/* Company Logos */}
        <div className="mb-20 grid grid-cols-2 gap-6 md:grid-cols-4">
          {[
            "TESLA",
            "BMW",
            "AUDI",
            "MERCEDES",
            "NISSAN",
            "VOLKSWAGEN",
            "FORD",
            "HYUNDAI",
          ].map((company) => (
            <div
              key={company}
              className="border-border/50 bg-card group flex items-center justify-center rounded-xl border p-6 shadow-sm transition-all hover:shadow-lg"
            >
              <span className="text-muted-foreground group-hover:text-foreground text-sm font-semibold transition-colors">
                {company}
              </span>
            </div>
          ))}
        </div>

        <div className="text-center">
          <h3 className="text-foreground mb-6 text-2xl font-bold md:text-3xl">
            Lái Xe Tương Lai Với Electrify
          </h3>
          <p className="text-muted-foreground mx-auto mb-8 max-w-2xl text-base leading-relaxed">
            Mạng lưới Electrify cung cấp phạm vi toàn diện trên toàn quốc với
            công nghệ thông minh thích ứng với nhu cầu của bạn. Tham gia cuộc
            cách mạng điện tử ngay hôm nay.
          </p>
          <Button
            size="lg"
            className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg transition-all hover:shadow-xl"
          >
            Bắt Đầu Sạc Ngay Hôm Nay
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-border/50 bg-card/30 border-t pt-16 pb-8">
        <div className="container mx-auto px-6">
          <div className="grid gap-12 md:grid-cols-4">
            <div className="space-y-4">
              <div className="flex items-center gap-2.5">
                <Image
                  src="/assets/images/logo01.png"
                  alt="Logo"
                  width={40}
                  height={40}
                  className="h-10 w-10"
                />
                <span className="text-foreground text-xl font-bold">
                  Electrify
                </span>
              </div>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Tương lai của việc sạc xe điện đã đến.
              </p>
            </div>
            <div>
              <h4 className="text-foreground mb-4 text-sm font-semibold">
                Dịch vụ
              </h4>
              <ul className="text-muted-foreground space-y-3 text-sm">
                <li>
                  <a
                    href="#"
                    className="hover:text-foreground transition-colors"
                  >
                    Tìm Trạm Sạc
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-foreground transition-colors"
                  >
                    Gói Giá
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-foreground transition-colors"
                  >
                    Giải Pháp Doanh Nghiệp
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-foreground mb-4 text-sm font-semibold">
                Công ty
              </h4>
              <ul className="text-muted-foreground space-y-3 text-sm">
                <li>
                  <a
                    href="#"
                    className="hover:text-foreground transition-colors"
                  >
                    Giới thiệu
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-foreground transition-colors"
                  >
                    Nghề nghiệp
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-foreground transition-colors"
                  >
                    Liên hệ
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-foreground mb-4 text-sm font-semibold">
                Hỗ trợ
              </h4>
              <ul className="text-muted-foreground space-y-3 text-sm">
                <li>
                  <a
                    href="#"
                    className="hover:text-foreground transition-colors"
                  >
                    Trung tâm trợ giúp
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-foreground transition-colors"
                  >
                    Ứng dụng di động
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-foreground transition-colors"
                  >
                    Hỗ trợ 24/7
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-border/50 text-muted-foreground mt-12 border-t pt-8 text-center text-sm">
            <p>&copy; 2025 Go Electrify. Tất cả quyền được bảo lưu.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
