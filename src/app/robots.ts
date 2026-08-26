import type { MetadataRoute } from 'next'

/**
 * robots.txt.
 *
 * Deliberately permissive to AI crawlers. The usual instinct is to block
 * GPTBot and friends to stop models training on your writing — but the entire
 * point of this blog is to be the source an assistant cites when a Michigan
 * clinic owner asks it who builds booking software. Blocking them would be
 * blocking the distribution channel.
 *
 * The sitemap reference is what makes a crawler find posts without waiting to
 * follow links to them.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: '*', allow: '/' }],
    sitemap: 'https://jaklabs.io/sitemap.xml',
    host: 'https://jaklabs.io',
  }
}
