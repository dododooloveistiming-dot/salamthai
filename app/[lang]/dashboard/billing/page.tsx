import { MOCK_BUSINESS, MOCK_INVOICES, MOCK_KPIS } from "@/lib/dashboard-mock";
import type { Lang } from "@/lib/types";

const PLANS = [
  {
    key: "free",
    name: "Free",
    price: "฿0",
    period: "/mo",
    perks: [
      "10 inquiries/month",
      "Listed on Salaam Thailand",
      "Basic verification",
      "—",
    ],
    cta: "Current",
    enabled: false,
  },
  {
    key: "pro",
    name: "Pro",
    price: "฿599",
    period: "/mo",
    perks: [
      "Unlimited inquiries",
      "1-hour reply SLA guarantee",
      "Insights · benchmarks",
      "Multi-language inquiry routing",
    ],
    cta: "Current plan",
    enabled: false,
    current: true,
  },
  {
    key: "featured",
    name: "Featured",
    price: "฿1,999",
    period: "/mo",
    perks: [
      "Everything in Pro",
      "Top placement in your category",
      "Named competitor benchmarks",
      "Priority placement in AEO results",
    ],
    cta: "Pay via QR · upgrade",
    enabled: true,
    highlight: true,
  },
];

const STATUS_COLOR: Record<string, string> = {
  paid: "bg-islam-100 text-islam-700 dark:bg-islam-950/50 dark:text-islam-300",
  due:  "bg-gold-100 text-gold-800 dark:bg-gold-950/40 dark:text-gold-300",
  free: "bg-ink-150 text-ink-700 dark:bg-ink-800 dark:text-ink-400",
};

