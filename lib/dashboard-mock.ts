// Mock data for the dashboard demo. Eventually replaced by real DB queries.
// All values are realistic for a Bangkok muslim-friendly hotel using the SaaS.

import type { Niche } from "./types";

export interface MockBusiness {
  name: string;
  niche: Niche;
  city: string;
  trust_score: number;
  rank_in_city: number;
  total_in_city: number;
  rank_in_thailand: number;
  total_in_thailand: number;
  member_since: string;
  plan: "free" | "pro" | "featured";
  next_renewal: string;
}

export const MOCK_BUSINESS: MockBusiness = {
  name: "Al Meroz Hotel",
  niche: "muslim-hotel",
  city: "Bangkok",
  trust_score: 87,
  rank_in_city: 1,
  total_in_city: 32,
  rank_in_thailand: 2,
  total_in_thailand: 116,
  member_since: "2026-03-12",
  plan: "pro",
  next_renewal: "2026-06-25",
};

export interface MockInquiry {
  id: number;
  name: string;
  country: string;
  flag: string;
  email: string;
  whatsapp?: string;
  language: "EN" | "AR" | "MS" | "ID" | "KO" | "ZH" | "JA" | "TH";
  arrival: string;
  nights: number;
  guests: number;
  rooms: number;
  message_preview: string;
  status: "new" | "replied" | "booked" | "lost";
  received_at: string;
  sla_remaining_min: number;
}

export const MOCK_INQUIRIES: MockInquiry[] = [
  { id: 1, name: "Ahmed Al-Saud",     country: "Saudi Arabia",   flag: "🇸🇦", email: "ahmed.alsaud@example.com",    whatsapp: "+966-50-1234567", language: "AR", arrival: "2026-06-10", nights: 5, guests: 4, rooms: 2, message_preview: "Looking for connecting rooms, prayer mat needed, hala…", status: "new",     received_at: "13 min ago",  sla_remaining_min: 47 },
  { id: 2, name: "Siti Nurhaliza",    country: "Malaysia",       flag: "🇲🇾", email: "siti.n@example.com",                                       language: "MS", arrival: "2026-06-15", nights: 3, guests: 2, rooms: 1, message_preview: "Honeymoon trip, women-only spa hours available?",   status: "new",     received_at: "2 h ago",     sla_remaining_min: -78 },
  { id: 3, name: "Park Min-jun",      country: "South Korea",    flag: "🇰🇷", email: "minjun.park@example.com",                                   language: "KO", arrival: "2026-06-20", nights: 4, guests: 4, rooms: 2, message_preview: "한국어 가능한 직원 있나요? 가족여행입니다",        status: "replied", received_at: "4 h ago",     sla_remaining_min: 0 },
  { id: 4, name: "Fatma El-Sayed",    country: "Egypt",          flag: "🇪🇬", email: "fatma.s@example.com",         whatsapp: "+20-12-3456789", language: "AR", arrival: "2026-06-22", nights: 7, guests: 6, rooms: 3, message_preview: "Group booking — 3 rooms, halal welcome meal please",  status: "booked",  received_at: "yesterday",   sla_remaining_min: 0 },
  { id: 5, name: "Hassan Mohamed",    country: "UAE",            flag: "🇦🇪", email: "hassan.m@example.com",                                      language: "AR", arrival: "2026-07-01", nights: 5, guests: 3, rooms: 2, message_preview: "Arriving late, need 24h reception in Arabic",      status: "replied", received_at: "2 days ago",  sla_remaining_min: 0 },
  { id: 6, name: "Aisha Wijaya",      country: "Indonesia",      flag: "🇮🇩", email: "aisha.w@example.com",                                       language: "ID", arrival: "2026-07-05", nights: 3, guests: 4, rooms: 1, message_preview: "Famili 4 orang, kamar besar tersedia?",          status: "booked",  received_at: "3 days ago",  sla_remaining_min: 0 },
  { id: 7, name: "Yusuf Tan",         country: "Singapore",      flag: "🇸🇬", email: "yusuf.t@example.com",                                       language: "EN", arrival: "2026-07-12", nights: 2, guests: 2, rooms: 1, message_preview: "Business trip, need quiet room near prayer hall",   status: "lost",    received_at: "5 days ago",  sla_remaining_min: 0 },
  { id: 8, name: "Mariam Al-Qasimi",  country: "UAE",            flag: "🇦🇪", email: "mariam.q@example.com",        whatsapp: "+971-50-9876543", language: "AR", arrival: "2026-07-18", nights: 10, guests: 8, rooms: 4, message_preview: "Extended stay, family 8 people, halal kitchen access", status: "new",     received_at: "5 days ago",  sla_remaining_min: 0 },
];

