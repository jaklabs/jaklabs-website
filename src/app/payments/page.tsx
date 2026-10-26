import type { Metadata } from 'next'
import { social } from '@/lib/social'
import Link from 'next/link'
import localFont from 'next/font/local'

/**
 * /payments — taking payment, sold as a service to ANY business.
 *
 * WHAT THIS PAGE IS
 *
 * The information + sales page for the payment service built in
 * ~/claude-server/ballast-payments. One page per product, on the house brand,
 * the way /ballast, /quarry, /verdikt and /telehealth do it.
 *
 * ⚠️ IT IS NOT A BALLAST PAGE, AND MUST NOT READ LIKE ONE. The repo is named
 * ballast-payments because the payments module eventually lands inside Ballast,
 * but the service is multi-tenant and sells to any business -- a counter, a job
 * site, a clinic desk, an invoice, a donation page. JD's instruction, 2026-10-24:
 * "the payment system could be used for whatever business". So every example on
 * this page is deliberately from a different sector, and Ballast is not
 * mentioned. Narrowing this to trades would hand away every other buyer.
 *
 * ⚠️ IT IS ON THE TEST NETWORK AND THE PAGE SAYS SO, ONCE, IN PLAIN WORDS.
 * ballast-payments/CLAUDE.md: mainnet is NOT deployed, mainnet will not start
 * without PRICE_SOURCE because par-vs-market is the CPA's call, and Gate 1
 * before mainnet money is counsel + CPA sign-off. A page implying money can
 * move today would be false. This is the same line /telehealth draws ("built
 * and owned, no operator yet") and /ballast draws ("one shop runs on it and it
 * is mine"). Do not soften it: the status pill and the <StatusNote> are both
 * load-bearing, and the CTA is a CALL precisely because the call is the gate.
 *
 * ⚠️ ONE MECHANIC SURVIVES ON PURPOSE: that the customer pays in USDC from
 * their own wallet. JD asked for benefits only, no mechanics, and everything
 * else obeys that -- no chain, no verification, no references, no settlement
 * plumbing. But WHICH instrument the customer pays with decides whether the
 * service fits at all, and a price table above an omitted payment instrument
 * is a misleading price table. It stays in one sentence, stated flatly.
 *
 * ⚠️ EVERY RATE COMES FROM ballast-payments/config/plans.json, which is the
 * decided record (JD, 24 Oct 2026), not from memory:
 *   payg ....... 0.75%          rateBps 75,  monthlyFeeCents 0
 *   business ... $49/mo + 0.25%  rateBps 25,  monthlyFeeCents 4900
 *   nonprofit .. 0.5%           rateBps 50,  monthlyFeeCents 0
 * The rate applies to the DOLLAR VALUE AT RECEIPT, the fee is INVOICED and
 * never deducted, and overdue at 30 days stops NEW links while links already
 * sent keep working. If a rate changes, change plans.json and then this file --
 * a price on a public page that disagrees with the billing code is the one
 * defect here that costs money in both directions.
 *
 * ⚠️ BUILD PRICES ARE MIRRORED FROM /services AND MUST NOT DRIFT. Every line
 * keeps BOTH "one-time" and "delivered in", for the reason written at length in
 * services/page.tsx: a reader in a Facebook group parsed "$1,500 flat · about a
 * week" as "1500 / week" and read a one-off audit as a $6,000/mo retainer. A
 * price and a duration side by side are read as a RATE unless something in
 * between forbids it.
 *
 * ⚠️ NO COMPETITOR NAMED, NO COMPETITOR PRICE, EVER. Same rule as /ballast and
 * /ops-platform. "~$245 / tech / month" was removed from /ops-platform for
 * exactly this reason. The comparison here is on the MODEL -- invoiced versus
 * deducted, nothing held versus held -- which is true, checkable, and argues
 * the point better than a number somebody can dispute.
 *
 * ⚠️ NO OUTCOME PROMISES. Nothing on this page claims a business will sell
 * more, save a stated amount, or get paid faster. The FTC treats an
 * unsubstantiated outcome claim as deceptive regardless of intent, and this is
 * a page about money. Everything in WHY is a term of business, not a result.
 *
 * ⚠️ PAYMENTS BEING FINAL IS STATED AS A TRADE-OFF, NOT A FEATURE. It genuinely
 * removes chargeback fraud and it genuinely removes the buyer's recourse. A
 * page that sold only the first half would be selling a hazard, and the first
 * angry customer would be the proof. It is in WHY and again in NOT-A-FIT.
 *
 * FIGURES: the only production numbers here are Haslett's, and the copy says
 * they are mine rather than a customer's. Register ids in
 * jak-labs/content-engine/facts.toml:
 *   $216K invoiced ............. haslett-invoiced
 *   $192K collected / $650 ..... haslett-collected
 *   one engineer ............... headcount
 *
 * SKIN: graphite with a ledger mint, scoped to .payments-skin in globals.css.
 * The visual idea is a RECEIPT -- the argument is that the fee shows up as a
 * line on a statement instead of a slice missing from a payment, so the page is
 * built out of ruled rows and tabular digits. Deliberately neutral grey where
 * /ballast is navy and /ops-platform is brass: three pages, three offers.
 */

