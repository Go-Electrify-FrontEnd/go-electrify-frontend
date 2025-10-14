import { routing } from "@/i18n/routing";

type Locale = (typeof routing.locales)[number];

declare module "next-intl" {
  interface AppConfig {
    Locale: Locale;
  }
}

declare module "next-intl/server" {
  /**
   * Returns a translation function scoped to an optional namespace.
   * Usage: const t = await getTranslations('wallet'); t('title')
   */
  export function getTranslations(
    namespace?: string
  ): (key: string, values?: Record<string, unknown>) => string;

  /**
   * Set the request locale for the current server-side request.
   */
  export function setRequestLocale(locale?: string): void;

  /**
   * Get the current request locale.
   */
  export function getLocale(): Promise<string>;
}

export {};
