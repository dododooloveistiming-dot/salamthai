# Setup guide — Real DB + Auth + Payments

When you're ready to switch from demo dashboard to real payments, follow these steps in order. Total time: ~90 min.

---

## 1. Database — Neon Postgres (10 min)

```
1. Vercel Dashboard → salaamthailand project → Storage tab
2. Create New → Postgres → Neon
3. Region: Singapore (closest to Thailand)
4. Database name: salaamthailand-prod
5. Click "Connect Project" — Vercel auto-adds these env vars:
     DATABASE_URL
     POSTGRES_URL
     POSTGRES_URL_NON_POOLING
     POSTGRES_PRISMA_URL
6. Done. No copy/paste needed.
```

After creation, Neon free tier gives 0.5 GB storage + 3 GB transfer/mo. Enough for ~5,000 active businesses.

---

## 2. Auth.js setup (15 min)

Restore the Inquiry MVP code that's currently disabled:

```bash
cd C:\Users\yunmin\Desktop\salaamthailand
git checkout d9b06a4 -- app/api/auth lib/auth.ts lib/db.ts lib/quota.ts lib/notify.ts drizzle
```

Then generate NextAuth secret:

```bash
# Windows PowerShell
[Convert]::ToBase64String([Security.Cryptography.RandomNumberGenerator]::GetBytes(32))

# Or Mac/Linux
openssl rand -base64 32
```

Add to Vercel project env vars:
```
NEXTAUTH_SECRET=<paste output>
NEXTAUTH_URL=https://salaamthailand.com
```

### Google OAuth (recommended for business owners)

```
1. https://console.cloud.google.com/apis/credentials
2. Create Credentials → OAuth client ID → Web application
3. Authorized redirect URIs:
     https://salaamthailand.com/api/auth/callback/google
4. Copy Client ID + Client Secret → Vercel env vars:
     GOOGLE_CLIENT_ID
     GOOGLE_CLIENT_SECRET
```

---

## 3. Drizzle schema push (5 min)

After DB is set up:

```bash
cd C:\Users\yunmin\Desktop\salaamthailand
npm install
npm run db:push   # creates tables from drizzle/schema.ts
```

This creates: `users`, `listings`, `listingClaims`, `inquiries`, `subscriptions`, plus Auth.js session tables.

---

## 4. Resend (email) — 15 min

```
1. https://resend.com → Sign up (free 3K emails/month)
2. Verify domain salaamthailand.com:
   - Resend gives 3 DNS records (SPF + DKIM + Return-Path)
   - Add to Vercel Domain DNS or your registrar
3. API Keys → Create API key (full access)
4. Add to Vercel env vars:
     RESEND_API_KEY=re_xxxxxxxxxxxxx
     RESEND_FROM_EMAIL=hello@salaamthailand.com
```

After verification, test:

```js
// lib/notify.ts already wired — just check existing email send path works
// e.g. inquiry-received notification flows through this
```

---

## 5. Stripe (payments) — 30 min

### Step 1 — Create account

```
1. https://dashboard.stripe.com → Sign up
2. Activate account (provide business details for live mode)
3. For testing first: use test mode (toggle top-left)
```

### Step 2 — Create products

In Stripe Dashboard → Products → Add product (do this twice):

**Pro plan**
```
Name: Salaam Thailand · Pro
Description: Unlimited inquiries · 1h SLA · Insights & benchmarks
Pricing: Recurring · Monthly · ฿599 THB
→ Copy the price_xxx ID
```

**Featured plan**
```
Name: Salaam Thailand · Featured
Description: Pro + Top placement + Named competitor benchmarks
Pricing: Recurring · Monthly · ฿1,999 THB
→ Copy the price_xxx ID
```

### Step 3 — API keys

```
Dashboard → Developers → API keys
Copy:
  Publishable key (pk_test_... or pk_live_...) → NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
  Secret key (sk_test_... or sk_live_...) → STRIPE_SECRET_KEY
```

