"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Battery } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function LandingPricing() {
  return (
    <section id="pricing" className="container mx-auto px-6 py-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
        className="mb-16 text-center"
      >
        <h2 className="mb-4 text-3xl font-bold md:text-4xl lg:text-5xl">
          Gói Sạc Phù Hợp Với Bạn
        </h2>
        <p className="text-muted-foreground mx-auto max-w-2xl text-lg">
          Chọn gói phù hợp với nhu cầu sạc của bạn. Tiết kiệm hơn với các gói
          đăng ký hàng tháng.
        </p>
      </motion.div>

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: {
              staggerChildren: 0.15,
            },
          },
        }}
        className="grid gap-8 md:grid-cols-2 lg:grid-cols-4"
      >
        {/* Pay-as-you-go */}
        <motion.div
          variants={{
            hidden: { opacity: 0, y: 30 },
            visible: { opacity: 1, y: 0 },
          }}
        >
          <Card className="border-border/50 bg-card relative flex flex-col p-8 shadow-lg transition-all hover:shadow-xl">
            <div className="mb-6">
              <h3 className="text-foreground mb-2 text-2xl font-bold">
                Trả Theo Lượt
              </h3>
              <p className="text-muted-foreground text-sm">
                Linh hoạt, không cam kết
              </p>
            </div>

            <div className="mb-6">
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-bold">4.500₫</span>
                <span className="text-muted-foreground text-sm">/kWh</span>
              </div>
              <p className="text-muted-foreground mt-2 text-sm">
                Không giới hạn sử dụng
              </p>
            </div>

            <ul className="mb-8 flex-1 space-y-3">
              <li className="flex items-start gap-2">
                <Battery className="text-primary mt-0.5 h-5 w-5 flex-shrink-0" />
                <span className="text-sm">Trả tiền theo lượng sạc thực tế</span>
              </li>
              <li className="flex items-start gap-2">
                <Battery className="text-primary mt-0.5 h-5 w-5 flex-shrink-0" />
                <span className="text-sm">Không phí hàng tháng</span>
              </li>
              <li className="flex items-start gap-2">
                <Battery className="text-primary mt-0.5 h-5 w-5 flex-shrink-0" />
                <span className="text-sm">Truy cập tất cả trạm sạc</span>
              </li>
              <li className="flex items-start gap-2">
                <Battery className="text-primary mt-0.5 h-5 w-5 flex-shrink-0" />
                <span className="text-sm">Hỗ trợ 24/7</span>
              </li>
            </ul>

            <Button variant="outline" className="w-full">
              Bắt Đầu Ngay
            </Button>
          </Card>
        </motion.div>

        {/* Basic Plan */}
        <motion.div
          variants={{
            hidden: { opacity: 0, y: 30 },
            visible: { opacity: 1, y: 0 },
          }}
        >
          <Card className="border-border/50 bg-card relative flex flex-col p-8 shadow-lg transition-all hover:shadow-xl">
            <div className="mb-6">
              <h3 className="text-foreground mb-2 text-2xl font-bold">
                Cơ Bản
              </h3>
              <p className="text-muted-foreground text-sm">
                Cho người dùng thường xuyên
              </p>
            </div>

            <div className="mb-6">
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-bold">299.000₫</span>
                <span className="text-muted-foreground text-sm">/tháng</span>
              </div>
              <p className="text-muted-foreground mt-2 text-sm">
                200 kWh • 3.500₫/kWh vượt hạn
              </p>
            </div>

            <ul className="mb-8 flex-1 space-y-3">
              <li className="flex items-start gap-2">
                <Battery className="text-primary mt-0.5 h-5 w-5 flex-shrink-0" />
                <span className="text-sm font-semibold">
                  200 kWh/tháng (~1.495₫/kWh)
                </span>
              </li>
              <li className="flex items-start gap-2">
                <Battery className="text-primary mt-0.5 h-5 w-5 flex-shrink-0" />
                <span className="text-sm">3.500₫/kWh khi vượt hạn mức</span>
              </li>
              <li className="flex items-start gap-2">
                <Battery className="text-primary mt-0.5 h-5 w-5 flex-shrink-0" />
                <span className="text-sm">Ưu tiên hỗ trợ khách hàng</span>
              </li>
              <li className="flex items-start gap-2">
                <Battery className="text-primary mt-0.5 h-5 w-5 flex-shrink-0" />
                <span className="text-sm">Báo cáo sử dụng hàng tháng</span>
              </li>
            </ul>

            <Button className="w-full">Đăng Ký Ngay</Button>
          </Card>
        </motion.div>

        {/* Pro Plan - Most Popular */}
        <motion.div
          variants={{
            hidden: { opacity: 0, y: 30 },
            visible: { opacity: 1, y: 0 },
          }}
        >
          <Card className="border-primary bg-card hover:shadow-3xl relative flex flex-col border-2 p-8 shadow-2xl transition-all">
            <div className="bg-primary text-muted absolute -top-4 left-1/2 -translate-x-1/2 rounded-full px-4 py-1.5 text-xs font-semibold">
              Phổ Biến Nhất
            </div>

            <div className="mb-6">
              <h3 className="text-foreground mb-2 text-2xl font-bold">
                Chuyên Nghiệp
              </h3>
              <p className="text-muted-foreground text-sm">
                Tốt nhất cho doanh nghiệp nhỏ
              </p>
            </div>

            <div className="mb-6">
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-bold">799.000₫</span>
                <span className="text-muted-foreground text-sm">/tháng</span>
              </div>
              <p className="text-muted-foreground mt-2 text-sm">
                600 kWh • 3.200₫/kWh vượt hạn
              </p>
            </div>

            <ul className="mb-8 flex-1 space-y-3">
              <li className="flex items-start gap-2">
                <Battery className="text-primary mt-0.5 h-5 w-5 flex-shrink-0" />
                <span className="text-sm font-semibold">
                  600 kWh/tháng (~1.332₫/kWh)
                </span>
              </li>
              <li className="flex items-start gap-2">
                <Battery className="text-primary mt-0.5 h-5 w-5 flex-shrink-0" />
                <span className="text-sm">3.200₫/kWh khi vượt hạn mức</span>
              </li>
              <li className="flex items-start gap-2">
                <Battery className="text-primary mt-0.5 h-5 w-5 flex-shrink-0" />
                <span className="text-sm">Ưu tiên sạc tại trạm đông đúc</span>
              </li>
              <li className="flex items-start gap-2">
                <Battery className="text-primary mt-0.5 h-5 w-5 flex-shrink-0" />
                <span className="text-sm">Phân tích chi tiết sử dụng</span>
              </li>
              <li className="flex items-start gap-2">
                <Battery className="text-primary mt-0.5 h-5 w-5 flex-shrink-0" />
                <span className="text-sm">Hỗ trợ ưu tiên 24/7</span>
              </li>
            </ul>

            <Button className="w-full">Đăng Ký Ngay</Button>
          </Card>
        </motion.div>

        {/* Enterprise Plan */}
        <motion.div
          variants={{
            hidden: { opacity: 0, y: 30 },
            visible: { opacity: 1, y: 0 },
          }}
        >
          <Card className="border-border/50 bg-card relative flex flex-col p-8 shadow-lg transition-all hover:shadow-xl">
            <div className="mb-6">
              <h3 className="text-foreground mb-2 text-2xl font-bold">
                Doanh Nghiệp
              </h3>
              <p className="text-muted-foreground text-sm">Cho đội xe lớn</p>
            </div>

            <div className="mb-6">
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-bold">1.999.000₫</span>
                <span className="text-muted-foreground text-sm">/tháng</span>
              </div>
              <p className="text-muted-foreground mt-2 text-sm">
                1.800 kWh • 2.800₫/kWh vượt hạn
              </p>
            </div>

            <ul className="mb-8 flex-1 space-y-3">
              <li className="flex items-start gap-2">
                <Battery className="text-primary mt-0.5 h-5 w-5 flex-shrink-0" />
                <span className="text-sm font-semibold">
                  1.800 kWh/tháng (~1.111₫/kWh)
                </span>
              </li>
              <li className="flex items-start gap-2">
                <Battery className="text-primary mt-0.5 h-5 w-5 flex-shrink-0" />
                <span className="text-sm">2.800₫/kWh khi vượt hạn mức</span>
              </li>
              <li className="flex items-start gap-2">
                <Battery className="text-primary mt-0.5 h-5 w-5 flex-shrink-0" />
                <span className="text-sm">Quản lý đa phương tiện</span>
              </li>
              <li className="flex items-start gap-2">
                <Battery className="text-primary mt-0.5 h-5 w-5 flex-shrink-0" />
                <span className="text-sm">API tích hợp doanh nghiệp</span>
              </li>
              <li className="flex items-start gap-2">
                <Battery className="text-primary mt-0.5 h-5 w-5 flex-shrink-0" />
                <span className="text-sm">Quản lý tài khoản chuyên dụng</span>
              </li>
              <li className="flex items-start gap-2">
                <Battery className="text-primary mt-0.5 h-5 w-5 flex-shrink-0" />
                <span className="text-sm">
                  Hóa đơn tập trung & báo cáo tùy chỉnh
                </span>
              </li>
            </ul>

            <Button variant="outline" className="w-full">
              Liên Hệ Bán Hàng
            </Button>
          </Card>
        </motion.div>
      </motion.div>

      <div className="mt-12 text-center">
        <p className="text-muted-foreground text-sm">
          Tất cả gói bao gồm truy cập toàn bộ mạng lưới trạm sạc của chúng tôi.{" "}
          <Link
            href="#contact"
            className="text-primary font-semibold hover:underline"
          >
            Liên hệ chúng tôi
          </Link>{" "}
          để được tư vấn gói phù hợp.
        </p>
      </div>
    </section>
  );
}
