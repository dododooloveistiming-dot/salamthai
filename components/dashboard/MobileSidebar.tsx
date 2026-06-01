"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

interface NavItem {
  key: string;
  label: string;
  icon: string;
  href: string;
  badge?: string | number;
}

export default function MobileSidebar({
  base,
  navItems,
  ownerName,
  ownerCity,
  ownerNiche,
  planName,
}: {
  base: string;
  navItems: NavItem[];
  ownerName: string;
  ownerCity: string;
  ownerNiche: string;
  planName: string;
}) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        onClick={() => setOpen(true)}
        className="grid h-8 w-8 place-items-center rounded-md border border-ink-200 text-ink-700 hover:bg-ink-100 lg:hidden dark:border-ink-700 dark:text-ink-300 dark:hover:bg-ink-800"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M3 6h18M3 12h18M3 18h18" />
        </svg>
      </button>

      {open && (
        <>
          <div
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm lg:hidden"
            onClick={() => setOpen(false)}
            aria-hidden="true"
          />
          <aside
            className="fixed inset-y-0 left-0 z-50 w-72 overflow-y-auto bg-white shadow-2xl lg:hidden dark:bg-ink-900"
            aria-label="Dashboard navigation"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-ink-100 px-5 py-4 dark:border-ink-800">
              <div className="flex items-center gap-2">
                <span className="grid h-7 w-7 place-items-center rounded-lg bg-gradient-to-br from-islam-700 to-islam-950 text-gold-400">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                  </svg>
                </span>
                <span className="font-display text-sm font-bold text-islam-950 dark:text-islam-100">Salaam</span>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="grid h-8 w-8 place-items-center rounded-md text-ink-700 hover:bg-ink-100 dark:text-ink-300 dark:hover:bg-ink-800"
                aria-label="Close menu"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M6 6l12 12M6 18L18 6" />
                </svg>
              </button>
            </div>

            {/* Profile */}
            <div className="border-b border-ink-100 px-5 py-4 dark:border-ink-800">
              <div className="flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br from-gold-400 to-gold-700 text-sm font-bold text-white">
                  {ownerName.charAt(0)}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-bold text-islam-950 dark:text-islam-50">{ownerName}</div>
                  <div className="truncate text-[10px] muted">{ownerCity} · {ownerNiche.replace("-", " ")}</div>
                </div>
                <span className="rounded-md bg-islam-600 px-2 py-0.5 text-[9px] font-bold uppercase text-white">
                  {planName}
                </span>
              </div>
            </div>

            {/* Nav */}
            <nav className="space-y-0.5 p-3">
              {navItems.map((item) => (
                <Link
                  key={item.key}
                  href={`${base}${item.href}`}
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-between rounded-md px-3 py-3 text-sm font-medium text-ink-700 transition hover:bg-islam-50 hover:text-islam-900 dark:text-ink-300 dark:hover:bg-islam-950/30 dark:hover:text-islam-100"
                >
                  <span className="flex items-center gap-3">
                    <span className="font-display text-base text-gold-700 dark:text-gold-400" aria-hidden="true">{item.icon}</span>
                    <span>{item.label}</span>
                  </span>
                  {item.badge != null && Number(item.badge) > 0 && (
                    <span className="rounded-md bg-rose-100 px-1.5 py-0.5 text-[10px] font-bold text-rose-700 dark:bg-rose-950/40 dark:text-rose-300">
                      {item.badge}
                    </span>
                  )}
                </Link>
              ))}
            </nav>

            {/* Featured upsell */}
            <div className="m-3 rounded-xl border border-gold-300/70 bg-gradient-to-br from-gold-50 to-sand-50 p-4 text-xs dark:border-gold-700/50 dark:from-gold-950/30 dark:to-ink-900/60">
              <div className="font-display text-sm font-bold text-gold-900 dark:text-gold-200">
                Featured plan
              </div>
              <p className="mt-1 leading-relaxed text-ink-700 dark:text-ink-300">
                Top placement in your category. +3× inquiries average.
              </p>
              <Link
                href={`${base}/billing`}
                onClick={() => setOpen(false)}
                className="mt-3 inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-gold-700 hover:text-gold-900 dark:text-gold-400"
              >
                Upgrade · ฿1,999/mo →
              </Link>
            </div>
          </aside>
        </>
      )}
    </>
  );
}
