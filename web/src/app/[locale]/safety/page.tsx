import { getTranslations, setRequestLocale } from "next-intl/server";
import { PageShell } from "@/components/PageShell";

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("tour.safety");
  const tips = await getTranslations("legal.safetyTips");
  return (
    <PageShell title={t("title")} lead={t("lead")} draft={t.raw("draft")}>
      <p>{t("body")}</p>
      <h2 className="pt-4 text-xl font-semibold text-stone-900">
        {tips("title")}
      </h2>
      <ul className="list-disc space-y-2 pl-5">
        <li>{tips("items.i1")}</li>
        <li>{tips("items.i2")}</li>
        <li>{tips("items.i3")}</li>
        <li>{tips("items.i4")}</li>
        <li>{tips("items.i5")}</li>
      </ul>
    </PageShell>
  );
}
