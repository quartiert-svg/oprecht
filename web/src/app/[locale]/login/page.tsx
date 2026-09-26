import { setRequestLocale } from "next-intl/server";
import { LoginForm } from "./LoginForm";

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <div className="mx-auto max-w-md px-4 py-12 sm:px-6">
      <LoginForm />
    </div>
  );
}
