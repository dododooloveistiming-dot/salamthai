"use client";
import { useEffect, useState } from "react";

// Client-side admin password gate. Stops casual access (URL-typing tourists,
// curious users) but not a determined attacker — the password is inlined in
// the build output (NEXT_PUBLIC_*). When we wire up a real DB, swap this for
// Auth.js with an admin role + email allowlist.
//
// Set the password in Vercel:
//   Settings → Environment Variables
//   Name:  NEXT_PUBLIC_ADMIN_PW
//   Value: <your choice>
//   Scope: Production + Preview
// Then redeploy.

const STORAGE_KEY = "salaam-admin-ok";
const TTL_HOURS = 24;
const FALLBACK_PW = "Wecandoit6^";

export default function AdminGate({ children }: { children: React.ReactNode }) {
  const [ok, setOk] = useState(false);
  const [ready, setReady] = useState(false);
  const [input, setInput] = useState("");
  const [err, setErr] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const ts = Number(raw);
        if (Number.isFinite(ts) && Date.now() - ts < TTL_HOURS * 3600 * 1000) {
          setOk(true);
        } else {
          localStorage.removeItem(STORAGE_KEY);
        }
      }
    } catch {}
    setReady(true);
  }, []);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const expected = process.env.NEXT_PUBLIC_ADMIN_PW || FALLBACK_PW;
    if (input === expected) {
      try { localStorage.setItem(STORAGE_KEY, String(Date.now())); } catch {}
      setOk(true);
      setErr(false);
    } else {
      setErr(true);
      setInput("");
    }
  }

  function logout() {
    try { localStorage.removeItem(STORAGE_KEY); } catch {}
    setOk(false);
    setInput("");
  }

  if (!ready) return null;

  if (!ok) {
    return (
      <div className="min-h-screen bg-islam-950 text-white">
        <div className="bg-islamic-stars absolute inset-0 opacity-[0.06]" aria-hidden="true" />
        <div className="relative mx-auto flex min-h-screen max-w-md flex-col items-center justify-center px-6">
          <div className="mb-6 grid h-16 w-16 place-items-center rounded-2xl bg-gradient-to-br from-islam-700 to-islam-950 text-gold-400 shadow-lg ring-1 ring-gold-500/30">
            <span className="text-3xl">🔒</span>
          </div>
          <div className="eyebrow mb-2 text-gold-300/90">Restricted</div>
          <h1 className="h-display text-3xl text-white sm:text-4xl">
            Operator login
          </h1>
          <p className="mt-2 text-center text-sm text-white/70">
            Enter the admin password to manage claims, payments, and listings.
          </p>

          <form onSubmit={submit} className="mt-8 w-full">
            <label htmlFor="admin-pw" className="sr-only">Password</label>
            <input
              id="admin-pw"
              type="password"
              value={input}
              onChange={(e) => { setInput(e.target.value); setErr(false); }}
              autoFocus
              autoComplete="current-password"
              placeholder="Password"
              className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3.5 text-base text-white placeholder-white/40 backdrop-blur outline-none ring-gold-400/40 transition focus:border-gold-400/60 focus:ring-2"
            />
            {err && (
              <p className="mt-3 text-sm text-rose-300">✕ Wrong password. Try again.</p>
            )}
            <button
              type="submit"
              disabled={input.length === 0}
              className="mt-4 w-full rounded-xl bg-gradient-to-br from-gold-500 to-gold-700 px-4 py-3.5 text-sm font-bold text-islam-950 shadow-md transition hover:from-gold-400 hover:to-gold-600 disabled:opacity-40"
            >
              Unlock admin →
            </button>
          </form>

          <p className="mt-8 text-center text-[11px] uppercase tracking-widest text-white/40">
            All admin actions are logged
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={logout}
        className="fixed bottom-4 right-4 z-50 rounded-full bg-white px-3 py-1.5 text-xs font-bold text-rose-700 shadow-lg ring-1 ring-rose-200 hover:bg-rose-50 dark:bg-ink-900 dark:text-rose-300 dark:ring-rose-700/40"
        title="Lock admin (clears session)"
      >
        🔓 Logout
      </button>
      {children}
    </div>
  );
}
