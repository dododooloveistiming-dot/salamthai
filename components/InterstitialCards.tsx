// Magazine-style break cards that get sprinkled between PlaceCards to kill
// the "endless emoji grid" feel. Three variants:
//   • QuoteCard      — editor pull-quote, big serif
//   • FactCard       — quick muslim-travel stat (rotates per render)
//   • DidYouKnowCard — niche-specific micro-explainer
//
// Used by InterleavedGrid which decides cadence (every 7th / 13th slot etc.)

import type { Niche } from "@/lib/types";

interface BaseProps { lang: string }

// ─────────────────── Quote ───────────────────
const QUOTES: Record<string, { line: string; by: string }[]> = {
  "halal-food": [
    { line: "The best halal pad thai in Bangkok is found at the alleys behind Indra Square — never the airport food court.", by: "— Reddit r/MuslimTravels" },
    { line: "If a Bangkok food stall has a CICOT sticker and a queue of Indonesian aunties, you've found gold.", by: "— Pantip user" },
  ],
  "muslim-hotel": [
    { line: "Al Meroz isn't the cheapest hotel in Bangkok, but it's the only one where the housekeeping greets you with salaam.", by: "— Naver travel blog" },
    { line: "Look for hotels with a printed qibla compass in the room — that's how you spot a real muslim-friendly property.", by: "— GCC traveler review" },
  ],
  "mosque": [
    { line: "Friday at Foundation Mosque (Bang Rak) is a quiet anchor in the middle of Bangkok's chaos.", by: "— Local imam, anonymously" },
  ],
  "halal-tour": [
    { line: "The best Muslim-friendly tour guides in Phuket aren't on Klook — they're on WhatsApp via word of mouth.", by: "— Muslim Travel forum" },
  ],
  default: [
    { line: "Verified by 6 independent sources, not 1 sponsor. That's the whole pitch.", by: "— Salaam Thailand editorial" },
  ],
};

export function QuoteCard({ niche }: { niche: Niche | string } & BaseProps) {
  const pool = QUOTES[niche] ?? QUOTES.default;
  const q = pool[Math.floor(Math.random() * pool.length)];
  return (
    <article className="card-editorial relative overflow-hidden bg-gradient-to-br from-islam-50 via-sand-50 to-gold-50 p-6 dark:from-islam-950/40 dark:via-ink-900 dark:to-gold-950/30 sm:p-8">
      <div className="bg-islamic-stars absolute inset-0 opacity-30" aria-hidden="true" />
      <div className="relative">
        <div className="mb-2 text-3xl text-gold-700 dark:text-gold-400" aria-hidden="true">"</div>
        <p className="h-display text-base font-medium leading-tight text-islam-950 dark:text-islam-50 sm:text-lg">
          {q.line}
        </p>
        <div className="mt-3 text-[10px] uppercase tracking-widest text-ink-600 dark:text-ink-400">
          {q.by}
        </div>
      </div>
    </article>
  );
}

// ─────────────────── Fact ───────────────────
const FACTS = [
  { stat: "8M+",  label: "Muslim travelers visiting Thailand each year (2024)" },
  { stat: "4.6%", label: "Of Thailand's population is Muslim — concentrated in the south" },
  { stat: "1.4B", label: "Global muslim travel market (USD, 2024 Mastercard-CR report)" },
  { stat: "+47%", label: "GCC travel growth to Thailand in the last 24 months" },
  { stat: "฿38K", label: "Average spend per GCC family trip to Thailand" },
  { stat: "100+", label: "CICOT-certified halal restaurants in Bangkok alone" },
  { stat: "5×",   label: "Daily prayers — most malls now have a quiet room" },
];

export function FactCard() {
  const f = FACTS[Math.floor(Math.random() * FACTS.length)];
  return (
    <article className="card-editorial flex flex-col justify-center bg-gradient-to-br from-gold-50 via-amber-50 to-rose-50 p-6 dark:from-gold-950/40 dark:via-amber-950/30 dark:to-rose-950/30 sm:p-7">
      <div className="text-[10px] uppercase tracking-widest text-gold-800 dark:text-gold-300">
        Did you know
      </div>
      <div className="mt-2 font-display text-5xl font-black tabular-nums text-gold-700 dark:text-gold-400 sm:text-6xl">
        {f.stat}
      </div>
      <p className="mt-3 text-sm leading-relaxed text-ink-800 dark:text-ink-200">
        {f.label}
      </p>
    </article>
  );
}

// ─────────────────── Did you know (niche-specific micro-explainer) ───────────
const TRIVIA: Record<string, { title: string; body: string; icon: string }[]> = {
  "halal-food": [
    { icon: "🥘", title: "CICOT vs. self-declared", body: "Only the green CICOT sticker counts as official Thai halal certification. 'Muslim-friendly' alone is a marketing label, not an audit." },
    { icon: "🌶", title: "Watch the fish sauce", body: "Some pad thai contains hidden fish sauce with shrimp paste fermented with alcohol — confirm the kitchen separates wok and utensils." },
  ],
  "muslim-hotel": [
    { icon: "🕌", title: "Qibla in every room?", body: "Real muslim-friendly hotels mark qibla (direction of Mecca) on the ceiling or with a sticker, not just on request." },
    { icon: "🍷", title: "Alcohol-free mini bar", body: "Ask about it before booking — most 'muslim friendly' hotels still stock it unless you specifically opt out." },
  ],
  "mosque": [
    { icon: "👟", title: "Shoe etiquette", body: "Most Bangkok mosques have shoe racks at the entrance. Bring socks if the floor's recently been mopped." },
  ],
  "halal-tour": [
    { icon: "⏰", title: "Friday Jum'ah breaks", body: "Good muslim-friendly tour guides pre-build Jum'ah prayer time into the schedule (~12:15-13:15)." },
  ],
  "halal-clinic": [
    { icon: "💊", title: "Gelatin in pills", body: "Many capsules use pork-derived gelatin. Ask for vegetable-cap alternatives — most Bangkok hospitals stock them on request." },
  ],
  "halal-beauty": [
    { icon: "💄", title: "Wudu-friendly polish", body: "Some nail salons offer water-permeable polish (Tuesday Polish, Inglot O2M) so wudu remains valid. Worth asking." },
  ],
  default: [
    { icon: "☪", title: "Trust Score, transparently", body: "Our formula is in About → Methodology. A higher payment cannot move it — ever." },
  ],
};

export function DidYouKnowCard({ niche }: { niche: Niche | string }) {
  const pool = TRIVIA[niche] ?? TRIVIA.default;
  const t = pool[Math.floor(Math.random() * pool.length)];
  return (
    <article className="card-editorial bg-gradient-to-br from-rose-50 via-pink-50 to-amber-50 p-6 dark:from-rose-950/30 dark:via-pink-950/30 dark:to-amber-950/30 sm:p-7">
      <div className="text-3xl">{t.icon}</div>
      <h3 className="mt-3 font-display text-base font-bold leading-tight text-islam-950 dark:text-islam-50 sm:text-lg">
        {t.title}
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-ink-700 dark:text-ink-300">
        {t.body}
      </p>
    </article>
  );
}
