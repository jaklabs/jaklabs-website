import 'server-only'

/**
 * Blog content, from the CMS.
 *
 * This file used to be a hardcoded array of five placeholder posts dated
 * January 2024, pointing at cover images that were never added to the repo,
 * while a fully built CMS sat deployed and empty. Posts now come from that API.
 *
 * SERVER ONLY — every caller is a server component, which is the point. Blog
 * content has to be in the HTML that arrives at a crawler or an answer engine,
 * not fetched by JavaScript after the page loads. `server-only` makes an
 * accidental client import a build error rather than a silent SEO regression.
 */

const API = process.env.BLOG_API_URL
  // The stage is v1, NOT prod. A wrong stage returns a bare 403 that reads like
  // a permissions problem rather than a wrong path.
  || 'https://eml064cbzg.execute-api.us-east-1.amazonaws.com/v1'

/**
 * How long the DATA cache lives — deliberately shorter than the page's.
 *
 * There are two caches in play and they are independent: the route segment's
 * `export const revalidate` decides when a page re-renders, and this decides
 * when the fetch underneath it re-reads the API. Setting both to 300 looks
 * tidy and is a trap. The page re-renders on its own boundary, finds the fetch
 * cache not yet stale, renders from OLD data, and caches that render for
 * another 300 seconds. The two timers drift out of phase and the index can sit
 * on stale content indefinitely — which is exactly what happened: a post went
 * live, appeared on the index, then vanished from it again on the next
 * re-render.
 *
 * Keeping the data window well inside the page window removes the phase
 * problem entirely. Whenever a page re-renders, the data behind it is at most
 * this old. Worst case for a new post to appear is page-revalidate + this.
 */
const REVALIDATE = 30

/** A post with no cover would crash next/image, which requires a non-empty src. */
export const FALLBACK_COVER = '/images/blogheader.jpg'

export interface BlogPost {
  id: string
  slug: string
  title: string
  excerpt: string
  content: string
  coverImage: string
  category: string
  tags: string[]
  publishedAt: string
  readingTime: number
  authorName: string
  updatedAt: string
}

export interface Category {
  id: string
  name: string
  slug: string
  description?: string
}

interface Envelope<T> { success: boolean; data: T }

/**
 * One fetch, with the failure mode chosen deliberately.
 *
 * A blog whose API is briefly unreachable should render as a blog with no posts
 * — not a 500 that takes the marketing site down with it. So this returns the
 * fallback and logs, rather than throwing. The one place that must NOT swallow
 * a failure is a single post lookup, which needs to tell a missing post apart
 * from a broken API; that caller checks for null itself.
 */
async function get<T>(path: string, fallback: T): Promise<T> {
  try {
    const res = await fetch(`${API}${path}`, { next: { revalidate: REVALIDATE } })
    if (!res.ok) {
      console.error(`blog API ${path} -> ${res.status}`)
      return fallback
    }
    const body = (await res.json()) as Envelope<T>
    return body.data ?? fallback
  } catch (err) {
    console.error(`blog API ${path} failed:`, err)
    return fallback
  }
}

function normalise(p: Partial<BlogPost>): BlogPost {
  return {
    id: p.id || '',
    slug: p.slug || '',
    title: p.title || 'Untitled',
    excerpt: p.excerpt || '',
    content: p.content || '',
    coverImage: p.coverImage || FALLBACK_COVER,
    category: p.category || '',
    tags: p.tags || [],
    // A published post always has publishedAt; falling back to updatedAt keeps
    // a date on the card rather than rendering "Invalid Date".
    publishedAt: p.publishedAt || p.updatedAt || '',
    readingTime: p.readingTime || 1,
    authorName: p.authorName || 'JD Kemp',
    updatedAt: p.updatedAt || p.publishedAt || '',
  }
}

/**
 * Published posts, newest first. Drafts are never returned to an anonymous caller.
 *
 * PAGINATED, and it has to be.
 *
 * This used to send no `limit`, so it took the API's default — which is 10. On
 * 2026-08-31 seven posts were published at once, the catalogue went to 15, and
 * the five oldest silently vanished from /blog and from the sitemap. Nothing
 * errored. The index looked completely normal; it was just missing a third of
 * the archive, and the only reason it was caught was counting the links after a
 * publish.
 *
 * Bumping the limit would have moved the same bug to post 51 — the handler caps
 * `limit` at 50 (`Math.min(parseInt(q.limit || '10'), 50)`), so any fixed number
 * is a cliff waiting for the archive to grow into it. Following `nextToken` has
 * no cliff.
 *
 * MAX_PAGES is a runaway guard, not a cap: at 50 per page it allows 1,000 posts,
 * and if it were ever hit it logs loudly rather than returning a quietly short
 * list. A truncation nobody can see is the thing this function is now designed
 * against.
 */
const PAGE_SIZE = 50
const MAX_PAGES = 20

export async function getBlogPosts(category?: string): Promise<BlogPost[]> {
  const base = category
    ? `?status=published&category=${encodeURIComponent(category)}`
    : '?status=published'

  const items: Partial<BlogPost>[] = []
  let nextToken: string | undefined
  let page = 0

  do {
    const qs = `${base}&limit=${PAGE_SIZE}${nextToken ? `&nextToken=${encodeURIComponent(nextToken)}` : ''}`
    const res = await get<{ items: Partial<BlogPost>[]; nextToken?: string }>(
      `/blogs${qs}`,
      { items: [] },
    )
    items.push(...res.items)
    nextToken = res.nextToken
    page += 1
  } while (nextToken && page < MAX_PAGES)

  if (nextToken) {
    console.error(
      `blog API: stopped after ${MAX_PAGES} pages with more posts remaining — `
      + `the index is truncated at ${items.length}. Raise MAX_PAGES.`,
    )
  }

  return items
    .map(normalise)
    .sort((a, b) => (b.publishedAt || '').localeCompare(a.publishedAt || ''))
}

/** One post, or null when there is no such published post. */
export async function getBlogPost(slug: string): Promise<BlogPost | null> {
  try {
    const res = await fetch(`${API}/blogs/${encodeURIComponent(slug)}`, {
      next: { revalidate: REVALIDATE },
    })
    if (!res.ok) return null
    const body = (await res.json()) as Envelope<Partial<BlogPost>>
    return body.data ? normalise(body.data) : null
  } catch (err) {
    console.error(`blog API /blogs/${slug} failed:`, err)
    return null
  }
}

export async function getCategories(): Promise<Category[]> {
  const { items } = await get<{ items: Category[] }>('/categories', { items: [] })
  return items
}

/**
 * Other posts worth reading next.
 *
 * Same category first, because that is the strongest signal of relevance and
 * internal links between related posts are how a topic cluster gets understood
 * as one. Topped up with anything else so the section is never half empty.
 */
export async function getRelatedPosts(post: BlogPost, limit = 3): Promise<BlogPost[]> {
  const all = (await getBlogPosts()).filter((p) => p.slug !== post.slug)
  const sameCategory = all.filter((p) => p.category === post.category)
  const rest = all.filter((p) => p.category !== post.category)
  return [...sameCategory, ...rest].slice(0, limit)
}
