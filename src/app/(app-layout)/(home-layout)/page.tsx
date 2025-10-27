// import { Button } from "@/components/ui/button";
// import { StationMap } from "@/features/stations-nearby/components/stations-map";
// import { StationsNearbyProvider } from "@/contexts/stations-nearby-context";
// import { getStations } from "@/features/stations/services/stations-api";
// import { Suspense } from "react";
// import {
//   CheaperPriceCard,
//   ReservationSlotCard,
//   SupportCard,
//   OnlinePaymentCard,
// } from "@/components/ui/feature-cards-canvas";
// import Image from "next/image";
// import LandingHeader from "@/features/landing/landing-header";
// import HeroSection from "@/components/shadcn-studio/blocks/hero-section-01/hero-section-01";

import HeroSection from "@/components/hero-section";

// export const revalidate = 3600; // Revalidate this page every hour

// export default async function HomePage() {
//   const stations = await getStations();
//   const brandClass =
//     "flex h-20 w-full items-center justify-center opacity-60 grayscale transition-all duration-300 hover:opacity-100 hover:grayscale-0";

//   const brands = [
//     { name: "Porsche", icon: "🏎️" },
//     { name: "Tesla", icon: "⚡" },
//     { name: "VinFast", icon: "🇻🇳" },
//     { name: "BYD", icon: "🔋" },
//     { name: "Volvo", icon: "🔌" },
//   ];

//   return (
//     <div className="bg-background text-foreground min-h-screen">
//       <LandingHeader />

//       <HeroSection />

//       {/* Partner Brands Section */}
//       <section className="border-border/50 mx-auto w-full max-w-7xl border-y px-4 py-12 sm:px-6">
//         <div className="mb-8 text-center">
//           <h3 className="text-muted-foreground text-sm font-semibold tracking-wider uppercase">
//             Hỗ trợ tất cả các dòng xe điện
//           </h3>
//         </div>
//         <div className="grid grid-cols-2 place-items-center gap-6 sm:gap-8 md:grid-cols-3 lg:grid-cols-5">
//           {brands.map((b) => (
//             <div key={b.name} className={brandClass}>
//               <div className="flex flex-col items-center gap-2">
//                 <span className="text-4xl">{b.icon}</span>
//                 <span className="text-lg font-semibold">{b.name}</span>
//               </div>
//             </div>
//           ))}
//         </div>
//       </section>

//       <section className="py-20">
//         <div className="mx-auto max-w-7xl px-4 sm:px-6">
//           <div className="mb-16 text-center">
//             <div className="border-border bg-muted/50 mb-6 inline-flex items-center gap-2 rounded-full border px-4 py-1.5">
//               <div className="bg-foreground h-1.5 w-1.5 rounded-full"></div>
//               <span className="text-muted-foreground text-sm font-medium">
//                 Tính năng vượt trội
//               </span>
//             </div>
//             <h2 className="mb-4 text-3xl font-bold sm:text-4xl lg:text-5xl">
//               Trải Nghiệm Sạc Xe Điện
//               <br />
//               Đẳng Cấp Hàng Đầu
//             </h2>
//             <p className="text-muted-foreground mx-auto max-w-2xl text-lg">
//               Nền tảng sạc xe điện thông minh với công nghệ AI, mang đến sự tiện
//               lợi tối ưu
//             </p>
//           </div>

//           <div className="grid w-full grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
//             <CheaperPriceCard />
//             <ReservationSlotCard />
//             <SupportCard />
//             <OnlinePaymentCard />
//           </div>
//         </div>
//       </section>

//       {/* Map Section */}
//       <section id="stations" className="bg-muted/30 py-20">
//         <div className="mx-auto w-full max-w-7xl px-4 sm:px-6">
//           <div className="mb-16 text-center">
//             <div className="border-border bg-background mb-6 inline-flex items-center gap-2 rounded-full border px-4 py-1.5">
//               <div className="bg-foreground h-1.5 w-1.5 rounded-full"></div>
//               <span className="text-muted-foreground text-sm font-medium">
//                 Mạng lưới trạm sạc
//               </span>
//             </div>
//             <h2 className="mb-4 text-3xl font-bold sm:text-4xl lg:text-5xl">
//               Khám Phá Trạm Sạc
//               <br />
//               Gần Bạn Nhất
//             </h2>
//             <p className="text-muted-foreground mx-auto max-w-2xl text-lg">
//               Hơn 100 trạm sạc được đặt tại các vị trí chiến lược khắp TP. Hồ
//               Chí Minh
//             </p>
//           </div>

