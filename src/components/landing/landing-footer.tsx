"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";

type FooterColumn = {
  title: string;
  links: Array<{ label: string; href: string }>;
};

export default function LandingFooter() {
  const footer = useTranslations("landing.footer");
  const columns = footer.raw("columns") as FooterColumn[];

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
              {footer("tagline")}
            </p>
          </div>
          {columns.map((column) => (
            <div key={column.title}>
              <h4 className="text-foreground mb-4 text-sm font-semibold">
                {column.title}
              </h4>
              <ul className="text-muted-foreground space-y-3 text-sm">
                {column.links.map((link) => (
                  <li key={`${column.title}-${link.label}`}>
                    <a
                      href={link.href}
                      className="hover:text-foreground transition-colors"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </motion.div>
        <div className="border-border/50 text-muted-foreground mt-12 border-t pt-8 text-center text-sm">
          <p>{footer("copyright")}</p>
        </div>
      </div>
    </footer>
  );
}
