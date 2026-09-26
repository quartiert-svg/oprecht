import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/routing";

export async function Footer() {
  const t = await getTranslations("footer");
  const year = new Date().getFullYear();

  const links = [
    { href: "/about", label: t("about") },
    { href: "/terms", label: t("terms") },
    { href: "/privacy", label: t("privacy") },
    { href: "/help", label: t("help") },
    { href: "/prices", label: t("prices") },
    { href: "/safety", label: t("safety") },
    { href: "/cookies", label: t("cookies") },
  ] as const;

  return (
    <footer className="mt-auto border-t border-stone-200 bg-stone-50">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-8 sm:px-6">
        <nav aria-label="Footer">
          <ul className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-stone-600">
            {links.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className="hover:text-stone-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-700"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <p className="text-sm text-stone-500">{t("note")}</p>
        <p className="text-xs text-stone-400">{t("rights", { year })}</p>
      </div>
    </footer>
  );
}
