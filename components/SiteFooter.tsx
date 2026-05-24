import { SITE, t } from "@/lib/i18n";
import type { Lang } from "@/lib/types";

export default function SiteFooter({ lang }: { lang: Lang }) {
  return (
    <footer className="relative mt-20 border-t border-islam-200 bg-gradient-to-b from-islam-50 to-white dark:border-islam-800/60 dark:from-islam-950/40 dark:to-ink-900">
      {/* Subtle Islamic pattern overlay */}
      <div className="bg-islamic-stars pointer-events-none absolute inset-0 opacity-30" aria-hidden="true" />

      {/* Mosque silhouette skyline */}
      <div className="relative -mt-px overflow-hidden" aria-hidden="true">
        <svg viewBox="0 0 1200 80" preserveAspectRatio="none" className="block h-12 w-full text-islam-200 dark:text-islam-800/60 sm:h-16">
          <path
            fill="currentColor"
            d="M0 80 V60 H80 V40 Q80 28 90 28 Q100 28 100 40 V60 H140 V50 Q140 35 155 35 Q170 35 170 50 V60 H190 L195 40 L200 60 H230 V35 Q230 18 250 18 Q270 18 270 35 V60 H300 V45 Q300 32 312 32 Q324 32 324 45 V60 H360 L368 30 L376 60 H410 V55 Q410 40 430 40 Q450 40 450 55 V60 H490 V35 Q490 20 510 20 Q530 20 530 35 V60 H560 V45 Q560 32 575 32 Q590 32 590 45 V60 H630 L640 25 L650 60 H700 V55 Q700 38 725 38 Q750 38 750 55 V60 H790 V40 Q790 25 808 25 Q826 25 826 40 V60 H870 V50 Q870 36 885 36 Q900 36 900 50 V60 H950 L960 30 L970 60 H1010 V42 Q1010 26 1030 26 Q1050 26 1050 42 V60 H1100 V50 Q1100 38 1115 38 Q1130 38 1130 50 V60 H1200 V80 Z"
          />
          {/* Crescent + small star */}
          <g transform="translate(640 18)">
            <path d="M0 0 a8 8 0 1 0 6 -6 a5.5 5.5 0 0 1 -6 6 z" fill="currentColor" opacity="0.7" />
          </g>
        </svg>
      </div>

      <div className="relative mx-auto max-w-6xl px-4 py-10 text-sm text-ink-700 dark:text-ink-300">
        {/* From our family — sibling sites */}
        <div className="mb-8">
          <div className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-islam-900 dark:text-islam-200">
            <span className="font-arabic text-base" dir="rtl" lang="ar">السلام</span>
            <span>From our family</span>
          </div>
          <div className="grid gap-3 text-xs sm:grid-cols-3">
            <a
              href={SITE.origin}
              className="block rounded-xl border-2 border-islam-300 bg-white p-3 transition hover:border-gold-400 dark:border-islam-700 dark:bg-ink-900"
            >
              <div className="font-bold text-islam-900 dark:text-islam-100">☪ Salaam Thailand</div>
              <div className="mt-1 leading-snug">
                Halal restaurants · muslim hotels · halal tours · mosques · clinics · beauty.
              </div>
              <div className="mt-1 text-[10px] uppercase tracking-wide text-gold-700 dark:text-gold-400">
                You are here
              </div>
            </a>
            <a
              href="https://verifiedthai.com"
              target="_blank"
              rel="noopener"
              className="block rounded-xl border border-ink-200 bg-white p-3 transition hover:border-emerald-400 dark:border-ink-700 dark:bg-ink-900"
            >
              <div className="font-bold text-ink-900 dark:text-ink-100">✅ Verified Thai</div>
              <div className="mt-1 leading-snug">
                Yoga · spa · muay thai · diving · cooking · coworking · wellness directory.
              </div>
            </a>
            <a
              href="https://thailandgolfguide.com"
              target="_blank"
              rel="noopener"
              className="block rounded-xl border border-ink-200 bg-white p-3 transition hover:border-emerald-400 dark:border-ink-700 dark:bg-ink-900"
            >
              <div className="font-bold text-ink-900 dark:text-ink-100">⛳ Thailand Golf Guide</div>
              <div className="mt-1 leading-snug">
                Independent reviews of Thai golf courses — booking, caddy, package deals.
              </div>
            </a>
          </div>
        </div>

        {/* About / legal */}
        <div className="border-t border-islam-200/70 pt-6 dark:border-islam-800/60">
          <p className="max-w-3xl text-xs leading-relaxed">
            {t("footer_blurb", lang)}
          </p>
          <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-xs">
            <div>
              © {new Date().getFullYear()} <span className="font-bold text-islam-800 dark:text-islam-200">{SITE.name}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-arabic text-sm text-islam-700 dark:text-islam-400" dir="rtl" lang="ar">
                وَعَلَيْكُمُ ٱلسَّلَام
              </span>
              <span className="text-[10px] muted">Wa ʿalaykum as-salaam</span>
            </div>
          </div>
          <div className="mt-2 text-xs muted">
            Sources: Google · Reddit · Naver · Pantip · YouTube · Bookimed · Official sites
          </div>
        </div>
      </div>
    </footer>
  );
}
