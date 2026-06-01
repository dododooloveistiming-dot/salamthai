import type { Metadata } from "next";
import { Inter, Playfair_Display, Amiri } from "next/font/google";
import "./globals.css";
import { SITE } from "@/lib/i18n";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const amiri = Amiri({
  subsets: ["arabic", "latin"],
  weight: ["400", "700"],
  variable: "--font-amiri",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.origin),
  title: { default: SITE.name, template: `%s — ${SITE.name}` },
  description: SITE.tagline.en,
  icons: {
    icon: [
      {
        url: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' rx='22' fill='%23022c22'/%3E%3Cpath d='M75 50a25 25 0 1 1-25-25 18 18 0 0 0 25 25z' fill='%23d4af37'/%3E%3C/svg%3E",
        type: "image/svg+xml",
      },
    ],
  },
  openGraph: {
    type: "website",
    url: SITE.origin,
    siteName: SITE.name,
    title: SITE.name,
    description: SITE.tagline.en,
  },
  twitter: { card: "summary_large_image", title: SITE.name, description: SITE.tagline.en },
  alternates: { canonical: SITE.origin },
  verification: {
    google: "OZH3rMwXyyzieHXa1-_5uweDBi2k88xsv58v3e67W5U",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable} ${amiri.variable}`}>
      <body>{children}</body>
    </html>
  );
}
