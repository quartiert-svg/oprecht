"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";

const STORAGE_KEY = "oprecht_cookie_consent";

type Consent = "essential" | "all";

export function CookieBanner() {
  const t = useTranslations("cookie");
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) setVisible(true);
    } catch {
      setVisible(true);
    }
  }, []);

  function save(value: Consent) {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ value, at: new Date().toISOString() }),
      );
    } catch {
      // ignore
    }
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-label={t("title")}
      className="fixed inset-x-0 bottom-0 z-40 border-t border-stone-200 bg-white p-4 shadow-lg sm:p-5"
    >
      <div className="mx-auto flex max-w-6xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1 text-sm text-stone-700">
          <p className="font-medium text-stone-900">{t("title")}</p>
          <p>
            {t("body")}{" "}
            <Link href="/cookies" className="underline underline-offset-2">
              {t("more")}
            </Link>
          </p>
        </div>
        <div className="flex shrink-0 gap-2">
          <button
            type="button"
            onClick={() => save("essential")}
            className="rounded-full border border-stone-300 px-3 py-1.5 text-sm text-stone-800 hover:bg-stone-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-700"
          >
            {t("acceptEssential")}
          </button>
          <button
            type="button"
            onClick={() => save("all")}
            className="rounded-full bg-rose-800 px-3 py-1.5 text-sm font-medium text-white hover:bg-rose-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-700"
          >
            {t("acceptAll")}
          </button>
        </div>
      </div>
    </div>
  );
}
