"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export default function LandingFooter() {
  return (
    <footer className="border-border/50 bg-card/30 border-t pt-16 pb-8">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6 }}
          className="grid gap-12 md:grid-cols-4"
        >
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
              Dịch vụ Sạc
            </h4>
            <ul className="text-muted-foreground space-y-3 text-sm">
              <li>
                <a href="#" className="hover:text-foreground transition-colors">
                  Tìm Trạm Sạc
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground transition-colors">
                  Gói Giá
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground transition-colors">
                  Giải Pháp Doanh Nghiệp
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-foreground mb-4 text-sm font-semibold">
              Về Electrify
            </h4>
            <ul className="text-muted-foreground space-y-3 text-sm">
              <li>
                <a href="#" className="hover:text-foreground transition-colors">
                  Giới thiệu
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground transition-colors">
                  Nghề nghiệp
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground transition-colors">
                  Liên hệ
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-foreground mb-4 text-sm font-semibold">
              Hỗ trợ Khách Hàng
            </h4>
            <ul className="text-muted-foreground space-y-3 text-sm">
              <li>
                <a href="#" className="hover:text-foreground transition-colors">
                  Trung tâm trợ giúp
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground transition-colors">
                  Ứng dụng di động
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground transition-colors">
                  Hỗ trợ 24/7
                </a>
              </li>
            </ul>
          </div>
        </motion.div>
        <div className="border-border/50 text-muted-foreground mt-12 border-t pt-8 text-center text-sm">
          <p>&copy; 2025 Go Electrify. Tất cả quyền được bảo lưu.</p>
        </div>
      </div>
    </footer>
  );
}
