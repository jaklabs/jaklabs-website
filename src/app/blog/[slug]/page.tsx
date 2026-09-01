import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getBlogPost, getBlogPosts, getRelatedPosts, FALLBACK_COVER } from '@/lib/blog-data'
import BlogArticle from './BlogArticle'

/**
 * One article — a SERVER component.
 *
 * Three jobs, none of which a client component can do:
 *
 *   1. Put the article text in the HTML. Crawlers mostly execute JavaScript;
 *      the retrieval pipelines behind AI assistants largely do not. A blog
 *      written to be cited has to be readable without running anything.
 *   2. Emit per-post <title>, description and canonical. A client page shares
 *      one static title across every article, so every post competes with
 *      itself in search results.
 *   3. Emit Article JSON-LD, which is what makes the post machine-readable
 *      rather than something a model has to infer from divs.
 */

export const revalidate = 300

interface Props {
  params: Promise<{ slug: string }>
}

/**
 * Pre-render every published post at build time.
 *
 * `dynamicParams` stays on (the default) so a post published after a build is
 * still served — it renders on first request and is cached from then on. Without
 * generateStaticParams the site works; with it, the posts that exist at build
 * time are already static, which is the faster path for the ones that matter.
 */
export async function generateStaticParams() {
  const posts = await getBlogPosts()
  return posts.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = await getBlogPost(slug)

  // A missing post still needs valid metadata — the 404 is rendered by the
  // page, and returning nothing here produces a page titled "undefined".
  if (!post) {
    return { title: 'Post not found', robots: { index: false, follow: false } }
  }

  const url = `/blog/${post.slug}`
  const image = post.coverImage || FALLBACK_COVER

  /**
   * Facebook needs the DIMENSIONS, not just the URL.
   *
   * Without og:image:width/height Facebook cannot lay the card out until it has
   * fetched and measured the image itself, so the FIRST share of a link — the
   * one that matters, because that is the post going up — renders small or with
   * no image at all. It looks correct later, once their scraper has caught up
   * and cached it, which is exactly why this is easy to miss: whoever reports it
   * is told to re-check and by then it works.
   *
   * Every cover is generated at 1200x630 by
   * marketing/scripts/make-covers-v5.py, and the stock fallback is the same
   * shape, so these are constants rather than something to measure per post.
   * 1200x630 is also the ratio Facebook and LinkedIn both render as a large
   * card; below 600x315 they both drop to the small thumbnail layout.
   */
  const OG_W = 1200
  const OG_H = 630

  return {
    // The root template appends the brand; adding it here renders it twice.
    title: post.title,
    description: post.excerpt,
    keywords: post.tags,
    authors: [{ name: post.authorName }],
    alternates: { canonical: url },
    openGraph: {
      type: 'article',
      url,
      title: post.title,
      description: post.excerpt,
      publishedTime: post.publishedAt || undefined,
      modifiedTime: post.updatedAt || undefined,
      authors: [post.authorName],
      tags: post.tags,
      images: [{
        url: image,
        width: OG_W,
        height: OG_H,
        alt: post.title,
        // PNG for the generated covers; the stock fallback is a JPEG. Naming
        // the wrong type is worse than omitting it, so only claim it when the
        // extension says so.
        type: image.endsWith('.png') ? 'image/png' : 'image/jpeg',
      }],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
      images: [{ url: image, width: OG_W, height: OG_H, alt: post.title }],
    },
  }
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params
  const post = await getBlogPost(slug)
  if (!post) notFound()

  const relatedPosts = await getRelatedPosts(post, 4)
  const url = `https://jaklabs.io/blog/${post.slug}`

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            {
              '@context': 'https://schema.org',
              '@type': 'BlogPosting',
              '@id': url,
              headline: post.title,
              description: post.excerpt,
              // Absolute, because a schema consumer has no page to resolve a
              // relative path against.
              image: post.coverImage?.startsWith('http')
                ? post.coverImage
                : `https://jaklabs.io${post.coverImage || FALLBACK_COVER}`,
              datePublished: post.publishedAt || undefined,
              dateModified: post.updatedAt || post.publishedAt || undefined,
              wordCount: post.content.replace(/<[^>]*>/g, ' ').trim().split(/\s+/).filter(Boolean).length,
              keywords: post.tags.join(', '),
              articleSection: post.category,
              inLanguage: 'en-US',
              mainEntityOfPage: { '@type': 'WebPage', '@id': url },
              author: {
                '@type': 'Person',
                name: post.authorName,
                url: 'https://jaklabs.io/about',
              },
              publisher: {
                '@type': 'Organization',
                name: 'JAK Labs',
                url: 'https://jaklabs.io',
                logo: {
                  '@type': 'ImageObject',
                  url: 'https://jaklabs.io/images/jaklabs-logo.png',
                },
              },
            },
            // Breadcrumbs give search results the Home › Blog › Post trail and
            // tell a model where this page sits in the site.
            {
              '@context': 'https://schema.org',
              '@type': 'BreadcrumbList',
              itemListElement: [
                { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://jaklabs.io' },
                { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://jaklabs.io/blog' },
                { '@type': 'ListItem', position: 3, name: post.title, item: url },
              ],
            },
          ]),
        }}
      />
      <BlogArticle post={post} relatedPosts={relatedPosts} />
    </>
  )
}
