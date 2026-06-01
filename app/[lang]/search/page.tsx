import type { Metadata } from "next";
import { SITE, SUPPORTED_LANGS } from "@/lib/i18n";
import type { Lang } from "@/lib/types";
import SearchClient from "@/components/SearchClient";

export const dynamic = "force-static";

export function generateStaticParams() {
  return SUPPORTED_LANGS.map((lang) => ({ lang }));
}

export const metadata: Metadata = {
  title: `Search — ${SITE.name}`,
  description: "Search across 760+ verified halal and muslim-friendly places in Thailand.",
  robots: { index: false, follow: true },
};

export default function SearchPage({
  params,
  searchParams,
}: {
  params: { lang: Lang };
  searchParams?: { q?: string };
}) {
  const { lang } = params;
  const initialQuery = (searchParams?.q || "").toString();
  return <SearchClient lang={lang} initialQuery={initialQuery} />;
}
