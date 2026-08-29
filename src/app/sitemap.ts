import type { MetadataRoute } from 'next'
import { getBlogPosts } from '@/lib/blog-data'
import { industrySlugs } from '@/lib/industries'

/**
 * The sitemap, with blog posts in it.
 *
 * There wasn't one. For a site whose whole strategy is being found, a sitemap is
 * the cheapest possible win: it tells a crawler what exists and when it last
 * changed, instead of leaving it to discover pages by following links.
 *
 * Regenerated on the same cadence as the blog, so a post published today is
 * listed today rather than at the next deploy.
 */
export const revalidate = 300

const BASE = 'https://jaklabs.io'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Static pages. Priority is a hint, not a ranking lever — the home page and
  // the service pages are what convert, so they lead.
  const pages = ([
    { url: BASE, changeFrequency: 'weekly', priority: 1 },
    { url: `${BASE}/services`, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${BASE}/about`, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE}/contact`, changeFrequency: 'monthly', priority: 0.7 },
    // The audit tool is the highest-intent page on the site.
    { url: `${BASE}/website-audit`, changeFrequency: 'monthly', priority: 0.95 },
    { url: `${BASE}/blog`, changeFrequency: 'weekly', priority: 0.9 },
    // The free tool. Linkable on its own merits, which is what earns the
    // inbound — the agency pages convert, this one gets shared.
    { url: `${BASE}/aura`, changeFrequency: 'monthly', priority: 0.8 },
    // The industry pages are the SEO/GEO surface: one page per category the
    // CRM can file a client under, written the way that buyer searches.
    { url: `${BASE}/industries`, changeFrequency: 'monthly', priority: 0.8 },
    // A different audience entirely — linked, but not competing with the
    // local-business pages for the same searches.
    { url: `${BASE}/engineering`, changeFrequency: 'monthly', priority: 0.7 },
  ] as const).map((p) => ({ ...p, lastModified: new Date() }))

  // A blog API outage must not produce a sitemap missing every post — better to
  // ship the static pages than to fail the route entirely. getBlogPosts already
  // returns [] rather than throwing.
  const posts = await getBlogPosts()

  return [
    ...pages,
    // Generated from the same list the pages are, so a new industry cannot be
    // added to the site and left out of the sitemap.
    ...industrySlugs().map((slug) => ({
      url: `${BASE}/industries/${slug}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    })),
    ...posts.map((post) => ({
      url: `${BASE}/blog/${post.slug}`,
      lastModified: post.updatedAt ? new Date(post.updatedAt) : new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
  ]
}
