'use client'

import { useState } from 'react'
import Link from 'next/link'

/**
 * The self-serve website audit.
 *
 * Deliberately blunt: one field, one button, real answers in under a minute.
 * The point is to demonstrate competence rather than claim it — every other
 * agency site says "results-driven"; this one finds a real fault in your own
 * site while you watch.
 *
 * No email gate. Gating the result behind a form is the obvious move and the
 * wrong one: the thing that earns the call is the visitor seeing something true
 * about their own business, and asking for an address first means most never
 * get there. The offer to go deeper comes after they have been given something.
 */

const API = process.env.NEXT_PUBLIC_BLOG_API
  || 'https://eml064cbzg.execute-api.us-east-1.amazonaws.com/v1'

type Issue = { id: string; label: string; severity: 'high' | 'medium' | 'low'; finding: string; fix: string }
type Result = {
  url: string; reachable: boolean; message?: string
  loadSeconds?: number; consoleErrorCount?: number; issueCount?: number; checkCount?: number
  issues?: Issue[]; passed?: { id: string; label: string }[]; headline?: string; title?: string
}

const TONE: Record<string, string> = {
  high: 'border-red-500/40 bg-red-500/5',
  medium: 'border-amber-500/40 bg-amber-500/5',
  low: 'border-white/15 bg-white/5',
}

export default function AuditTool() {
  const [url, setUrl] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<Result | null>(null)

  async function run(e: React.FormEvent) {
    e.preventDefault()
    if (busy || !url.trim()) return
    setBusy(true); setError(null); setResult(null)
    try {
      const res = await fetch(`${API}/audit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: url.trim() }),
      })
      const body = await res.json()
      if (!body.success) throw new Error(body?.error?.message || 'That check could not be completed')
      setResult(body.data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Try again in a moment.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="mx-auto w-full max-w-3xl">
      <form onSubmit={run} className="flex flex-col gap-3 sm:flex-row">
        <input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="yourbusiness.com"
          aria-label="Your website address"
          className="flex-1 rounded-xl border border-white/15 bg-white/5 px-5 py-4 text-white
                     placeholder-white/30 outline-none transition focus:border-purple-400/60"
        />
        <button
          type="submit"
          disabled={busy || !url.trim()}
          className="rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 px-8 py-4 font-semibold
                     text-white transition hover:opacity-90 disabled:opacity-40"
        >
          {busy ? 'Checking…' : 'Check my site'}
        </button>
      </form>

      <p className="mt-3 text-sm text-white/40">
        Free, no signup. I load your homepage the way a phone would and report what breaks.
        Takes about 30 seconds.
      </p>

      {error && (
        <div className="mt-6 rounded-xl border border-red-500/40 bg-red-500/5 px-5 py-4 text-red-200">
          {error}
        </div>
      )}

      {busy && (
        <div className="mt-8 rounded-xl border border-white/10 bg-white/5 px-6 py-8 text-center text-white/50">
          Loading your homepage on a simulated phone and watching what happens…
        </div>
      )}

      {result && !result.reachable && (
        <div className="mt-8 rounded-xl border border-amber-500/40 bg-amber-500/5 px-6 py-6">
          <p className="font-semibold text-amber-200">{result.message}</p>
          <p className="mt-2 text-sm text-white/50">
            If your site is up and you can see it yourself, it may be blocking automated
            checks — which is fine and quite common. Get in touch and I&apos;ll look manually.
          </p>
        </div>
      )}

      {result && result.reachable && (
        <div className="mt-8">
          <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1 border-b border-white/10 pb-4">
            <span className="text-2xl font-bold text-white">
              {result.issueCount === 0 ? 'No problems found' : `${result.issueCount} of ${result.checkCount} checks failed`}
            </span>
            <span className="text-sm text-white/40">{result.url}</span>
          </div>

          {result.issueCount === 0 ? (
            <p className="mt-6 text-white/60">
              Your homepage passed all {result.checkCount} checks — it loaded in{' '}
              {result.loadSeconds}s, works at phone width, has no JavaScript errors and has a
              tappable way to reach you. That puts you ahead of most of the Michigan
              businesses I&apos;ve measured.
            </p>
          ) : (
            <>
              <p className="mt-6 text-white/60">
                Each of these is something a visitor on a phone would run into. The fix is
                underneath — take it and do it yourself, or{' '}
                <Link href="/contact" className="text-purple-300 underline">ask me</Link>.
              </p>
              <div className="mt-6 space-y-4">
                {result.issues?.map((i) => (
                  <div key={i.id} className={`rounded-xl border px-5 py-4 ${TONE[i.severity]}`}>
                    <div className="flex items-center gap-3">
                      <span className="font-semibold text-white">{i.label}</span>
                      <span className="rounded-full border border-white/20 px-2 py-0.5 text-xs uppercase tracking-wide text-white/50">
                        {i.severity}
                      </span>
                    </div>
                    <p className="mt-2 text-white/70">{i.finding}.</p>
                    <p className="mt-2 border-l-2 border-white/20 pl-3 text-sm text-white/45">
                      <strong className="text-white/70">The fix:</strong> {i.fix}
                    </p>
                  </div>
                ))}
              </div>
            </>
          )}

          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <Stat label="Load time on mobile" value={`${result.loadSeconds}s`}
                  warn={(result.loadSeconds || 0) > 5} />
            <Stat label="JavaScript errors" value={String(result.consoleErrorCount ?? 0)}
                  warn={(result.consoleErrorCount || 0) > 0} />
            <Stat label="Checks passed" value={`${result.passed?.length ?? 0}/${result.checkCount}`} />
          </div>

          {(result.passed?.length ?? 0) > 0 && (
            <p className="mt-4 text-sm text-white/40">
              Passed: {result.passed?.map((p) => p.label).join(' · ')}
            </p>
          )}

          <div className="mt-10 rounded-xl border border-purple-400/30 bg-purple-500/5 px-6 py-6">
            <p className="text-white/80">
              This checks seven things automatically. It cannot tell you whether your booking
              flow actually completes, whether enquiries reach your inbox, or where people
              give up — which is usually where the money is.
            </p>
            <p className="mt-3 text-white/60">
              That&apos;s what the free 30-minute Operations Audit is for. I walk your site and
              your process the way a customer would, and tell you what I find. No charge,
              no pitch.
            </p>
            <Link href="/contact"
              className="mt-5 inline-block rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 px-6 py-3 font-semibold text-white transition hover:opacity-90">
              Book the Operations Audit
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}

function Stat({ label, value, warn }: { label: string; value: string; warn?: boolean }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 px-5 py-4">
      <div className="text-xs uppercase tracking-wide text-white/40">{label}</div>
      <div className={`mt-1 text-2xl font-bold ${warn ? 'text-amber-300' : 'text-white'}`}>{value}</div>
    </div>
  )
}
