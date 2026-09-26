import { getTranslations, setRequestLocale } from "next-intl/server";
import { PageShell } from "@/components/PageShell";

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("tour.youAndDating");
  return (
    <PageShell title={t("title")} lead={t("lead")} draft={t.raw("draft")}>
      <p>{t("body")}</p>
    </PageShell>
  );
}
