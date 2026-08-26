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
};

export default nextConfig;
