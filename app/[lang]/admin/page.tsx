import type { Metadata } from "next";
import Link from "next/link";
import { MOCK_CLAIMS, MOCK_PAYMENTS, ADMIN_KPI, MOCK_FLAGGED_LISTINGS } from "@/lib/admin-mock";
import { SUPPORTED_LANGS } from "@/lib/i18n";
import type { Lang } from "@/lib/types";
import AdminGate from "@/components/admin/AdminGate";
import BookingsQueue from "@/components/admin/BookingsQueue";

export const dynamic = "force-static";

export function generateStaticParams() {
  return SUPPORTED_LANGS.map((lang) => ({ lang }));
}

export const metadata: Metadata = {
  title: "Admin · Salaam Thailand",
  robots: { index: false, follow: false },
};

const STATUS_PILL: Record<string, string> = {
  pending:   "bg-rose-100 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300",
  approved:  "bg-islam-100 text-islam-700 dark:bg-islam-950/50 dark:text-islam-300",
  confirmed: "bg-islam-100 text-islam-700 dark:bg-islam-950/50 dark:text-islam-300",
  rejected:  "bg-ink-150 text-ink-700 dark:bg-ink-800 dark:text-ink-400",
  disputed:  "bg-orange-100 text-orange-800 dark:bg-orange-950/40 dark:text-orange-300",
};

