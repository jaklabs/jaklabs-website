/**
 * Campaign attribution — the smallest thing that makes "scale what works" answerable.
 *
 * An ad links to a page with `?c=VIBE_RESCUE`. The visitor reads, maybe runs the free
 * audit, and only later hits /contact — by which point the query string is long gone.
 * So the code is captured on first sight and carried in sessionStorage until the form
 * is actually submitted.
 *
 * ⚠️ WHY THIS EXISTS AT ALL. The brief was "target everyone and scale what works",
 * which is only a strategy if something can say which one worked. The outreach cron
 * already demonstrates the alternative: it once sent 100 emails across three campaigns
 * and two templates in one run, and the reply rate from that run means nothing, because
 * no reply can be traced to the thing that caused it. Running ads without this would
 * reproduce that at ad spend.
 *
 * ⚠️ IT DOES NOT GATE ANYTHING. The audit tool deliberately has no email gate — the
 * reasoning is in AuditTool.tsx and it is right. This reads a query parameter the
 * visitor already arrived with and asks for nothing.
 *
 * sessionStorage, not localStorage: attribution should last a visit, not follow someone
 * around for weeks and then credit an ad they saw in March.
 */

const KEY = 'jl_campaign'

// Codes are ours, from ads/scripts/*.md. Anything else is ignored rather than stored —
// a querystring is attacker-controlled text, and it ends up in a CRM record a human
// reads. An unrecognised code is far more likely to be junk than a campaign nobody
// told this file about.
const KNOWN = ['VIBE_RESCUE', 'OPERATOR', 'BROKEN_SITE'] as const
export type Campaign = (typeof KNOWN)[number]

function safe<T>(fn: () => T, fallback: T): T {
  // Private windows and blocked site data throw on access rather than returning null.
  try { return fn() } catch { return fallback }
}

/** Call once on mount. Captures `?c=` if present and recognised; never overwrites. */
export function captureCampaign(): void {
  if (typeof window === 'undefined') return
  const raw = new URLSearchParams(window.location.search).get('c')
  if (!raw) return
  const code = raw.toUpperCase()
  if (!KNOWN.includes(code as Campaign)) return
  // First touch wins. If someone arrives on BROKEN_SITE and later clicks an OPERATOR
  // ad, the first ad is the one that did the work of getting them here.
  if (safe(() => sessionStorage.getItem(KEY), null)) return
  safe(() => sessionStorage.setItem(KEY, code), undefined)
}

/** The captured code, or null. Null means direct/organic — a real answer, not a gap. */
export function getCampaign(): string | null {
  if (typeof window === 'undefined') return null
  return safe(() => sessionStorage.getItem(KEY), null)
}
