"use client";

import { FormEvent, useState } from "react";
import { useTranslations } from "next-intl";

export function VerifyForm({ initialToken }: { initialToken: string }) {
  const t = useTranslations("auth.verify");
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
      const res = await fetch("/api/auth/email/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: String(fd.get("token") || "") }),
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
        <label htmlFor="token" className="text-sm font-medium">
          {t("token")}
        </label>
        <input
          id="token"
          name="token"
          required
          defaultValue={initialToken}
          className="w-full rounded-md border border-stone-300 px-3 py-2 font-mono text-sm"
        />
      </div>
      <button
        type="submit"
        disabled={loading || done}
        className="w-full rounded-full bg-rose-800 px-4 py-2.5 text-sm font-medium text-white hover:bg-rose-900 disabled:opacity-60"
      >
        {t("submit")}
      </button>
    </form>
  );
}