/*
 * Fonts are SELF-HOSTED. Do not put `next/font/google` back.
 *
 * Amplify build 109 failed outright because next/font could not reach Google to
 * fetch a family -- a commit that only touched the homepage hero died on a
 * network call for a font on a different page. It is invisible locally, where
 * the fonts are cached, so it only ever fails in CI and reads as "your code
 * broke". Adding a weight means adding a file -- see scripts/fetch-fonts.py.
 */
const space = localFont({
  src: [
    { path: '../../fonts/SpaceGrotesk/500.woff2', weight: '500', style: 'normal' },
    { path: '../../fonts/SpaceGrotesk/600.woff2', weight: '600', style: 'normal' },
    { path: '../../fonts/SpaceGrotesk/700.woff2', weight: '700', style: 'normal' },
  ],
  variable: '--font-space',
  display: 'swap',
})
const hanken = localFont({
  src: [
    { path: '../../fonts/HankenGrotesk/400.woff2', weight: '400', style: 'normal' },
    { path: '../../fonts/HankenGrotesk/500.woff2', weight: '500', style: 'normal' },
    { path: '../../fonts/HankenGrotesk/600.woff2', weight: '600', style: 'normal' },
  ],
  variable: '--font-hanken',
  display: 'swap',
})
const jet = localFont({
  src: [
    { path: '../../fonts/JetBrainsMono/400.woff2', weight: '400', style: 'normal' },
    { path: '../../fonts/JetBrainsMono/500.woff2', weight: '500', style: 'normal' },
  ],
  variable: '--font-jet',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Payments & Point of Sale — published rates, fee invoiced not deducted',
  description:
    'Take payment at a counter, on a job, at a desk or on an invoice. The fee is invoiced monthly and never deducted from the payment. Rates published: 0.75%, $49 + 0.25%, or 0.5% for nonprofits.',
  alternates: { canonical: '/payments' },
  // ⚠️ Routed through social(), NOT hand-written. This block used to spell
  // `openGraph` itself with a title, a description and a url and no `images` —
  // and because Next REPLACES the root layout's openGraph rather than merging
  // it, that silently deleted the site card. /payments posted to Facebook as a
  // bare link with no image at all, which is how this was noticed. social()
  // cannot be called without a card, so the mistake is no longer spellable.
  ...social('payments', {
    type: 'website',
    url: '/payments',
    title: 'Payments & Point of Sale — JAK Labs',
    description:
      'Published rates, nothing held, and the fee invoiced at month end instead of taken out of the payment. Book a call and we work out whether it fits.',
  }),
}

/* ── Where money actually gets taken. One per sector, on purpose: the service
      is not for one trade, and a reader should find themselves in this list. ── */
const SETTINGS: [string, string][] = [
  ['At a counter', 'a code on the screen or on the till, the customer pays from their phone'],
  ['On a job', 'take the payment standing in the kitchen you just finished, before you leave'],
  ['At a front desk', 'a clinic, a studio, a salon — collected at check-in, receipt already sent'],
  ['On an invoice', 'the bill carries its own pay link, so the follow-up call stops being a chore'],
  ['On a donation page', 'a nonprofit takes the gift and the acknowledgement goes out the same minute'],
]

/* ── What the business gets. Benefits only. No plumbing. ────────────────────── */
const GETS: [string, string][] = [
  [
    'The money lands in your own account',
    'It is your account, in your name, and it is the only place the payment goes. Nothing is routed through me on the way, so there is no balance of yours sitting in somebody else’s system waiting to be released.',
  ],
  [
    'The fee is a bill, not a bite',
    'You are invoiced once a month for what you owe. It is never taken out of a payment, so the amount your customer sent and the amount you reconcile are the same number.',
  ],
  [
    'Nothing is held, ever',
    'No rolling reserve, no settlement window, no limit that trips because you had a good week and the system decided that was unusual.',
  ],
  [
    'The receipt goes out by itself',
    'Your customer gets one immediately and you get the notice. Nobody has to remember to send anything, which is the step that actually gets skipped.',
  ],
  [
    'Your bookkeeper gets a file, not a shoebox',
    'Every payment comes out as a record an accountant can file from, with the amounts in dollars. The large-cash and donated-property reporting flags are raised for you rather than found in March.',
  ],
  [
    'Every payer is screened before it counts',
    'Each payment is checked against the US Treasury sanctions list. That is a check most businesses this size have no way to run and no idea they are expected to.',
  ],
]

/* ── The comparison. On the MODEL. No competitor, no number of theirs. ─────── */
const WHY: [string, string][] = [
  [
    'Invoiced, not deducted',
    'The usual arrangement takes its cut out of the payment on the way past, so every figure in your books is net of a fee and the gross has to be reconstructed. Here the payment arrives whole and the fee arrives as a statement, the same as any other supplier.',
  ],
  [
    'Your money is never in my custody',
    'I do not hold funds and I do not hold keys. That is not a policy I could change next quarter — it is how the thing is built, and it is the reason there is no process by which your balance could be frozen while somebody reviews your account.',
  ],
  [
    'A completed payment is final',
    'There is no chargeback window, which removes a category of fraud that falls on the business today. It also removes the buyer’s route to reverse a payment, so it suits work that is delivered and invoiced far better than it suits anonymous walk-in retail. I would rather say that on the page than have you find it out.',
  ],
  [
    'The price is on this page',
    'All of it, including what happens if you pay me late. You do not book a call to find out a number — you book a call to decide whether the thing fits.',
  ],
  [
    'One engineer, and he answers',
    'The person who writes it is the person who picks up. There is no tier one, and nothing about your account is explained to you by somebody reading a script.',
  ],
  [
    'It was built for a business that had to survive it',
    'The first business on it is my own trades company, which has put $216K through software I wrote and still operate — $192K of that collected, with under $650 more than 30 days late. I am not the test customer here, I am the first one.',
  ],
]

/* ── Payment plans. Mirrors ballast-payments/config/plans.json exactly. ────── */
const PLANS = [
  {
    name: 'Pay as you go',
    rate: '0.75%',
    monthly: 'No monthly fee',
    who: 'Taking payment occasionally, or trying it out.',
    note: 'Nothing to commit to. You pay a percentage of what you actually collected and nothing in a month where you collected nothing.',
    featured: false,
  },
  {
    name: 'Business',
    rate: '0.25%',
    monthly: '$49 per month',
    who: 'Taking payment as a normal part of the week.',
    note: 'The monthly fee buys the lower rate. It is worth it once you are collecting enough that a third of a percent is more than $49 — the call is where we work that out with your real numbers.',
    featured: true,
  },
  {
    name: 'Nonprofit',
    rate: '0.5%',
    monthly: 'No monthly fee',
    who: 'A registered nonprofit taking donations or fees.',
    note: 'A lower rate with no monthly cost, because a small charity has no software budget and the gift is somebody’s money rather than a margin.',
    featured: false,
  },
]

/* ── The build ladder. Mirrored from /services. "one-time" + "delivered in"
      stay on every line -- see the header note. ───────────────────────────── */
const BUILDS: [string, string, string][] = [
  ['Operations Audit', 'Free', 'Where the manual work actually is, and what it would take to remove it. No signup.'],
  ['Local SEO Audit', '$1,500 one-time · delivered in about a week', 'Why a local business does not show up, worst first. Not a retainer and not a ranking promise.'],
  ['AI Reliability Audit', '$2,500 one-time · delivered in about a week', 'An AI feature reviewed before it ships a wrong answer. Eval harness, retrieval gates, a prioritised fix list.'],
  ['Ops-Automation Build', 'From $6,000 one-time · delivered in 2–4 weeks', 'One manual workflow automated end to end — intake to ticketing to invoicing.'],
  ['LLM Integration Sprint', 'From $7,500 one-time · delivered in 2–4 weeks', 'One production-ready AI feature, built on your stack and your data, with the gates that keep it honest.'],
  ['Support after a build', '$1–2K per month · optional, cancel with notice', 'Keeping what I built running, improved and supported. Never assumed, never bundled.'],
  ['Embedded engineering', 'Monthly retainer · 8–20 hrs/week, month-to-month', 'I work inside your team for a stretch and ship on your real systems. Scope agreed each cycle.'],
]

const FIT = [
  'You already invoice people, or you take payment for work you have delivered.',
  'You would rather be billed for a service than have a cut taken out of your takings.',
  'You want your books to balance without somebody unpicking fees line by line.',
  'You have customers who can pay from a phone, or you are willing to offer it alongside what you take today.',
  'You are a nonprofit and every percent of a gift matters.',
]

const NOT_FIT = [
  'You need to take cards from walk-in strangers tomorrow. This sits alongside that, it does not replace it.',
  'Your customers need the ability to reverse a payment after the fact. Here they do not have one.',
  'You cannot ask a customer to pay from their own wallet — because that is what paying means here, and no amount of good design changes it.',
  'You want somebody to hold the money for you. I never will, and for some businesses that is the wrong answer.',
]

export default function PaymentsPage() {
  return (
    <main className={`payments-skin ${space.variable} ${hanken.variable} ${jet.variable}`}>
      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="px-6 pt-28 pb-16 md:pt-36 md:pb-24">
        <div className="mx-auto max-w-5xl">
          <p className="pm-eyebrow mb-5">Payments &amp; Point of Sale</p>
          <h1 className="text-4xl font-bold leading-[1.08] md:text-6xl">
            Get paid without losing a slice
            <br />
            of every payment
          </h1>
          <p className="mt-7 max-w-2xl text-lg leading-relaxed md:text-xl">
            A counter, a job site, a front desk, an invoice or a donation page — one way to take
            money, in any business. The fee is <span className="pm-ink">invoiced at the end of the
            month</span>, never taken out of what your customer sent.
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-3">
            <Link href="/contact" className="pm-btn">
              Book a call
            </Link>
            <Link href="#terms" className="pm-btn-ghost">
              See every rate first
            </Link>
          </div>

          <p className="pm-mono mt-6 flex items-center gap-2 text-xs">
            <span className="pm-dot" aria-hidden="true" />
            <span>Running on the test network · onboarding the first businesses now</span>
          </p>
        </div>
      </section>

      {/* ── The honest status. One paragraph, high on the page, not buried. ─ */}
      <section className="px-6 pb-16">
        <div className="mx-auto max-w-5xl">
          <div className="pm-panel pm-panel-2 p-6 md:p-8">
            <p className="pm-eyebrow mb-3">Where this actually stands</p>
            <p className="leading-relaxed">
              The system is built, tested and deployed, and it is running on a{' '}
              <span className="pm-ink">test network</span> — so no live money has moved through it
              yet. Before it does, two people who are not me have to sign off: an accountant on how
              a payment is valued in dollars, and an attorney on the terms. I am booking calls now
              because the first few businesses on it should be ones I have actually talked to, and
              because the order of those conversations decides what gets built next. If you need to
              take money this week, say so on the call and I will tell you straight that this is not
              yet the thing for it.
            </p>
          </div>
        </div>
      </section>

      {/* ── Where you can take payment ───────────────────────────────────── */}
      <section className="px-6 py-16 md:py-20">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-3xl font-bold md:text-4xl">Wherever the money actually happens</h2>
          <p className="mt-4 max-w-2xl leading-relaxed">
            The same service in five different rooms. Nothing on this list is a different product or
            a different price.
          </p>
          <div className="mt-10 overflow-hidden rounded-[14px] border border-[var(--pm-line)]">
            {SETTINGS.map(([where, what], i) => (
              <div
                key={where}
                className={`flex flex-col gap-1 px-5 py-5 md:flex-row md:items-baseline md:gap-6 md:px-7 ${
                  i % 2 === 1 ? 'bg-[var(--pm-panel-2)]' : 'bg-[var(--pm-panel)]'
                }`}
              >
                <span className="pm-ink w-48 shrink-0 font-semibold">{where}</span>
                <span className="leading-relaxed">{what}</span>
              </div>
            ))}
          </div>
          <p className="pm-faint mt-5 text-sm leading-relaxed">
            One thing worth knowing before the call, because it decides whether any of this fits:
            your customer pays in <span className="pm-ink">USDC, a dollar-denominated currency,
            from their own wallet</span>. That is the whole of what they do differently.
          </p>
        </div>
      </section>

      {/* ── What you get ─────────────────────────────────────────────────── */}
      <section className="px-6 py-16 md:py-20">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-3xl font-bold md:text-4xl">What you get</h2>
          <div className="mt-10 grid gap-5 md:grid-cols-2">
            {GETS.map(([head, body]) => (
              <div key={head} className="pm-panel p-6">
                <h3 className="text-lg font-semibold">{head}</h3>
                <p className="mt-3 text-[0.95rem] leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── The comparison. Question-shaped H2 on purpose. ───────────────── */}
      <section className="px-6 py-16 md:py-20">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-3xl font-bold md:text-4xl">
            Why this instead of what you use now?
          </h2>
          <p className="mt-4 max-w-2xl leading-relaxed">
            Six differences, and every one of them is a term of business rather than a promise about
            your results. I am not naming anybody else or quoting their prices — you already know
            what you pay.
          </p>
          <div className="mt-10 space-y-px overflow-hidden rounded-[14px] border border-[var(--pm-line)]">
            {WHY.map(([head, body], i) => (
              <div
                key={head}
                className={`px-5 py-6 md:px-7 ${
                  i % 2 === 1 ? 'bg-[var(--pm-panel-2)]' : 'bg-[var(--pm-panel)]'
                }`}
              >
                <h3 className="pm-ink text-lg font-semibold">{head}</h3>
                <p className="mt-2 max-w-3xl text-[0.95rem] leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Terms: the payment plans ─────────────────────────────────────── */}
      <section id="terms" className="scroll-mt-24 px-6 py-16 md:py-20">
        <div className="mx-auto max-w-5xl">
          <p className="pm-eyebrow mb-4">Terms · payments</p>
          <h2 className="text-3xl font-bold md:text-4xl">What it costs to take a payment</h2>
          <p className="mt-4 max-w-2xl leading-relaxed">
            The percentage applies to the dollar value of the payment when it arrives. Pick a plan
            by what you collect, not by what you hope to.
          </p>

          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {PLANS.map((p) => (
              <div
                key={p.name}
                className={`pm-panel flex flex-col p-6 ${p.featured ? 'pm-panel-lift' : ''}`}
              >
                <p className="pm-eyebrow">{p.name}</p>
                <p className="pm-num mt-4 text-4xl">{p.rate}</p>
                <p className="pm-faint mt-1 text-sm">per payment</p>
                <p className="pm-ink mt-4 font-semibold">{p.monthly}</p>
                <p className="mt-4 text-sm font-medium">{p.who}</p>
                <p className="pm-faint mt-3 text-sm leading-relaxed">{p.note}</p>
              </div>
            ))}
          </div>

          {/* The four terms that are not a rate, and that nobody publishes. */}
          <div className="pm-panel pm-panel-2 mt-8 p-6 md:p-8">
            <p className="pm-eyebrow mb-5">And the rest of it, in writing</p>
            <ul className="space-y-4 text-[0.95rem] leading-relaxed">
              <li>
                <span className="pm-ink font-semibold">The fee is invoiced, never deducted.</span>{' '}
                Every payment reaches your account in full. I bill you once a month for the month
                before, and you pay that bill like any other.
              </li>
              <li>
                <span className="pm-ink font-semibold">Each payment is billed exactly once.</span>{' '}
                A payment that arrives late lands on the next statement rather than being missed or
                counted twice. Anything held for review is not billed at all.
              </li>
              <li>
                <span className="pm-ink font-semibold">
                  If you are 30 days late paying me, I stop issuing you new pay links.
                </span>{' '}
                Links already in your customers&rsquo; hands keep working. Your customer&rsquo;s
                money is not mine to interrupt, and it will never be held over a dispute between
                you and me.
              </li>
              <li>
                <span className="pm-ink font-semibold">No setup fee, no contract, no minimum.</span>{' '}
                Nothing is held, there is no reserve, and there is no monthly amount you have to
                collect to keep the rate.
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* ── Terms: everything else I sell ────────────────────────────────── */}
      <section className="px-6 py-16 md:py-20">
        <div className="mx-auto max-w-5xl">
          <p className="pm-eyebrow mb-4">Terms · everything else</p>
          <h2 className="text-3xl font-bold md:text-4xl">The rest of what I do, priced</h2>
          <p className="mt-4 max-w-2xl leading-relaxed">
            Taking payment is one piece. If the reason you are here is that the admin around the
            money is the actual problem, these are the fixed-scope pieces, and the price is the
            price.
          </p>

          <div className="mt-10 overflow-hidden rounded-[14px] border border-[var(--pm-line)]">
            {BUILDS.map(([name, price, what], i) => (
              <div
                key={name}
                className={`px-5 py-5 md:px-7 ${
                  i % 2 === 1 ? 'bg-[var(--pm-panel-2)]' : 'bg-[var(--pm-panel)]'
                }`}
              >
                <div className="flex flex-col gap-1 md:flex-row md:items-baseline md:justify-between md:gap-6">
                  <span className="pm-ink font-semibold">{name}</span>
                  <span className="pm-num text-sm md:text-right">{price}</span>
                </div>
                <p className="pm-faint mt-2 max-w-2xl text-sm leading-relaxed">{what}</p>
              </div>
            ))}
          </div>

          <p className="pm-faint mt-5 text-sm leading-relaxed">
            Fixed scope agreed before I start, and a build is quoted once I know what is actually
            there — which is what the free audit is for. Support afterwards is optional and is never
            assumed.
          </p>
        </div>
      </section>

      {/* ── Fit / not fit. This is what makes the CTA honest. ────────────── */}
      <section className="px-6 py-16 md:py-20">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-3xl font-bold md:text-4xl">Is this a good fit for you?</h2>
          <p className="mt-4 max-w-2xl leading-relaxed">
            That is genuinely the question the call answers, in both directions. Here is my half of
            it in advance so you can save yourself the half hour.
          </p>
          <div className="mt-10 grid gap-5 md:grid-cols-2">
            <div className="pm-panel p-6">
              <p className="pm-eyebrow mb-4">It fits if</p>
              <ul className="space-y-3 text-[0.95rem] leading-relaxed">
                {FIT.map((f) => (
                  <li key={f} className="flex gap-3">
                    <span className="pm-mint mt-[0.35rem] text-xs" aria-hidden="true">
                      ▸
                    </span>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="pm-panel pm-panel-2 p-6">
              <p className="pm-eyebrow pm-eyebrow-warn mb-4">It does not fit if</p>
              <ul className="space-y-3 text-[0.95rem] leading-relaxed">
                {NOT_FIT.map((f) => (
                  <li key={f} className="flex gap-3">
                    <span className="pm-clay mt-[0.35rem] text-xs" aria-hidden="true">
                      ▸
                    </span>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────────────── */}
      <section className="px-6 pb-28 pt-8">
        <div className="mx-auto max-w-5xl">
          <div className="pm-panel p-8 md:p-12">
            <h2 className="text-3xl font-bold md:text-4xl">Book a call and we will work it out</h2>
            <p className="mt-5 max-w-2xl leading-relaxed">
              Half an hour. Bring what you collect in a normal month and what you pay to collect it,
              and we will do the arithmetic together on the call rather than me guessing at it here.
              If it is not a fit I will say so and point you at what is — I would rather lose the
              sale than sell you a payment method your customers will not use.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link href="/contact" className="pm-btn">
                Book a call
              </Link>
              <Link href="/website-audit" className="pm-btn-ghost">
                Or start with the free website check
              </Link>
            </div>
            <p className="pm-faint mt-6 text-sm">
              One engineer, published prices, and no obligation at the end of the call.
            </p>
          </div>
        </div>
      </section>
    </main>
  )
}
