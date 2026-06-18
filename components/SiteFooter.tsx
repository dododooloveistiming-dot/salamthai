import { SITE, t } from "@/lib/i18n";
import type { Lang, Niche } from "@/lib/types";

const NICHE_PILLS: Array<{ slug: Niche; label: string }> = [
  { slug: "halal-food",   label: "🥘 Halal Food" },
  { slug: "muslim-hotel", label: "🏨 Muslim Hotels" },
  { slug: "halal-tour",   label: "✈️ Halal Tours" },
  { slug: "mosque",       label: "🕌 Mosques" },
  { slug: "halal-clinic", label: "🏥 Clinics" },
  { slug: "halal-beauty", label: "💄 Beauty" },
];

export default function SiteFooter({ lang, byNiche }: { lang: Lang; byNiche?: Record<Niche, number> }) {
  const visiblePills = byNiche
    ? NICHE_PILLS.filter((p) => (byNiche[p.slug] ?? 0) > 0)
    : NICHE_PILLS;
  return (
    <footer className="relative mt-20 border-t border-islam-200 bg-gradient-to-b from-islam-50 to-white dark:border-islam-800/60 dark:from-islam-950/40 dark:to-ink-900">
      {/* Subtle Islamic pattern overlay */}
      <div className="bg-islamic-stars pointer-events-none absolute inset-0 opacity-30" aria-hidden="true" />

      {/* Mosque skyline silhouette */}
      <div className="relative -mt-px overflow-hidden" aria-hidden="true">
        <svg viewBox="0 0 1200 80" preserveAspectRatio="none" className="block h-12 w-full text-islam-200 dark:text-islam-800/60 sm:h-16">
          <path
            fill="currentColor"
            d="M0 80 V60 H80 V40 Q80 28 90 28 Q100 28 100 40 V60 H140 V50 Q140 35 155 35 Q170 35 170 50 V60 H190 L195 40 L200 60 H230 V35 Q230 18 250 18 Q270 18 270 35 V60 H300 V45 Q300 32 312 32 Q324 32 324 45 V60 H360 L368 30 L376 60 H410 V55 Q410 40 430 40 Q450 40 450 55 V60 H490 V35 Q490 20 510 20 Q530 20 530 35 V60 H560 V45 Q560 32 575 32 Q590 32 590 45 V60 H630 L640 25 L650 60 H700 V55 Q700 38 725 38 Q750 38 750 55 V60 H790 V40 Q790 25 808 25 Q826 25 826 40 V60 H870 V50 Q870 36 885 36 Q900 36 900 50 V60 H950 L960 30 L970 60 H1010 V42 Q1010 26 1030 26 Q1050 26 1050 42 V60 H1100 V50 Q1100 38 1115 38 Q1130 38 1130 50 V60 H1200 V80 Z"
          />
        </svg>
      </div>

      <div className="relative mx-auto max-w-6xl px-4 py-12 text-sm text-ink-700 dark:text-ink-300">
        {/* Brand block — standalone Salaam Thailand identity */}
        <div className="mb-8 flex flex-col items-center text-center">
          <div className="mb-3 grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-islam-600 to-islam-800 text-white shadow-md">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
            </svg>
          </div>
          <div className="text-xl font-black tracking-tight text-islam-900 dark:text-islam-100">
            {SITE.name}
          </div>
          <p className="mt-2 max-w-md text-xs leading-relaxed muted">
            {t("footer_blurb", lang).replace("{site}", SITE.name)}
          </p>
        </div>

        {/* Niche links — only categories with data */}
        {visiblePills.length > 0 && (
          <div className="mb-8 flex flex-wrap items-center justify-center gap-2 text-xs">
            {visiblePills.map((p) => (
              <a
                key={p.slug}
                href={`/${lang}/c/${p.slug}/`}
                className="rounded-full border border-islam-200 px-3 py-1 hover:border-gold-400 hover:bg-gold-50 dark:border-islam-700 dark:hover:bg-gold-950/40"
              >
                {p.label}
              </a>
            ))}
          </div>
        )}

        {/* About / Why us / Search nav */}
        <div className="mb-8 flex flex-wrap items-center justify-center gap-4 text-xs">
          <a href={`/${lang}/search/`} className="link-gold font-semibold text-islam-800 dark:text-islam-200">🔍 Search</a>
          <span className="text-ink-300 dark:text-ink-700">·</span>
          <a href={`/${lang}/why-us/`} className="link-gold font-semibold text-islam-800 dark:text-islam-200">Why us</a>
          <span className="text-ink-300 dark:text-ink-700">·</span>
          <a href={`/${lang}/about/`} className="link-gold font-semibold text-islam-800 dark:text-islam-200">About</a>
        </div>

        {/* Closing Arabic greeting + copyright */}
        <div className="border-t border-islam-200/70 pt-6 dark:border-islam-800/60">
          <div className="flex flex-col items-center gap-3 text-xs sm:flex-row sm:justify-between">
            <div>
              © {new Date().getFullYear()} <span className="font-bold text-islam-800 dark:text-islam-200">{SITE.name}</span>
              <span className="mx-2 muted">·</span>
              <span className="muted">Independent halal & muslim-friendly directory · No paid promotion</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-arabic text-sm text-islam-700 dark:text-islam-400" dir="rtl" lang="ar">
                وَعَلَيْكُمُ ٱلسَّلَام
              </span>
              <span className="text-[10px] muted">Wa ʿalaykum as-salaam</span>
            </div>
          </div>
          <div className="mt-3 text-center text-[10px] muted">
            Verified across Google · Reddit · Naver · Pantip · YouTube · Official websites
          </div>
        </div>
      </div>
    </footer>
  );
}
