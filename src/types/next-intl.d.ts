import { routing } from "@/i18n/routing";

type Locale = (typeof routing.locales)[number];

declare module "next-intl" {
  interface AppConfig {
    Locale: Locale;
  }
}

export {};
