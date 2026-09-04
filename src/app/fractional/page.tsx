import type { Metadata } from 'next'
import Link from 'next/link'
import { PointerLight, SpotlightCard } from '@/components/engineering/PointerLight'

/**
 * Fractional AI engineering — the hire-me-part-time page.
 *
 * Built from jak-labs-sales/Why-Hire-Fractional-AI-Engineer.pdf. Deliberately
 * NOT a new scoped skin: the request was the site's existing theme, so this uses
 * the house purple, Poppins/Inter, and the `fx-` motion layer already written
 * for /engineering — scroll-driven CSS reveals with no JS, plus the pointer
 * light. Nothing new had to be invented for it to feel alive.
 *
 * SIBLING OF /engineering, NOT A DUPLICATE. /engineering argues that I can be
 * dropped into someone else's customer problem and ship. This argues the
 * commercial shape: part-time, month-to-month, cheaper than a hire. Same
 * evidence, different question — so they cross-link rather than repeat.
 *
 * ⚠️ THREE FIGURES IN THE SOURCE PDF DID NOT SURVIVE VERIFICATION. All three are
 * corrected here and recorded in content-engine/facts.toml:
 *
 *   "35 scheduled automations that move real money" — matches neither reality.
 *     Counted 2026-09-04: 51 Haslett launchd agents total, of which 18 are
 *     money-moving. 35 overstates the money subset and understates the total,
 *     so both numbers are quoted separately instead.
 *
 *   "~17,000-line Python service layer" — measured 18,095 non-test lines.
 *     Now ~18,000.
 *
 *   "125+ tests" on the telehealth platform — the suite actually runs 608 tests
 *     across 140 suites, 0 failing. Low by a factor of five.
 *
 * ⚠️ AND ONE CLAIM THAT MUST NOT COME BACK. The PDF says the telehealth platform
 * is "HIPAA-compliant". It is not, and jak-labs/legal/telehealth/README.md says
 * so in its own words: the legal set is "NOT compliant as-written, and NOT safe
 * to launch on". Software cannot be HIPAA-compliant by itself in any case —
 * compliance is a property of an organisation's whole programme. This page says
 * HIPAA-READY, exactly as /telehealth does. Keep the two in step.
 *
 * The ~140 hours stays labelled an estimate, because the register labels it one.
 */

export const metadata: Metadata = {
  title: 'Fractional AI engineering — ship production AI without the hire',
  description:
    'A fractional AI engineer who has already shipped production AI into a real business. '
    + '8–20 hrs/week, month-to-month, embedded with your team. Deployment, not demos.',
  alternates: { canonical: '/fractional' },
  openGraph: {
    type: 'website',
    url: '/fractional',
    siteName: 'JAK Labs',
    locale: 'en_US',
    title: 'Why hire me — fractionally',
    description:
      'Most companies do not need another AI demo. They need someone who will embed part-time and '
      + 'put a verified AI system into production on their real data.',
  },
}

const GETTING = [
  {
    h: 'Deployment, not demos',
    p: 'The model is the easy part now. The work is integration — mapping how your team actually '
      + 'operates, wiring into the systems you already use, and earning trust in the data. That '
      + 'middle ground between engineering, product and the customer is where I live.',
  },
  {
    h: 'A reliability-first approach to AI',
    p: 'I build the verification layer first: evaluation harnesses, retrieval-quality gates, agents '
      + 'with scoped tools and controlled state. A bad model output or a changed prompt should not '
      + 'be able to reach your user — an eval gate stops it. That is the difference between "it '
      + 'worked in the demo" and "it is safe in production."',
  },
  {
    h: 'Full-stack ownership on AWS serverless',
    p: 'Python and TypeScript. Lambda, DynamoDB, API Gateway, Cognito, CloudFront, Terraform. I can '
      + 'take a system from data model to deployed and monitored — you do not need to staff around me.',
  },
  {
    h: 'Security by necessity',
    p: 'The data I have shipped on has been PHI, financial, and other people’s customers. Tenant '
      + 'isolation, encryption and least-privilege access are not add-ons; they are how I build.',
  },
  {
    h: 'An operator’s lens',
    p: 'I have run payroll, chased receivables, and felt the cost of software that does not fit the '
      + 'workflow. I build around how your people actually work, not around my schema.',
  },
]

// Every figure register-backed. See the header note for the three the source
// document got wrong.
const NUMBERS = [
  { n: '$216K', k: 'invoiced through it · $610 over 30 days late' },
  { n: '3,235', k: 'transactions auto-categorised' },
  { n: '51', k: 'scheduled automations — 18 of them moving real money' },
  { n: '~140', unit: ' hrs', k: 'of owner admin removed (my estimate)' },
]

