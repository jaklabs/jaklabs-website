import type { Metadata } from 'next'
import Link from 'next/link'
import { Archivo, IBM_Plex_Sans, IBM_Plex_Mono } from 'next/font/google'

/**
 * The Haslett Ops Platform — the codebase offered as an acquirable asset.
 *
 * WHAT THIS PAGE IS SELLING, AND THE LINE IT MUST NOT CROSS
 *
 * Haslett Handyman is MY OWN company. It is not a client, and this page must
 * never let a reader conclude otherwise — the whole argument here depends on the
 * opposite being true and said plainly: I run the business the software runs, so
 * the software is proven by the person selling it. That is the de-risker. Blur it
 * into "a client's platform" and the page loses the only thing it has that a
 * software vendor does not.
 *
 * ⚠️ EVERY FIGURE IS REGISTER-BACKED. jak-labs/content-engine/facts.toml:
 *   $155K invoiced ......... haslett-invoiced
 *   ~95% collected ......... haslett-collected
 *   240 jobs ............... haslett-jobs      (derived 2026-08-31, see below)
 *   3,235 transactions ..... haslett-transactions
 *   ~140 hrs ............... haslett-hours     — an ESTIMATE, labelled as one
 *
 * TWO CLAIMS FROM THE DESIGN ARTIFACT DID NOT SURVIVE VERIFICATION:
 *
 * 1. "170+ jobs run end-to-end" was stale and low. The real figure is 240, and
 *    getting there mattered: the table's item count reads 326, but that table
 *    also holds BILL records and cancelled/unscheduled work — two record types
 *    sharing one table, so the raw count is not a job count. 240 is
 *    status ∈ {COMPLETE, BILLED, PAID}. The derivation is in the register.
 *
 * 2. "~$245 / tech / month" for ServiceTitan and Jobber is NOT here and must not
 *    come back. ServiceTitan does not publish pricing at all, so that number has
 *    no checkable source, and putting a specific invented price against a named
 *    competitor is the one kind of claim on this site that could actually draw a
 *    letter. The comparison is made on the MODEL — per-seat recurring versus own
 *    it once — which is true, verifiable and argues the point just as well. The
 *    published ServiceTitan post takes the same line deliberately.
 *
 * SKIN: brass on charcoal, scoped to .haslett-skin in globals.css. Warm where
 * the rest of the site is cool, because it sells to a different person: a
 * multi-shop operator weighing an asset purchase, not a developer and not a
 * local owner booking an audit. The visual idea is an instrument panel, not a
 * landing page — the page claims the software is real and running, so it should
 * look like a readout of something running.
 */

const archivo = Archivo({
  subsets: ['latin'],
  weight: ['600', '700', '800'],
  variable: '--font-archivo',
  display: 'swap',
})
const plexSans = IBM_Plex_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-plex-sans',
  display: 'swap',
})
const plexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['500', '600'],
  variable: '--font-plex-mono',
  display: 'swap',
})

const MAILTO =
  'mailto:jdakemp@gmail.com?subject='
  + encodeURIComponent('Haslett Ops Platform — acquisition')
  + '&body='
  + encodeURIComponent(
    'Hi JD,\n\nI read the ops-platform page. Here is our operation:\n\n'
    + '- Shops / locations:\n- Trades:\n- Techs in the field:\n'
    + '- What we run today:\n- What we pay for it:\n\n',
  )

const METRICS = [
  { n: '$155K', k: 'invoiced through it · ~95% collected' },
  { n: '240', k: 'jobs carried to complete, billed or paid' },
  { n: '3,235', k: 'bank transactions auto-categorised' },
  { n: '~140', unit: ' hrs', k: 'of admin removed from my week (my estimate)' },
]

const FEATURES = [
  ['Email-driven auto-ticketing', 'inbound turns into a job without anyone opening it'],
  ['One-click approve → auto-invoice', 'with a multi-rate crew billing engine'],
  ['Unified lead intake', 'Angi, website and email, spam-filtered into one queue'],
  ['QuickBooks + Plaid sync', 'and receipt OCR through Claude vision'],
  ['Profit First accounting', 'transactions auto-categorised into envelopes'],
  ['Crew mobile app', 'field close-outs and per-person hours, lead and helper rates'],
  ['ROI dashboard', 'plus contractor performance tracking'],
  ['AWS serverless', 'Lambda · DynamoDB · Cognito · SES · CloudFront, all Terraform'],
]

