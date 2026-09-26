"use client";

import { FormEvent, useState } from "react";
import { useTranslations } from "next-intl";
import { Link, useRouter } from "@/i18n/routing";
import { isAdultClient } from "@/lib/client-age";

export function RegisterForm({ locale }: { locale: string }) {
  const t = useTranslations("auth.register");
  const te = useTranslations("auth.errors");
  const tf = useTranslations("footer");
  const router = useRouter();
  const [step, setStep] = useState<"age" | "form">("age");
  const [dob, setDob] = useState("");
  const [ageError, setAgeError] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function onAgeContinue(e: FormEvent) {
    e.preventDefault();
    setAgeError(null);
    if (!isAdultClient(dob)) {
      setAgeError(t("underage"));
      return;
    }
    setStep("form");
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);
    const fd = new FormData(e.currentTarget);
    const body = {
      email: String(fd.get("email") || ""),
      password: String(fd.get("password") || ""),
      gender: String(fd.get("gender") || ""),
      genderSought: String(fd.get("genderSought") || ""),
      dateOfBirth: dob,
      locale,
      consents: {
        terms: fd.get("terms") === "on",
        privacy: fd.get("privacy") === "on",
        marketing: fd.get("marketing") === "on",
      },
    };
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        if (res.status === 409) setError(te("emailTaken"));
        else if (data.code === "underage") setError(te("underage"));
        else if (res.status === 429) setError(te("rateLimited"));
        else if (res.status === 400) setError(data.message || te("validation"));
        else setError(te("generic"));
        return;
      }
      setSuccess(t("success"));
      router.push("/verify-email");
      router.refresh();
    } catch {
      setError(te("generic"));
    } finally {
      setLoading(false);
    }
  }

  if (step === "age") {
    return (
      <form onSubmit={onAgeContinue} className="space-y-5">
        <h1 className="text-3xl font-semibold text-stone-900">{t("ageTitle")}</h1>
        <p className="text-stone-600">{t("ageLead")}</p>
        {ageError && (
          <p role="alert" className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-800">
            {ageError}
          </p>
        )}
        <div className="space-y-1">
          <label htmlFor="dob" className="text-sm font-medium text-stone-700">
            {t("dob")}
          </label>
          <input
            id="dob"
            type="date"
            required
            value={dob}
            onChange={(e) => setDob(e.target.value)}
            className="w-full rounded-md border border-stone-300 px-3 py-2"
          />
        </div>
        <button
          type="submit"
          className="w-full rounded-full bg-rose-800 px-4 py-2.5 text-sm font-medium text-white hover:bg-rose-900"
        >
          {t("continue")}
        </button>
        <p className="text-sm text-stone-600">
          {t("haveAccount")}{" "}
          <Link href="/login" className="font-medium text-rose-900 underline underline-offset-2">
            {t("loginLink")}
          </Link>
        </p>
      </form>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <h1 className="text-3xl font-semibold text-stone-900">{t("title")}</h1>
      <p className="text-sm text-stone-500">
        {t("dob")}: <time dateTime={dob}>{dob}</time>
      </p>
      {error && (
        <p role="alert" className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-800">
          {error}
        </p>
      )}
      {success && (
        <p role="status" className="rounded-md bg-green-50 px-3 py-2 text-sm text-green-800">
          {success}
        </p>
      )}
      <div className="space-y-1">
        <label htmlFor="email" className="text-sm font-medium">
          {t("email")}
        </label>
        <input id="email" name="email" type="email" required autoComplete="email" className="w-full rounded-md border border-stone-300 px-3 py-2" />
      </div>
      <div className="space-y-1">
        <label htmlFor="password" className="text-sm font-medium">
          {t("password")}
        </label>
        <input id="password" name="password" type="password" required minLength={8} autoComplete="new-password" className="w-full rounded-md border border-stone-300 px-3 py-2" />
        <p className="text-xs text-stone-500">{t("passwordHint")}</p>
      </div>
      <div className="space-y-1">
        <label htmlFor="gender" className="text-sm font-medium">
          {t("gender")}
        </label>
        <select id="gender" name="gender" required className="w-full rounded-md border border-stone-300 px-3 py-2">
          <option value="woman">{t("genderWoman")}</option>
          <option value="man">{t("genderMan")}</option>
          <option value="other">{t("genderOther")}</option>
        </select>
      </div>
      <div className="space-y-1">
        <label htmlFor="genderSought" className="text-sm font-medium">
          {t("genderSought")}
        </label>
        <select id="genderSought" name="genderSought" required className="w-full rounded-md border border-stone-300 px-3 py-2">
          <option value="women">{t("soughtWomen")}</option>
          <option value="men">{t("soughtMen")}</option>
          <option value="everyone">{t("soughtEveryone")}</option>
        </select>
      </div>
      <label className="flex items-start gap-2 text-sm">
        <input type="checkbox" name="terms" required className="mt-1" />
        <span>
          {t("terms")} (
          <Link href="/terms" className="underline">
            {tf("terms")}
          </Link>
          )
        </span>
      </label>
      <label className="flex items-start gap-2 text-sm">
        <input type="checkbox" name="privacy" required className="mt-1" />
        <span>
          {t("privacy")} (
          <Link href="/privacy" className="underline">
            {tf("privacy")}
          </Link>
          )
        </span>
      </label>
      <label className="flex items-start gap-2 text-sm">
        <input type="checkbox" name="marketing" className="mt-1" />
        <span>{t("marketing")}</span>
      </label>
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