// PromptPay QR — placeholder. In production, generate from your PromptPay
// number using a QR library or a static png in /public.
const QR_DEMO_SVG = `data:image/svg+xml;base64,${Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><rect width="200" height="200" fill="white"/><g fill="black">${Array.from({length: 25 * 25}, (_, i) => {
  const x = (i % 25) * 8;
  const y = Math.floor(i / 25) * 8;
  // Pseudo-random pattern for visual approximation only
  const seed = (i * 9301 + 49297) % 233280;
  return seed > 116640 ? `<rect x="${x}" y="${y}" width="8" height="8"/>` : "";
}).join("")}</g><rect x="0" y="0" width="56" height="56" fill="white"/><rect x="8" y="8" width="40" height="40" fill="black"/><rect x="16" y="16" width="24" height="24" fill="white"/><rect x="20" y="20" width="16" height="16" fill="black"/><rect x="144" y="0" width="56" height="56" fill="white"/><rect x="152" y="8" width="40" height="40" fill="black"/><rect x="160" y="16" width="24" height="24" fill="white"/><rect x="164" y="20" width="16" height="16" fill="black"/><rect x="0" y="144" width="56" height="56" fill="white"/><rect x="8" y="152" width="40" height="40" fill="black"/><rect x="16" y="160" width="24" height="24" fill="white"/><rect x="20" y="164" width="16" height="16" fill="black"/></svg>`).toString("base64")}`;

export default function BillingPage({ params: _ }: { params: { lang: Lang } }) {
  const planLabel = MOCK_BUSINESS.plan.charAt(0).toUpperCase() + MOCK_BUSINESS.plan.slice(1);
  const monthlyValue = 599;
  const last30Inquiries = MOCK_KPIS.inquiries_30d;
  const valuePerInquiry = (monthlyValue / last30Inquiries).toFixed(2);

  return (
    <div className="space-y-8 pb-20 lg:pb-0">
      {/* Header */}
      <header>
        <div className="eyebrow mb-1">Billing</div>
        <h1 className="h-display text-3xl font-bold text-islam-950 dark:text-islam-50 sm:text-4xl">
          Plan & QR payments
        </h1>
        <p className="mt-1 text-sm muted">
          Pay via PromptPay / mobile banking · No credit card · Cancel anytime
        </p>
      </header>

      {/* Current plan card */}
      <section className="card-editorial overflow-hidden">
        <div className="grid gap-6 p-6 sm:grid-cols-3 sm:p-8">
          <div>
            <div className="eyebrow mb-1">Current plan</div>
            <div className="flex items-baseline gap-2">
              <span className="h-display text-3xl font-bold text-islam-950 dark:text-islam-50">{planLabel}</span>
              <span className="rounded-md bg-islam-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-islam-700 dark:bg-islam-950/50 dark:text-islam-300">
                Active
              </span>
            </div>
            <p className="mt-2 text-xs muted">Next renewal · {MOCK_BUSINESS.next_renewal}</p>
            <p className="mt-1 text-xs muted">Member since · {MOCK_BUSINESS.member_since}</p>
          </div>
          <div>
            <div className="eyebrow mb-1">This month</div>
            <div className="font-display text-3xl font-bold tabular-nums text-islam-950 dark:text-islam-50">
              {last30Inquiries.toLocaleString()}
            </div>
            <p className="mt-1 text-xs muted">inquiries · unlimited</p>
          </div>
          <div>
            <div className="eyebrow mb-1">Value per inquiry</div>
            <div className="font-display text-3xl font-bold tabular-nums text-gold-700 dark:text-gold-400">
              ฿{valuePerInquiry}
            </div>
            <p className="mt-1 text-xs muted">฿{monthlyValue} / {last30Inquiries} inquiries</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-3 border-t border-ink-100 px-6 py-4 dark:border-ink-800 sm:px-8">
          <a
            href="#qr-pay"
            className="rounded-md border border-ink-200 bg-white px-4 py-2 text-xs font-bold text-ink-800 transition hover:bg-ink-50 dark:border-ink-700 dark:bg-ink-900 dark:text-ink-200"
          >
            View QR · pay next month
          </a>
          <button className="rounded-md border border-ink-200 bg-white px-4 py-2 text-xs font-bold text-ink-800 transition hover:bg-ink-50 dark:border-ink-700 dark:bg-ink-900 dark:text-ink-200">
            Download invoice (PDF)
          </button>
          <button className="ml-auto rounded-md border border-rose-300 bg-white px-4 py-2 text-xs font-bold text-rose-700 transition hover:bg-rose-50 dark:border-rose-700/60 dark:bg-ink-900 dark:text-rose-300">
            Cancel subscription
          </button>
        </div>
      </section>

      {/* ─── QR PAYMENT PANEL ─── */}
      <section id="qr-pay" className="card-editorial overflow-hidden">
        <div className="grid gap-0 md:grid-cols-[1fr_1.4fr]">
          {/* Left — QR */}
          <div className="flex flex-col items-center justify-center border-b border-ink-100 bg-gradient-to-br from-islam-50 to-sand-50 p-8 dark:border-ink-800 dark:from-islam-950/40 dark:to-ink-900/60 md:border-b-0 md:border-r">
            <div className="eyebrow mb-2">Scan to pay</div>
            <div className="rounded-2xl bg-white p-4 shadow-md ring-1 ring-islam-200 dark:ring-islam-800">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={QR_DEMO_SVG} alt="PromptPay QR" className="h-48 w-48" />
            </div>
            <div className="mt-4 text-center">
              <div className="font-display text-2xl font-bold text-islam-950 dark:text-islam-50">
                ฿{monthlyValue.toLocaleString()}
              </div>
              <div className="text-[10px] uppercase tracking-widest text-gold-700 dark:text-gold-400">
                Pro · monthly
              </div>
            </div>
          </div>

          {/* Right — instructions */}
          <div className="p-7 sm:p-9">
            <div className="eyebrow mb-1">How to pay</div>
            <h2 className="h-display text-xl font-bold text-islam-950 dark:text-islam-50">
              4 steps — about 30 seconds
            </h2>

            <ol className="mt-5 space-y-4 text-sm">
              {[
                { n: 1, title: "Open your banking app", body: "Any Thai bank (KBank, SCB, BBL, KTB, etc.) · KakaoPay (KR) · WeChat Pay (CN)" },
                { n: 2, title: "Scan the QR on the left",  body: "Amount and recipient auto-fill — verify ฿599 then confirm" },
                { n: 3, title: "Use this reference",        body: <code className="rounded bg-islam-100 px-2 py-0.5 font-mono text-xs text-islam-900 dark:bg-islam-950/50 dark:text-islam-100">SALAAM-{MOCK_BUSINESS.name.replace(/\s/g, "").toUpperCase().slice(0, 6)}-{new Date().getFullYear().toString().slice(-2)}{(new Date().getMonth() + 1).toString().padStart(2, "0")}</code> },
                { n: 4, title: "We confirm in 30 min",      body: "Our team sees your transfer + auto-extends your subscription. No upload needed." },
              ].map((s) => (
                <li key={s.n} className="flex gap-4">
                  <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-islam-700 text-xs font-bold text-white">{s.n}</span>
                  <div>
                    <h3 className="font-bold text-islam-950 dark:text-islam-50">{s.title}</h3>
                    <p className="mt-0.5 text-xs leading-relaxed text-ink-700 dark:text-ink-300">{s.body}</p>
                  </div>
                </li>
              ))}
            </ol>

            <div className="mt-6 rounded-xl bg-gold-50 px-4 py-3 text-xs text-gold-900 dark:bg-gold-950/30 dark:text-gold-200">
              <strong>Trouble paying?</strong> WhatsApp <a href="https://wa.me/66610934014" target="_blank" rel="noopener noreferrer" className="font-bold underline">+66 61 093 4014</a>, LINE <strong>@838wyfih</strong>, or email
              <a href="mailto:thaiconnect33@gmail.com" className="font-bold underline"> thaiconnect33@gmail.com</a>
              — we accept bank transfer, WeChat, KakaoPay, USDT, and cash on-site.
            </div>
          </div>
        </div>
      </section>

      {/* Plan comparison */}
      <section>
        <div className="mb-5">
          <div className="eyebrow mb-1">Available plans</div>
          <h2 className="h-display text-2xl font-bold text-islam-950 dark:text-islam-50">
            Change plan
          </h2>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {PLANS.map((p) => (
            <div
              key={p.key}
              className={`card-editorial p-6 ${
                p.highlight
                  ? "border-gold-400 ring-2 ring-gold-300/50"
                  : p.current
                  ? "border-islam-400 ring-2 ring-islam-300/40"
                  : ""
              }`}
            >
              {p.highlight && (
                <div className="mb-3 inline-block rounded-md bg-gold-500 px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-islam-950">
                  Recommended
                </div>
              )}
              <div className="font-display text-2xl font-bold text-islam-950 dark:text-islam-50">
                {p.name}
              </div>
              <div className="mt-2 flex items-baseline gap-1">
                <span className="font-display text-4xl font-bold text-gold-700 dark:text-gold-400">{p.price}</span>
                <span className="text-xs muted">{p.period}</span>
              </div>
              <ul className="mt-5 space-y-2 text-xs">
                {p.perks.map((perk) => (
                  <li key={perk} className="flex items-start gap-2">
                    <span className="mt-0.5 text-islam-600 dark:text-islam-400">✓</span>
                    <span className="text-ink-800 dark:text-ink-200">{perk}</span>
                  </li>
                ))}
              </ul>
              <a
                href={p.enabled ? "#qr-pay" : undefined}
                className={`mt-6 block rounded-md px-4 py-2.5 text-center text-xs font-bold transition ${
                  p.highlight
                    ? "bg-islam-950 text-white hover:bg-islam-900"
                    : p.current
                    ? "border border-ink-200 bg-ink-50 text-ink-500 dark:border-ink-700 dark:bg-ink-800 dark:text-ink-400"
                    : "bg-ink-100 text-ink-500 dark:bg-ink-800 dark:text-ink-400"
                }`}
              >
                {p.cta} {p.enabled && "→"}
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* Invoice history */}
      <section className="card-editorial overflow-hidden">
        <div className="border-b border-ink-100 p-5 dark:border-ink-800 sm:p-6">
          <div className="eyebrow mb-1">Payment history</div>
          <h2 className="font-display text-lg font-bold text-islam-950 dark:text-islam-50">
            Past QR transfers
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-ink-100 bg-sand-50/40 text-[10px] uppercase tracking-wider dark:border-ink-800 dark:bg-ink-800/30">
              <tr>
                <th className="px-4 py-3 text-left font-bold text-ink-600 dark:text-ink-400">Reference</th>
                <th className="px-4 py-3 text-left font-bold text-ink-600 dark:text-ink-400">Date</th>
                <th className="px-4 py-3 text-left font-bold text-ink-600 dark:text-ink-400">Plan</th>
                <th className="px-4 py-3 text-right font-bold text-ink-600 dark:text-ink-400">Amount</th>
                <th className="px-4 py-3 text-right font-bold text-ink-600 dark:text-ink-400">Status</th>
                <th className="px-4 py-3 text-right font-bold text-ink-600 dark:text-ink-400">Receipt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink-100 dark:divide-ink-800">
              {MOCK_INVOICES.map((inv) => (
                <tr key={inv.id} className="transition hover:bg-sand-50/40 dark:hover:bg-ink-800/40">
                  <td className="px-4 py-3 font-mono text-xs text-ink-800 dark:text-ink-200">
                    SALAAM-{inv.id.replace("INV-", "")}
                  </td>
                  <td className="px-4 py-3 text-xs text-ink-700 dark:text-ink-300">{inv.date}</td>
                  <td className="px-4 py-3 text-xs text-ink-700 dark:text-ink-300">{inv.plan}</td>
                  <td className="px-4 py-3 text-right font-bold tabular-nums">
                    {inv.amount === 0 ? <span className="muted">—</span> : `฿${inv.amount.toLocaleString()}`}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span className={`inline-block rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${STATUS_COLOR[inv.status]}`}>
                      {inv.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button className="link-gold text-xs font-bold text-islam-700 dark:text-islam-300">
                      Download
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <p className="text-center text-xs muted">
        QR payments · PromptPay / Thai bank / KakaoPay / WeChat / USDT accepted · cancel anytime
      </p>
    </div>
  );
}
