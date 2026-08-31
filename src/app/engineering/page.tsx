import type { Metadata } from 'next'
import Link from 'next/link'
import { PointerLight, SpotlightCard } from '@/components/engineering/PointerLight'
import { EngagementScoper } from '@/components/engineering/EngagementScoper'

/**
 * The second front door.
 *
 * Everything else on this site talks to a business owner. This page talks to an
 * engineering or delivery lead deciding whether to hand a customer relationship
 * to a contractor, and those two readers are convinced by opposite things: the
 * owner wants to know I understand their business, this reader wants to know I
 * will survive their messiest customer.
 *
 * So it is linked from the footer and from /about, not from the main nav. The
 * local buyer never needs it; the person I send it to lands on it directly.
 *
 * MOTION, added 2026-08-31. This file used to say "no animation on purpose",
 * on the reasoning that the reader skims and leaves. That reasoning was about
 * not making them WAIT, and it was right — so the motion here is built to not
 * cost them anything:
 *
 *   • The reveals are `animation-timeline: view()` in CSS. The browser drives
 *     them off scroll with no JavaScript, so there is nothing to hydrate and no
 *     flash of hidden content on a slow connection. A browser without support
 *     (Firefox today) renders the page static and fully legible.
 *   • The only script is the pointer light and the card spotlights: two rAF-
 *     throttled listeners that write CSS variables and never touch React state.
 *     Both are off under prefers-reduced-motion and on devices with no cursor.
 *   • Every word remains server-rendered. Nothing on this page waits on JS to
 *     become readable, which is the property the old comment was protecting.
 *
 * Every claim below is checkable, and the bugs are included because the bugs are
 * the credential. Nobody who has only built demos writes those paragraphs.
 */

export const metadata: Metadata = {
  title: 'Forward-Deployed Engineering',
  description:
    'JD Kemp — forward-deployed engineer and small-business owner. I embed with a team, '
    + 'learn the customer\'s domain, and ship production software on their real data. '
    + 'Public artifacts, the stack, and the bugs.',
  alternates: { canonical: '/engineering' },
  openGraph: {
    type: 'website',
    url: '/engineering',
    title: 'Forward-Deployed Engineering | JD Kemp',
    description:
      'I do not need to learn your customer — I am your customer, and I can build.',
  },
}

const ARTIFACTS = [
  {
    name: 'Multi-tenant clinical platform',
    href: 'https://github.com/jaklabs/telehealth-platform-reference',
    what:
      'Many separately branded clinics on one deployment — storefront, patient portal, clinic CRM '
      + 'and webhook ingest across four subdomains. 95 TypeScript source files, 29 test files, '
      + '36 migrations.',
    decisions: [
      'Tenant isolation in PostgreSQL row-level security, not application code. A query that '
        + 'forgets its WHERE clause returns nothing rather than another clinic\'s patients.',
      'A clinical-network adapter behind a typed boundary, so the vendor can be swapped without '
        + 'touching anything downstream. That decision is what made it a product rather than '
        + 'custom work.',
      'Per-service IAM and RDS IAM auth — no long-lived database passwords anywhere in it.',
    ],
    honest:
      'Built and owned by me. It has no live client, and I will not imply otherwise.',
  },
  {
    name: 'A public endpoint that fetches arbitrary URLs',
    href: '/website-audit',
    what:
      'The free audit on this site runs headless Chromium in Lambda against any address a stranger '
      + 'types into a form. Unauthenticated, public, and pointed at whatever you give it.',
    decisions: [
      'That shape is an SSRF liability unless the boundary is real: link-local metadata '
        + '(169.254.169.254), RFC1918 and CGNAT ranges, credentials embedded in the URL, '
        + 'non-HTTP schemes, and .internal/.local names are all refused.',
      'DNS is resolved and checked before the fetch, because a public hostname can point at a '
        + 'private address and a URL allowlist alone would never catch it.',
      '36 tests against that boundary — 24 blocked inputs, 11 that must still be allowed, and a '
        + 'bounds check — run against the guard rather than a local mock.',
    ],
    honest:
      'Security judgement on a public endpoint is what an FDE gets trusted with on day one in '
      + 'someone else\'s environment.',
  },
  {
    name: 'An end-to-end prospecting pipeline',
    href: 'https://github.com/jaklabs/web-browse',
    what:
      'Google Places → enrichment → headless audit → scoring → CRM. It is how I find my own '
      + 'clients: 3,000+ businesses swept, scored and loaded, with the compliance rules encoded '
      + 'in the scorer rather than left to whoever runs it.',
    decisions: [
      'Ranking runs in code with no model call, so the same input produces the same output. An '
        + 'LLM verdict is not reproducible and cannot be audited after the fact.',
      'Idempotent writes keyed on place_id, a do-not-contact gate, and suppression applied at '
        + 'scoring time so a do-not-solicit address never reaches the CRM at all.',
      'Every importer dry-runs by default and needs --commit said out loud to touch production.',
    ],
    honest:
      'It also shows I build tools for myself first, which is the instinct the job runs on.',
  },
]

