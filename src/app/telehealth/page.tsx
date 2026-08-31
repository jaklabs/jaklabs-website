import type { Metadata } from 'next'
import Link from 'next/link'
import { Newsreader, Instrument_Sans, IBM_Plex_Mono } from 'next/font/google'

/**
 * The telehealth platform — offered for licence or acquisition.
 *
 * ⚠️⚠️ READ BEFORE EDITING A SINGLE WORD OF THE COMPLIANCE COPY.
 *
 * The design artifact this page came from said "HIPAA-compliant", "compliant on
 * day one", "you launch compliantly", and "the BAA in place". None of that
 * shipped, and none of it may come back. The project's own legal README
 * (jak-labs/legal/telehealth/README.md) opens with, verbatim:
 *
 *     🛑 STOP — READ THIS FIRST. These are starter drafts to bring to a
 *     HEALTHCARE attorney — they are NOT legal advice, NOT compliant
 *     as-written, and NOT safe to launch on. Do not accept PHI on this
 *     platform until a healthcare attorney has finalized the BAA.
 *
 * Selling "compliant on day one" against that is not marketing licence, it is a
 * false statement about regulatory status made to someone who would rely on it —
 * and the reliance is the danger. An operator who believes it could start
 * accepting PHI on an unfinalised BAA. HIPAA penalties run into seven figures a
 * year per violation category and carry criminal exposure, and patients are the
 * ones harmed.
 *
 * There is also a plain-accuracy point: software cannot be "HIPAA-compliant" on
 * its own. Compliance is a property of a covered entity's or business
 * associate's whole programme — policies, training, BAAs, risk analysis — not of
 * a codebase. So the page says HIPAA-READY, describes precisely what is built,
 * and describes the legal set as what it is: drafts that shorten the attorney's
 * job rather than replace it. To the sophisticated operator this page is aimed
 * at, that precision reads as competence, not as weakness.
 *
 * ⚠️ NO LIVE CLIENT. There has never been one. The page says so out loud and
 * turns it into the offer (founding terms for the first operator). Anything that
 * implies patients, clinics or PHI have touched this is false. In particular:
 * jak-labs/legal/telehealth/ contains a becoming-wellness/ folder — that deal
 * died 2026-08-26, was never signed and never paid. It must never appear here.
 *
 * FIGURES, all verified 2026-08-31:
 *   608 tests, 140 suites, 0 failing .. `npm test` in jak-labs/telehealth-platform
 *                                       (the artifact said "125+", well low)
 *   28 test files ..................... find, excluding node_modules
 *   37 migrations ..................... db migrations directory
 *   5 legal drafts .................... legal/telehealth/ — PSA, BAA, privacy,
 *                                       ToS, refund+billing. NOT a "perpetual
 *                                       licence agreement"; the artifact listed
 *                                       one and no such document exists.
 */

