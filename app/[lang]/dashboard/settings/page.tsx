import { MOCK_BUSINESS } from "@/lib/dashboard-mock";
import type { Lang } from "@/lib/types";

export default function SettingsPage({ params: _ }: { params: { lang: Lang } }) {
  return (
    <div className="space-y-8 pb-20 lg:pb-0">
      <header>
        <div className="eyebrow mb-1">Settings</div>
        <h1 className="h-display text-3xl font-bold text-islam-950 dark:text-islam-50 sm:text-4xl">
          Settings
        </h1>
        <p className="mt-1 text-sm muted">Profile · notifications · add-on policy</p>
      </header>

      {/* Profile */}
      <section className="card-editorial p-5 sm:p-6">
        <div className="mb-5">
          <div className="eyebrow mb-1">Profile</div>
          <h2 className="font-display text-lg font-bold text-islam-950 dark:text-islam-50">Property owner</h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Property name" value={MOCK_BUSINESS.name} />
          <Field label="City" value={MOCK_BUSINESS.city} />
          <Field label="Contact email" value="thaiconnect33@gmail.com" />
          <Field label="WhatsApp" value="+66 61 093 4014" />
          <Field label="Member since" value={MOCK_BUSINESS.member_since} />
          <Field label="Plan" value={MOCK_BUSINESS.plan.toUpperCase()} />
        </div>
      </section>

      {/* Notifications */}
      <section className="card-editorial p-5 sm:p-6">
        <div className="mb-5">
          <div className="eyebrow mb-1">Notifications</div>
          <h2 className="font-display text-lg font-bold text-islam-950 dark:text-islam-50">How we reach you</h2>
        </div>
        <div className="space-y-3">
          {[
            { label: "New inquiry — instant alert",      v: ["email", "whatsapp"] },
            { label: "SLA approaching (45 min mark)",    v: ["email", "whatsapp", "push"] },
            { label: "Trust Score changes",              v: ["email"] },
            { label: "Weekly insight digest",            v: ["email"] },
            { label: "Competitor signal alerts",         v: ["push"] },
            { label: "Billing & invoice",                v: ["email"] },
          ].map((n) => (
            <div key={n.label} className="flex flex-wrap items-center justify-between gap-3 rounded-md border border-ink-100 px-3 py-2.5 dark:border-ink-800">
              <span className="text-sm text-ink-800 dark:text-ink-200">{n.label}</span>
              <div className="flex gap-1.5">
                {(["email", "whatsapp", "push"] as const).map((ch) => (
                  <button
                    key={ch}
                    className={`rounded-md border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                      n.v.includes(ch)
                        ? "border-islam-700 bg-islam-700 text-white"
                        : "border-ink-200 bg-white text-ink-500 dark:border-ink-700 dark:bg-ink-900 dark:text-ink-400"
                    }`}
                  >
                    {ch}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Add-on policy */}
      <section className="card-editorial p-5 sm:p-6">
        <div className="mb-5">
          <div className="eyebrow mb-1">Add-on policy</div>
          <h2 className="font-display text-lg font-bold text-islam-950 dark:text-islam-50">
            Free muslim-friendly extras (set once, included with every booking)
          </h2>
        </div>
        <div className="space-y-3">
          {[
            { label: "🧎 Prayer kit",          desc: "Mat + qibla + Qur'an in room on arrival",         on: true },
            { label: "🍽 Halal welcome meal",  desc: "Complimentary CICOT-certified meal at check-in",   on: true },
            { label: "📡 Arabic-speaking host", desc: "Paired automatically when available",             on: true },
            { label: "🌙 Ramadan iftar box",   desc: "Free iftar set during Ramadan stays",             on: false },
            { label: "🚗 Airport pickup",      desc: "Free transfer Suvarnabhumi / Don Mueang",          on: false },
          ].map((a) => (
            <label key={a.label} className="flex cursor-pointer items-start gap-3 rounded-md border border-ink-100 px-4 py-3 transition hover:border-gold-400 dark:border-ink-800">
              <input type="checkbox" defaultChecked={a.on} className="mt-1 h-4 w-4 accent-islam-700" />
              <div className="min-w-0">
                <div className="font-bold text-islam-950 dark:text-islam-50">{a.label}</div>
                <div className="text-xs muted">{a.desc}</div>
              </div>
            </label>
          ))}
        </div>
      </section>

      {/* Discount policy */}
      <section className="card-editorial p-5 sm:p-6">
        <div className="mb-5">
          <div className="eyebrow mb-1">Direct booking discount</div>
          <h2 className="font-display text-lg font-bold text-islam-950 dark:text-islam-50">
            How much cheaper vs Booking.com / Agoda
          </h2>
        </div>
        <div className="flex flex-wrap items-end gap-4">
          <div>
            <label className="text-[10px] uppercase tracking-wider muted">Discount %</label>
            <div className="mt-1 flex items-center gap-2">
              <input type="range" min="0" max="20" defaultValue="10" className="w-48 accent-islam-700" />
              <span className="font-display text-2xl font-bold tabular-nums text-gold-700 dark:text-gold-400">10%</span>
            </div>
          </div>
          <p className="text-xs muted">
            You save on Booking 15% commission. We pass 10% to the guest, you keep 5%.
          </p>
        </div>
      </section>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-ink-100 px-3 py-2 dark:border-ink-800">
      <div className="text-[10px] uppercase tracking-wider muted">{label}</div>
      <div className="mt-0.5 font-medium text-ink-800 dark:text-ink-200">{value}</div>
    </div>
  );
}