// The bugs. This section exists because it is the most persuasive thing on the
// page — an engineer reading it concludes "this person has actually shipped to
// production", which no amount of adjectives achieves.
const BUGS = [
  {
    symptom: '"empty password returned by client" on every database connection',
    cause:
      'node-postgres was silently discarding the IAM token function. The connection string was '
      + 'parsed into an object and merged with Object.assign, which let the parsed URL\'s empty '
      + 'password field overwrite the function that generates the token.',
    lesson:
      'The error named the symptom and not one component involved in causing it. Config merge '
      + 'order is worth reading twice when a credential is a function rather than a string.',
  },
  {
    symptom: 'Two services permanently unhealthy, with a health check that looked fine',
    cause:
      'The readiness probe called a dependency the service\'s own IAM role forbade. The probe '
      + 'failed, so the task never went healthy, so it was replaced — forever.',
    lesson:
      'A readiness probe should assert what the service needs to serve traffic, not everything '
      + 'it might eventually touch. Probes that over-reach turn a permissions problem into a '
      + 'crash loop.',
  },
  {
    symptom: 'ECS Exec silently unavailable, with no reason given anywhere',
    cause:
      'readonlyRootFilesystem stopped the SSM agent from writing where it needs to. Nothing '
      + 'logged it; the exec attempt just failed.',
    lesson:
      'Hardening and debuggability trade against each other, and the trade should be a decision '
      + 'rather than a surprise discovered at the worst moment.',
  },
]