const RECEIPTS = [
  {
    tag: 'Live',
    h: 'Home-services operations platform',
    p: 'Owner web and crew mobile on AWS serverless. Email-driven auto-ticketing, a multi-rate '
      + 'billing engine, scheduling, CRM, Plaid and QuickBooks sync, receipt OCR through Claude '
      + 'vision, and a Profit First accounting layer.',
    detail: 'Billing, crew payouts and A/R run on roughly 18,000 lines of Python — 51 scheduled '
      + 'automations, 18 of which move real money, every one dry-running unless explicitly told '
      + 'to commit.',
    href: '/ops-platform',
    cta: 'See the platform',
  },
  {
    tag: 'Built and owned',
    h: 'Telehealth reliability layer',
    p: 'A multi-tenant, HIPAA-ready platform: PostgreSQL row-level security for hard tenant '
      + 'isolation, 608 passing tests, and an LLM reliability layer — an evaluation harness with '
      + 'retrieval-quality gates, so model output is measured and verified before it could reach '
      + 'a patient.',
    detail: 'Production-ready. Built and owned by me, with no live tenant — and I will not imply '
      + 'otherwise.',
    href: '/telehealth',
    cta: 'See the platform',
  },
]

const TAGS = [
  'Applied AI · Claude', 'RAG & retrieval quality', 'Evals & LLM reliability',
  'Agents & tool use', 'AWS serverless', 'Python · TypeScript',
  'Terraform IaC', 'Multi-tenant security',
]

const RUNS = [
  {
    h: 'Cadence',
    p: 'A fixed block of hours per week, a weekly working session, async the rest. You always know '
      + 'what shipped and what is next.',
  },
  {
    h: 'Engagement shapes',
    p: 'A scoped project with a fixed outcome, an ongoing retainer at 8–20 hrs/week, or a short paid '
      + 'discovery to de-risk the first one. Month-to-month — I keep the engagement by earning it.',
  },
  {
    h: 'The goal is to make myself optional',
    p: 'Documented, tested, owned by your team. Built to run without me is the whole point.',
  },
]

const STEPS = ['Embed', 'Map the real workflow', 'Ship it with evals around it', 'Hand it over']