// Newsreader has no metrics in Next's override table, so the automatic
// size-adjust fallback cannot be computed and the build warns. Naming the
// fallback stack explicitly and turning the adjustment off silences it and, more
// to the point, makes the swap deliberate: Georgia is metrically close enough to
// Newsreader that the h1 does not jump when the webfont lands.
const newsreader = Newsreader({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-newsreader',
  display: 'swap',
  fallback: ['Georgia', 'Times New Roman', 'serif'],
  adjustFontFallback: false,
})
const instrument = Instrument_Sans({
  subsets: ['latin'],
  weight: ['500', '600', '700'],
  variable: '--font-instrument',
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
  + encodeURIComponent('Telehealth platform — licence or acquire')
  + '&body='
  + encodeURIComponent(
    'Hi JD,\n\nI read the telehealth page. Here is what we are building:\n\n'
    + '- Model (single clinic / be-the-platform):\n- Clinical network:\n'
    + '- States we would operate in:\n- Timeline:\n\n',
  )

const SPECS = [
  { s: 'HIPAA-ready', k: 'architecture built for a BAA — not a compliance certificate' },
  { s: 'RLS isolation', k: 'PostgreSQL row-level — hard multi-tenant separation' },
  { s: '608 tests', k: 'passing, 0 failing, across 140 suites' },
  { s: 'Reliability layer', k: 'model output evaluated before it reaches a patient' },
]

const FEATURES = [
  ['Multi-tenant SaaS', 'PostgreSQL row-level security — a query that forgets its WHERE returns nothing, not another clinic’s patients'],
  ['LLM reliability layer', 'eval harness and retrieval-quality gates in front of anything a patient reads'],
  ['Network-agnostic', 'the clinical and prescribing integration sits behind a typed boundary and can be swapped'],
  ['Patient intake, scheduling, records', 'plus secure messaging, across four subdomains'],
  ['No long-lived database passwords', 'per-service IAM and RDS IAM auth throughout'],
  ['37 migrations', 'schema is versioned and reproducible, not hand-applied'],
]

const AUDIENCE = [
  {
    h: 'Telehealth operators',
    p: 'Infrastructure now, with tenant isolation and the reliability layer already built and tested.',
  },
  {
    h: 'Clinic and wellness brands',
    p: 'Run your own branded telehealth rather than a generic vendor’s, on infrastructure you control.',
  },
  {
    h: 'Companies that want to be the platform',
    p: 'Acquire the infrastructure and white-label it to many clinics under your own brand.',
  },
]

const PATHS = [
  {
    lab: 'Licence — run your own telehealth',
    h: 'For a clinic or brand',
    who: 'You want your own branded telehealth, owned for good.',
    feature: true,
    items: [
      'A perpetual, tenant-isolated deployment that is yours',
      'I deploy it, brand it, and wire your clinical or prescribing network',
      'The reliability layer, and the BAA drafts to take to your counsel',
      'Bug fixes and updates included; new build-out scoped separately',
      'Your patients, your data, your brand — always',
    ],
  },
  {
    lab: 'Acquire — be the provider',
    h: 'For a company',
    who: 'You want to own the platform and offer it to others.',
    feature: false,
    items: [
      'The codebase and IP outright, source in hand',
      'I deploy it, build it out, and transition it to your team',
      'White-label it to your clinics under your brand',
      'The legal draft set comes with it',
      'Optional ongoing engineering support, scoped',
    ],
  },
]

const STEPS = [
  { h: 'Scope', p: 'Your model, your clinical network, single clinic versus be-the-platform, and which states.' },
  { h: 'Deploy & tailor', p: 'I stand it up on your infrastructure, wire your integrations and apply your brand.' },
  { h: 'Handover', p: 'You own it, documented — with me on call for fixes and extensions.' },
]

export const metadata: Metadata = {
  title: 'Telehealth platform — licence it, or acquire it',
  description:
    'A multi-tenant, network-agnostic telehealth platform with PostgreSQL row-level tenant '
    + 'isolation, an LLM reliability layer and 608 passing tests. HIPAA-ready architecture. '
    + 'Built and owned by me, awaiting its first operator.',
  alternates: { canonical: '/telehealth' },
  openGraph: {
    type: 'website',
    url: '/telehealth',
    title: 'The platform for people who want to be the platform.',
    description:
      'Multi-tenant telehealth infrastructure with hard tenant isolation and a reliability layer '
      + 'in front of the model. Licence it or acquire it.',
  },
}

function Head({ eyebrow, children }: { eyebrow: string; children: React.ReactNode }) {
  return (
    <div className="tl-in mb-7">
      <p className="tl-eyebrow mb-3">{eyebrow}</p>
      <h2 className="text-2xl md:text-3xl">{children}</h2>
    </div>
  )
}

export default function TelehealthPage() {
  return (
    <div className={`tele-skin ${newsreader.variable} ${instrument.variable} ${plexMono.variable}`}>
      {/* Hero */}
      <section className="pt-32 pb-12">
        <div className="container-custom max-w-4xl">
          <div className="tl-in">
            <p className="tl-eyebrow mb-4">Built · tested · owned IP · no operator yet</p>
            <h1 className="mb-6 text-4xl md:text-5xl lg:text-6xl">
              The platform for people who want to be the platform.
            </h1>
            <p className="text-lg leading-relaxed">
              A multi-tenant, network-agnostic telehealth platform with hard tenant isolation, an LLM
              reliability layer, and the legal starter set already drafted. Licence it to run your own
              telehealth, or acquire it to become the provider.
            </p>
            <p
              className="tl-mono tl-ink mt-7 inline-flex items-center gap-3 rounded-full border px-4 py-2 text-sm font-semibold"
              style={{ background: 'var(--tl-teal-ghost)', borderColor: 'var(--tl-line)' }}
            >
              <span className="h-1.5 w-1.5 rounded-full" style={{ background: 'var(--tl-teal)' }} />
              Licence or acquire + deployment · you own the IP
            </p>
            <div className="mt-8 flex flex-wrap gap-3.5">
              <a href={MAILTO} className="tl-btn">Book a call</a>
              <a href="#what" className="tl-btn-ghost">See the architecture</a>
            </div>
          </div>
        </div>
      </section>

      {/* Status readout */}
      <section className="pb-14">
        <div className="container-custom max-w-4xl">
          <div className="tl-panel overflow-hidden">
            <div
              className="tl-panel-2 flex flex-wrap items-center gap-3 border-b px-5 py-3.5"
              style={{ borderColor: 'var(--tl-line)' }}
            >
              <span
                className="tl-mono inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.16em]"
                style={{ color: 'var(--tl-ready)' }}
              >
                <span className="tl-pulse" />
                Built and passing
              </span>
              <span className="tl-mono tl-faint ml-auto text-[11px]">
                engineering status · awaiting its first operator
              </span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 tl-stagger">
              {SPECS.map((s, i) => (
                <div
                  key={s.s}
                  className="border-b border-r p-5 last:border-r-0 md:border-b-0"
                  style={{ borderColor: 'var(--tl-line)', ['--i' as string]: i }}
                >
                  <div className="tl-mono text-[15px] font-semibold" style={{ color: 'var(--tl-teal)' }}>
                    {s.s}
                  </div>
                  <div className="mt-1.5 text-[12.5px] leading-snug">{s.k}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* What it is */}
      <section id="what" className="pb-14 scroll-mt-24">
        <div className="container-custom max-w-4xl">
          <Head eyebrow="What it is">Network-agnostic telehealth infrastructure.</Head>
          <p className="tl-in mb-8 text-lg leading-relaxed">
            Multi-tenant by design: each clinic or brand is an isolated tenant on shared
            infrastructure, so the marginal cost of the next tenant trends toward zero. Bring your own
            clinical network — the platform plugs into it.
          </p>
          <ul className="grid gap-x-8 gap-y-3.5 sm:grid-cols-2 tl-stagger">
            {FEATURES.map(([h, p], i) => (
              <li
                key={h}
                className="relative pl-7 text-[15.5px]"
                style={{ ['--i' as string]: i }}
              >
                <span
                  className="absolute left-0 top-2 h-2.5 w-2.5 rounded-full border-2"
                  style={{ borderColor: 'var(--tl-teal)' }}
                />
                <b className="tl-ink font-semibold">{h}</b> — {p}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* The compliance position. The most important block on the page. */}
      <section className="pb-14">
        <div className="container-custom max-w-4xl">
          <div
            className="tl-in rounded-2xl border p-7 sm:p-9"
            style={{ background: 'var(--tl-teal-ghost)', borderColor: 'var(--tl-line)' }}
          >
            <p className="tl-eyebrow mb-3">Where compliance actually stands</p>
            <h2 className="mb-4 text-2xl">
              A head start on the paperwork. Not a substitute for your attorney.
            </h2>
            <div className="space-y-4 text-[15.5px] leading-relaxed tl-ink">
              <p>
                Building multi-tenant telehealth infrastructure is a year, a team and six figures. That
                part is done, tested, and yours. The platform is built{' '}
                <b className="font-semibold">HIPAA-ready</b>: row-level tenant isolation, per-service
                IAM, no long-lived database credentials, and an architecture designed for a business
                associate relationship.
              </p>
              <p>
                It also ships with five drafted legal documents — platform services agreement,
                business associate agreement, privacy policy, terms, and billing terms — so your
                counsel starts from a draft rather than a blank page.
              </p>
              <p
                className="rounded-lg border-l-[3px] py-1 pl-4"
                style={{ borderColor: 'var(--tl-caution)' }}
              >
                <b className="font-semibold">Said plainly, because it matters:</b> those documents are
                starter drafts for a healthcare attorney to finalise. They are not compliant
                as-written, and no software is &ldquo;HIPAA-compliant&rdquo; by itself — compliance is
                a property of your whole programme, not of a codebase. Do not accept PHI on this or
                any platform until your attorney has finalised the BAA. Anyone selling you
                &ldquo;compliant on day one&rdquo; is selling you a risk they will not be carrying.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Who it is for */}
      <section className="pb-14">
        <div className="container-custom max-w-4xl">
          <Head eyebrow="Who it&rsquo;s for">Three shapes of operator</Head>
          <div className="grid gap-4 md:grid-cols-3 tl-stagger">
            {AUDIENCE.map((a, i) => (
              <div key={a.h} className="tl-panel p-6" style={{ ['--i' as string]: i }}>
                <h3 className="mb-2 text-lg">{a.h}</h3>
                <p className="text-[15px]">{a.p}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Two ways in */}
      <section className="pb-14">
        <div className="container-custom max-w-4xl">
          <Head eyebrow="Two ways in">Licence it, or acquire it.</Head>
          <div className="grid gap-4 md:grid-cols-2 tl-stagger">
            {PATHS.map((p, i) => (
              <div
                key={p.h}
                className="tl-panel flex flex-col p-7"
                style={{
                  borderColor: p.feature ? 'var(--tl-teal)' : 'var(--tl-line)',
                  borderWidth: p.feature ? '1.5px' : '1px',
                  ['--i' as string]: i,
                }}
              >
                <p className="tl-mono mb-2 text-[11px] uppercase tracking-[0.12em] tl-teal">
                  {p.lab}
                </p>
                <h3 className="mb-1.5 text-xl">{p.h}</h3>
                <p className="mb-4 text-sm italic">{p.who}</p>
                <ul className="space-y-2.5">
                  {p.items.map((it) => (
                    <li key={it} className="relative pl-6 text-[14.5px] tl-ink">
                      <span className="absolute left-0 font-bold tl-teal">✓</span>
                      {it}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="mt-4 grid gap-4 md:grid-cols-3 tl-stagger">
            {STEPS.map((s, i) => (
              <div key={s.h} className="tl-panel p-6" style={{ ['--i' as string]: i }}>
                <p className="tl-mono text-[13px] font-semibold tl-teal">0{i + 1}</p>
                <h3 className="mb-1.5 mt-2 text-base">{s.h}</h3>
                <p className="text-[14.5px]">{s.p}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* First operator + why me */}
      <section className="pb-14">
        <div className="container-custom max-w-4xl">
          <div className="grid gap-8 md:grid-cols-2 md:items-center tl-stagger">
            <div>
              <p className="tl-eyebrow mb-3">Be the anchor</p>
              <h2 className="mb-4 text-2xl">First operator advantage.</h2>
              <p className="text-[17px] leading-relaxed">
                The platform is built and tested and has no operator yet. I would rather say that than
                imply a customer I do not have — and it is the offer, not an apology: the first
                operator gets founding terms and a direct line to the engineer shaping it, on a
                finished foundation rather than a roadmap.
              </p>
            </div>
            <div className="border-l-[3px] pl-6" style={{ borderColor: 'var(--tl-teal)' }}>
              <p className="tl-eyebrow mb-3">Why me</p>
              <p className="text-[17px] leading-relaxed tl-ink">
                I architected the platform, its reliability layer and its legal starter set — the
                whole stack. I am a forward-deployed engineer: I embed, deploy on your
                infrastructure, and stay reachable when something breaks at an hour that matters.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="pb-24">
        <div className="container-custom max-w-4xl">
          <div
            className="tl-panel-2 tl-in rounded-2xl border p-10 text-center sm:p-14"
            style={{ borderColor: 'var(--tl-line)' }}
          >
            <p className="tl-eyebrow mb-3">Let&rsquo;s talk</p>
            <h2 className="mb-3 text-3xl">Tell me what you&rsquo;re building.</h2>
            <p className="mx-auto mb-7 max-w-lg">
              Twenty minutes: your model, your clinical network, and whether licensing or acquiring
              this beats building it. If building it yourself is the right answer, I will say so.
            </p>
            <a href={MAILTO} className="tl-btn">Start the conversation</a>
            <p className="tl-faint mx-auto mt-6 max-w-xl text-xs">
              Built and owned by me. It has no live client and has never carried patient data — a
              proven-architecture asset, not a live-user claim. More on how I work —{' '}
              <Link href="/engineering" className="tl-teal hover:underline">
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
