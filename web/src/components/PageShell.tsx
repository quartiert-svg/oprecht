import { getTranslations } from "next-intl/server";

export async function PageShell({
  title,
  lead,
  children,
  draft = false,
}: {
  title: string;
  lead?: string;
  children: React.ReactNode;
  draft?: boolean;
}) {
  const t = await getTranslations("common");
  return (
    <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <header className="mb-8 space-y-3">
        {draft && (
          <span className="inline-block rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-900">
            {t("draftBadge")}
          </span>
        )}
        <h1 className="text-3xl font-semibold tracking-tight text-stone-900 sm:text-4xl">
          {title}
        </h1>
        {lead && <p className="text-lg text-stone-600">{lead}</p>}
      </header>
      <div className="space-y-4 text-stone-700 leading-relaxed">{children}</div>
    </article>
  );
}
