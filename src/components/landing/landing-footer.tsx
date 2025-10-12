"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export default function LandingFooter() {
  const t = useTranslations("landing.footer");
  return (
    <footer className="border-border bg-background border-t">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <p className="text-muted-foreground text-sm">
            © {new Date().getFullYear()} GoElectrify. {t("rightsReserved")}
          </p>
          <nav className="flex gap-6">
            <Link
              href="/about"
              className="text-muted-foreground hover:text-foreground text-sm transition-colors"
            >
              {t("about")}
            </Link>
            <Link
              href="/privacy"
              className="text-muted-foreground hover:text-foreground text-sm transition-colors"
            >
              {t("privacy")}
            </Link>
            <Link
              href="/terms"
              className="text-muted-foreground hover:text-foreground text-sm transition-colors"
            >
              Terms
            </Link>
            <Link
              href="/contact"
              className="text-muted-foreground hover:text-foreground text-sm transition-colors"
            >
              {t("contact")}
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