// 30 days of daily metrics — for the home dashboard chart
export const MOCK_DAILY: { date: string; views: number; inquiries: number; bookings: number }[] = [
  { date: "Apr 26", views:  82, inquiries:  3, bookings: 1 },
  { date: "Apr 27", views:  95, inquiries:  5, bookings: 2 },
  { date: "Apr 28", views: 102, inquiries:  4, bookings: 1 },
  { date: "Apr 29", views:  88, inquiries:  3, bookings: 0 },
  { date: "Apr 30", views: 110, inquiries:  6, bookings: 2 },
  { date: "May 01", views: 125, inquiries:  8, bookings: 3 },
  { date: "May 02", views: 132, inquiries:  7, bookings: 2 },
  { date: "May 03", views: 118, inquiries:  5, bookings: 2 },
  { date: "May 04", views: 124, inquiries:  6, bookings: 2 },
  { date: "May 05", views: 142, inquiries:  9, bookings: 3 },
  { date: "May 06", views: 156, inquiries: 11, bookings: 4 },
  { date: "May 07", views: 168, inquiries: 13, bookings: 5 },
  { date: "May 08", views: 175, inquiries: 14, bookings: 4 },
  { date: "May 09", views: 162, inquiries: 12, bookings: 5 },
  { date: "May 10", views: 180, inquiries: 15, bookings: 6 },
  { date: "May 11", views: 192, inquiries: 16, bookings: 6 },
  { date: "May 12", views: 208, inquiries: 18, bookings: 7 },
  { date: "May 13", views: 215, inquiries: 17, bookings: 5 },
  { date: "May 14", views: 224, inquiries: 19, bookings: 6 },
  { date: "May 15", views: 248, inquiries: 22, bookings: 8 },
  { date: "May 16", views: 256, inquiries: 21, bookings: 7 },
  { date: "May 17", views: 262, inquiries: 23, bookings: 8 },
  { date: "May 18", views: 245, inquiries: 19, bookings: 6 },
  { date: "May 19", views: 268, inquiries: 24, bookings: 9 },
  { date: "May 20", views: 285, inquiries: 26, bookings: 9 },
  { date: "May 21", views: 296, inquiries: 27, bookings: 10 },
  { date: "May 22", views: 308, inquiries: 29, bookings: 11 },
  { date: "May 23", views: 312, inquiries: 28, bookings: 10 },
  { date: "May 24", views: 324, inquiries: 31, bookings: 12 },
  { date: "May 25", views: 342, inquiries: 33, bookings: 13 },
];

export const MOCK_KPIS = {
  inquiries_30d: 446,
  inquiries_prev_30d: 312,
  bookings_30d: 158,
  bookings_prev_30d: 102,
  conversion_pct: 35.4,
  conversion_prev_pct: 32.7,
  revenue_thb: 568_500,
  revenue_prev_thb: 421_000,
};

// Trust Score breakdown — what's earning points, what's leaking points
export const MOCK_TRUST_BREAKDOWN = [
  { label: "Google Reviews",        weight: 18, earned: 17, max: 20, color: "islam" },
  { label: "Source diversity",      weight: 15, earned: 15, max: 15, color: "islam" },
  { label: "Halal signal (text)",   weight: 12, earned: 11, max: 15, color: "gold"  },
  { label: "Photo coverage",        weight: 12, earned:  8, max: 15, color: "gold"  },
  { label: "Community mentions",    weight: 10, earned:  9, max: 10, color: "islam" },
  { label: "Languages supported",   weight: 10, earned: 10, max: 10, color: "islam" },
  { label: "Website depth",         weight:  8, earned:  6, max: 10, color: "gold"  },
  { label: "Video coverage",        weight:  7, earned:  4, max:  5, color: "islam" },
];

