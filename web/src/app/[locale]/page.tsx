import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/routing";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("home");

  return (
    <section className="mx-auto flex max-w-3xl flex-col gap-8 px-4 py-16 sm:px-6">
      <p className="text-sm font-medium uppercase tracking-wide text-rose-800">
        {t("eyebrow")}
      </p>
      <h1 className="text-4xl font-semibold tracking-tight text-stone-900 sm:text-5xl">
        {t("title")}
      </h1>
      <p className="text-lg text-stone-600">{t("lead")}</p>
      <ul className="list-disc space-y-2 pl-5 text-stone-700">
        <li>{t("points.p1")}</li>
        <li>{t("points.p2")}</li>
        <li>{t("points.p3")}</li>
      </ul>
      <div className="flex flex-wrap gap-3">
        <Link
          href="/register"
          className="rounded-full bg-rose-800 px-5 py-2.5 text-sm font-medium text-white hover:bg-rose-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-700"
        >
          {t("ctaRegister")}
        </Link>
        <Link
          href="/method"
          className="rounded-full border border-stone-300 px-5 py-2.5 text-sm font-medium text-stone-800 hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-700"
        >
          {t("ctaMethod")}
        </Link>
      </div>
    </section>
  );
}
