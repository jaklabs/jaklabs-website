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

/** Posts change when someone publishes, not per request. Five minutes is plenty. */
const REVALIDATE = 300

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

/** Published posts, newest first. Drafts are never returned to an anonymous caller. */
export async function getBlogPosts(category?: string): Promise<BlogPost[]> {
  const qs = category ? `?status=published&category=${encodeURIComponent(category)}` : '?status=published'
  const { items } = await get<{ items: Partial<BlogPost>[] }>(`/blogs${qs}`, { items: [] })
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