export default function EngineeringPage() {
  return (
    <div className="fx-page">
      {/* The one piece of lighting that needs a cursor. Self-disabling under
          reduced motion and on touch — see the component. */}
      <PointerLight />

      {/* Hero */}
      <section className="relative pt-32 pb-16">
        <div className="fx-lamp fx-lamp-l -top-32" aria-hidden="true"
             style={{ background: 'radial-gradient(circle, rgba(168,85,247,0.16), transparent 62%)' }} />
        <div className="container-custom">
          <div className="max-w-3xl fx-reveal">
            <p className="subheading mb-4">Forward-deployed engineering</p>
            <h1 className="heading-xl mb-8">
              I don&apos;t need to learn your customer.{' '}
              <span className="text-gradient-neon">I am your customer.</span>
            </h1>
            <div className="space-y-5 text-lg text-white/70">
              <p>
                I&apos;m JD Kemp. I embed with a team, learn the customer&apos;s domain fast
                enough to be useful, and ship the production system that makes the product
                actually work in their world — the integration, the migration, the prototype that
                closes the deal, the pipeline that gets ugly data into a usable shape.
              </p>
              <p>
                Every other engineer up for that work has never run a business.{' '}
                <span className="text-white">
                  I run a home-services company that depends on software I wrote and still
                  operate.
                </span>{' '}
                If you sell into trades, home services, clinics or local services, I have quoted
                the job, chased the invoice, and lost the customer to a booking form that
                didn&apos;t work — this year, with my own money on the line.
              </p>
              <p>
                That is the hardest thing on your list to hire for, and I have it by accident of
                biography.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* The numbers */}
      <section className="relative py-16 bg-secondary/30 overflow-hidden">
        <div className="fx-lamp fx-lamp-r -top-40" aria-hidden="true"
             style={{ background: 'radial-gradient(circle, rgba(34,211,238,0.10), transparent 62%)' }} />
        <div className="container-custom">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 fx-stagger">
            {[
              ['$155K', 'invoiced through software I wrote and operate'],
              ['3,235', 'transactions auto-categorised'],
              ['~140 hrs', 'of admin removed from my own week'],
              ['1', 'engineer — nothing to production is somebody else\'s job'],
            ].map(([figure, label], i) => (
              <div key={figure} className="fx-pop" style={{ '--i': i } as React.CSSProperties}>
                <div className="text-4xl font-bold text-gradient-neon mb-2">{figure}</div>
                <div className="text-sm text-white/60">{label}</div>
              </div>
            ))}
          </div>
          <p className="mt-8 text-sm text-white/40 max-w-3xl">
            Those four are the only numbers I claim. There is no client count, no satisfaction
            score, and no team — and where a figure would flatter me but isn&apos;t true, it
            isn&apos;t here.
          </p>
        </div>
      </section>

      {/* The scoper.
          Placed straight after the figures and before the artifacts: the reader
          has just been given four numbers and is deciding whether to keep
          reading. An interactive thing that can tell them "no" earns more of
          that decision than another paragraph would. */}
      <section className="relative section-padding overflow-hidden">
        <div className="fx-lamp fx-lamp-r top-10" aria-hidden="true"
             style={{ background: 'radial-gradient(circle, rgba(168,85,247,0.12), transparent 62%)' }} />
        <div className="container-custom">
          <div className="max-w-3xl mb-10 fx-reveal">
            <p className="subheading mb-4">Scope it in thirty seconds</p>
            <h2 className="heading-lg mb-6">
              Tell me the shape of the problem.{' '}
              <span className="text-gradient-neon">I&apos;ll tell you if I&apos;m the wrong person.</span>
            </h2>
            <p className="text-white/70">
              Four questions, then a real engagement brief you can forward to whoever signs off —
              including the cases where the honest answer is that you need someone else.
            </p>
          </div>

          <div className="max-w-3xl fx-reveal">
            <EngagementScoper />
            <p className="mt-6 text-sm text-white/40">
              This runs entirely in your browser and there is no model behind it — the same four
              answers always produce the same brief. That is deliberate: an LLM verdict is not
              reproducible and cannot be audited afterwards, which is the same rule I apply to the
              scoring and ranking code below. Nothing you tap is transmitted anywhere.
            </p>
          </div>
        </div>
      </section>

      {/* Artifacts */}
      <section className="relative section-padding">
        <div className="fx-lamp fx-lamp-l top-1/4" aria-hidden="true"
             style={{ background: 'radial-gradient(circle, rgba(191,90,242,0.13), transparent 62%)' }} />
        <div className="container-custom">
          <div className="max-w-3xl mb-16 fx-reveal">
            <p className="subheading mb-4">Read the code</p>
            <h2 className="heading-lg mb-6">
              Three things I built, and the{' '}
              <span className="text-gradient-neon">decisions inside them</span>
            </h2>
            <p className="text-white/70">
              Not a list of technologies. The small number of decisions everything else followed
              from, and whether the code actually enforces them.
            </p>
          </div>

          <div className="space-y-12">
            {ARTIFACTS.map((a, i) => (
              <SpotlightCard
                key={a.name}
                className="fx-reveal rounded-2xl border border-white/10 bg-secondary-dark/40 p-6 sm:p-8"
              >
                <div className="flex items-baseline gap-4 mb-4 flex-wrap">
                  <span className="text-sm text-neon-purple font-mono">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <h3 className="text-2xl font-semibold">{a.name}</h3>
                </div>
                <div className="grid lg:grid-cols-2 gap-8">
                  <div>
                    <p className="text-white/70 mb-4">{a.what}</p>
                    <p className="text-sm text-white/40 italic mb-4">{a.honest}</p>
                    <Link
                      href={a.href}
                      className="text-neon-purple hover:text-neon-pink transition-colors text-sm font-medium"
                      {...(a.href.startsWith('http')
                        ? { target: '_blank', rel: 'noopener noreferrer' }
                        : {})}
                    >
                      {a.href.startsWith('http') ? 'View on GitHub →' : 'Try it →'}
                    </Link>
                  </div>
                  <ul className="space-y-3">
                    {a.decisions.map((d) => (
                      <li key={d} className="text-sm text-white/60 flex gap-3">
                        <span className="text-neon-purple mt-1 shrink-0">▸</span>
                        <span>{d}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </SpotlightCard>
            ))}
          </div>
        </div>
      </section>

      {/* The bugs */}
      <section className="relative section-padding bg-secondary/30 overflow-hidden">
        <div className="fx-lamp fx-lamp-r top-0" aria-hidden="true"
             style={{ background: 'radial-gradient(circle, rgba(249,115,22,0.09), transparent 62%)' }} />
        <div className="container-custom">
          <div className="max-w-3xl mb-12 fx-reveal">
            <p className="subheading mb-4">The part most portfolios leave out</p>
            <h2 className="heading-lg mb-6">
              Three bugs that only <span className="text-gradient-neon">appear in production</span>
            </h2>
            <p className="text-white/70">
              I would rather you judge me on these than on a feature list. Each one cost real
              hours, and in every case the error message named the symptom and not one component
              involved in causing it.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 fx-stagger">
            {BUGS.map((b, i) => (
              <div
                key={b.symptom}
                className="border-l-2 border-neon-purple/40 pl-6"
                style={{ '--i': i } as React.CSSProperties}
              >
                <div className="text-xs uppercase tracking-wide text-white/40 mb-2">Symptom</div>
                <p className="font-medium mb-4">{b.symptom}</p>
                <div className="text-xs uppercase tracking-wide text-white/40 mb-2">Cause</div>
                <p className="text-sm text-white/60 mb-4">{b.cause}</p>
                <div className="text-xs uppercase tracking-wide text-white/40 mb-2">
                  What it changed
                </div>
                <p className="text-sm text-white/60">{b.lesson}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stack + how I work */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-16 fx-stagger">
            <div>
              <p className="subheading mb-4">The stack</p>
              <h2 className="heading-lg mb-6">Whole-stack, which is the job</h2>
              <div className="space-y-4 text-white/70">
                <p>
                  <span className="text-white">Languages</span> — TypeScript, Python, JavaScript.
                </p>
                <p>
                  <span className="text-white">Frontend</span> — React, React Native, Next.js,
                  Expo.
                </p>
                <p>
                  <span className="text-white">Backend and data</span> — Node, Lambda, API
                  Gateway, DynamoDB, PostgreSQL/RDS, ECS.
                </p>
                <p>
                  <span className="text-white">Infrastructure</span> — AWS, Terraform, CDK,
                  Cognito, SES, CloudFront, IAM.
                </p>
                <p>
                  <span className="text-white">AI</span> — Claude in production, and the
                  evaluation layer that decides whether an answer is good enough to show anyone.
                </p>
                <p className="text-sm text-white/40 pt-2">
                  Breadth over depth is deliberate. On an embedded engagement you touch their
                  auth, their database, their frontend, their deploy pipeline and someone&apos;s
                  spreadsheet, usually in the same week.
                </p>
              </div>
            </div>

            <div>
              <p className="subheading mb-4">How an engagement runs</p>
              <h2 className="heading-lg mb-6">Short, scoped, and yours at the end</h2>
              <div className="space-y-5 text-white/70">
                <p>
                  <span className="text-white">Weeks, not quarters.</span> A defined stretch
                  against a named outcome. If the outcome turns out to be the wrong one, I would
                  rather say so in week one than bill through to the end of it.
                </p>
                <p>
                  <span className="text-white">On your real data.</span> A demo that works on
                  clean input has proved nothing. Their data is bad, the API is undocumented, and
                  the stakeholder changes their mind — that is the work, not an obstacle to it.
                </p>
                <p>
                  <span className="text-white">Documented so it outlives me.</span> An embedded
                  engineer who leaves behind something only they can operate has made the problem
                  worse.
                </p>
                <p>
                  <span className="text-white">I talk to non-engineers without condescension.</span>{' '}
                  Half the job is sitting with an operations manager and working out what they
                  actually do all day. I have been the operations manager.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative section-padding bg-secondary/30 overflow-hidden">
        <div className="fx-lamp fx-lamp-l bottom-0" aria-hidden="true"
             style={{ background: 'radial-gradient(circle, rgba(168,85,247,0.15), transparent 62%)' }} />
        <div className="container-custom">
          <div className="max-w-2xl fx-reveal">
            <h2 className="heading-lg mb-6">
              Available for <span className="text-gradient-neon">embedded contracts</span>
            </h2>
            <p className="text-white/70 mb-8">
              If you have a customer engagement that needs someone who can learn their world fast
              and ship into it, tell me about the customer and what &quot;working&quot; would look
              like. If I am not the right person for it I will say so, and it costs you one
              email.
            </p>
            <p className="text-white/50 mb-8 text-sm">
              If you are a developer rather than someone hiring one, I also run a school —{' '}
              <Link href="/hood-dev" className="text-neon-purple hover:text-neon-pink">
                Hood Dev
              </Link>
              , which teaches the messy half of this job. Free while I build it.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/contact" className="btn-primary">
                Start a conversation
              </Link>
              <Link
                href="https://github.com/jaklabs"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary"
              >
                GitHub
              </Link>
              <Link
                href="https://www.linkedin.com/in/jd-alexander-kemp-99b07064/"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary"
              >
                LinkedIn
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
