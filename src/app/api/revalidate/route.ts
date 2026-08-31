import { revalidatePath } from 'next/cache'
import { NextResponse } from 'next/server'

/**
 * On-demand revalidation, so publishing a post actually shows it.
 *
 * WHY THIS EXISTS
 *
 * Publishing used to be two steps and nobody would have guessed the second.
 * The post went `published` in DynamoDB, the API returned it correctly, and the
 * blog index kept serving the old list — `x-nextjs-cache: STALE`, for well over
 * the 300s revalidate window. It took a full Amplify rebuild to appear.
 *
 * That is Amplify's SSR hosting: the ISR cache lives per Lambda instance with no
 * shared store, so time-based `revalidate` fires per instance if at all. A post
 * could sit published-and-invisible indefinitely, which looks like a broken CMS
 * rather than a caching quirk.
 *
 * So the CMS tells the site instead of the site guessing. The blogs Lambda calls
 * this whenever a post's published state changes.
 *
 * WHY IT IS AUTHENTICATED
 *
 * revalidatePath is cheap but not free — it drops cached pages and forces
 * regeneration on the next request. Unauthenticated, it is a trivial way to make
 * every request a cache miss and put load straight through to the API. The
 * secret is a shared value, not a user credential: it authorises "the CMS may
 * tell me a post changed", nothing more.
 */

export const runtime = 'nodejs'
// This route must never be cached itself.
export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  const secret = process.env.REVALIDATE_SECRET

  // Fail closed. With no secret configured, an open endpoint is worse than one
  // that does not work — say so plainly rather than silently accepting anything.
  if (!secret) {
    return NextResponse.json(
      { revalidated: false, error: 'REVALIDATE_SECRET is not configured' },
      { status: 503 },
    )
  }

  const provided = request.headers.get('x-revalidate-secret')
  if (provided !== secret) {
    return NextResponse.json({ revalidated: false }, { status: 401 })
  }

  let slug: string | undefined
  try {
    const body = await request.json()
    slug = typeof body?.slug === 'string' ? body.slug : undefined
  } catch {
    // A bare POST with no body is a valid "refresh the index" call.
  }

  // The index and the sitemap always change when any post's state changes.
  const paths = ['/blog', '/sitemap.xml']
  // The post itself, when one was named. Guarded so a hostile slug cannot be
  // used to revalidate arbitrary paths — only ever a child of /blog/.
  if (slug && /^[a-z0-9-]{1,120}$/.test(slug)) paths.push(`/blog/${slug}`)

  for (const p of paths) revalidatePath(p)

  return NextResponse.json({ revalidated: true, paths, at: Date.now() })
}
