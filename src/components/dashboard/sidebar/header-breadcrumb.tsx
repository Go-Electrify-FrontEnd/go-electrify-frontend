"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

// URL o ben trai con ten hien thi o ben phai
const pathNameMap = new Map([
  ["dashboard", "Bảng điều khiển"],
  ["find-stations", "Tìm trạm sạc"],
  ["reservations", "Đặt chỗ"],
  ["charging-history", "Lịch sử sạc"],
  ["wallet", "Ví điện tử"],
  ["transactions", "Giao dịch"],
  ["plans-billing", "Gói & Thanh toán"],
  ["settings", "Cài đặt"],
  ["profile", "Hồ sơ"],
  ["admin", "Quản trị"],
  ["car-models", "Mẫu xe"],
  ["connector-type", "Loại cổng sạc"],
  ["create-reservation", "Tạo đặt chỗ"],
  ["subscriptions", "Gói đăng ký"],
  ["start-charging", "Bắt đầu sạc"],
  ["users", "Người dùng"],
]);

export default function HeaderBreadcrumb() {
  const pathname = usePathname();

  const paths = pathname.split("/").filter(Boolean);

  const breadcrumbItems = paths.map((segment, index) => {
    const href = "/" + paths.slice(0, index + 1).join("/");
    const isLast = index === paths.length - 1;
    const displayName =
      pathNameMap.get(segment) ||
      segment.charAt(0).toUpperCase() + segment.slice(1);

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
                  <Link href={item.href}>{item.label}</Link>
                </BreadcrumbLink>
              )}
            </BreadcrumbItem>
          </div>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
