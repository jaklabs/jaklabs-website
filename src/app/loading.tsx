/**
 * The route-level loading state.
 *
 * Shown while a server component streams. Most of this site is static and
 * appears instantly, so this mostly surfaces on the blog, whose posts come from
 * DynamoDB through an API -- exactly the route where a visitor would otherwise
 * stare at a blank dark rectangle and assume the page is broken.
 *
 * A pulse rather than a spinner: a spinner suggests an operation that might
 * fail, a skeleton suggests content that is arriving. Deliberately plain, since
 * the whole point is that it is replaced within a moment.
 */
export default function Loading() {
  return (
    <main
      className="flex min-h-[70vh] items-center justify-center px-6 py-24"
      aria-busy="true"
      aria-live="polite"
    >
      <div className="w-full max-w-2xl">
        <span className="sr-only">Loading…</span>
        <div className="animate-pulse space-y-5" aria-hidden="true">
          <div className="h-3 w-24 rounded bg-neon-purple/30" />
          <div className="h-10 w-3/4 rounded bg-white/10" />
          <div className="h-10 w-1/2 rounded bg-white/10" />
          <div className="space-y-3 pt-4">
            <div className="h-4 w-full rounded bg-white/5" />
            <div className="h-4 w-11/12 rounded bg-white/5" />
            <div className="h-4 w-4/6 rounded bg-white/5" />
          </div>
        </div>
      </div>
    </main>
  )
}