// The comparison is on the MODEL, never on an invented competitor price.
// See the header note — this is the one thing on the page that must not drift.
const COMPARE = [
  {
    them: 'Per-seat, per-month, forever. The bill grows with every tech you hire, and it never stops.',
    you: 'Acquired once. Add techs, locations and shops without the meter running.',
  },
  {
    them: 'You conform to their workflow. AI arrives later, bolted onto a tool designed before it.',
    you: 'Shaped to how you actually work. OCR and auto-ticketing are load-bearing, not an add-on.',
  },
  {
    them: 'The software stops at the handoff to accounting. Support is a ticket queue.',
    you: 'It goes into the books — Profit First, Plaid, QuickBooks — and you call the engineer who wrote it.',
  },
]

const AUDIENCE = [
  {
    h: 'Home-services rollups',
    p: 'Stop paying per seat across every shop you acquire. Deploy one platform you own across the portfolio.',
  },
  {
    h: 'Multi-location operators',
    p: 'A proven operations backbone fitted to your trades, without an eighteen-month six-figure build.',
  },
  {
    h: 'Owners who want to own',
    p: 'Your software, your data, your workflow — not a vendor’s mould and a vendor’s lock-in.',
  },
]

const GETS = [
  'The full codebase — yours, source in hand',
  'Deployment on your AWS account',
  'Customisation to your trades and workflow',
  'Data migration and a written runbook',
  'Transition and documentation',
  'Optional ongoing support, scoped separately',
]

const STEPS = [
  { h: 'Scope', p: 'A call on your operation — your trades, your billing, your portfolio, what has to fit.' },
  { h: 'Deploy & tailor', p: 'I stand it up on your infrastructure and shape it to how you actually work.' },
  { h: 'Handover', p: 'You own the code, documented, with me on call for fixes and extensions.' },
]

export const metadata: Metadata = {
  title: 'Haslett Ops Platform — own the software that runs a real business',
  description:
    'A production home-services operations platform — owner web console and crew mobile app — '
    + 'running a live company today. Acquire the codebase and I deploy it on your infrastructure. '
    + 'You own the IP.',
  alternates: { canonical: '/ops-platform' },
  openGraph: {
    type: 'website',
    url: '/ops-platform',
    title: 'Own the software that runs a real business.',
    description:
      '$155K invoiced and 240 jobs carried through it — in my own company. Acquire the codebase, '
      + 'and the engineer who built it deploys it on yours.',
  },
}

function Head({ eyebrow, children }: { eyebrow: string; children: React.ReactNode }) {
  return (
    <div className="hz-in mb-8">
      <p className="hz-eyebrow mb-3">{eyebrow}</p>
      <h2 className="text-3xl md:text-4xl font-extrabold">{children}</h2>
      {/* Draws itself left-to-right as the section arrives. */}
      <div
        className="hz-rule mt-5 h-px w-24 origin-left"
        style={{ background: 'var(--hz-brass)' }}
      />
    </div>
  )
}

