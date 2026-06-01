// Mock data for the admin (operator) dashboard. You — the site owner — see
// this view to approve claims, confirm QR payments, manage the listing
// population, and monitor health.

export interface AdminClaim {
  id: number;
  placeName: string;
  placeCity: string;
  placeNiche: string;
  claimedBy: string;
  claimedEmail: string;
  claimedPhone: string;
  submittedAt: string;
  status: "pending" | "approved" | "rejected";
  verificationMethod: "email" | "phone" | "manual";
  notes?: string;
}

export const MOCK_CLAIMS: AdminClaim[] = [
  { id: 1, placeName: "Al Meroz Hotel",        placeCity: "Bangkok", placeNiche: "muslim-hotel", claimedBy: "Ahmed Hassan",    claimedEmail: "ahmed@almeroz.com",     claimedPhone: "+66-2-XXX-XXXX", submittedAt: "2 hours ago",  status: "pending", verificationMethod: "email" },
  { id: 2, placeName: "Yana Halal Restaurant",  placeCity: "Bangkok", placeNiche: "halal-food",   claimedBy: "Faisal Mohamed",  claimedEmail: "faisal@yanahalal.com",  claimedPhone: "+66-XX-XXX-XXXX", submittedAt: "5 hours ago", status: "pending", verificationMethod: "phone" },
  { id: 3, placeName: "Movenpick Resort Karon", placeCity: "Phuket",  placeNiche: "muslim-hotel", claimedBy: "Sarah Lim",       claimedEmail: "slim@movenpick.com",    claimedPhone: "+66-76-XXX-XXX",  submittedAt: "1 day ago",   status: "pending", verificationMethod: "email", notes: "Multi-brand chain — verify GM-level authorization" },
  { id: 4, placeName: "Bismillah Restaurant",   placeCity: "Bangkok", placeNiche: "halal-food",   claimedBy: "Rashid Ali",      claimedEmail: "rashid@bismillah.co.th", claimedPhone: "+66-2-XXX-XXXX", submittedAt: "2 days ago",  status: "approved", verificationMethod: "manual", notes: "Walk-in verification, owner present" },
  { id: 5, placeName: "Foodland Halal Bangkok", placeCity: "Bangkok", placeNiche: "halal-food",   claimedBy: "John Smith",      claimedEmail: "john@suspicious.com",   claimedPhone: "+1-555-0000",      submittedAt: "3 days ago",  status: "rejected", verificationMethod: "email", notes: "Email domain mismatch — possible impersonation" },
];

export interface AdminPayment {
  id: number;
  businessName: string;
  amount: number;
  reference: string;
  paidVia: "PromptPay" | "Bank transfer" | "KakaoPay" | "WeChat" | "USDT" | "Cash";
  submittedAt: string;
  status: "pending" | "confirmed" | "disputed";
  plan: "Pro" | "Featured";
}

export const MOCK_PAYMENTS: AdminPayment[] = [
  { id: 1, businessName: "Al Meroz Hotel",        amount: 599,   reference: "SALAAM-ALMERO-2606",   paidVia: "PromptPay",     submittedAt: "12 min ago",  status: "pending",   plan: "Pro" },
  { id: 2, businessName: "Yana Halal Restaurant", amount: 599,   reference: "SALAAM-YANAHA-2606",   paidVia: "Bank transfer", submittedAt: "1 hour ago",  status: "pending",   plan: "Pro" },
  { id: 3, businessName: "Movenpick Karon",       amount: 1999,  reference: "SALAAM-MOVENP-2606",   paidVia: "Bank transfer", submittedAt: "3 hours ago", status: "confirmed", plan: "Featured" },
  { id: 4, businessName: "Nasa Vegas Hotel",      amount: 599,   reference: "SALAAM-NASAVE-2606",   paidVia: "KakaoPay",      submittedAt: "yesterday",   status: "confirmed", plan: "Pro" },
  { id: 5, businessName: "Anonymous business",    amount: 500,   reference: "(no reference)",         paidVia: "Bank transfer", submittedAt: "2 days ago",  status: "disputed",  plan: "Pro" },
];

export const ADMIN_KPI = {
  active_pro_subscriptions: 47,
  active_featured_subscriptions: 6,
  monthly_revenue_thb: 47 * 599 + 6 * 1999,
  pending_claims: MOCK_CLAIMS.filter((c) => c.status === "pending").length,
  pending_payments: MOCK_PAYMENTS.filter((p) => p.status === "pending").length,
  disputed_payments: MOCK_PAYMENTS.filter((p) => p.status === "disputed").length,
  total_listings: 760,
  claimed_listings: 142,
  unclaimed_listings: 618,
};

export interface AdminListing {
  id: string;
  name: string;
  city: string;
  niche: string;
  trustScore: number;
  isClaimed: boolean;
  isFlagged: boolean;
  flagReason?: string;
  lastUpdated: string;
}

export const MOCK_FLAGGED_LISTINGS: AdminListing[] = [
  { id: "x1", name: "Halal Mega Buffet",   city: "Bangkok", niche: "halal-food",   trustScore: 32, isClaimed: false, isFlagged: true, flagReason: "Rating 5.0 with only 3 reviews — viral pattern",           lastUpdated: "yesterday" },
  { id: "x2", name: "Generic Muslim Hotel", city: "Phuket",  niche: "muslim-hotel", trustScore: 28, isClaimed: false, isFlagged: true, flagReason: "CICOT mention scraped but not verifiable on halal.or.th", lastUpdated: "2 days ago" },
  { id: "x3", name: "Bangkok Halal Spa",    city: "Bangkok", niche: "halal-beauty", trustScore: 19, isClaimed: false, isFlagged: true, flagReason: "Single Google review, all-zh content, possible spam",      lastUpdated: "5 days ago" },
];