export default function FractionalPage() {
  return (
    <div className="fx-page">
      <PointerLight />

      {/* Hero */}
      <section className="relative pt-32 pb-16">
        <div
          className="fx-lamp fx-lamp-l -top-32"
          aria-hidden="true"
          style={{ background: 'radial-gradient(circle, rgba(168,85,247,0.16), transparent 62%)' }}
        />
        <div className="container-custom max-w-4xl">
          <div className="fx-reveal">
            <p className="subheading mb-4 text-center">Fractional AI engineering</p>
            <h1 className="heading-xl mb-6 text-center">
              Why hire me —{' '}
              <span className="text-gradient-neon">fractionally</span>
            </h1>
            <p className="mx-auto mb-8 max-w-2xl text-lg text-white/70">
              Most companies do not need another AI demo. They need someone who will embed with
              their team part-time and put a working, verified AI system into production — on their
              real data, wired into the tools they already run. That is the only thing I do, and I
              have already done it for a business I own.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/contact" className="btn-primary">Start a conversation</Link>
              <Link href="/engineering" className="btn-secondary">The engineering case</Link>
            </div>
          </div>
        </div>
      </section>

      {/* The case in one line */}
      <section className="relative py-16 bg-secondary/30">
        <div className="container-custom max-w-4xl">
          <div className="fx-reveal">
            <p className="subheading mb-4 text-center">The case in one line</p>
            <h2 className="heading-lg mb-6 text-center">
              I was the customer <span className="text-gradient-neon">before I was the developer</span>
            </h2>
            <p className="text-white/70">
              I run a Michigan home-services company, could not buy the software it needed, so I
              built it — and that is how I became a forward-deployed engineer: someone who ships
              production systems on real, messy data inside a business that is already running. As a
              fractional hire you get that operator&rsquo;s judgment and a shipped track record, at a
              fraction of a full-time senior AI engineer&rsquo;s cost.
            </p>
          </div>
        </div>
      </section>

      {/* Why fractional */}
      <section className="relative section-padding">
        <div
          className="fx-lamp fx-lamp-r top-1/4"
          aria-hidden="true"
          style={{ background: 'radial-gradient(circle, rgba(34,211,238,0.10), transparent 62%)' }}
        />
        <div className="container-custom max-w-4xl">
          <div className="mb-10 fx-reveal">
            <p className="subheading mb-4 text-center">Why fractional is the right call</p>
            <h2 className="heading-lg text-center">One or two systems, not a year of headcount</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-2 fx-stagger">
            <SpotlightCard className="rounded-2xl border border-white/10 bg-secondary-dark p-6 sm:p-7">
              <p className="mb-2 font-mono text-xs uppercase tracking-[0.16em] text-neon-purple">
                The math
              </p>
              <p className="text-white/70">
                A full-time senior AI engineer runs{' '}
                <span className="text-white">$340–470K all-in</span> in year one. Most teams do not
                have a year of full-time AI work — they have one or two systems that need to actually
                ship. At 8–12 hrs/week I am roughly{' '}
                <span className="text-white">$90–144K/yr</span>, and you only pay while there is work
                worth doing.
              </p>
            </SpotlightCard>
            <SpotlightCard className="rounded-2xl border border-white/10 bg-secondary-dark p-6 sm:p-7">
              <p className="mb-2 font-mono text-xs uppercase tracking-[0.16em] text-neon-purple">
                The speed
              </p>
              <p className="text-white/70">
                No three-month hiring loop, no ramp. I start on your problem in week one, ship
                something into production inside the first engagement, and scale hours up or down as
                the roadmap changes.
              </p>
            </SpotlightCard>
          </div>
          <p className="mt-5 border-l-2 border-white/15 pl-5 text-sm text-white/40">
            Rate figures are market benchmarks for fractional AI engineering (roughly $150–250/hr
            direct); the full-time comparison is total comp, not salary. Your actual scope sets the
            number.
          </p>
        </div>
      </section>

      {/* What you get */}
      <section className="relative section-padding bg-secondary/30">
        <div className="container-custom max-w-4xl">
          <div className="mb-10 fx-reveal">
            <p className="subheading mb-4 text-center">What you&rsquo;re actually getting</p>
            <h2 className="heading-lg text-center">Five things, and none of them is a demo</h2>
          </div>
          <div className="space-y-4 fx-stagger">
            {GETTING.map((g, i) => (
              <div
                key={g.h}
                className="grid gap-2 border-l-2 border-neon-purple/40 pl-5"
                style={{ ['--i' as string]: i }}
              >
                <h3 className="font-semibold text-white">{g.h}</h3>
                <p className="text-sm text-white/60">{g.p}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Receipts */}
      <section className="relative section-padding">
        <div
          className="fx-lamp fx-lamp-l top-1/3"
          aria-hidden="true"
          style={{ background: 'radial-gradient(circle, rgba(191,90,242,0.13), transparent 62%)' }}
        />
        <div className="container-custom max-w-4xl">
          <div className="mb-10 fx-reveal">
            <p className="subheading mb-4 text-center">The receipts</p>
            <h2 className="heading-lg mb-6 text-center">
              Two production systems, <span className="text-gradient-neon">built solo, end to end</span>
            </h2>
            <p className="text-center text-white/70">
              This is what &ldquo;shipped&rdquo; means when I say it.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-2 fx-stagger">
            {RECEIPTS.map((r, i) => (
              <SpotlightCard
                key={r.h}
                className="flex flex-col rounded-2xl border border-white/10 bg-secondary-dark p-6 sm:p-7"
              >
                <div style={{ ['--i' as string]: i }}>
                  <p className="mb-2 font-mono text-xs uppercase tracking-[0.16em] text-neon-purple">
                    {r.tag}
                  </p>
                  <h3 className="mb-3 text-lg font-semibold text-white">{r.h}</h3>
                  <p className="mb-3 text-sm text-white/70">{r.p}</p>
                  <p className="mb-4 text-sm text-white/40">{r.detail}</p>
                  <Link href={r.href} className="text-sm font-medium text-neon-purple hover:text-neon-pink">
                    {r.cta} →
                  </Link>
                </div>
              </SpotlightCard>
            ))}
          </div>
        </div>
      </section>

      {/* Numbers */}
      <section className="relative py-16 bg-secondary/30 overflow-hidden">
        <div
          className="fx-lamp fx-lamp-r -top-40"
          aria-hidden="true"
          style={{ background: 'radial-gradient(circle, rgba(168,85,247,0.12), transparent 62%)' }}
        />
        <div className="container-custom max-w-4xl">
          <p className="subheading mb-8 text-center">The numbers behind the ops platform</p>
          <div className="grid grid-cols-2 gap-8 lg:grid-cols-4 fx-stagger">
            {NUMBERS.map((m, i) => (
              <div key={m.n} className="fx-pop text-center" style={{ ['--i' as string]: i }}>
                <div className="mb-2 text-3xl font-bold text-gradient-neon md:text-4xl">
                  {m.n}
                  {m.unit && <span className="text-lg text-white/40">{m.unit}</span>}
                </div>
                <div className="text-sm text-white/60">{m.k}</div>
              </div>
            ))}
          </div>
          <p className="mt-8 border-l-2 border-white/15 pl-5 text-sm text-white/40">
            The invoiced, collection, transaction and automation figures are actual — from DynamoDB,
            QuickBooks and the scheduler itself. The ~140 hours is a conservative estimate and is
            labelled as one. I also run a live agency CRM in AWS. I do not present trading or
            investing results as a track record.
          </p>
        </div>
      </section>

      {/* How it runs */}
      <section className="relative section-padding">
        <div className="container-custom max-w-4xl">
          <div className="mb-10 fx-reveal">
            <p className="subheading mb-4 text-center">How a fractional engagement runs</p>
            <h2 className="heading-lg text-center">Four moves, then I am optional</h2>
          </div>

          <div className="mb-10 flex flex-wrap items-center justify-center gap-x-3 gap-y-3 fx-reveal">
            {STEPS.map((s, i) => (
              <span key={s} className="flex items-center gap-3">
                <span
                  className={`rounded-lg border px-4 py-2.5 text-sm ${
                    i === STEPS.length - 1
                      ? 'border-primary/40 bg-primary/[0.08] font-medium text-white'
                      : 'border-white/10 bg-secondary-dark text-white/70'
                  }`}
                >
                  {s}
                </span>
                {i < STEPS.length - 1 && <span className="text-neon-purple">→</span>}
              </span>
            ))}
          </div>

          <div className="grid gap-4 md:grid-cols-3 fx-stagger">
            {RUNS.map((r, i) => (
              <div
                key={r.h}
                className="rounded-2xl border border-white/10 bg-secondary-dark p-6"
                style={{ ['--i' as string]: i }}
              >
                <h3 className="mb-2 font-semibold text-white">{r.h}</h3>
                <p className="text-sm text-white/60">{r.p}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Fit */}
      <section className="relative section-padding bg-secondary/30">
        <div className="container-custom max-w-4xl">
          <div className="mb-10 fx-reveal">
            <p className="subheading mb-4 text-center">Where I&rsquo;m the right fit</p>
            <h2 className="heading-lg text-center">And where I am not</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-2 fx-stagger">
            <div className="rounded-2xl border border-emerald-400/25 bg-emerald-400/[0.05] p-6 sm:p-7">
              <p className="mb-2 font-mono text-xs uppercase tracking-[0.16em] text-emerald-400">
                Hire me if
              </p>
              <p className="text-white/70">
                You are deploying AI where a wrong answer is costly — health, finance, ops, regulated
                data — and you need it to actually work in production, integrated and verified, not a
                prototype that impresses in a meeting.
              </p>
            </div>
            <div className="rounded-2xl border border-accent-coral/25 bg-accent-coral/[0.05] p-6 sm:p-7">
              <p className="mb-2 font-mono text-xs uppercase tracking-[0.16em] text-accent-coral">
                Don&rsquo;t hire me if
              </p>
              <p className="text-white/70">
                You want a large research team, frontier-model training, or a body to fill a seat. I
                am one senior builder who ships end to end — that is the value and the limit.
              </p>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap justify-center gap-2 fx-reveal">
            {TAGS.map((t) => (
              <span
                key={t}
                className="rounded-full border border-white/10 bg-secondary-dark px-3.5 py-1.5 text-xs text-white/60"
              >
                {t}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative section-padding overflow-hidden">
        <div
          className="fx-lamp fx-lamp-l bottom-0"
          aria-hidden="true"
          style={{ background: 'radial-gradient(circle, rgba(168,85,247,0.15), transparent 62%)' }}
        />
        <div className="container-custom max-w-4xl">
          <div className="fx-reveal text-center">
            <h2 className="heading-lg mb-6">
              Tell me what you are trying to{' '}
              <span className="text-gradient-neon">put into production</span>
            </h2>
            <p className="mx-auto mb-8 max-w-xl text-white/70">
              A short paid discovery is the cheapest way to find out whether this works. If I am not
              the right person for it, I will say so — and it costs you one email.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/contact" className="btn-primary">Start a conversation</Link>
              <a
                href="https://www.linkedin.com/in/jd-alexander-kemp-99b07064/"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary"
              >
                LinkedIn
              </a>
              <a
                href="https://github.com/jaklabs"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary"
              >
                GitHub
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
