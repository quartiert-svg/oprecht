import { setRequestLocale } from "next-intl/server";
import { ForgotForm } from "./ForgotForm";

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <div className="mx-auto max-w-md px-4 py-12 sm:px-6">
      <ForgotForm />
    </div>
  );
}