// Anonymized competitors in same niche + city
export const MOCK_COMPETITORS = [
  { anon: "Hotel A · Pratunam",   trust_score: 81, inquiries_30d: 312, response_min: 38, halal_signal: true,  partnership: false },
  { anon: "Hotel B · Sukhumvit",  trust_score: 79, inquiries_30d: 298, response_min: 52, halal_signal: false, partnership: true  },
  { anon: "Hotel C · Silom",      trust_score: 76, inquiries_30d: 245, response_min: 78, halal_signal: true,  partnership: false },
];

export const MOCK_TRUST_TIPS = [
  { title: "Add 12 more photos",          impact: "+3 points", body: "Your photo coverage is at 8/15. Upload 12 photos showing prayer corner, qibla direction, family rooms — would boost your photo signal." },
  { title: "Reply to 3 dormant reviews",  impact: "+2 points", body: "There are 3 Google reviews from 6+ months ago without a response. Replies in Arabic & English signal active management." },
  { title: "Submit CICOT verification",   impact: "+4 points", body: "You have halal kitchen text mentions but no CICOT certificate ID on file. Upload the cert to lock the highest halal signal weight." },
];

// ---- Daily digest (Airbnb Host style) ----
export interface DailyHighlight {
  icon: string;
  title: string;
  body: string;
  cta?: { label: string; href: string };
  tone: "neutral" | "urgent" | "celebrate";
}

export const MOCK_DAILY_DIGEST: DailyHighlight[] = [
  {
    icon: "⏰",
    title: "1 inquiry waiting · 47 min left on SLA",
    body: "Ahmed Al-Saud (🇸🇦) asked about prayer kit & connecting rooms 13 min ago. Reply now to keep streak alive.",
    cta: { label: "Reply now", href: "/dashboard/inbox" },
    tone: "urgent",
  },
  {
    icon: "📈",
    title: "Trust Score is up 2 points this week",
    body: "87 → 89 expected after Friday's Reddit thread mention. Halal kitchen text-mining detected 3 new signals.",
    cta: { label: "See breakdown", href: "/dashboard/insights" },
    tone: "celebrate",
  },
  {
    icon: "👥",
    title: "GCC inquiries +47% week-over-week",
    body: "Ramadan-prep season. 14 of last 30 came from Saudi · UAE · Egypt. Consider an Arabic landing add-on for the property page.",
    cta: { label: "Edit listing", href: "/dashboard/listings" },
    tone: "neutral",
  },
];

// ---- AI insight cards (long-form smart bullets) ----
export interface AIInsight {
  emoji: string;
  category: "trend" | "competitor" | "opportunity" | "warning";
  title: string;
  body: string;
  metric?: string;
}

export const MOCK_AI_INSIGHTS: AIInsight[] = [
  {
    emoji: "🇸🇦",
    category: "trend",
    title: "GCC bookings now 41% of revenue — up from 28% last quarter",
    body: "Saudi · UAE · Egypt represent your fastest-growing segment. Adding an Arabic-only PDF brochure (free) historically lifts conversion 18% for similar properties.",
    metric: "+13 pp vs Q1",
  },
  {
    emoji: "🥈",
    category: "competitor",
    title: "Hotel B (Sukhumvit) just turned on Featured — they'll appear above you in 60% of city searches",
    body: "Their Trust Score is 79 (yours: 87) but Featured placement reorders results. Match by upgrading or hold and watch — most Featured trials don't renew if Trust gap is >5 points.",
  },
  {
    emoji: "📸",
    category: "opportunity",
    title: "Your photo coverage is 8/15 — lowest of your top-3 components",
    body: "Properties at full photo coverage convert 31% better. Recommended uploads: prayer corner (qibla marked), family suite, women-only pool hours, halal breakfast spread.",
    metric: "+3 trust pts available",
  },
  {
    emoji: "⏰",
    category: "warning",
    title: "Average reply time slipped to 42 min — was 28 min two weeks ago",
    body: "Still inside 1h SLA, but trending up. Saturday saw 3 inquiries during 11am–1pm — consider auto-acknowledgment template while staff are at jum'ah prayer.",
  },
];

