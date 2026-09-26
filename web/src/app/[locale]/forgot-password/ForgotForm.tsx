"use client";

import { FormEvent, useState } from "react";
import { useTranslations } from "next-intl";

export function ForgotForm() {
  const t = useTranslations("auth.forgot");
  const tl = useTranslations("auth.login");
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
      const res = await fetch("/api/auth/password/forgot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: String(fd.get("email") || "") }),
      });
      if (!res.ok && res.status !== 204) {
        setError(te("generic"));
        return;
      }
      setDone(true);
    } catch {
      setError(te("generic"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <h1 className="text-3xl font-semibold text-stone-900">{t("title")}</h1>
      <p className="text-stone-600">{t("lead")}</p>
      {error && (
        <p role="alert" className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-800">
          {error}
        </p>
      )}
      {done && (
        <p role="status" className="rounded-md bg-green-50 px-3 py-2 text-sm text-green-800">
          {t("done")}
        </p>
      )}
      <div className="space-y-1">
        <label htmlFor="email" className="text-sm font-medium">
          {tl("email")}
        </label>
        <input
          id="email"
          name="email"
          type="email"
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
    </form>
  );
}
