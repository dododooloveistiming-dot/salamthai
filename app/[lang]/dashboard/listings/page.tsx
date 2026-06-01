import Link from "next/link";
import { MOCK_BUSINESS } from "@/lib/dashboard-mock";
import TrustGauge from "@/components/TrustGauge";
import type { Lang } from "@/lib/types";

const MOCK_LISTINGS = [
  {
    id: "al-meroz-hotel",
    name: MOCK_BUSINESS.name,
    niche: "muslim-hotel",
    city: "Bangkok",
    trust_score: 87,
    photos: 8,
    inquiries_30d: 446,
    cover: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=1200&h=800&fit=crop",
    status: "active" as const,
  },
];

const PHOTOS = [
  "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=400&h=300&fit=crop",
  "https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=400&h=300&fit=crop",
  "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=400&h=300&fit=crop",
  "https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=400&h=300&fit=crop",
  "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400&h=300&fit=crop",
  "https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?w=400&h=300&fit=crop",
  "https://images.unsplash.com/photo-1578774204375-1d2d34abce8b?w=400&h=300&fit=crop",
  "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=400&h=300&fit=crop",
];

export default function ListingsPage({ params }: { params: { lang: Lang } }) {
  const { lang } = params;
  const listing = MOCK_LISTINGS[0];

  return (
    <div className="space-y-8 pb-20 lg:pb-0">
      {/* Header */}
      <header className="flex flex-wrap items-baseline justify-between gap-3">
        <div>
          <div className="eyebrow mb-1">Listings</div>
          <h1 className="h-display text-3xl font-bold text-islam-950 dark:text-islam-50 sm:text-4xl">
            Your properties
          </h1>
          <p className="mt-1 text-sm muted">
            {MOCK_LISTINGS.length} active · manage photos, hours, amenities
          </p>
        </div>
        <button className="rounded-md bg-islam-950 px-3 py-1.5 text-xs font-bold text-white hover:bg-islam-900">
          + Claim another listing
        </button>
      </header>

      {/* Listing card */}
      <article className="card-editorial overflow-hidden">
        <div className="grid lg:grid-cols-[1.4fr_1fr]">
          <div className="relative aspect-[16/10] lg:aspect-auto lg:min-h-[300px]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={listing.cover} alt={listing.name} loading="lazy" decoding="async" className="absolute inset-0 h-full w-full object-cover" />
            <span className="absolute left-3 top-3 rounded-md bg-islam-700 px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-white">
              ✓ Active
            </span>
          </div>
          <div className="p-6">
            <h2 className="h-display text-2xl font-bold text-islam-950 dark:text-islam-50">
              {listing.name}
            </h2>
            <p className="mt-1 text-xs muted">
              📍 {listing.city} · {listing.niche.replace("-", " ")}
            </p>

            <div className="mt-5 grid grid-cols-3 gap-4">
              <div>
                <div className="text-[10px] uppercase tracking-wider muted">Trust</div>
                <div className="font-display text-2xl font-bold tabular-nums text-islam-950 dark:text-islam-50">
                  {listing.trust_score}
                </div>
              </div>
              <div>
                <div className="text-[10px] uppercase tracking-wider muted">Photos</div>
                <div className="font-display text-2xl font-bold tabular-nums text-islam-950 dark:text-islam-50">
                  {listing.photos}<span className="text-sm muted">/15</span>
                </div>
              </div>
              <div>
                <div className="text-[10px] uppercase tracking-wider muted">Inquiries 30d</div>
                <div className="font-display text-2xl font-bold tabular-nums text-islam-950 dark:text-islam-50">
                  {listing.inquiries_30d}
                </div>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-2">
              <Link href={`/${lang}/place/${listing.id}/`} className="rounded-md border border-ink-200 px-3 py-1.5 text-xs font-bold text-ink-700 hover:bg-ink-50 dark:border-ink-700 dark:text-ink-300">
                View public page
              </Link>
              <button className="rounded-md border border-ink-200 px-3 py-1.5 text-xs font-bold text-ink-700 hover:bg-ink-50 dark:border-ink-700 dark:text-ink-300">
                Edit details
              </button>
              <button className="rounded-md bg-gold-500 px-3 py-1.5 text-xs font-bold text-islam-950 hover:bg-gold-400">
                + Upload photos
              </button>
            </div>
          </div>
        </div>
      </article>

      {/* Photo gallery editor */}
      <section className="card-editorial p-5 sm:p-6">
        <div className="mb-4 flex items-baseline justify-between">
          <div>
            <div className="eyebrow mb-1">Photo gallery</div>
            <h2 className="font-display text-lg font-bold text-islam-950 dark:text-islam-50">
              {listing.photos}/15 photos · 7 to reach full coverage
            </h2>
          </div>
          <button className="rounded-md bg-islam-950 px-3 py-1.5 text-xs font-bold text-white hover:bg-islam-900">
            + Upload
          </button>
        </div>

        <div className="mb-4 h-1.5 overflow-hidden rounded-full bg-ink-100 dark:bg-ink-800">
          <div className="h-full bg-gradient-to-r from-islam-600 to-gold-500" style={{ width: `${(listing.photos / 15) * 100}%` }} />
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {PHOTOS.map((url, i) => (
            <div key={i} className="group relative aspect-[4/3] overflow-hidden rounded-lg bg-ink-100 dark:bg-ink-800">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={url} alt={`Photo ${i+1}`} className="h-full w-full object-cover transition group-hover:scale-105" loading="lazy" />
              <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition group-hover:opacity-100">
                <div className="flex w-full justify-between p-2">
                  <button className="rounded bg-white/95 px-2 py-0.5 text-[9px] font-bold text-islam-900 hover:bg-white">★ Cover</button>
                  <button className="rounded bg-rose-500 px-2 py-0.5 text-[9px] font-bold text-white hover:bg-rose-600">✕</button>
                </div>
              </div>
            </div>
          ))}
          {/* Empty slots */}
          {Array.from({ length: 15 - PHOTOS.length }).map((_, i) => (
            <button
              key={`empty-${i}`}
              className="grid aspect-[4/3] place-items-center rounded-lg border-2 border-dashed border-ink-200 text-3xl text-ink-300 hover:border-gold-400 hover:bg-gold-50 hover:text-gold-700 dark:border-ink-700 dark:hover:bg-gold-950/30"
            >
              +
            </button>
          ))}
        </div>
      </section>

      {/* Amenities checklist */}
      <section className="card-editorial p-5 sm:p-6">
        <div className="mb-4">
          <div className="eyebrow mb-1">Muslim-friendly amenities</div>
          <h2 className="font-display text-lg font-bold text-islam-950 dark:text-islam-50">
            What you offer
          </h2>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {[
            { label: "Prayer mats in every room",       on: true },
            { label: "Qibla direction marked",          on: true },
            { label: "Halal kitchen · CICOT certified", on: true },
            { label: "Separate prayer room on-site",    on: true },
            { label: "Women-only swimming hours",       on: false },
            { label: "Arabic-speaking front desk",      on: true },
            { label: "Alcohol-free mini bar",           on: true },
            { label: "Halal breakfast included",        on: true },
            { label: "Family suites (4+ guests)",       on: true },
            { label: "Ramadan iftar service",           on: false },
          ].map((a) => (
            <label key={a.label} className="flex cursor-pointer items-center gap-3 rounded-md border border-ink-100 px-3 py-2 transition hover:border-gold-400 dark:border-ink-800">
              <input type="checkbox" defaultChecked={a.on} className="h-4 w-4 accent-islam-700" />
              <span className="text-sm text-ink-800 dark:text-ink-200">{a.label}</span>
            </label>
          ))}
        </div>
        <button className="mt-5 rounded-md bg-islam-950 px-4 py-2 text-xs font-bold text-white hover:bg-islam-900">
          Save amenities
        </button>
      </section>
    </div>
  );
}