// ---- Streak / Achievement (Linear cycle style) ----
export const MOCK_STREAKS = {
  reply_under_1h_days: 23,
  trust_top_1_city_months: 3,
  inquiries_total_lifetime: 1842,
  bookings_total_lifetime: 612,
};

export const MOCK_ACHIEVEMENTS = [
  { icon: "🔥", title: "23-day SLA streak",  desc: "Every inquiry answered within 1h for 23 straight days", earned: true,  level: "Gold" },
  { icon: "🏆", title: "#1 in Bangkok",       desc: "Top of muslim-friendly hotels in city, 3 months running", earned: true,  level: "Diamond" },
  { icon: "🌍", title: "Polyglot",            desc: "Replied in 5+ languages this quarter (EN/AR/MS/ID/KO)",   earned: true,  level: "Silver" },
  { icon: "📸", title: "Full gallery",        desc: "Upload 15+ photos covering all key amenities",            earned: false, level: "Bronze" },
  { icon: "💎", title: "1000 inquiries",      desc: "Hit lifetime 1k mark — at 1,842, you're past it!",       earned: true,  level: "Diamond" },
];

// ---- Real-time activity feed (Linear-style) ----
export interface ActivityEvent {
  ago: string;
  type: "inquiry" | "review" | "booking" | "trust" | "view";
  emoji: string;
  text: string;
}

export const MOCK_ACTIVITY: ActivityEvent[] = [
  { ago: "just now",  type: "view",    emoji: "👁",  text: "Listing viewed from 🇸🇦 Riyadh (mobile)" },
  { ago: "2 min ago", type: "view",    emoji: "👁",  text: "Listing viewed from 🇲🇾 KL (desktop)" },
  { ago: "13 min ago", type: "inquiry", emoji: "✉",  text: "New inquiry · Ahmed Al-Saud (🇸🇦 SA) · 4 guests, 5 nights" },
  { ago: "47 min ago", type: "review",  emoji: "★",  text: "New Google review · 5 ★ from Fatma S. — 'best halal hotel in Bangkok'" },
  { ago: "1 h ago",   type: "view",    emoji: "👁",  text: "Listing viewed from 🇰🇷 Seoul (mobile)" },
  { ago: "2 h ago",   type: "inquiry", emoji: "✉",  text: "New inquiry · Siti Nurhaliza (🇲🇾 MY) · honeymoon" },
  { ago: "3 h ago",   type: "booking", emoji: "✓",  text: "Booking confirmed · Park Min-jun (🇰🇷 KR) · ฿18,500" },
  { ago: "5 h ago",   type: "trust",   emoji: "📈",  text: "Trust Score updated · 87 (no change)" },
  { ago: "6 h ago",   type: "review",  emoji: "★",  text: "New Pantip mention · 'Al Meroz Bangkok ฮาลาล'" },
];

// ---- Today vs Yesterday comparison ----
export const MOCK_TODAY_VS_YESTERDAY = {
  inquiries_today: 5,
  inquiries_yesterday: 3,
  bookings_today: 2,
  bookings_yesterday: 1,
  views_today: 142,
  views_yesterday: 118,
  replies_within_1h_today: 5,
  replies_within_1h_yesterday: 3,
};

export const MOCK_INVOICES = [
  { id: "INV-2026-005", date: "2026-05-25", amount: 599,  status: "due",   plan: "Pro · monthly" },
  { id: "INV-2026-004", date: "2026-04-25", amount: 599,  status: "paid",  plan: "Pro · monthly" },
  { id: "INV-2026-003", date: "2026-03-25", amount: 599,  status: "paid",  plan: "Pro · monthly" },
  { id: "INV-2026-002", date: "2026-02-25", amount: 599,  status: "paid",  plan: "Pro · monthly" },
  { id: "INV-2026-001", date: "2026-01-25", amount: 0,    status: "free",  plan: "Free trial" },
];
