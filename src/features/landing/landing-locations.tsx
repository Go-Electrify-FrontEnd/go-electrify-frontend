"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import LandingGlobe from "./landing-globe";
import { motion } from "framer-motion";

const locations = {
  tagline: "Mở rộng mạng lưới",
  heading: "Tìm trạm sạc gần bạn",
  subheading: "Trạm sạc được đặt tại các vị trí chiến lược trên toàn quốc",
  description:
    "Sử dụng bản đồ tương tác để tìm trạm sạc, kiểm tra tình trạng và bắt đầu sạc chỉ với vài thao tác",
  primaryCta: "Xem bản đồ",
  secondaryCta: "Truy vấn trạm",
  statusLabel: "Trạng thái kết nối",
  statusCaption: "Hoạt động ổn định",
};

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
                {locations.tagline}
              </motion.div>
              <h2 className="text-foreground text-4xl font-bold lg:text-5xl">
                {locations.heading}
              </h2>
              <p className="text-muted-foreground text-xl leading-relaxed">
                {locations.subheading}
              </p>
            </div>

            {/* Description */}
            <div className="space-y-6">
              <p className="text-muted-foreground leading-relaxed">
                {locations.description}
              </p>

              <div className="flex flex-col gap-4 sm:flex-row">
                <Button
                  size="lg"
                  className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg transition-all duration-300 hover:shadow-xl"
                >
                  {locations.primaryCta}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-primary/20 hover:bg-primary/5 transition-all duration-300"
                >
                  {locations.secondaryCta}
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
                    <div className="text-sm font-medium">
                      {locations.statusLabel}
                    </div>
                    <div className="text-muted-foreground text-xs">
                      {locations.statusCaption}
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
