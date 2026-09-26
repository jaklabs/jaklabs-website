import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

/**
 * The 404 page.
 *
 * Until this file existed, a wrong URL on jaklabs.io served Next's stock
 * "404: This page could not be found." -- black text on a white page, no
 * navigation, no brand, no way onward. On a site whose whole argument is that
 * the owner ships finished software, that page was the counter-argument.
 *
 * A server component on purpose: nothing here is interactive, so it costs no
 * JavaScript. The root layout still wraps it, so the navbar and footer come
 * along and the visitor is never stranded.
 */
export const metadata: Metadata = {
  title: 'Page not found',
  description: 'That page does not exist. Here is the way back.',
  // A 404 must never be indexed -- otherwise Google lists an error page under
  // the brand, which is worse than the missing page it replaced.
  robots: { index: false, follow: true },
}

const ROUTES = [
  { href: '/services', label: 'Services & pricing', hint: 'Fixed scope, published prices' },
  { href: '/work', label: 'Work', hint: 'What I have actually shipped' },
  { href: '/blog', label: 'Blog', hint: 'How the systems get built' },
  { href: '/contact', label: 'Book a free audit', hint: '30 minutes, no signup' },
]

export default function NotFound() {
  return (
    <main className="relative flex min-h-[70vh] items-center justify-center overflow-hidden px-6 py-24">
      {/* Same ambient wash the hero uses, so this reads as part of the site. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-neon-purple/20 blur-[120px]"
      />

      <div className="relative mx-auto max-w-2xl text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-neon-purple">
          404
        </p>

        <h1 className="mt-4 text-4xl font-bold text-white sm:text-5xl">
          That page isn&apos;t here
        </h1>

        <p className="mx-auto mt-5 max-w-lg text-lg leading-relaxed text-white/60">
          The link is wrong, or the page moved. Either way it&apos;s on me, not you —
          here&apos;s where everything actually lives.
        </p>

        <div className="mt-10 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {ROUTES.map((r) => (
            <Link
              key={r.href}
              href={r.href}
              className="group rounded-xl border border-white/10 bg-white/5 p-4 text-left transition-all duration-300 hover:border-neon-purple/50 hover:bg-white/10"
            >
              <span className="flex items-center justify-between text-base font-semibold text-white">
                {r.label}
                <ArrowRight className="h-4 w-4 text-neon-purple opacity-0 transition-opacity group-hover:opacity-100" />
              </span>
              <span className="mt-1 block text-sm text-white/50">{r.hint}</span>
            </Link>
          ))}
        </div>

        <p className="mt-10 text-sm text-white/40">
          Looking for something specific?{' '}
          <Link href="/contact" className="text-neon-purple underline-offset-4 hover:underline">
            Ask me directly
          </Link>
          .
        </p>
      </div>
    </main>
  )
}
