"use client";

import { usePathname } from "next/navigation";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import Link from "next/link";

const segmentMap: Record<string, string> = {
  dashboard: "Tổng Quan",
  charging: "Bắt Đầu Sạc",
  "stations-nearby": "Trạm Gần Đây",
  wallet: "Ví",
  reservations: "Đặt Chỗ",
  "charging-history": "Lịch Sử Sạc",
  admin: "Quản Trị",
  stations: "Quản Lý Trạm",
  users: "Quản Lý Người Dùng",
  subscriptions: "Quản Lý Gói",
  "connector-type": "Quản Lý Loại Kết Nối",
  "vehicle-models": "Quản Lý Mẫu Xe",
  "plans-billing": "Gói & Thanh Toán",
  settings: "Cài Đặt",
  "station-me": "Trạm Của Tôi",
  "station-detail": "Chi Tiết Trạm",
  binding: "Liên Kết Đặt Chỗ",
  progress: "Tiến Trình Sạc",
  payment: "Thanh Toán",
  success: "Thành Công",
  staff: "Nhân Viên",
  "booking-fee": "Phí Đặt Chỗ",
  "incident-reports": "Báo Cáo Sự Cố",
  "deposit-customers": "Nạp Tiền Khách Hàng",
};

export default function HeaderBreadcrumb() {
  const pathname = usePathname();
  const paths = pathname.split("/").filter((seg) => seg.length > 0);

  const breadcrumbItems = paths.map((segment, index) => {
    const href = "/" + paths.slice(0, index + 1).join("/");
    const isLast = index === paths.length - 1;
    const displayName =
      segmentMap[segment] || segment.charAt(0).toUpperCase() + segment.slice(1);

    return {
      href,
      label: displayName.trim(),
      isLast,
    };
  });

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {breadcrumbItems.map((item, index) => (
          <div key={item.href} className="contents">
            {index > 0 && <BreadcrumbSeparator />}

            <BreadcrumbItem>
              {item.isLast ? (
                <BreadcrumbPage>{item.label}</BreadcrumbPage>
              ) : (
                <BreadcrumbLink asChild>
                  <Link prefetch={false} href={item.href}>
                    {item.label}
                  </Link>
                </BreadcrumbLink>
              )}
            </BreadcrumbItem>
          </div>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