Add Price IDs to Vercel:
```
NEXT_PUBLIC_STRIPE_PRICE_PRO=price_xxxxxxxx
NEXT_PUBLIC_STRIPE_PRICE_FEATURED=price_xxxxxxxx
```

### Step 4 — Webhook endpoint

Stripe sends events (subscription created, payment failed, etc) to a webhook URL we host:

```
1. Dashboard → Developers → Webhooks → Add endpoint
2. URL: https://salaamthailand.com/api/stripe/webhook
3. Events to listen for:
     - customer.subscription.created
     - customer.subscription.updated
     - customer.subscription.deleted
     - invoice.payment_succeeded
     - invoice.payment_failed
4. Reveal signing secret (whsec_...) → add to Vercel:
     STRIPE_WEBHOOK_SECRET=whsec_xxxxxxx
```

### Step 5 — Test the flow

```
Stripe Dashboard → Customers → Find a test customer
→ Add subscription → use test card 4242 4242 4242 4242
→ verify the webhook fires (Webhook Events log)
→ verify our app marks the user's subscription.tier = "pro"
```

---

## 6. Switch live (when ready)

Once test flow works:

```
1. Stripe Dashboard → toggle Live mode (top-left)
2. Re-create the 2 products in Live mode (separate Price IDs)
3. Re-create the webhook (live mode has its own signing secret)
4. Update all 5 Stripe env vars in Vercel to use live keys
5. Redeploy
```

---

## 7. Restore the dashboard data flow

Currently `app/[lang]/dashboard/*` uses `lib/dashboard-mock.ts`. To switch to real data:

```ts
// app/[lang]/dashboard/page.tsx
// Replace:
import { MOCK_BUSINESS, MOCK_INQUIRIES, ... } from "@/lib/dashboard-mock";

// With (after Auth.js is restored):
import { auth } from "@/lib/auth";
import { getCurrentBusiness, getInquiries, getKPIs } from "@/lib/dashboard-data";

const session = await auth();
const business = await getCurrentBusiness(session.user.id);
const inquiries = await getInquiries(business.id);
const kpis = await getKPIs(business.id);
```

`lib/dashboard-data.ts` doesn't exist yet — create it when DB is ready. Schema sketch:

```ts
import { db, listings, inquiries, subscriptions } from "@/lib/db";
import { eq, gte, desc } from "drizzle-orm";

export async function getCurrentBusiness(userId: string) { /* ... */ }
export async function getInquiries(listingId: string)    { /* ... */ }
export async function getKPIs(listingId: string)         { /* ... */ }
```

---

## 8. Cost estimate at scale

| Stage | Listings | Users | Pro subs | Monthly cost |
|---|---|---|---|---|
| Month 1 | 760 (mock) | 0 | 0 | $0 (free tiers) |
| Month 3 | 1,200 | 50 claimed | 5 pro | $0 still |
| Month 6 | 2,000 | 300 claimed | 30 pro | ~$25 (Neon scale-up) |
| Year 1  | 3,500 | 1,000 claimed | 150 pro + 10 featured | ~$80 (Neon + Resend pro) |

Stripe fees: 2.9% + 30¢ per transaction. On ฿599 = ฿17 + ฿10 ≈ ฿27 per pro subscription per month. Net: ฿572.

---

## Quick checklist

```
[ ] Neon DB created (Vercel Storage tab)
[ ] git checkout — restore Auth/Drizzle files from d9b06a4
[ ] npm install
[ ] NEXTAUTH_SECRET + NEXTAUTH_URL added to Vercel
[ ] Google OAuth credentials added
[ ] npm run db:push  (creates tables)
[ ] Resend domain verified + API key added
[ ] Stripe products created (Pro ฿599, Featured ฿1,999)
[ ] Stripe API keys + webhook secret + Price IDs added
[ ] Test subscription flow with card 4242 4242 4242 4242
[ ] Switch to live mode + update env vars
[ ] Replace dashboard MOCK_ imports with real DB queries
[ ] Deploy and announce
```
