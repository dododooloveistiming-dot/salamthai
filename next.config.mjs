/** @type {import('next').NextConfig} */
const nextConfig = {
  // Hybrid: directory pages still pre-render (SSG), but /api and /dashboard
  // run on Vercel's serverless runtime so we can do auth + DB for the
  // business dashboard. Static export removed for this reason.
  images: { unoptimized: true },
  trailingSlash: true,
  experimental: { typedRoutes: false },

  // Legacy WordPress URLs (the site was migrated off WP). Handled here as static
  // 301s — no compute, cached at the edge — so we preserve any remaining link
  // equity by sending crawlers to the closest new page. Anything NOT listed
  // here (and not a real /[lang]/… route) now 404s via the [lang] dynamicParams
  // guard; obvious injected spam returns 410 via middleware.
  async redirects() {
    return [
      { source: "/about-us/", destination: "/en/about/", permanent: true },
      { source: "/aboutt-us/", destination: "/en/about/", permanent: true },
      { source: "/contact/", destination: "/en/about/", permanent: true },
      { source: "/contact-us/", destination: "/en/about/", permanent: true },
      { source: "/faq/", destination: "/en/how-we-verify/", permanent: true },
      { source: "/faq-2/", destination: "/en/how-we-verify/", permanent: true },
      { source: "/blog/", destination: "/en/wiki/", permanent: true },
      { source: "/blog-1/", destination: "/en/wiki/", permanent: true },
      { source: "/listar-subject/", destination: "/en/search/", permanent: true },
      { source: "/home/", destination: "/en/", permanent: true },
      { source: "/2834-2/", destination: "/en/", permanent: true },
    ];
  },
};

export default nextConfig;