export default function OpsPlatformPage() {
  return (
    <div className={`haslett-skin ${archivo.variable} ${plexSans.variable} ${plexMono.variable}`}>
      {/* Hero */}
      <section className="pt-32 pb-12">
        <div className="container-custom max-w-4xl">
          <div className="hz-in">
            <p className="hz-eyebrow mb-4">A proven home-services operations platform</p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-[1.06] mb-6">
              Own the software that runs a real business.
            </h1>
            <p className="text-lg leading-relaxed mb-7">
              Haslett is a production operations platform — an owner web console and a crew mobile
              app — that runs a live home-services company <em>today</em>. Acquire the codebase and I
              deploy and tailor it to your operation. You own it outright. No per-seat tax, no
              rollout fee.
            </p>
            <p
              className="hz-mono inline-flex items-center gap-3 rounded-full border px-4 py-2 text-sm font-semibold hz-ink"
              style={{ background: 'var(--hz-brass-ghost)', borderColor: 'var(--hz-line)' }}
            >
              <span className="h-1.5 w-1.5 rounded-full" style={{ background: 'var(--hz-brass)' }} />
              Code + deployment · $75K–$250K · you own the IP
            </p>
            <div className="mt-8 flex flex-wrap gap-3.5">
              <a href={MAILTO} className="hz-btn">Book a scoping call</a>
              <a href="#what" className="hz-btn-ghost">See what it does</a>
            </div>
          </div>
        </div>
      </section>

      {/* The readout. The page's central claim rendered as an instrument. */}
      <section className="pb-16">
        <div className="container-custom max-w-4xl">
          <div className="hz-panel hz-sheen overflow-hidden">
            <div
              className="flex flex-wrap items-center gap-3 border-b px-5 py-3.5 hz-panel-2"
              style={{ borderColor: 'var(--hz-line)' }}
            >
              <span
                className="hz-mono inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.16em]"
                style={{ color: 'var(--hz-good)' }}
              >
                <span className="hz-pulse" />
                Live in production
              </span>
              <span className="hz-mono hz-faint ml-auto text-[11px]">
                figures from the system of record
              </span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 hz-stagger">
              {METRICS.map((m, i) => (
                <div
                  key={m.n}
                  className="border-b border-r p-5 last:border-r-0 md:border-b-0"
                  style={{ borderColor: 'var(--hz-line)', ['--i' as string]: i }}
                >
                  <div className="hz-num text-2xl md:text-3xl">
                    <span style={{ color: 'var(--hz-brass)' }}>{m.n}</span>
                    {m.unit && <span className="text-base hz-faint">{m.unit}</span>}
                  </div>
                  <div className="mt-1.5 text-[12.5px] leading-snug">{m.k}</div>
                </div>
              ))}
            </div>
          </div>
          <p className="hz-faint mt-4 text-xs">
            Real figures from the running system, not projections. The hours are my own estimate and
            are labelled as one; the rest come out of the database and QuickBooks.
          </p>
        </div>
      </section>

      {/* What it is */}
      <section id="what" className="pb-16 scroll-mt-24">
        <div className="container-custom max-w-4xl">
          <Head eyebrow="What it is">
            A two-sided operations platform, built on real infrastructure.
          </Head>
          <p className="hz-in mb-8 text-lg leading-relaxed">
            Owner web to run the operation. Crew mobile for field close-outs. AWS serverless
            underneath — the kind of stack a vendor charges six figures to build for you.
          </p>
          <ul className="grid gap-x-8 gap-y-3 sm:grid-cols-2 hz-stagger">
            {FEATURES.map(([h, p], i) => (
              <li
                key={h}
                className="relative pl-7 text-[15.5px] hz-ink"
                style={{ ['--i' as string]: i }}
              >
                <span
                  className="absolute left-0 top-[9px] h-2 w-2 rotate-45"
                  style={{ background: 'var(--hz-brass)' }}
                />
                <b className="font-semibold">{h}</b>{' '}
                <span style={{ color: 'var(--hz-muted)' }}>— {p}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Own vs rent */}
      <section className="pb-16">
        <div className="container-custom max-w-4xl">
          <Head eyebrow="Why owning beats renting">
            The big platforms rent you a generic tool. This one is yours.
          </Head>
          <div className="space-y-3.5 hz-stagger">
            {COMPARE.map((c, i) => (
              <div
                key={c.you}
                className="grid overflow-hidden rounded-xl border md:grid-cols-2"
                style={{ borderColor: 'var(--hz-line)', ['--i' as string]: i }}
              >
                <div className="hz-panel-2 p-5">
                  <p className="hz-mono hz-faint mb-1.5 text-[11px] uppercase tracking-[0.12em]">
                    Renting
                  </p>
                  <p className="text-[15px] hz-ink">{c.them}</p>
                </div>
                <div className="p-5">
                  <p className="hz-mono mb-1.5 text-[11px] uppercase tracking-[0.12em] hz-brass">
                    Owning
                  </p>
                  <p className="text-[15px] hz-ink">{c.you}</p>
                </div>
              </div>
            ))}
          </div>
          <p className="hz-faint mt-5 text-xs">
            Deliberately no competitor price quoted here. ServiceTitan does not publish one, so any
            figure I put against their name would be invented — and the argument is about the pricing
            model, which does not need a number to be true.
          </p>
        </div>
      </section>

      {/* Who it is for */}
      <section className="pb-16">
        <div className="container-custom max-w-4xl">
          <Head eyebrow="Who it&rsquo;s for">Three shapes of buyer</Head>
          <div className="grid gap-4 md:grid-cols-3 hz-stagger">
            {AUDIENCE.map((a, i) => (
              <div key={a.h} className="hz-panel p-6" style={{ ['--i' as string]: i }}>
                <h3 className="mb-2 text-lg font-bold">{a.h}</h3>
                <p className="text-[15px]">{a.p}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* The offer */}
      <section className="pb-16">
        <div className="container-custom max-w-4xl">
          <div className="hz-panel hz-in p-8 sm:p-10">
            <p className="hz-eyebrow mb-3">The offer</p>
            <h2 className="mb-5 text-3xl font-extrabold">Acquire the platform. I deploy it.</h2>
            <p className="hz-num text-3xl md:text-4xl">
              <span style={{ color: 'var(--hz-brass)' }}>$75K – $250K</span>
            </p>
            <p className="mt-2 text-sm">
              scoped to your operation · you own the codebase
            </p>
            <p className="mt-5 max-w-2xl leading-relaxed">
              You are not buying orphaned code to figure out. You acquire a proven platform{' '}
              <em>and</em> the engineer who built it — I stand it up on your infrastructure, fit it to
              how you run, and hand it over documented.
            </p>
            <ul className="mt-7 grid gap-x-7 gap-y-2.5 sm:grid-cols-2">
              {GETS.map((g) => (
                <li key={g} className="relative pl-6 text-[15px] hz-ink">
                  <span className="absolute left-0 font-bold" style={{ color: 'var(--hz-brass)' }}>
                    ✓
                  </span>
                  {g}
                </li>
              ))}
            </ul>
            <div className="mt-8 grid gap-4 md:grid-cols-3">
              {STEPS.map((s, i) => (
                <div
                  key={s.h}
                  className="rounded-xl border p-5"
                  style={{ borderColor: 'var(--hz-line)' }}
                >
                  <p className="hz-mono text-[13px] font-semibold" style={{ color: 'var(--hz-brass)' }}>
                    0{i + 1}
                  </p>
                  <h3 className="mb-1.5 mt-2 text-base font-bold">{s.h}</h3>
                  <p className="text-[14.5px]">{s.p}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Modules + why me */}
      <section className="pb-16">
        <div className="container-custom max-w-4xl">
          <div className="grid gap-8 md:grid-cols-2 md:items-center hz-stagger">
            <div>
              <p className="hz-eyebrow mb-3">Prefer just the engine?</p>
              <h2 className="mb-4 text-2xl font-extrabold">
                Acquire the parts the big tools don&rsquo;t have.
              </h2>
              <p className="leading-relaxed">
                Not the whole platform — just the differentiated pieces: the{' '}
                <b className="hz-brass font-semibold">AI bookkeeping</b>,{' '}
                <b className="hz-brass font-semibold">email auto-ticketing</b> and{' '}
                <b className="hz-brass font-semibold">multi-rate crew-billing</b> engines. Portable
                modules that drop into what you already run.
              </p>
            </div>
            <div className="border-l-[3px] pl-6" style={{ borderColor: 'var(--hz-brass)' }}>
              <p className="hz-eyebrow mb-3">Why me</p>
              <p className="text-[17px] hz-ink leading-relaxed">
                I did not just build this platform —{' '}
                <b className="font-semibold">I run my own home-services business on it, every day.</b>{' '}
                That is a de-risker no software vendor can offer: it is proven in production by the
                person selling it. I embed, deploy on your real systems, and stay reachable when
                something breaks.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="pb-24">
        <div className="container-custom max-w-4xl">
          <div
            className="hz-panel-2 hz-in rounded-2xl border p-10 text-center sm:p-14"
            style={{ borderColor: 'var(--hz-line)' }}
          >
            <p className="hz-eyebrow mb-3">Let&rsquo;s talk</p>
            <h2 className="mb-3 text-3xl font-extrabold">Tell me about your operation.</h2>
            <p className="mx-auto mb-7 max-w-lg">
              Twenty minutes: your shops, your trades, what you pay per seat today, and whether owning
              this beats renting for you. If it doesn&rsquo;t, I will say so.
            </p>
            <a href={MAILTO} className="hz-btn">Start the conversation</a>
            <p className="hz-faint mx-auto mt-6 max-w-xl text-xs">
              Haslett Handyman is my own company, not a client. That is the point: the software is
              proven in production by the person selling it. More on how I work —{' '}
              <Link href="/engineering" className="hz-brass hover:underline">
                jaklabs.io/engineering
              </Link>
              .
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
