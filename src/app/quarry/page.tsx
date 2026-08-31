import type { Metadata } from 'next'
import Link from 'next/link'
import { Bricolage_Grotesque, Hanken_Grotesk, IBM_Plex_Mono } from 'next/font/google'

/**
 * Quarry — the growth-compliance engine. Free to run, paid to ship inside
 * something you sell.
 *
 * ⚠️ THE ATTORNEY REVIEW HAS NOT HAPPENED YET, and this page must keep saying so.
 *
 * The design artifact's "why me" block said the engine "is reviewed against the
 * boundary cases". It is not. quarry/LICENSING-DECISION-attorney.md is a brief
 * PREPARED FOR an attorney, and it says in its own words that the questions need
 * confirming "before we make the repository public". Claiming a completed legal
 * review on a product whose entire value proposition is legal accuracy would be
 * self-refuting — it is the one claim on this page a buyer would most reasonably
 * rely on, and the first one a competitor would check.
 *
 * So the page states the review is pending and turns that into the early-access
 * framing, which is also why the repo is still private. If the review completes,
 * update this block and the copy together; do not update one without the other.
 *
 * FIGURES, verified 2026-08-31 against ~/claude-server/quarry:
 *   86 tactics ......... find register -name '*.toml' | wc -l
 *   10 channels ........ ls register (11 entries, minus SCHEMA.md)
 *                        ⚠️ the artifact said 9. It is 10.
 *   263 tests passing .. python3 -m unittest discover -s tests
 *   pricing ............ every figure matches PRICING.md exactly — $0 / $2,400yr /
 *                        from $12,000yr / $149–499mo, plus the $2,500 coverage
 *                        pack and $9,500 integration. Do not adjust one without
 *                        the other; PRICING.md is the source of truth.
 *
 * The verdict colours carry meaning, so every pill also carries its word. Colour
 * is never the only signal — see .qy-pill in globals.css.
 */

