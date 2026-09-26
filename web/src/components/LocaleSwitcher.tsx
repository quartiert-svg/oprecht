"use client";

import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter, routing, type AppLocale } from "@/i18n/routing";

export function LocaleSwitcher() {
  const t = useTranslations("nav");
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  function onChange(next: string) {
    router.replace(pathname, { locale: next as AppLocale });
  }

  return (
    <label className="inline-flex items-center gap-2 text-sm text-stone-600">
      <span className="sr-only">{t("locale")}</span>
      <select
        className="rounded-md border border-stone-300 bg-white px-2 py-1.5 text-stone-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-700"
        value={locale}
        onChange={(e) => onChange(e.target.value)}
        aria-label={t("locale")}
      >
        {routing.locales.map((loc) => (
          <option key={loc} value={loc}>
            {loc.toUpperCase()}
          </option>
        ))}
      </select>
    </label>
  );
}
