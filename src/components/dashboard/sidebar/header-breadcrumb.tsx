"use client";

import { usePathname } from "next/navigation";
// translations removed, using static mapping for breadcrumb labels
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import Link from "next/link";

export default function HeaderBreadcrumb() {
  const pathname = usePathname();
  console.log("Current pathname:" + pathname);
  const paths = pathname.split("/").filter((seg) => seg.length > 0);

  const segmentMap: Record<string, string> = {
    dashboard: "Tổng quan",
    "stations-nearby": "Trạm gần đây",
    wallet: "Ví",
    reservations: "Đặt chỗ",
    admin: "Quản trị",
    subscriptions: "Gói đăng ký",
    "vehicle-models": "Mẫu xe",
  };

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