export default function AdminPage({ params }: { params: { lang: Lang } }) {
  const { lang } = params;

  return (
    <AdminGate>
    <div className="min-h-screen bg-sand-50/40 dark:bg-ink-950">
      {/* Admin warning bar */}
      <div className="border-b border-rose-300 bg-rose-50 px-4 py-2 text-center text-xs font-bold text-rose-800 dark:border-rose-700/60 dark:bg-rose-950/30 dark:text-rose-200">
        🔒 OPERATOR ADMIN · Restricted access · noindex · all actions are logged
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
        {/* ========== HEADER ========== */}
        <header className="mb-8 flex flex-wrap items-baseline justify-between gap-3">
          <div>
            <div className="eyebrow mb-1 text-rose-700 dark:text-rose-300">Salaam Thailand · Admin</div>
            <h1 className="h-display text-3xl font-bold text-islam-950 dark:text-islam-50 sm:text-4xl">
              Site operations
            </h1>
            <p className="mt-1 text-sm muted">
              Manage claims, confirm QR payments, audit listings, monitor health.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href={`/${lang}/dashboard/`}
              className="rounded-md border border-ink-200 bg-white px-3 py-1.5 text-xs font-bold text-ink-700 hover:bg-ink-50 dark:border-ink-700 dark:bg-ink-900 dark:text-ink-300"
            >
              See owner dashboard preview
            </Link>
            <Link
              href={`/${lang}/`}
              className="rounded-md bg-islam-950 px-3 py-1.5 text-xs font-bold text-white hover:bg-islam-900"
            >
              ← Back to site
            </Link>
          </div>
        </header>

        {/* ========== KPI ROW ========== */}
        <section className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { label: "Monthly revenue", value: `฿${ADMIN_KPI.monthly_revenue_thb.toLocaleString()}`, hint: `${ADMIN_KPI.active_pro_subscriptions} Pro + ${ADMIN_KPI.active_featured_subscriptions} Featured` },
            { label: "Active subscriptions", value: (ADMIN_KPI.active_pro_subscriptions + ADMIN_KPI.active_featured_subscriptions).toLocaleString(), hint: "businesses paying" },
            { label: "Total listings",  value: ADMIN_KPI.total_listings.toLocaleString(),       hint: `${ADMIN_KPI.claimed_listings} claimed · ${ADMIN_KPI.unclaimed_listings} unclaimed` },
            { label: "Pending actions", value: (ADMIN_KPI.pending_claims + ADMIN_KPI.pending_payments).toLocaleString(), hint: `${ADMIN_KPI.pending_claims} claims · ${ADMIN_KPI.pending_payments} payments` },
          ].map((k) => (
            <div key={k.label} className="card-editorial p-4">
              <div className="eyebrow !text-[10px]">{k.label}</div>
              <div className="mt-1 font-display text-2xl font-bold tabular-nums text-islam-950 dark:text-islam-50 sm:text-3xl">
                {k.value}
              </div>
              <div className="mt-1 text-[10px] muted">{k.hint}</div>
            </div>
          ))}
        </section>

        {/* ========== BOOKINGS QUEUE ========== */}
        <section className="mb-10">
          <div className="mb-3">
            <div className="eyebrow mb-1">Live bookings</div>
            <h2 className="font-display text-xl font-bold text-islam-950 dark:text-islam-50">
              Direct booking queue
            </h2>
          </div>
          <BookingsQueue />
        </section>

        {/* ========== PENDING CLAIMS ========== */}
        <section className="mb-10 card-editorial overflow-hidden">
          <div className="flex items-baseline justify-between border-b border-ink-100 p-5 dark:border-ink-800">
            <div>
              <div className="eyebrow mb-1">Listing claims</div>
              <h2 className="font-display text-lg font-bold text-islam-950 dark:text-islam-50">
                Pending verification ({ADMIN_KPI.pending_claims})
              </h2>
            </div>
            <span className="text-xs muted">
              Email auto-verifies. Phone needs SMS code. Walk-in is manual.
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-ink-100 bg-sand-50/50 text-[10px] uppercase tracking-wider dark:border-ink-800 dark:bg-ink-800/40">
                <tr>
                  <th className="px-4 py-3 text-left font-bold text-ink-600 dark:text-ink-400">Business</th>
                  <th className="px-4 py-3 text-left font-bold text-ink-600 dark:text-ink-400">Claimer</th>
                  <th className="px-4 py-3 text-left font-bold text-ink-600 dark:text-ink-400">Verification</th>
                  <th className="px-4 py-3 text-left font-bold text-ink-600 dark:text-ink-400">When</th>
                  <th className="px-4 py-3 text-right font-bold text-ink-600 dark:text-ink-400">Status</th>
                  <th className="px-4 py-3 text-right font-bold text-ink-600 dark:text-ink-400">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink-100 dark:divide-ink-800">
                {MOCK_CLAIMS.map((c) => (
                  <tr key={c.id} className="transition hover:bg-sand-50/40 dark:hover:bg-ink-800/40">
                    <td className="px-4 py-4">
                      <div className="font-bold text-islam-950 dark:text-islam-50">{c.placeName}</div>
                      <div className="mt-0.5 text-[10px] uppercase tracking-wider muted">
                        {c.placeCity} · {c.placeNiche.replace("-", " ")}
                      </div>
                    </td>
                    <td className="px-4 py-4 text-xs">
                      <div className="font-medium text-ink-800 dark:text-ink-200">{c.claimedBy}</div>
                      <div className="mt-0.5 muted">{c.claimedEmail}</div>
                      <div className="muted">{c.claimedPhone}</div>
                    </td>
                    <td className="px-4 py-4 text-xs">
                      <span className="rounded-md bg-ink-100 px-2 py-0.5 font-bold uppercase tracking-wider text-ink-700 dark:bg-ink-800 dark:text-ink-300">
                        {c.verificationMethod}
                      </span>
                      {c.notes && (
                        <div className="mt-1 text-[10px] italic muted">⚠ {c.notes}</div>
                      )}
                    </td>
                    <td className="px-4 py-4 text-xs muted">{c.submittedAt}</td>
                    <td className="px-4 py-4 text-right">
                      <span className={`inline-block rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${STATUS_PILL[c.status]}`}>
                        {c.status}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-right">
                      {c.status === "pending" ? (
                        <div className="flex justify-end gap-1.5">
                          <button className="rounded-md bg-islam-700 px-2 py-1 text-[10px] font-bold text-white hover:bg-islam-800">
                            ✓ Approve
                          </button>
                          <button className="rounded-md border border-rose-300 px-2 py-1 text-[10px] font-bold text-rose-700 hover:bg-rose-50 dark:border-rose-700/60 dark:text-rose-300">
                            ✕ Reject
                          </button>
                        </div>
                      ) : (
                        <button className="text-[10px] font-bold text-ink-500 hover:text-islam-700 dark:text-ink-400">
                          View
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* ========== PAYMENTS ========== */}
        <section className="mb-10 card-editorial overflow-hidden">
          <div className="flex items-baseline justify-between border-b border-ink-100 p-5 dark:border-ink-800">
            <div>
              <div className="eyebrow mb-1">QR Payments</div>
              <h2 className="font-display text-lg font-bold text-islam-950 dark:text-islam-50">
                Confirm transfers ({ADMIN_KPI.pending_payments} pending · {ADMIN_KPI.disputed_payments} disputed)
              </h2>
            </div>
            <span className="text-xs muted">
              Match the reference code to your bank statement, then click ✓ Confirm.
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-ink-100 bg-sand-50/50 text-[10px] uppercase tracking-wider dark:border-ink-800 dark:bg-ink-800/40">
                <tr>
                  <th className="px-4 py-3 text-left font-bold text-ink-600 dark:text-ink-400">Business</th>
                  <th className="px-4 py-3 text-left font-bold text-ink-600 dark:text-ink-400">Reference</th>
                  <th className="px-4 py-3 text-left font-bold text-ink-600 dark:text-ink-400">Channel</th>
                  <th className="px-4 py-3 text-right font-bold text-ink-600 dark:text-ink-400">Amount</th>
                  <th className="px-4 py-3 text-left font-bold text-ink-600 dark:text-ink-400">When</th>
                  <th className="px-4 py-3 text-right font-bold text-ink-600 dark:text-ink-400">Status</th>
                  <th className="px-4 py-3 text-right font-bold text-ink-600 dark:text-ink-400">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink-100 dark:divide-ink-800">
                {MOCK_PAYMENTS.map((p) => (
                  <tr key={p.id} className="transition hover:bg-sand-50/40 dark:hover:bg-ink-800/40">
                    <td className="px-4 py-4">
                      <div className="font-bold text-islam-950 dark:text-islam-50">{p.businessName}</div>
                      <div className="mt-0.5 text-[10px] uppercase tracking-wider muted">{p.plan} plan</div>
                    </td>
                    <td className="px-4 py-4 font-mono text-xs text-ink-800 dark:text-ink-200">{p.reference}</td>
                    <td className="px-4 py-4 text-xs muted">{p.paidVia}</td>
                    <td className="px-4 py-4 text-right font-bold tabular-nums">฿{p.amount.toLocaleString()}</td>
                    <td className="px-4 py-4 text-xs muted">{p.submittedAt}</td>
                    <td className="px-4 py-4 text-right">
                      <span className={`inline-block rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${STATUS_PILL[p.status]}`}>
                        {p.status}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-right">
                      {p.status === "pending" ? (
                        <div className="flex justify-end gap-1.5">
                          <button className="rounded-md bg-islam-700 px-2 py-1 text-[10px] font-bold text-white hover:bg-islam-800">
                            ✓ Confirm
                          </button>
                          <button className="rounded-md border border-orange-300 px-2 py-1 text-[10px] font-bold text-orange-700 hover:bg-orange-50 dark:border-orange-700/60 dark:text-orange-300">
                            ⚠ Dispute
                          </button>
                        </div>
                      ) : (
                        <button className="text-[10px] font-bold text-ink-500 hover:text-islam-700 dark:text-ink-400">
                          View
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* ========== FLAGGED LISTINGS ========== */}
        <section className="card-editorial overflow-hidden">
          <div className="border-b border-ink-100 p-5 dark:border-ink-800">
            <div className="eyebrow mb-1">Quality review</div>
            <h2 className="font-display text-lg font-bold text-islam-950 dark:text-islam-50">
              Flagged listings ({MOCK_FLAGGED_LISTINGS.length})
            </h2>
            <p className="mt-1 text-xs muted">
              Auto-flagged by the &quot;suspected viral&quot; filter or low-source coverage. Audit and decide.
            </p>
          </div>

          <ul className="divide-y divide-ink-100 dark:divide-ink-800">
            {MOCK_FLAGGED_LISTINGS.map((f) => (
              <li key={f.id} className="flex flex-col gap-3 p-5 sm:flex-row sm:items-start">
                <div className="min-w-0 flex-1">
                  <div className="font-bold text-islam-950 dark:text-islam-50">{f.name}</div>
                  <div className="mt-0.5 text-[10px] uppercase tracking-wider muted">
                    📍 {f.city} · {f.niche.replace("-", " ")} · Trust {f.trustScore} · {f.lastUpdated}
                  </div>
                  <p className="mt-2 rounded-md border-l-2 border-orange-400 bg-orange-50/50 px-3 py-2 text-xs leading-relaxed text-orange-900 dark:bg-orange-950/20 dark:text-orange-200">
                    ⚠ {f.flagReason}
                  </p>
                </div>
                <div className="flex shrink-0 gap-2">
                  <button className="rounded-md border border-ink-200 px-3 py-1.5 text-[10px] font-bold text-ink-700 hover:bg-ink-50 dark:border-ink-700 dark:text-ink-300">
                    Re-scan
                  </button>
                  <button className="rounded-md border border-islam-300 px-3 py-1.5 text-[10px] font-bold text-islam-700 hover:bg-islam-50 dark:border-islam-700 dark:text-islam-300">
                    Keep
                  </button>
                  <button className="rounded-md bg-rose-600 px-3 py-1.5 text-[10px] font-bold text-white hover:bg-rose-700">
                    Remove
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </section>

        <p className="mt-10 text-center text-xs muted">
          Mock data shown. Live operations will require Auth.js + Drizzle DB. See SETUP_PAYMENTS.md.
        </p>
      </div>
    </div>
    </AdminGate>
  );
}
