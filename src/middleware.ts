import { NextResponse, type NextRequest } from 'next/server'

/**
 * Serves rank.jaklabs.io from the /rank route of this app.
 *
 * Amplify points the subdomain at the same branch as the apex, so the app has to
 * decide what a request means from its Host header. A rewrite (not a redirect)
 * keeps the URL bar showing rank.jaklabs.io while React renders /rank.
 */
const RANK_HOST = 'rank.'

export function middleware(request: NextRequest) {
  const host = request.headers.get('host')?.toLowerCase() ?? ''

  if (host.startsWith(RANK_HOST)) {
    const url = request.nextUrl.clone()
    // Already inside /rank (an internal navigation) -- leave it alone, or the
    // rewrite would stack into /rank/rank.
    if (!url.pathname.startsWith('/rank')) {
      url.pathname = url.pathname === '/' ? '/rank' : `/rank${url.pathname}`
      return NextResponse.rewrite(url)
    }
  }

  return NextResponse.next()
}

export const config = {
  // Static assets and metadata routes are served as-is; only page requests need
  // host-based routing.
  matcher: ['/((?!_next/static|_next/image|api|images|favicon.ico|robots.txt|sitemap.xml).*)'],
}