//           <div className="border-border overflow-hidden rounded-xl border shadow-xl">
//             <div className="h-[600px] sm:h-[700px] md:h-[800px] lg:h-[900px]">
//               <Suspense
//                 fallback={
//                   <div className="bg-muted/50 flex h-full items-center justify-center">
//                     <div className="text-center">
//                       <div className="border-foreground mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-r-transparent"></div>
//                       <p className="text-muted-foreground">
//                         Đang tải bản đồ...
//                       </p>
//                     </div>
//                   </div>
//                 }
//               >
//                 <StationsNearbyProvider stations={stations}>
//                   <StationMap />
//                 </StationsNearbyProvider>
//               </Suspense>
//             </div>
//           </div>
//         </div>
//       </section>

//       <footer className="bg-background border-border mt-32 border-t">
//         <div className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 sm:py-16">
//           <div className="grid gap-8 sm:gap-12 lg:grid-cols-12">
//             <div className="lg:col-span-4">
//               <div className="space-y-4">
//                 <div className="flex items-center gap-2">
//                   <div className="bg-foreground flex h-8 w-8 items-center justify-center rounded-md">
//                     <svg
//                       className="text-background h-4 w-4"
//                       fill="currentColor"
//                       viewBox="0 0 24 24"
//                     >
//                       <path d="M13 2L3 14h8l-1 8 10-12h-8l1-8z" />
//                     </svg>
//                   </div>
//                   <span className="text-lg font-semibold">GoElectrify</span>
//                 </div>
//                 <p className="text-muted-foreground max-w-sm text-sm leading-relaxed">
//                   Nền tảng sạc xe điện thông minh hàng đầu tại Việt Nam. Mang
//                   đến trải nghiệm sạc nhanh chóng, tiện lợi và bền vững.
//                 </p>
//                 <div className="flex gap-3 pt-2">
//                   <a
//                     href="#"
//                     className="border-border hover:bg-accent text-muted-foreground hover:text-foreground flex h-9 w-9 items-center justify-center rounded-full border transition-all duration-200"
//                     aria-label="Facebook"
//                   >
//                     <svg
//                       className="h-4 w-4"
//                       fill="currentColor"
//                       viewBox="0 0 24 24"
//                     >
//                       <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
//                     </svg>
//                   </a>
//                   <a
//                     href="#"
//                     className="border-border hover:bg-accent text-muted-foreground hover:text-foreground flex h-9 w-9 items-center justify-center rounded-full border transition-all duration-200"
//                     aria-label="Instagram"
//                   >
//                     <svg
//                       className="h-4 w-4"
//                       fill="currentColor"
//                       viewBox="0 0 24 24"
//                     >
//                       <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
//                     </svg>
//                   </a>
//                   <a
//                     href="#"
//                     className="border-border hover:bg-accent text-muted-foreground hover:text-foreground flex h-9 w-9 items-center justify-center rounded-full border transition-all duration-200"
//                     aria-label="LinkedIn"
//                   >
//                     <svg
//                       className="h-4 w-4"
//                       fill="currentColor"
//                       viewBox="0 0 24 24"
//                     >
//                       <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
//                     </svg>
//                   </a>
//                 </div>
//               </div>
//             </div>

//             <div className="grid grid-cols-2 gap-6 sm:gap-8 lg:col-span-8 lg:grid-cols-4">
//               <div>
//                 <h3 className="text-foreground mb-4 text-sm font-semibold tracking-wider">
//                   SẢN PHẨM
//                 </h3>
//                 <ul className="text-muted-foreground space-y-3 text-sm">
//                   <li>
//                     <a
//                       href="#stations"
//                       className="hover:text-foreground transition-colors"
//                     >
//                       Tìm Trạm Sạc
//                     </a>
//                   </li>
//                   <li>
//                     <a
//                       href="/dashboard"
//                       className="hover:text-foreground transition-colors"
//                     >
//                       Đặt Chỗ Sạc
//                     </a>
//                   </li>
//                   <li>
//                     <a
//                       href="#pricing"
//                       className="hover:text-foreground transition-colors"
//                     >
//                       Gói Dịch Vụ
//                     </a>
//                   </li>
//                   <li>
//                     <a
//                       href="#"
//                       className="hover:text-foreground transition-colors"
//                     >
//                       Ứng Dụng Di Động
//                     </a>
//                   </li>
//                 </ul>
//               </div>

