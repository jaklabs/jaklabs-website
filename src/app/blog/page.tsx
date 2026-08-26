import type { Metadata } from 'next'
import { getBlogPosts, getCategories } from '@/lib/blog-data'
import BlogIndex from './BlogIndex'

/**
 * The blog index — a SERVER component.
 *
 * It was a client component reading a hardcoded array, which meant the post
 * titles and summaries only existed after JavaScript ran. Crawlers mostly cope
 * with that; the retrieval pipelines behind AI assistants largely do not. Since
 * the entire point of this blog is to be found by both, the content is fetched
 * here and rendered into the HTML, and BlogIndex handles the animation.
 */

export const metadata: Metadata = {
  title: 'Blog | JAK Labs',
  description:
    'Practical writing on booking, intake and operations software for Michigan '
    + 'med spas, clinics and wellness businesses — from someone who audits their sites.',
  alternates: { canonical: '/blog' },
  openGraph: {
    type: 'website',
    url: '/blog',
    title: 'Blog | JAK Labs',
    description:
      'Booking, intake and operations software for Michigan med spas, clinics and wellness businesses.',
  },
}

// Rebuild at most every five minutes. A blog does not need per-request
// freshness, and static HTML is what both crawlers and readers want.
export const revalidate = 300

export default async function BlogPage() {
  // In parallel: neither depends on the other, and the page cannot render
  // until both are in.
  const [posts, categories] = await Promise.all([getBlogPosts(), getCategories()])

  return (
    <>
      {/* A Blog node tells an answer engine what this page IS, rather than
          leaving it to infer from markup. The posts are listed inline so the
          index itself is a retrievable summary of what exists here. */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Blog',
            '@id': 'https://jaklabs.io/blog',
            name: 'JAK Labs Blog',
            description:
              'Booking, intake and operations software for Michigan med spas, clinics and wellness businesses.',
            url: 'https://jaklabs.io/blog',
            publisher: {
              '@type': 'Organization',
              name: 'JAK Labs',
              url: 'https://jaklabs.io',
            },
            blogPost: posts.slice(0, 20).map((p) => ({
              '@type': 'BlogPosting',
              headline: p.title,
              description: p.excerpt,
              url: `https://jaklabs.io/blog/${p.slug}`,
              datePublished: p.publishedAt || undefined,
              author: { '@type': 'Person', name: p.authorName },
            })),
          }),
        }}
      />
      <BlogIndex posts={posts} categories={categories} />
    </>
  )
}
