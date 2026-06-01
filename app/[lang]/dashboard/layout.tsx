import type { Metadata } from "next";
import Link from "next/link";
import { MOCK_BUSINESS, MOCK_INQUIRIES } from "@/lib/dashboard-mock";
import { SUPPORTED_LANGS } from "@/lib/i18n";
import type { Lang } from "@/lib/types";
import MobileSidebar from "@/components/dashboard/MobileSidebar";

export const dynamic = "force-static";

export function generateStaticParams() {
  return SUPPORTED_LANGS.map((lang) => ({ lang }));
}

export const metadata: Metadata = {
  title: "Dashboard · Salaam Thailand",
  description: "Manage your verified muslim-friendly listing — inquiries, trust score, billing.",
  robots: { index: false, follow: false },
};

const NEW_INQUIRY_COUNT = MOCK_INQUIRIES.filter((i) => i.status === "new").length;
const OVER_SLA_COUNT = MOCK_INQUIRIES.filter((i) => i.status === "new" && i.sla_remaining_min < 0).length;

const NAV_ITEMS: Array<{ key: string; label: string; icon: string; href: string; badge?: string | number }> = [
  { key: "home",     label: "Overview",  icon: "▣", href: "" },
  { key: "bookings", label: "Bookings",  icon: "✦", href: "/bookings", badge: "new" },
  { key: "inbox",    label: "Inbox",     icon: "✉", href: "/inbox",    badge: NEW_INQUIRY_COUNT },
  { key: "listings", label: "Listings",  icon: "▤", href: "/listings" },
  { key: "insights", label: "Insights",  icon: "◊", href: "/insights" },
  { key: "billing",  label: "Billing",   icon: "$", href: "/billing" },
  { key: "settings", label: "Settings",  icon: "⚙", href: "/settings" },
];

const PLAN_LABEL: Record<typeof MOCK_BUSINESS.plan, { name: string; color: string }> = {
  free:     { name: "Free",     color: "bg-ink-200 text-ink-800" },
  pro:      { name: "Pro",      color: "bg-islam-600 text-white" },
  featured: { name: "Featured", color: "bg-gradient-to-br from-gold-500 to-gold-700 text-white" },
};

