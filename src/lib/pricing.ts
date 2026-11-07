// Every published price for JAK Labs, in ONE place.
//
// WHY THIS EXISTS — the measurement, taken 2026-11-07
//
// The five service prices were written out as string literals in FIVE files:
// `app/services/page.tsx` (the ladder), `app/services/layout.tsx` (its meta
// description), `app/layout.tsx` (the root meta description, "Most builds
// $2,500–$10,000"), `app/payments/page.tsx` (a second, independent copy of the
// whole list), and the stats strip at the top of the services page
// ("$2.5–10K"). Nothing connected them.
//
// This is `business.ts`'s disease exactly: that file exists because swapping one
// contact address was logged as "a three-line change" and was eleven, across
// nine files. A price is worse than an address, because a stale one is not a
// broken link — it is a number a prospect reads, believes, and quotes back.
// `scripts/check-pricing.mjs` fails the build on a hard-coded copy.
//
// ⚠️ DO NOT WRITE A PRICE ANYWHERE ELSE. The failure being prevented is not
// untidiness: it is the sixth call site added later, which keeps the old number
// and is wrong on exactly one page nobody re-reads.
//
// ── THE ONE-TIME / RECURRING TRAP, WHICH IS LOAD-BEARING ────────────────────
//
// ⚠️⚠️ A PRICE AND A DURATION SIDE BY SIDE ARE READ AS A RATE unless something
// between them forbids it. `app/services/page.tsx` carries the incident in
// full: the SEO audit read `$1,500 flat · about a week` until 2026-10-15, and a
// reader in a Facebook group quoted it back as "1500 / week (about)" — he
// parsed the middot as "per" and the duration as the billing period, turning a
// one-off audit into a $6,000-a-month retainer, and concluded the pricing
// sounded "unsure and open to charging more".
//
// "flat" only denies HOURLY billing. It does not deny a RECURRING one, which is
// the reading that actually happened.
//
// So every entry here carries an explicit `cadence`, and `subtitle()` renders
// it as the words that survived that incident: "one-time · delivered in …" for
// work that ends, "per month · ongoing …" for work that does not. That matters
// more now than it did in October, because this file introduces a GENUINELY
// recurring product alongside the one-off ones — so "no price says per month"
// is no longer available as the thing that disambiguates them. It has to be
// said on every line, in both directions.
export type Cadence = 'one-time' | 'monthly' | 'enquire'

// ── WHY ONE OFFER DELIBERATELY CARRIES NO NUMBER (JD, 2026-11-07) ───────────
//
// Front Office is sold by enquiry: "let's not talk about pricing and get the
// client to inquire first." That cuts against this page's own argument that the
// positioning rests on published prices — and the argument was right, for the
// work it was written about. A fixed-scope audit or build has one deliverable,
// so it has one number, and withholding it only costs the reader time.
//
// Work that CONTINUES does not have one number. A handyman fielding forty
// enquiries a month and a med spa fielding four hundred are the same page and
// very different work, so any single published figure is wrong for one of them
// — and the usual fix, a tiered volume table, prices the thing by message count
// when what the buyer is actually purchasing is "nobody gets missed".
//
// ⚠️ AND THE OBJECTION THIS NORMALLY RAISES DOES NOT APPLY HERE. "A prospect who
// has to book a call to learn a number usually just leaves" assumes the only way
// in is a call. It is not: the 30-minute Operations Audit and the 7-check website
// review are free, need no signup, and are already the front door (`audit-free`).
// So the ask is not "call me to hear a price", it is "take the free audit, and
// the scope comes out of what it finds" — which is a better first step than a
// number the reader cannot yet apply to themselves.
//
// Embedded Engineering has published this way since it existed, so this is the
// existing pattern rather than a new exception.

export interface Offer {
  id: string
  title: string
  /** The price as published. Never recomputed, never formatted elsewhere. */
  price: string
  cadence: Cadence
  /** Lead time for one-time work; billing terms for monthly. */
  terms: string
  /** The matching `id` in jak-labs/content-engine/facts.toml, so the two cannot drift. */
  fact: string
}

export const OFFERS: Record<string, Offer> = {
  aiReliability: {
    id: 'ai-reliability', title: 'AI Reliability Audit',
    price: '$2,500', cadence: 'one-time', terms: 'delivered in about a week',
    fact: 'price-audit',
  },
  localSeo: {
    id: 'local-seo', title: 'Local SEO Audit',
    price: '$1,500', cadence: 'one-time', terms: 'delivered in about a week',
    fact: 'price-seo-audit',
  },
  llmSprint: {
    id: 'llm-sprint', title: 'LLM Integration Sprint',
    price: 'From $7,500', cadence: 'one-time', terms: 'delivered in 2–4 weeks',
    fact: 'price-sprint',
  },
  opsAutomation: {
    id: 'ops-automation', title: 'Ops-Automation Build',
    price: 'From $6,000', cadence: 'one-time', terms: 'delivered in 2–4 weeks',
    fact: 'price-ops',
  },
  support: {
    id: 'support', title: 'Support after a build',
    price: '$1–2K', cadence: 'monthly', terms: 'optional, cancel with notice',
    fact: 'price-support',
  },
  frontOffice: {
    id: 'front-office', title: 'Front Office',
    // No number on purpose — see the Cadence comment above.
    price: '', cadence: 'enquire', terms: 'priced per business after the free Operations Audit',
    fact: 'frontoffice-terms',
  },
}

/** The published price line for an offer. The only place these words are assembled.
 *
 * ⚠️ `enquire` renders "Monthly · <terms>" and never an empty price followed by a
 * middot. An offer with no number must not produce a line that LOOKS like a price
 * was meant to be there and is missing — that reads as a bug to a prospect, and a
 * page that looks broken where the price goes is worse than one that says
 * plainly how it is priced.
 */
export function subtitle(o: Offer): string {
  if (o.cadence === 'enquire') return `Monthly · ${o.terms}`
  if (o.cadence === 'monthly') return `${o.price} per month · ${o.terms}`
  return `${o.price} one-time · ${o.terms}`
}

/** The typical build range, for meta descriptions and the stats strip. */
export const BUILD_RANGE = '$2,500–$10,000'
export const BUILD_RANGE_SHORT = '$2.5–10K'
