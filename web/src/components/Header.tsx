"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { LocaleSwitcher } from "./LocaleSwitcher";

const tourLinks = [
  { href: "/you-and-dating", key: "youAndDating" as const },
  { href: "/method", key: "method" as const },
  { href: "/safety", key: "safety" as const },
  { href: "/service", key: "service" as const },
  { href: "/prices", key: "prices" as const },
  { href: "/faq", key: "faq" as const },
];

export function Header() {
  const t = useTranslations("nav");
  const brand = useTranslations("brand");
  const [open, setOpen] = useState(false);

  return (
    <header className="border-b border-stone-200 bg-white/90 backdrop-blur">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-rose-800 focus:px-3 focus:py-2 focus:text-white"
      >
        {t("skipToContent")}
      </a>
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Link
          href="/"
          className="text-lg font-semibold tracking-tight text-rose-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-700"
        >
          {brand("name")}
        </Link>

        <nav
          className="hidden items-center gap-4 lg:flex"
          aria-label="Primary"
        >
          {tourLinks.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm text-stone-600 hover:text-stone-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-700"
            >
              {t(item.key)}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <LocaleSwitcher />
          <Link
            href="/login"
            className="hidden text-sm font-medium text-stone-700 sm:inline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-700"
          >
            {t("login")}
          </Link>
          <Link
            href="/register"
            className="rounded-full bg-rose-800 px-3 py-1.5 text-sm font-medium text-white hover:bg-rose-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-700"
          >
            {t("register")}
          </Link>
          <button
            type="button"
            className="inline-flex rounded-md border border-stone-300 px-2 py-1 text-sm lg:hidden focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-700"
            aria-expanded={open}
            aria-controls="mobile-nav"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? t("closeMenu") : t("openMenu")}
          </button>
        </div>
      </div>

      {open && (
        <nav
          id="mobile-nav"
          className="border-t border-stone-200 px-4 py-3 lg:hidden"
          aria-label="Mobile"
        >
          <ul className="flex flex-col gap-2">
            {tourLinks.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="block rounded-md px-2 py-2 text-stone-700 hover:bg-stone-50"
                  onClick={() => setOpen(false)}
                >
                  {t(item.key)}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href="/login"
                className="block rounded-md px-2 py-2 text-stone-700 hover:bg-stone-50 sm:hidden"
                onClick={() => setOpen(false)}
              >
                {t("login")}
              </Link>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}
