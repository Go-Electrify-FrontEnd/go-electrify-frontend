"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import LandingGlobe from "@/components/landing/landing-globe";
import { motion } from "framer-motion";

export default function LandingLocations() {
  return (
    <section className="relative overflow-hidden pt-20">
      <div className="relative container mx-auto px-6">
        <div className="grid items-center gap-16 lg:grid-cols-2">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="space-y-8"
          >
            <div className="space-y-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="bg-primary/10 text-primary inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold"
              >
                <div className="h-2 w-2 animate-pulse rounded-full bg-green-400"></div>
                Thành phố Hồ Chí Minh
              </motion.div>
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
                cho xe điện. Được đặt chiến lược dọc theo các tuyến đường chính
                và gần các tiện ích thuận tiện.
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
          </motion.div>

          {/* Right Visual */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative"
          >
            <div className="relative z-10 rounded-3xl border border-dashed">
              <div className="relative h-120 w-full overflow-hidden rounded-2xl md:h-[47rem]">
                <div className="absolute inset-0 flex items-center justify-center">
                  <LandingGlobe />
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
          </motion.div>
        </div>
      </div>
    </section>
  );
}
