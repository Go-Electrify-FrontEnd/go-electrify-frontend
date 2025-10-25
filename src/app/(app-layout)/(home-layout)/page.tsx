import LandingHeader from "@/components/landing/landing-header";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { StationMap } from "@/features/stations-nearby/components/stations-map";
import { StationsNearbyProvider } from "@/contexts/stations-nearby-context";
import { getStations } from "@/features/stations/services/stations-api";

export const revalidate = 3600; // Revalidate this page every hour

export default async function HomePage() {
  const stations = await getStations();
  const brandClass =
    "flex h-20 w-full items-center justify-center opacity-60 grayscale transition-all duration-300 hover:opacity-100 hover:grayscale-0";

  const brands = [
    { name: "Porsche", size: "text-4xl" },
    { name: "Tesla", size: "text-4xl" },
    { name: "VinFast", size: "text-4xl" },
    { name: "BYD", size: "text-4xl" },
    { name: "Volvo", size: "text-4xl" },
  ];

  return (
    <div className="bg-background text-foreground relative mx-2 min-h-screen">
      <LandingHeader />

      {/* Hero Section */}
      <section className="w-full pt-32">
        <div className="mx-auto w-full max-w-7xl border-t border-r border-l text-center">
          <div className="mx-auto w-max max-w-full space-y-4 p-6 sm:space-y-6 sm:p-10 lg:border-r lg:border-l lg:p-14">
            <div className="text-muted-foreground font-xanh text-xs tracking-wider sm:text-sm">
              GOELECTRIFY / 2025
            </div>

            <h1 className="text-4xl font-light tracking-tight sm:text-5xl lg:text-6xl xl:text-7xl">
              Sạc Xe Điện
              <br />
              <span className="text-muted-foreground">Thông Minh</span>
            </h1>

            <p className="text-muted-foreground mx-auto max-w-2xl px-4 text-base leading-relaxed sm:px-0 sm:text-lg lg:text-xl">
              Nền tảng sạc xe điện tiện lợi và tiết kiệm hàng đầu dành cho tài
              xế với mạng lưới trạm sạc phủ sóng khắp Thành phố Hồ Chí Minh.
            </p>

            <div className="text-muted-foreground flex items-center justify-center gap-2 text-xs sm:gap-3 sm:text-sm">
              <div className="h-2 w-2 rounded-full bg-green-500"></div>
              <div>Sẵn sàng phục vụ 24/7</div>
            </div>

            <div className="flex flex-col justify-center gap-3 pt-2 sm:flex-row sm:gap-4 sm:pt-4">
              <Button size="lg" className="w-full font-medium sm:w-auto">
                Bắt Đầu Ngay
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="w-full font-medium sm:w-auto"
              >
                Tìm Hiểu Thêm
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Partner Brands Section */}
      <section className="mx-auto w-full max-w-7xl border px-4 py-12 sm:px-6 sm:py-16">
        <div className="mb-8 text-center">
          <h2 className="text-muted-foreground font-xanh mb-2 text-xs tracking-wider uppercase sm:text-sm">
            Các Hãng Xe Được Hỗ Trợ
          </h2>
          <p className="text-xl">
            Hợp tác cùng các thương hiệu xe điện hàng đầu
          </p>
        </div>

        <div className="grid grid-cols-2 place-items-center gap-6 sm:gap-8 md:grid-cols-3 lg:grid-cols-5">
          {brands.map((b) => (
            <div key={b.name} className={brandClass}>
              <div className={`${b.size} font-mono text-current`}>{b.name}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Map Section */}
      <section>
        <div className="mx-auto w-full max-w-7xl border p-6 sm:px-6">
          <div className="p-12">
            <div className="text-center text-balance">
              <h2 className="text-muted-foreground font-xanh mb-2 text-xs tracking-wider sm:mb-3 sm:text-sm">
                MẠNG LƯỚI TRẠM SẠC
              </h2>
              <p className="text-2xl font-light sm:text-3xl lg:text-4xl">
                Khám phá trạm sạc gần bạn
              </p>
              <p className="text-muted-foreground mt-3 px-4">
                Với hơn 100 trạm sạc khắp thành phố Hồ Chí Minh, bạn luôn tìm
                thấy điểm sạc thuận tiện mọi lúc mọi nơi
              </p>
            </div>
          </div>

          <div className="overflow-hidden rounded-2xl border shadow-2xl sm:rounded-3xl">
            <div className="h-[400px] sm:h-[500px] md:h-[600px] lg:h-[800px] xl:h-[1000px]">
              <StationsNearbyProvider stations={stations}>
                <StationMap />
              </StationsNearbyProvider>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-background mt-32 border-t">
        <div className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 sm:py-16">
          <div className="grid gap-8 sm:gap-12 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <div className="space-y-3 sm:space-y-4">
                <div className="font-xanh text-lg font-semibold tracking-tight sm:text-xl">
                  GoElectrify
                </div>
                <p className="text-muted-foreground max-w-sm text-sm leading-relaxed">
                  Nền tảng sạc xe điện thông minh hàng đầu tại Việt Nam. Mang
                  đến trải nghiệm sạc nhanh, tiện lợi và bền vững.
                </p>
                <div className="flex gap-3 pt-2 sm:gap-4">
                  <a
                    href="#"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                    aria-label="Facebook"
                  >
                    <svg
                      className="h-5 w-5"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                  </a>
                  <a
                    href="#"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                    aria-label="Instagram"
                  >
                    <svg
                      className="h-5 w-5"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                    </svg>
                  </a>
                  <a
                    href="#"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                    aria-label="LinkedIn"
                  >
                    <svg
                      className="h-5 w-5"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6 sm:gap-8 lg:col-span-8 lg:grid-cols-4">
              <div>
                <h3 className="mb-3 text-xs font-semibold tracking-wider sm:mb-4 sm:text-sm">
                  SẢN PHẨM
                </h3>
                <ul className="text-muted-foreground space-y-2 text-sm sm:space-y-3">
                  <li>
                    <a
                      href="#"
                      className="hover:text-foreground transition-colors"
                    >
                      Tìm trạm sạc
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="hover:text-foreground transition-colors"
                    >
                      Đặt chỗ sạc
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="hover:text-foreground transition-colors"
                    >
                      Gói dịch vụ
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
                </ul>
              </div>

              <div>
                <h3 className="mb-3 text-xs font-semibold tracking-wider sm:mb-4 sm:text-sm">
                  CÔNG TY
                </h3>
                <ul className="text-muted-foreground space-y-2 text-sm sm:space-y-3">
                  <li>
                    <a
                      href="#"
                      className="hover:text-foreground transition-colors"
                    >
                      Về chúng tôi
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="hover:text-foreground transition-colors"
                    >
                      Tin tức
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="hover:text-foreground transition-colors"
                    >
                      Tuyển dụng
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="hover:text-foreground transition-colors"
                    >
                      Đối tác
                    </a>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="font-xanh mb-3 text-xs font-semibold tracking-wider sm:mb-4 sm:text-sm">
                  HỖ TRỢ
                </h3>
                <ul className="text-muted-foreground space-y-2 text-sm sm:space-y-3">
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
                      Hướng dẫn sử dụng
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
                  <li>
                    <a
                      href="#"
                      className="hover:text-foreground transition-colors"
                    >
                      FAQ
                    </a>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="font-xanh mb-3 text-xs font-semibold tracking-wider sm:mb-4 sm:text-sm">
                  PHÁP LÝ
                </h3>
                <ul className="text-muted-foreground space-y-2 text-sm sm:space-y-3">
                  <li>
                    <a
                      href="#"
                      className="hover:text-foreground transition-colors"
                    >
                      Điều khoản dịch vụ
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="hover:text-foreground transition-colors"
                    >
                      Chính sách bảo mật
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="hover:text-foreground transition-colors"
                    >
                      Cookie
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="hover:text-foreground transition-colors"
                    >
                      Bản quyền
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="border-muted-foreground/20 mt-8 border-t pt-6 sm:mt-12 sm:pt-8">
            <div className="flex flex-col items-center justify-between gap-3 text-center sm:flex-row sm:gap-4 sm:text-left">
              <p className="text-muted-foreground text-xs sm:text-sm">
                © 2025 GoElectrify. Tất cả quyền được bảo lưu.
              </p>
              <div className="flex items-center gap-1 text-xs sm:text-sm">
                <span className="text-muted-foreground">
                  Được phát triển với
                </span>
                <span className="text-red-500">♥</span>
                <span className="text-muted-foreground">tại Việt Nam</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
