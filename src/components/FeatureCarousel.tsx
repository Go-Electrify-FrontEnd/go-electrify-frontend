"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Pagination, Autoplay } from "swiper/modules";
import { Button } from "@/components/ui/button";

export default function FeatureCarousel() {
  const features = [
    {
      title: "INTRODUCING CHARGE+",
      desc: "Our smart mobile app finds the nearest charging stations, monitors progress, and handles payments seamlessly. Never worry about range anxiety again.",
      btn: "Download App",
    },
    {
      title: "REAL-TIME MONITORING",
      desc: "Track your charging progress in real-time with live updates. Always know when your vehicle is ready to go.",
      btn: "Learn More",
    },
    {
      title: "SEAMLESS PAYMENTS",
      desc: "Handle transactions effortlessly with secure in-app payments and digital wallet integration.",
      btn: "Get Started",
    },
  ];

  return (
    <section className="container mx-auto px-4 py-20">
      <Swiper
        modules={[Pagination, Autoplay]} // bỏ Navigation đi
        spaceBetween={50}
        slidesPerView={1}
        pagination={{ clickable: true }}
        autoplay={{ delay: 5000 }}
        loop
      >
        {features.map((feature, i) => (
          <SwiperSlide key={i}>
            <div className="grid items-center gap-12 lg:grid-cols-2">
              {/* Left content */}
              <div>
                <h2 className="mb-6 text-4xl font-bold">{feature.title}</h2>
                <p className="text-muted-foreground mb-8 text-xl leading-relaxed">
                  {feature.desc}
                </p>
                <Button size="sm" className="hover:bg-gray-500">
                  {feature.btn}
                </Button>
              </div>

              {/* Right content giữ layout gốc */}
              <div className="rounded-2xl border border-gray-800 bg-gray-900 p-8">
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="h-8 w-8 rounded bg-green-500"></div>
                    <div className="h-8 w-8 rounded bg-blue-500"></div>
                    <div className="h-8 w-8 rounded bg-purple-500"></div>
                    <div className="h-8 w-8 rounded bg-orange-500"></div>
                  </div>
                  <div className="rounded-lg bg-gray-800 p-4">
                    <div className="grid grid-cols-4 gap-2">
                      {Array.from({ length: 16 }).map((_, j) => (
                        <div
                          key={j}
                          className="aspect-square rounded bg-gray-700"
                        ></div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}