//               <div>
//                 <h3 className="text-foreground mb-4 text-sm font-semibold tracking-wider">
//                   CÔNG TY
//                 </h3>
//                 <ul className="text-muted-foreground space-y-3 text-sm">
//                   <li>
//                     <a
//                       href="#about"
//                       className="hover:text-foreground transition-colors"
//                     >
//                       Về Chúng Tôi
//                     </a>
//                   </li>
//                   <li>
//                     <a
//                       href="#"
//                       className="hover:text-foreground transition-colors"
//                     >
//                       Tin Tức
//                     </a>
//                   </li>
//                   <li>
//                     <a
//                       href="#"
//                       className="hover:text-foreground transition-colors"
//                     >
//                       Tuyển Dụng
//                     </a>
//                   </li>
//                   <li>
//                     <a
//                       href="#"
//                       className="hover:text-foreground transition-colors"
//                     >
//                       Đối Tác
//                     </a>
//                   </li>
//                 </ul>
//               </div>

//               <div>
//                 <h3 className="text-foreground mb-4 text-sm font-semibold tracking-wider">
//                   HỖ TRỢ
//                 </h3>
//                 <ul className="text-muted-foreground space-y-3 text-sm">
//                   <li>
//                     <a
//                       href="#support"
//                       className="hover:text-foreground transition-colors"
//                     >
//                       Trung Tâm Trợ Giúp
//                     </a>
//                   </li>
//                   <li>
//                     <a
//                       href="#"
//                       className="hover:text-foreground transition-colors"
//                     >
//                       Hướng Dẫn Sử Dụng
//                     </a>
//                   </li>
//                   <li>
//                     <a
//                       href="#"
//                       className="hover:text-foreground transition-colors"
//                     >
//                       Liên Hệ
//                     </a>
//                   </li>
//                   <li>
//                     <a
//                       href="#"
//                       className="hover:text-foreground transition-colors"
//                     >
//                       Câu Hỏi Thường Gặp
//                     </a>
//                   </li>
//                 </ul>
//               </div>

//               <div>
//                 <h3 className="text-foreground mb-4 text-sm font-semibold tracking-wider">
//                   PHÁP LÝ
//                 </h3>
//                 <ul className="text-muted-foreground space-y-3 text-sm">
//                   <li>
//                     <a
//                       href="#"
//                       className="hover:text-foreground transition-colors"
//                     >
//                       Điều Khoản Dịch Vụ
//                     </a>
//                   </li>
//                   <li>
//                     <a
//                       href="#"
//                       className="hover:text-foreground transition-colors"
//                     >
//                       Chính Sách Bảo Mật
//                     </a>
//                   </li>
//                   <li>
//                     <a
//                       href="#"
//                       className="hover:text-foreground transition-colors"
//                     >
//                       Cookie
//                     </a>
//                   </li>
//                   <li>
//                     <a
//                       href="#"
//                       className="hover:text-foreground transition-colors"
//                     >
//                       Bản Quyền
//                     </a>
//                   </li>
//                 </ul>
//               </div>
//             </div>
//           </div>

//           <div className="border-border mt-12 border-t pt-8">
//             <div className="flex flex-col items-center justify-between gap-4 text-center sm:flex-row sm:text-left">
//               <p className="text-muted-foreground text-sm">
//                 © 2025 GoElectrify. Tất cả quyền được bảo lưu.
//               </p>
//               <div className="text-muted-foreground flex items-center gap-2 text-sm">
//                 <span>Được phát triển tại Việt Nam</span>
//                 <span>🇻🇳</span>
//               </div>
//             </div>
//           </div>
//         </div>
//       </footer>
//     </div>
//   );
// }

export default async function HomePage() {
  return <HeroSection />;
}
