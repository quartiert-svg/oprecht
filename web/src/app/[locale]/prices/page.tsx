import { getTranslations, setRequestLocale } from "next-intl/server";
import { PageShell } from "@/components/PageShell";

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("tour.prices");

  const plans = [
    { label: t("plan1"), price: t("price1") },
    { label: t("plan3"), price: t("price3") },
    { label: t("plan12"), price: t("price12") },
  ];

  const rows: { key: string; basic: string; premium: string }[] = [
    { key: "quiz", basic: t("yes"), premium: t("yes") },
    { key: "suggestions", basic: t("blurred"), premium: t("clear") },
    { key: "likePass", basic: t("yes"), premium: t("yes") },
    { key: "daily", basic: t("capped"), premium: t("continuous") },
    { key: "photos", basic: t("no"), premium: t("yes") },
    { key: "messaging", basic: t("no"), premium: t("yes") },
    { key: "likes", basic: t("no"), premium: t("yes") },
    { key: "visitors", basic: t("no"), premium: t("yes") },
    { key: "radius", basic: t("no"), premium: t("yes") },
  ];

  return (
    <PageShell title={t("title")} lead={t("lead")} draft={t.raw("draft")}>
      <p>{t("intro")}</p>

      <h2 className="pt-4 text-xl font-semibold text-stone-900">
        {t("plansTitle")}
      </h2>
      <div className="grid gap-3 sm:grid-cols-3">
        {plans.map((p) => (
          <div
            key={p.label}
            className="rounded-xl border border-stone-200 bg-white p-4 shadow-sm"
          >
            <p className="text-sm text-stone-500">{p.label}</p>
            <p className="mt-1 text-2xl font-semibold text-rose-900">
              {p.price}
            </p>
          </div>
        ))}
      </div>

      <h2 className="pt-6 text-xl font-semibold text-stone-900">
        {t("matrixTitle")}
      </h2>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[28rem] border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-stone-200">
              <th className="py-2 pr-3 font-semibold">{t("colFeature")}</th>
              <th className="py-2 pr-3 font-semibold">{t("colBasic")}</th>
              <th className="py-2 font-semibold">{t("colPremium")}</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.key} className="border-b border-stone-100">
                <td className="py-2 pr-3">{t(`rows.${r.key}`)}</td>
                <td className="py-2 pr-3 text-stone-600">{r.basic}</td>
                <td className="py-2 text-stone-600">{r.premium}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-sm text-stone-500">{t("note")}</p>
    </PageShell>
  );
}
