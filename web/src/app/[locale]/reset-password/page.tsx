import { setRequestLocale } from "next-intl/server";
import { ResetForm } from "./ResetForm";

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ token?: string }>;
}) {
  const { locale } = await params;
  const sp = await searchParams;
  setRequestLocale(locale);
  return (
    <div className="mx-auto max-w-md px-4 py-12 sm:px-6">
      <ResetForm initialToken={sp.token || ""} />
    </div>
  );
}
