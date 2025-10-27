"use client";

import Link from "next/link";

export default function LandingFooter() {
  return (
    <footer className="border-border bg-background border-t">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <p className="text-muted-foreground text-sm">
            © {new Date().getFullYear()} GoElectrify. Bản quyền thuộc về
            GoElectrify.
          </p>
          <nav className="flex gap-6">
            <Link
              prefetch={false}
              href="/about"
              className="text-muted-foreground hover:text-foreground text-sm transition-colors"
            >
              Về chúng tôi
            </Link>
            <Link
              prefetch={false}
              href="/privacy"
              className="text-muted-foreground hover:text-foreground text-sm transition-colors"
            >
              Chính sách bảo mật
            </Link>
            <Link
              prefetch={false}
              href="/terms"
              className="text-muted-foreground hover:text-foreground text-sm transition-colors"
            >
              Điều khoản
            </Link>
            <Link
              prefetch={false}
              href="/contact"
              className="text-muted-foreground hover:text-foreground text-sm transition-colors"
            >
              Liên hệ
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
