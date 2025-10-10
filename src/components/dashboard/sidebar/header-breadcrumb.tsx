"use client";

import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Link } from "@/i18n/navigation";

export default function HeaderBreadcrumb() {
  const pathname = usePathname();
  const t = useTranslations("navigation");

  // Skip the language segment (locale prefix)
  let normalizedPath = pathname;
  if (pathname.startsWith("/en/")) {
    normalizedPath = pathname.slice(4);
  } else if (pathname.startsWith("/vi/")) {
    normalizedPath = pathname.slice(4);
  }

  const paths = normalizedPath.split("/");

  const breadcrumbItems = paths.map((segment, index) => {
    const href = "/" + paths.slice(0, index + 1).join("/");
    const isLast = index === paths.length - 1;
    const displayName =
      t(segment) || segment.charAt(0).toUpperCase() + segment.slice(1);

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
