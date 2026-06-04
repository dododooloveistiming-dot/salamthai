"use client";

import { useState } from "react";

interface Props {
  /** Where the signup is shown — sent as 'source' for analytics. */
  source: string;
  /** Current page language. */
  lang: string;
  /** Headline above the form. */
  title?: string;
  /** Sub-line under the headline. */
  description?: string;
  /** CTA button label. */
  cta?: string;
  /** Optional country dropdown. Useful for Ramadan campaign (GCC focus). */
  collectCountry?: boolean;
  /** Tone variant. */
  variant?: "default" | "gold" | "compact";
}

export default function EmailSignup({
  source,
  lang,
  title = "Get the Ramadan 2027 Thailand guide — free",
  description = "Iftar buffets, Suhoor restaurants, mosque locations, prayer rooms at airports — all cross-verified. We send one email when the guide drops.",
  cta = "Send me the guide",
  collectCountry = false,
  variant = "default",
}: Props) {
  const [email, setEmail] = useState("");
  const [country, setCountry] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "already" | "error">("idle");
  const [errMsg, setErrMsg] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (status === "loading") return;
    setStatus("loading");
    setErrMsg("");
    try {
      const r = await fetch("/api/email/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, country: country || undefined, source, lang }),
      });
      const data = await r.json();
      if (!r.ok || !data.ok) {
        setErrMsg(data.error || "Something went wrong.");
        setStatus("error");
        return;
      }
      setStatus(data.already ? "already" : "ok");
    } catch (err) {
      setErrMsg("Network error. Try again.");
      setStatus("error");
    }
  }

  if (status === "ok" || status === "already") {
    return (
      <div className={`rounded-2xl border p-6 ${variant === "gold" ? "border-gold-300 bg-gold-50 dark:border-gold-700 dark:bg-gold-950/30" : "border-emerald-300 bg-emerald-50 dark:border-emerald-700 dark:bg-emerald-950/30"}`}>
        <div className="text-2xl">✓</div>
        <h3 className="mt-2 font-display text-lg font-black text-islam-950 dark:text-islam-50">
          {status === "already" ? "Already on the list" : "You're on the list"}
        </h3>
        <p className="mt-1 text-sm muted">
          {status === "already"
            ? "We already have your email — you'll receive the guide when it ships."
            : "Check your inbox in February 2027 for the full guide. No spam, one email."}
        </p>
      </div>
    );
  }

  const wrapClass =
    variant === "gold"
      ? "rounded-2xl border border-gold-300 bg-gradient-to-br from-gold-50 via-amber-50 to-white p-6 dark:border-gold-700 dark:from-gold-950/30 dark:via-amber-950/20 dark:to-ink-900"
      : variant === "compact"
      ? "rounded-xl border border-ink-200 bg-white p-4 dark:border-ink-700 dark:bg-ink-900"
      : "rounded-2xl border border-islam-200 bg-gradient-to-br from-islam-50 via-sand-50 to-gold-50 p-6 dark:border-islam-800 dark:from-islam-950/40 dark:via-ink-900 dark:to-gold-950/30";

  return (
    <form onSubmit={onSubmit} className={wrapClass}>
      {variant !== "compact" && (
        <>
          <div className="text-[10px] uppercase tracking-widest text-gold-700 dark:text-gold-300">
            🌙 Free — no spam
          </div>
          <h3 className="mt-1 font-display text-xl font-black text-islam-950 dark:text-islam-50 sm:text-2xl">
            {title}
          </h3>
          <p className="mt-2 text-sm text-ink-700 dark:text-ink-300">{description}</p>
        </>
      )}

      <div className={`mt-4 flex flex-col gap-2 ${collectCountry ? "" : "sm:flex-row"}`}>
        <input
          type="email"
          required
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
          className="flex-1 rounded-xl border border-ink-300 bg-white px-4 py-3 text-sm focus:border-gold-500 focus:outline-none dark:border-ink-700 dark:bg-ink-900"
          aria-label="Your email address"
        />
        {collectCountry && (
          <input
            type="text"
            placeholder="Country (optional)"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            autoComplete="country-name"
            className="rounded-xl border border-ink-300 bg-white px-4 py-3 text-sm focus:border-gold-500 focus:outline-none dark:border-ink-700 dark:bg-ink-900"
            aria-label="Your country (optional)"
          />
        )}
        <button
          type="submit"
          disabled={status === "loading"}
          className="rounded-xl bg-islam-900 px-6 py-3 text-sm font-bold text-white transition hover:bg-islam-800 disabled:opacity-60 dark:bg-islam-700"
        >
          {status === "loading" ? "..." : cta}
        </button>
      </div>

      {status === "error" && (
        <p className="mt-2 text-xs font-bold text-rose-600 dark:text-rose-400">⚠ {errMsg}</p>
      )}
      <p className="mt-3 text-[11px] muted">
        Editorial. Independent. No paid promotion. Unsubscribe anytime.
      </p>
    </form>
  );
}
