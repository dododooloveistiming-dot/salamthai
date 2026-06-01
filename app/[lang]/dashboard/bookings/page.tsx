import type { Metadata } from "next";
import { SUPPORTED_LANGS } from "@/lib/i18n";
import { MOCK_BUSINESS } from "@/lib/dashboard-mock";
import type { Lang } from "@/lib/types";
import BookingsClient from "@/components/dashboard/BookingsClient";

export const dynamic = "force-static";

export function generateStaticParams() {
  return SUPPORTED_LANGS.map((lang) => ({ lang }));
}

export const metadata: Metadata = {
  title: "Bookings · Salaam Thailand",
  robots: { index: false, follow: false },
};

export default function DashboardBookingsPage(_props: { params: { lang: Lang } }) {
  return (
    <main className="mx-auto max-w-5xl px-4 py-8 lg:px-8">
      <header className="mb-6">
        <div className="eyebrow mb-1">Direct bookings</div>
        <h1 className="font-display text-2xl font-bold text-islam-950 dark:text-islam-50 sm:text-3xl">
          {MOCK_BUSINESS.name} · Booking requests
        </h1>
        <p className="mt-1 text-sm muted">
          Guests who booked directly through Salaam Thailand — no booking fee, no commission to a third-party. Reply within 24 hours to keep your SLA streak alive.
        </p>
      </header>

      <BookingsClient ownerPlaceId="demo-almeroz" />
    </main>
  );
}
