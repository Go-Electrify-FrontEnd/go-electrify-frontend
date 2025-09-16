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
  ["dashboard", "Your Dashboard"],
  ["find-stations", "Find Stations"],
  ["reservations", "Reservations"],
  ["charging-history", "Charging History"],
  ["wallet", "Wallet"],
  ["transactions", "Transactions"],
  ["plans-billing", "Plans & Billing"],
  ["settings", "Settings"],
  ["profile", "Profile"],
]);

export default function HeaderBreadcrumb() {
  const pathname = usePathname();

  const paths = pathname.split("/").filter(Boolean);

  // Create breadcrumb items
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

  // Don't show breadcrumb only if we're at true root ("/")
  if (breadcrumbItems.length === 0) {
    return null;
  }

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