const bricolage = Bricolage_Grotesque({
  subsets: ['latin'],
  weight: ['600', '700', '800'],
  variable: '--font-bricolage',
  display: 'swap',
})
const hanken = Hanken_Grotesk({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-hanken',
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
  + encodeURIComponent('Quarry — early access')
  + '&body='
  + encodeURIComponent(
    'Hi JD,\n\nI read the Quarry page. Here is how we grow:\n\n'
    + '- What we are: \n- Channels we use: \n- Where we are unsure of the line: \n'
    + '- Free core / agency licence / embed: \n\n',
  )

const VERDICTS = [
  {
    k: 'GREEN' as const,
    t: 'Cold B2B email',
    s: 'Lawful in the US — truthful header, physical address, working opt-out',
    cite: 'CAN-SPAM · 15 U.S.C. §7704',
  },
  {
    k: 'YELLOW' as const,
    t: 'Competitor keyword bidding',
    s: 'Gray — trademark use in ad copy needs a human call',
    cite: 'Lanham Act · needs review',
  },
  {
    k: 'RED' as const,
    t: 'Ringless voicemail drops',
    s: 'Illegal without consent — the FCC ruled these are calls',
    cite: 'TCPA · $500–1,500 / msg',
  },
]

const PILL: Record<string, string> = { GREEN: 'qy-g', YELLOW: 'qy-y', RED: 'qy-r' }

const FEATURES = [
  ['A cited Tactic Register', '86 tactics across 10 channels, each with a plain-English verdict'],
  ['Deterministic classifier', 'no model call, no hallucinated law — the same input always gives the same verdict'],
  ['Unknown resolves to YELLOW', 'never green. It will not bless a tactic it cannot vouch for'],
  ['RED is filtered before ranking', 'an illegal tactic cannot win its way into your plan'],
  ['Plan generator', 'describe the business, get a full-funnel plan built only from lawful tactics'],
  ['Runs offline, stdlib only', 'quarry check plan.md · quarry plan profile.toml · 263 tests passing'],
]

const LIGHTS = [
  { c: 'var(--qy-green)', h: 'Do it', p: 'Lawful tactics — SEO, real scarcity, referral, cold email done CAN-SPAM-clean. Execute freely.' },
  { c: 'var(--qy-yellow)', h: 'Check it', p: 'Gray, ToS-risky or jurisdiction-dependent. Flagged for a human or a legal call before use.' },
  { c: 'var(--qy-red)', h: 'Don’t', p: 'Fake urgency, fabricated reviews, ringless voicemail — documented with why, and never executed.' },
]

const AUDIENCE = [
  { h: 'Growth teams & founders', p: 'Move fast without a legal own-goal. Ship campaigns you can defend.' },
  { h: 'Agencies', p: 'Give clients aggressive growth and a paper trail of why each tactic is safe.' },
  { h: 'AI builders', p: 'Wrap a compliance layer around your own growth agents — GREEN executes, RED is blocked.' },
]

const TIERS = [
  {
    lab: 'Open-source core',
    h: 'Quarry Core',
    price: '$0',
    per: '',
    feature: false,
    items: [
      'The engine and all 86 cited tactics',
      'Deterministic classifier and plan generator',
      'The append-only audit log',
      'Runs offline. No account, no telemetry',
    ],
  },
  {
    lab: 'Commercial licence',
    h: 'Agency',
    price: '$2,400',
    per: '/yr',
    feature: true,
    items: [
      'White-label the plan output as your own',
      'No share-alike on client deliverables',
      'Every recommendation lands with its citation',
      'Per firm, not per seat',
    ],
  },
  {
    lab: 'Commercial licence',
    h: 'Embed / OEM',
    price: 'from $12,000',
    per: '/yr',
    feature: false,
    items: [
      'Ship the classifier inside your product',
      'Released from AGPL obligations',
      'Redistribution rights',
      'Compliance becomes your feature, not your risk',
    ],
  },
  {
    lab: 'Managed',
    h: 'Quarry Cloud',
    price: '$149–$499',
    per: '/mo',
    feature: false,
    items: [
      'Hosted API — nothing to run',
      'Register updates as a live feed',
      'Retained audit log for your records',
      'No licence needed; I host it',
    ],
  },
]

const ADDONS = [
  {
    lab: 'Coverage pack',
    price: '$2,500',
    p: 'A jurisdiction or a vertical researched, cited and merged into the register within 30 days. Yours on merge; public 90 days later.',
  },
  {
    lab: 'Integration',
    price: '$9,500',
    p: 'Fixed scope. Quarry wired into your CRM or marketing stack, adapters and audit trail included, by the person who built it.',
  },
]

export const metadata: Metadata = {
  title: 'Quarry — the growth engine that knows what’s legal',
  description:
    'Every marketing tactic classified green, yellow or red with the citation that says why. '
    + '86 tactics, 10 channels, a deterministic classifier that never calls a model. Free to run; '
    + 'paid to ship inside something you sell.',
  alternates: { canonical: '/quarry' },
  openGraph: {
    type: 'website',
    url: '/quarry',
    title: 'The growth engine that knows what’s legal.',
    description:
      'A linter for growth tactics. Aggressive, deterministic, cited — and it will not bless a '
      + 'tactic it cannot vouch for.',
  },
}

export default function QuarryPage() {
  return (
    <div className={`quarry-skin ${bricolage.variable} ${hanken.variable} ${plexMono.variable}`}>
      {/* Hero */}
      <section className="pt-32 pb-12">
        <div className="container-custom max-w-4xl">
          <div className="qy-in">
            <p className="qy-eyebrow mb-4">Quarry · growth-compliance engine</p>
            <h1 className="mb-6 text-4xl md:text-5xl lg:text-6xl">
              The growth engine that knows what&rsquo;s legal.
            </h1>
            <p className="text-lg leading-relaxed">
              Quarry finds every <em>legal</em> way to grow — and flags the ones that will get you
              sued. Every tactic is classified{' '}
              <b style={{ color: 'var(--qy-green)' }}>green</b>,{' '}
              <b style={{ color: 'var(--qy-yellow)' }}>yellow</b> or{' '}
              <b style={{ color: 'var(--qy-red)' }}>red</b>, each with the citation that says why. It
              builds full-funnel plans that only ever reach for lawful tactics. Aggressive.
              Deterministic. Cited.
            </p>
            <div className="mt-8 flex flex-wrap gap-3.5">
              <a href={MAILTO} className="qy-btn">Get early access</a>
              <a href="#how" className="qy-btn-ghost">How it works</a>
            </div>
          </div>
        </div>
      </section>

      {/* The classifier, as the product's own gesture. */}
      <section className="pb-14">
        <div className="container-custom max-w-4xl">
          <div className="qy-panel overflow-hidden">
            <div
              className="qy-panel-2 flex items-center gap-2 border-b px-5 py-3"
              style={{ borderColor: 'var(--qy-line)' }}
            >
              {['var(--qy-green)', 'var(--qy-yellow)', 'var(--qy-red)'].map((c) => (
                <span key={c} className="h-2.5 w-2.5 rounded-full" style={{ background: c }} />
              ))}
              <span className="qy-mono ml-2 text-xs">
                <b className="qy-ink">quarry check</b> — every tactic, a verdict and a citation
              </span>
            </div>
            {VERDICTS.map((v, i) => (
              <div
                key={v.t}
                className="qy-verdict grid grid-cols-[auto_1fr] items-center gap-x-3.5 gap-y-1.5 border-b px-5 py-4 last:border-b-0 sm:grid-cols-[auto_1fr_auto]"
                style={{ borderColor: 'var(--qy-line)', ['--i' as string]: i }}
              >
                <span className={`qy-pill ${PILL[v.k]}`}>{v.k}</span>
                <span className="text-[15px] font-medium qy-ink">
                  {v.t}
                  <small className="block text-[13px] font-normal" style={{ color: 'var(--qy-muted)' }}>
                    {v.s}
                  </small>
                </span>
                <span className="qy-mono qy-faint col-span-2 text-[11.5px] sm:col-span-1 sm:text-right">
                  {v.cite}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What it is */}
      <section id="how" className="pb-14 scroll-mt-24">
        <div className="container-custom max-w-4xl">
          <div className="qy-in mb-7">
            <p className="qy-eyebrow mb-3">What it is</p>
            <h2 className="text-2xl md:text-3xl">A linter for growth tactics.</h2>
          </div>
          <p className="qy-in mb-8 text-lg leading-relaxed">
            Other tools hand you clever-sounding growth hacks and hope. Quarry knows the difference
            between real scarcity and a fake countdown timer, between cold email and an illegal
            robocall — and it can prove it, with the statute. The register is the product; the plan
            generator is its demo.
          </p>
          <ul className="grid gap-x-8 gap-y-3.5 sm:grid-cols-2 qy-stagger">
            {FEATURES.map(([h, p], i) => (
              <li key={h} className="relative pl-7 text-[15.5px]" style={{ ['--i' as string]: i }}>
                <span
                  className="absolute left-0 top-[7px] h-2.5 w-2.5 rounded-sm border-2"
                  style={{ borderColor: 'var(--qy-sig)' }}
                />
                <b className="qy-ink font-semibold">{h}</b> — {p}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Three lights */}
      <section className="pb-14">
        <div className="container-custom max-w-4xl">
          <div className="grid gap-4 md:grid-cols-3 qy-stagger">
            {LIGHTS.map((l, i) => (
              <div key={l.h} className="qy-panel p-6" style={{ ['--i' as string]: i }}>
                <span className="mb-3 block h-3.5 w-3.5 rounded-full" style={{ background: l.c }} />
                <h3 className="mb-2 text-lg">{l.h}</h3>
                <p className="text-[15px]">{l.p}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Terminal */}
      <section className="pb-14">
        <div className="container-custom max-w-4xl">
          <div className="qy-in mb-6">
            <p className="qy-eyebrow mb-3">See it run</p>
            <h2 className="text-2xl md:text-3xl">One command. Every tactic in your plan, checked.</h2>
          </div>
          <div className="qy-term qy-in p-6">
            <span className="ln">
              <span className="dim">$</span> <span style={{ color: 'var(--qy-sig)' }}>quarry</span>{' '}
              check launch-plan.md
            </span>
            <span className="ln"> </span>
            <span className="ln">
              <span style={{ color: 'var(--qy-green)' }}>✓ GREEN</span>   case study on verifiable
              numbers      <span className="dim">15 U.S.C. §45</span>
            </span>
            <span className="ln">
              <span style={{ color: 'var(--qy-green)' }}>✓ GREEN</span>   cold B2B email (opt-out
              present)      <span className="dim">15 U.S.C. §7704</span>
            </span>
            <span className="ln">
              <span style={{ color: 'var(--qy-yellow)' }}>! YELLOW</span>  competitor keyword
              bidding            <span className="dim">review: Lanham Act</span>
            </span>
            <span className="ln">
              <span style={{ color: 'var(--qy-red)' }}>✗ RED</span>     &quot;only 2 spots
              left&quot; (untrue)          <span className="dim">FTC dark patterns · §5</span>
            </span>
            <span className="ln"> </span>
            <span className="ln dim"># 1 blocker removed from the plan — replaced with a GREEN alternative</span>
          </div>
        </div>
      </section>

      {/* Who it is for */}
      <section className="pb-14">
        <div className="container-custom max-w-4xl">
          <div className="qy-in mb-7">
            <p className="qy-eyebrow mb-3">Who it&rsquo;s for</p>
            <h2 className="text-2xl md:text-3xl">Three kinds of user</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-3 qy-stagger">
            {AUDIENCE.map((a, i) => (
              <div key={a.h} className="qy-panel p-6" style={{ ['--i' as string]: i }}>
                <h3 className="mb-2 text-lg">{a.h}</h3>
                <p className="text-[15px]">{a.p}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* The model */}
      <section className="pb-14">
        <div className="container-custom max-w-4xl">
          <div className="qy-in mb-6">
            <p className="qy-eyebrow mb-3">The model</p>
            <h2 className="mb-4 text-2xl md:text-3xl">Free to run. Pay to ship it.</h2>
            <p className="text-lg leading-relaxed">
              Run Quarry on your own business for nothing, forever — that is the whole engine and
              every cited tactic, not a trial. You pay when you put it inside something you sell,
              host it for other people, or take the share-alike off work you hand a client.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 qy-stagger">
            {TIERS.map((t, i) => (
              <div
                key={t.h}
                className="qy-panel flex flex-col p-7"
                style={{
                  borderColor: t.feature ? 'var(--qy-sig)' : 'var(--qy-line)',
                  borderWidth: t.feature ? '1.5px' : '1px',
                  ['--i' as string]: i,
                }}
              >
                <p className="qy-mono qy-sig mb-2 text-[11px] uppercase tracking-[0.12em]">{t.lab}</p>
                <h3 className="mb-1 text-xl">{t.h}</h3>
                <p className="mb-4 text-2xl font-extrabold qy-ink" style={{ fontFamily: 'var(--font-bricolage)' }}>
                  {t.price}
                  {t.per && <span className="text-[15px] font-semibold" style={{ color: 'var(--qy-muted)' }}>{t.per}</span>}
                </p>
                <ul className="space-y-2.5">
                  {t.items.map((it) => (
                    <li key={it} className="relative pl-6 text-[14.5px] qy-ink">
                      <span className="absolute left-0 font-bold qy-sig">✓</span>
                      {it}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="mt-4 grid gap-4 sm:grid-cols-2 qy-stagger">
            {ADDONS.map((a, i) => (
              <div
                key={a.lab}
                className="qy-panel-2 rounded-2xl border p-6"
                style={{ borderColor: 'var(--qy-line)', ['--i' as string]: i }}
              >
                <p className="qy-mono qy-sig mb-1.5 text-[11px] uppercase tracking-[0.12em]">{a.lab}</p>
                <p className="mb-2 text-xl font-extrabold qy-ink" style={{ fontFamily: 'var(--font-bricolage)' }}>
                  {a.price}
                </p>
                <p className="text-[14.5px]">{a.p}</p>
              </div>
            ))}
          </div>

          <p className="qy-faint mt-5 text-xs">
            What you are buying is speed, not exclusivity. Paid coverage reaches the public register
            on the same open licence 90 days later — a compliance tool that hides its rules is not
            one worth trusting.
          </p>
        </div>
      </section>

      {/* Where it stands. The honest block. */}
      <section className="pb-14">
        <div className="container-custom max-w-4xl">
          <div
            className="qy-in rounded-2xl border p-7 sm:p-9"
            style={{ background: 'var(--qy-sig-ghost)', borderColor: 'var(--qy-line)' }}
          >
            <p className="qy-eyebrow mb-3">Where it actually stands</p>
            <h2 className="mb-4 text-2xl">Early access, and here is why.</h2>
            <div className="space-y-4 text-[15.5px] leading-relaxed qy-ink">
              <p>
                The engine works: 86 tactics across 10 channels, a deterministic classifier with no
                model call anywhere in the verdict path, and 263 tests passing. You can run it today.
              </p>
              <p>
                It is not public yet, and the reason is the same discipline the product sells.{' '}
                <b className="font-semibold">
                  An attorney has not yet signed off on the GREEN/RED boundary cases or the licence
                  structure.
                </b>{' '}
                The brief is written and with counsel. Until it comes back, the register stays
                private and this is early access rather than a launch.
              </p>
              <p>
                Shipping a compliance tool on an unreviewed compliance position would be the exact
                mistake it exists to prevent. Verdicts are cited and directional; they are not legal
                advice, and they are not a substitute for your own counsel on anything that matters.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why me */}
      <section className="pb-14">
        <div className="container-custom max-w-4xl">
          <div className="qy-in border-l-[3px] pl-6" style={{ borderColor: 'var(--qy-sig)' }}>
            <p className="qy-eyebrow mb-3">Why me</p>
            <p className="text-[17px] leading-relaxed qy-ink">
              I built Quarry because &ldquo;compliance is the moat&rdquo; is not a slogan I say — it
              is how I run everything. The verdicts cite real statutes, the classifier is
              deterministic so it cannot hallucinate the law, and unknown resolves to yellow rather
              than to a guess. I am a forward-deployed engineer: I will wire it into your stack and
              stand behind every GREEN.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="pb-24">
        <div className="container-custom max-w-4xl">
          <div
            className="qy-panel-2 qy-in rounded-2xl border p-10 text-center sm:p-14"
            style={{ borderColor: 'var(--qy-line)' }}
          >
            <p className="qy-eyebrow mb-3">Early access</p>
            <h2 className="mb-3 text-3xl">Grow aggressively. Stay on the green.</h2>
            <p className="mx-auto mb-7 max-w-lg">
              Tell me how you grow and where you are unsure of the line, and I will get you in.
            </p>
            <a href={MAILTO} className="qy-btn">Request early access</a>
            <p className="qy-faint mx-auto mt-6 max-w-xl text-xs">
              Verdicts are cited and directional, not legal advice. More on how I work —{' '}
              <Link href="/engineering" className="qy-sig hover:underline">
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
