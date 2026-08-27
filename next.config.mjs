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
    return [
      { source: '/brand-strategy', destination: '/services', permanent: true },
      { source: '/marketing-strategy', destination: '/services', permanent: true },
      { source: '/seo-marketing', destination: '/services', permanent: true },
      // Not because the work is not sold — it is the core offering — but because
      // /services now describes it, and two pages competing for the same words
      // beat each other rather than the competition.
      { source: '/app-development', destination: '/services', permanent: true },
    ]
  },
};

export default nextConfig;
