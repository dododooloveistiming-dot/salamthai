import type { Lang, Niche } from "@/lib/types";
import { SUPPORTED_LANGS } from "@/lib/i18n";
import { loadPlaces } from "@/lib/data";
import Header from "@/components/Header";
import SetHtmlLang from "@/components/SetHtmlLang";
import SiteFooter from "@/components/SiteFooter";

export function generateStaticParams() {
  return SUPPORTED_LANGS.map((lang) => ({ lang }));
}

const NO_FOUC =
  "(function(){try{var s=localStorage.getItem('theme');var d=s==='dark'||(!s&&window.matchMedia('(prefers-color-scheme: dark)').matches);if(d)document.documentElement.classList.add('dark');}catch(e){}})();";

export default function LangLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { lang: Lang };
}) {
  const { lang } = params;
  const bundle = loadPlaces();
  const byNiche = bundle.by_niche as Record<Niche, number>;
  const isRtl = lang === "ar";

  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: NO_FOUC }} />
      <SetHtmlLang lang={lang} />
      {/*
        SSR-side language + direction marker: even though the root <html lang>
        is fixed by Next.js root layout, this wrapping div carries lang/dir
        in the rendered HTML so crawlers (Google, Bing, AI bots) and screen
        readers see correct linguistic context for each language route.
      */}
      <div lang={lang} dir={isRtl ? "rtl" : "ltr"} className="min-h-screen">
        <Header lang={lang} byNiche={byNiche} />
        {children}
        <SiteFooter lang={lang} byNiche={byNiche} />
      </div>
    </>
  );
}
