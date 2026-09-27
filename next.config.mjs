/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Cover images uploaded through the CMS are served from the media
    // CloudFront distribution, not from /public. next/image refuses any remote
    // host that is not listed here — the symptom is a hard 500 on the article
    // page, not a broken image.
    remotePatterns: [
      { protocol: 'https', hostname: 'd2ei57nf9fqty3.cloudfront.net' },
    ],
  },

  async redirects() {
    // Three pages advertised services JAK Labs does not sell: brand strategy,
    // marketing campaigns and SEO retainers. Ranking for work you cannot take
    // is worse than not ranking — every enquiry is an hour spent saying no, and
    // the visitor who actually needed operations software never saw it offered.
    //
    // Permanent redirects rather than deletions so any existing inbound link
    // still lands somewhere useful and passes its value to /services.
    //
    // THE REDIRECTS STAY; THE PAGES ARE GONE. The four page.tsx files behind
    // these sources were deleted 2026-09-26 — 3,040 lines no request could ever
    // reach, because a redirect here is matched before routing and the files
    // were in neither the sitemap nor any link. They still cost build time and
    // still turned up in every search of this codebase. Deleting a REDIRECT, by
    // contrast, would strand real inbound links — so these entries are
    // permanent in both senses, and must outlive the pages they replaced.
    return [
      { source: '/brand-strategy', destination: '/services', permanent: true },
      { source: '/marketing-strategy', destination: '/services', permanent: true },
      // SEO is SOLD AGAIN as of 2026-09-20 — a one-off Local SEO Audit at a
      // published price. So this no longer redirects because the work is not
      // taken; it redirects to the offering itself.
      //
      // The old 745-line /seo-marketing page was NOT revived with the offering
      // and has since been deleted:
      // it is written in the "we" voice of the original template, carries a
      // "proven results" claim, and would compete with /services for the same
      // words — which is the reason /app-development is on this list two lines
      // down. One page, one set of words. That reasoning outlives the file:
      // restoring it from git history would reintroduce the problem, not
      // correct an oversight.
      { source: '/seo-marketing', destination: '/services#local-seo', permanent: true },
      // Not because the work is not sold — it is the core offering — but because
      // /services now describes it, and two pages competing for the same words
      // beat each other rather than the competition.
      { source: '/app-development', destination: '/services', permanent: true },
    ]
  },
};

export default nextConfig;
