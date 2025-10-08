import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

const PARTNER_COMPANIES = [
  "TESLA",
  "BMW",
  "AUDI",
  "MERCEDES",
  "NISSAN",
  "VOLKSWAGEN",
  "FORD",
  "HYUNDAI",
];

export default function LandingFinalCTA() {
  return (
    <section className="container mx-auto px-6 py-24">
      <div className="mb-20 text-center">
        <h2 className="text-foreground mb-6 text-3xl leading-tight font-bold md:text-4xl lg:text-5xl">
          Cuối Cùng, Việc Sạc Xe Điện
          <br />
          Hoạt Động Theo Phong Cách Sống Của Bạn
        </h2>
        <p className="text-muted-foreground mx-auto mb-12 max-w-3xl text-lg leading-relaxed">
          Chúng tôi không chỉ cung cấp trạm sạc, chúng tôi tạo ra một hệ sinh
          thái hiểu được các mẫu lái xe của bạn, tối ưu hóa các tuyến đường của
          bạn và đảm bảo bạn luôn được cung cấp năng lượng. Trải nghiệm sự khác
          biệt của cơ sở hạ tầng sạc thông minh thực sự.
        </p>
      </div>

      {/* Charging Partners */}
      <div className="mb-8 text-center">
        <h3 className="text-foreground mb-4 text-xl font-semibold">
          Đối tác & Hạ tầng sạc
        </h3>
        <p className="text-muted-foreground mx-auto mb-6 max-w-2xl text-sm">
          Các nhà sản xuất ô tô và nhà vận hành trạm sạc hợp tác để đảm bảo trải
          nghiệm sạc rộng khắp và đáng tin cậy.
        </p>
      </div>

      <div className="mb-20 grid grid-cols-2 gap-6 md:grid-cols-4">
        {PARTNER_COMPANIES.map((company) => (
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
          Mạng lưới Electrify cung cấp hạ tầng sạc toàn quốc, giúp bạn tối ưu
          chi phí và thời gian sạc. Quản lý lịch sạc, theo dõi tiêu thụ năng
          lượng và tận hưởng trải nghiệm sạc liền mạch.
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
  );
}
