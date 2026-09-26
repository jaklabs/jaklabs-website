'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { RefreshCw, ArrowLeft } from 'lucide-react'

/**
 * The route-level error boundary.
 *
 * Without this file, an unhandled render error in production shows Next's
 * default screen -- a bare "Application error: a client-side exception has
 * occurred" with no navigation and no way back. The visitor's only move is the
 * back button, and the page gives them no reason to believe a retry would help.
 *
 * MUST be a client component with this exact filename and signature; that is
 * Next's contract for an error boundary, not a style choice.
 *
 * Note what this deliberately does NOT do: it does not print `error.message`.
 * A production stack trace or an internal message on a public marketing page
 * leaks implementation detail and tells a visitor nothing they can act on. The
 * digest is shown instead -- it is the stable id that matches a server log, so
 * if someone quotes it, the actual error is findable.
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // The console is the only sink here today. If an error reporter is ever
    // added, this is the one place it hooks in.
    console.error('Unhandled route error:', error)
  }, [error])

  return (
    <main className="relative flex min-h-[70vh] items-center justify-center overflow-hidden px-6 py-24">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-neon-pink/15 blur-[120px]"
      />

      <div className="relative mx-auto max-w-xl text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-neon-pink">
          Something broke
        </p>

        <h1 className="mt-4 text-4xl font-bold text-white sm:text-5xl">
          This page didn&apos;t load
        </h1>

        <p className="mx-auto mt-5 max-w-md text-lg leading-relaxed text-white/60">
          A genuine fault on my side, not anything you did. Trying again usually
          works — if it doesn&apos;t, tell me and I&apos;ll fix it properly.
        </p>

        <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <button
            onClick={reset}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 text-base font-medium text-white transition-all duration-300 hover:bg-primary-dark hover:shadow-lg hover:shadow-primary/25"
          >
            <RefreshCw className="h-4 w-4" />
            Try again
          </button>
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/20 bg-transparent px-6 py-3 text-base font-medium text-white transition-all duration-300 hover:bg-white/10"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to the homepage
          </Link>
        </div>

        {error.digest && (
          <p className="mt-10 font-mono text-xs text-white/30">
            Reference: {error.digest}
          </p>
        )}
      </div>
    </main>
  )
}
