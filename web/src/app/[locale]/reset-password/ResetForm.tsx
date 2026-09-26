"use client";

import { FormEvent, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";

export function ResetForm({ initialToken }: { initialToken: string }) {
  const t = useTranslations("auth.reset");
  const tl = useTranslations("auth.login");
  const tv = useTranslations("auth.verify");
  const te = useTranslations("auth.errors");
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const fd = new FormData(e.currentTarget);
    try {
      const res = await fetch("/api/auth/password/reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token: String(fd.get("token") || ""),
          password: String(fd.get("password") || ""),
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        if (data.code === "invalid_token") setError(t("invalid"));
        else setError(data.message || te("validation"));
        return;
      }
      setDone(true);
    } catch {
      setError(te("generic"));
    } finally {
      setLoading(false);
    }
  }

  if (done) {
    return (
      <div className="space-y-4">
        <h1 className="text-3xl font-semibold text-stone-900">{t("title")}</h1>
        <p role="status" className="text-green-800">
          {t("done")}
        </p>
        <Link href="/login" className="text-rose-900 underline">
          {tl("title")}
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <h1 className="text-3xl font-semibold text-stone-900">{t("title")}</h1>
      {error && (
        <p role="alert" className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-800">
          {error}
        </p>
      )}
      <div className="space-y-1">
        <label htmlFor="token" className="text-sm font-medium">
          {tv("token")}
        </label>
        <input
          id="token"
          name="token"
          required
          defaultValue={initialToken}
          className="w-full rounded-md border border-stone-300 px-3 py-2 font-mono text-sm"
        />
      </div>
      <div className="space-y-1">
        <label htmlFor="password" className="text-sm font-medium">
          {t("password")}
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          minLength={8}
          autoComplete="new-password"
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
    </form>
  );
}
