import { getTranslations, setRequestLocale } from "next-intl/server";
import { PageShell } from "@/components/PageShell";

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("tour.faq");
  const items = ["1", "2", "3", "4", "5"] as const;
  return (
    <PageShell title={t("title")} draft={t.raw("draft")}>
      <dl className="space-y-6">
        {items.map((n) => (
          <div key={n}>
            <dt className="font-semibold text-stone-900">
              {t(`items.q${n}`)}
            </dt>
            <dd className="mt-1 text-stone-700">{t(`items.a${n}`)}</dd>
          </div>
        ))}
      </dl>
    </PageShell>
  );
}