export default function DashboardLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { lang: Lang };
}) {
  const { lang } = params;
  const plan = PLAN_LABEL[MOCK_BUSINESS.plan];
  const base = `/${lang}/dashboard`;

  return (
    <div className="min-h-screen bg-sand-50/40 dark:bg-ink-950">
      {/* ========== TOPBAR ========== */}
      <header className="sticky top-0 z-30 border-b border-ink-150 bg-white/95 backdrop-blur dark:border-ink-800 dark:bg-ink-900/95">
        <div className="flex h-14 items-center justify-between px-4 lg:px-6">
          <div className="flex items-center gap-4">
            {/* Mobile sidebar hamburger */}
            <MobileSidebar
              base={base}
              navItems={NAV_ITEMS}
              ownerName={MOCK_BUSINESS.name}
              ownerCity={MOCK_BUSINESS.city}
              ownerNiche={MOCK_BUSINESS.niche}
              planName={plan.name}
            />
            {/* Logo */}
            <Link href={`/${lang}/`} className="flex items-center gap-2">
              <span className="grid h-7 w-7 place-items-center rounded-lg bg-gradient-to-br from-islam-700 to-islam-950 text-gold-400">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                </svg>
              </span>
              <span className="hidden font-display text-sm font-bold text-islam-950 dark:text-islam-100 sm:inline">
                Salaam Thailand
              </span>
              <span className="text-[10px] uppercase tracking-widest text-gold-700 dark:text-gold-400">
                · Dashboard
              </span>
            </Link>

            {/* Search */}
            <div className="hidden md:block">
              <input
                type="search"
                placeholder="Search inquiries, guests, dates…"
                className="h-8 w-72 rounded-md border border-ink-200 bg-ink-50 px-3 text-xs text-ink-800 placeholder:text-ink-400 focus:border-gold-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-gold-400/20 dark:border-ink-700 dark:bg-ink-800 dark:text-ink-200"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* SLA warning */}
            {OVER_SLA_COUNT > 0 && (
              <Link
                href={`${base}/inbox`}
                className="hidden items-center gap-1.5 rounded-full bg-rose-100 px-3 py-1 text-[11px] font-bold text-rose-700 sm:inline-flex dark:bg-rose-950/40 dark:text-rose-300"
              >
                ⚠ {OVER_SLA_COUNT} over SLA
              </Link>
            )}

            {/* Plan badge */}
            <span className={`hidden rounded-md px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest sm:inline-block ${plan.color}`}>
              {plan.name} plan
            </span>

            {/* Notifications */}
            <button className="relative grid h-8 w-8 place-items-center rounded-md border border-ink-200 text-ink-700 hover:bg-ink-100 dark:border-ink-700 dark:text-ink-300 dark:hover:bg-ink-800" aria-label="Notifications">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                <path d="M13.73 21a2 2 0 0 1-3.46 0" />
              </svg>
              {NEW_INQUIRY_COUNT > 0 && (
                <span className="absolute -right-1 -top-1 grid h-4 min-w-[1rem] place-items-center rounded-full bg-rose-500 px-1 text-[9px] font-bold text-white">
                  {NEW_INQUIRY_COUNT}
                </span>
              )}
            </button>

            {/* Profile */}
            <div className="flex items-center gap-2">
              <div className="grid h-8 w-8 place-items-center rounded-full bg-gradient-to-br from-gold-400 to-gold-700 text-xs font-bold text-white">
                {MOCK_BUSINESS.name.charAt(0)}
              </div>
              <div className="hidden text-right sm:block">
                <div className="text-xs font-bold text-ink-900 dark:text-ink-100">{MOCK_BUSINESS.name}</div>
                <div className="text-[10px] muted">{MOCK_BUSINESS.city} · {MOCK_BUSINESS.niche.replace("-", " ")}</div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* ========== SIDEBAR + MAIN ========== */}
      <div className="mx-auto flex max-w-7xl">
        <aside className="hidden w-56 shrink-0 border-r border-ink-150 bg-white px-3 py-6 dark:border-ink-800 dark:bg-ink-900 lg:block">
          <nav className="space-y-0.5">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.key}
                href={`${base}${item.href}`}
                className="flex items-center justify-between rounded-md px-3 py-2 text-sm font-medium text-ink-700 transition hover:bg-islam-50 hover:text-islam-900 dark:text-ink-300 dark:hover:bg-islam-950/30 dark:hover:text-islam-100"
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

          {/* Plan upsell at sidebar bottom */}
          <div className="mt-8 rounded-xl border border-gold-300/70 bg-gradient-to-br from-gold-50 to-sand-50 p-4 text-xs dark:border-gold-700/50 dark:from-gold-950/30 dark:to-ink-900/60">
            <div className="font-display text-sm font-bold text-gold-900 dark:text-gold-200">
              Featured plan
            </div>
            <p className="mt-1 leading-relaxed text-ink-700 dark:text-ink-300">
              Get top placement in your category. +3× inquiries on average.
            </p>
            <Link href={`${base}/billing`} className="mt-3 inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-gold-700 hover:text-gold-900 dark:text-gold-400">
              Upgrade · ฿1,999/mo →
            </Link>
          </div>
        </aside>

        {/* Main content */}
        <main className="min-w-0 flex-1 px-4 py-6 lg:px-8 lg:py-8">{children}</main>
      </div>

      {/* Mobile bottom nav (LG- only) */}
      <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-ink-150 bg-white/95 backdrop-blur dark:border-ink-800 dark:bg-ink-900/95 lg:hidden">
        <div className="grid grid-cols-6 gap-1 px-2 py-1.5">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.key}
              href={`${base}${item.href}`}
              className="relative flex flex-col items-center gap-0.5 rounded-md px-1 py-1.5 text-[10px] font-medium text-ink-600 transition hover:text-islam-900 dark:text-ink-400 dark:hover:text-islam-100"
            >
              <span className="font-display text-base text-gold-700 dark:text-gold-400" aria-hidden="true">{item.icon}</span>
              <span>{item.label}</span>
              {item.badge != null && Number(item.badge) > 0 && (
                <span className="absolute right-2 top-0.5 grid h-3.5 min-w-[0.875rem] place-items-center rounded-full bg-rose-500 px-1 text-[8px] font-bold text-white">
                  {item.badge}
                </span>
              )}
            </Link>
          ))}
        </div>
      </nav>
    </div>
  );
}
