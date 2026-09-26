import { getTranslations, setRequestLocale } from "next-intl/server";
import { PageShell } from "@/components/PageShell";
import { LEGAL_VERSIONS } from "@/lib/legal";

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("legal.privacy");
  return (
    <PageShell title={t("title")} draft>
      <p className="text-sm text-stone-500">
        {t("version", { version: LEGAL_VERSIONS.privacy })}
      </p>
      <p>{t("body")}</p>
    </PageShell>
  );
}
