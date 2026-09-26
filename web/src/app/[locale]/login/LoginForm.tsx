"use client";

import { FormEvent, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link, useRouter } from "@/i18n/routing";

export function LoginForm() {
  const t = useTranslations("auth.login");
  const te = useTranslations("auth.errors");
  const locale = useLocale();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const fd = new FormData(e.currentTarget);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: String(fd.get("email") || ""),
          password: String(fd.get("password") || ""),
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        if (res.status === 401) setError(te("invalidCredentials"));
        else if (res.status === 429) setError(te("rateLimited"));
        else setError(data.message || te("generic"));
        return;
      }
      router.push("/");
      router.refresh();
    } catch {
      setError(te("generic"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5" noValidate>
      <h1 className="text-3xl font-semibold text-stone-900">{t("title")}</h1>
      {error && (
        <p role="alert" className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-800">
          {error}
        </p>
      )}
      <div className="space-y-1">
        <label htmlFor="email" className="text-sm font-medium text-stone-700">
          {t("email")}
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          className="w-full rounded-md border border-stone-300 px-3 py-2"
        />
      </div>
      <div className="space-y-1">
        <label htmlFor="password" className="text-sm font-medium text-stone-700">
          {t("password")}
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className="w-full rounded-md border border-stone-300 px-3 py-2"
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-full bg-rose-800 px-4 py-2.5 text-sm font-medium text-white hover:bg-rose-900 disabled:opacity-60"
      >
        {t("submit")}
      </button>
      <p className="text-sm text-stone-600">
        <Link href="/forgot-password" className="underline underline-offset-2">
          {t("forgot")}
        </Link>
      </p>
      <p className="text-sm text-stone-600">
        {t("noAccount")}{" "}
        <Link href="/register" className="font-medium text-rose-900 underline underline-offset-2">
          {t("registerLink")}
        </Link>
      </p>
      <p className="sr-only">{locale}</p>
    </form>
  );
}
