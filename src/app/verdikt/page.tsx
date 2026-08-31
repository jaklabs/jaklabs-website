import type { Metadata } from 'next'
import Link from 'next/link'
import { Space_Grotesk, JetBrains_Mono } from 'next/font/google'

/**
 * Verdikt on the parent site.
 *
 * The product lives at verdikt.jaklabs.io with its own Cognito pool, its own
 * backend and its own identity. This page is the door from jaklabs.io: it
 * explains the product and hands the reader over. Signup and the app itself stay
 * there — same rule as /hood-dev, and for the same reason.
 *
 * WHY IT WEARS THE PRODUCT'S SKIN RATHER THAN THE SITE'S
 *
 * Everything visual here — the charcoal ground with its indigo and cyan radials,
 * the cyan accent, Space Grotesk headings, the hairline-gradient frame — is
 * copied from trademaster-gamified/apps/web/src/index.css, the app's real theme.
 * A visitor who clicks through should feel like they opened a door, not like they
 * arrived at a different company. The tokens live in globals.css under
 * `.verdikt-skin`, scoped, with the reasoning for the scoping written there.
 *
 * The site's nav and footer stay as they are. The seam between them and this
 * ground is intentional: it says "a JAK Labs product" rather than "another JAK
 * Labs service page".
 *
 * EVERY CLAIM CHECKED against ~/claude-server/trademaster-gamified before shipping:
 *   12 broker connectors ....... apps/api/src/brokers/connectors/ (12 files + index)
 *   30 / 10,000 / 95% .......... packages/edge-engine/src/constants.ts
 *   3 verdict kinds ............ packages/edge-engine/src/types.ts
 *   pure-function coach ........ packages/coach/src/session.ts imports one TYPE, nothing else
 *   68 sections / 48 questions . apps/web/src/lib/{lessons,quiz}.ts
 *   AES-256-GCM ................ apps/api/src/brokers/crypto
 *   live at verdikt.jaklabs.io . HTTP 200, serving the real SPA
 *
 * ⚠️ TWO THINGS THIS PAGE MUST KEEP DOING, both regulatory rather than aesthetic:
 *
 * 1. The "Not financial advice" block stays. This is marketing for a product that
 *    touches brokerage accounts, and the disclaimer is not decoration on that.
 *
 * 2. Nothing here may imply the journal makes anyone profitable, or that trading
 *    more is progress. Those are the product's own two standing rules, and a
 *    marketing page is exactly where they get broken first — a growth-flavoured
 *    edit to this file can undo a boundary the codebase defends in three layers.
 *
 * DELIBERATELY NOT CLAIMED: no user count, no returns, no testimonials, no
 * outcomes. The desktop surface is named as unreleased rather than implied.
 */

// The product's own typefaces, self-hosted at build and loaded only on this
// route. Adding them to the site-wide <link> in layout.tsx would cost every
// other page two font families it never renders.
const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['500', '600', '700'],
  variable: '--font-space-grotesk',
  display: 'swap',
})
const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
})

const APP = 'https://verdikt.jaklabs.io'

export const metadata: Metadata = {
  title: 'Verdikt — the trading journal built like Duolingo',
  description:
    'Streaks, XP and leagues wrapped around trade logging, with an edge engine that refuses to '
    + 'render a verdict until your sample earns it. Read-only broker access. A JAK Labs product.',
  alternates: { canonical: '/verdikt' },
  openGraph: {
    type: 'website',
    url: '/verdikt',
    title: 'Every trading book tells you to keep a journal. Almost nobody does.',
    description:
      'So this one is built like Duolingo instead of like a spreadsheet — and it will not call '
      + 'anything an edge until the numbers say so.',
  },
}

// The 14-day strip. 0.5 is a partial day — the habit is not all-or-nothing, and a
// wall of solid blocks would quietly imply perfection is the bar.
const DAYS = [1, 1, 0.5, 1, 1, 1, 1, 0.5, 1, 1, 1, 1, 1, 1]

const FEATURES = [
  {
    tag: 'Journal',
    title: 'The log',
    body:
      'Entries, exits, size, setup, and the reasoning — captured at the moment, not reconstructed '
      + 'after the fact.',
  },
  {
    tag: 'Psychology',
    title: 'What you felt',
    body:
      'The half of trading nobody records. Tilt, hesitation, revenge entries — logged next to the '
      + 'trade they produced.',
  },
  {
    tag: 'Dashboard',
    title: 'Your own numbers',
    body: 'Honest P&L math over what actually happened. No projections, no simulations.',
  },
  {
    tag: 'Calculator',
    title: 'Position sizing',
    body: 'Work out risk before the entry rather than justifying it afterwards.',
  },
  {
    tag: 'Learn & Quiz',
    title: 'Structured lessons',
    body:
      '68 lesson sections and a 48-question graded bank, so the streak has something to feed on '
      + 'when you haven’t traded.',
  },
  {
    tag: 'Achievements',
    title: 'Leagues & challenges',
    body: 'XP, coins, daily challenges and league placement — the loop that gets you back tomorrow.',
  },
]

const BROKERS = [
  'Coinbase', 'Kraken', 'Binance', 'Bybit', 'OKX', 'KuCoin',
  'Bitget', 'MEXC', 'Phemex', 'dYdX', 'Robinhood', 'Fidelity',
]

// Colour carries the meaning here, using the product's own semantic tokens:
// slate for "no judgement offered", cyan for "still open", green for "earned".
// That is the same ladder the app paints, so a reader arrives already fluent.
const VERDICTS = [
  {
    kind: 'Insufficient',
    tone: 'var(--vk-slate)',
    body:
      'Under 30 closed trades in that cohort, no judgement is offered at all. A 62% win rate over '
      + '11 trades is noise, and the product says so instead of congratulating you.',
  },
  {
    kind: 'Undetermined',
    tone: 'var(--vk-accent)',
    body:
      'Past the sample gate, but the data still cannot separate a real edge from zero. This is not '
      + '“you have no edge” — it is “keep going,” with an estimate of how many more trades would '
      + 'settle it.',
  },
  {
    kind: 'Proven',
    tone: 'var(--vk-success)',
    body:
      'The 95% confidence interval clears zero, over 10,000 bootstrap resamples, at an expectancy '
      + 'worth the screen time. Only then does the app agree you have something.',
  },
]

const OBSERVES = [
  {
    title: 'Adherence, not opportunity',
    body:
      'Trades taken against your plan’s cap. Setups outside your written plan. A session your plan '
      + 'doesn’t name. Setups the engine already ruled out.',
  },
  {
    title: 'The tilt tells',
    body:
      'Consecutive losses, surfaced against your own stop-trading rule. Risk going up after a loss. '
      + 'A day spent entirely outside your proven cohorts.',
  },
]

const LAYERS = [
  {
    name: 'Input — the real control.',
    body:
      'The bundle handed to the coach holds your verdicts, your written plan, your logged emotions '
      + 'and your session times. No price, no quote, no news, no market state. It cannot form a view '
      + 'on an instrument because it is never shown one.',
  },
  {
    name: 'Prompt.',
    body:
      'States the boundary, and more usefully what to do instead: compare against your plan, quote '
      + 'your own figures, say plainly when the data supports nothing yet.',
  },
  {
    name: 'Output — a backstop that fails closed.',
    body:
      'If directional phrasing is ever detected, the entire review is withheld rather than edited. '
      + 'A redacted recommendation is still a recommendation.',
  },
]

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="vk-eyebrow mb-4 flex items-center gap-3">
      <span>{children}</span>
      <span className="h-px flex-1" style={{ background: 'var(--vk-border)' }} />
    </p>
  )
}

export default function VerdiktPage() {
  return (
    <div className={`verdikt-skin ${spaceGrotesk.variable} ${jetbrainsMono.variable}`}>
      <section className="pt-32 pb-16">
        <div className="container-custom">
          <div className="max-w-3xl">
            <Eyebrow>Verdikt · a JAK Labs product</Eyebrow>
            <h1 className="heading-xl mb-6 vk-fg">
              Every trading book tells you to keep a journal.{' '}
              <span className="vk-grad">Almost nobody does.</span>
            </h1>
            <p className="mb-8 text-lg">
              So this one is built like Duolingo instead of like a spreadsheet. Streaks, XP, leagues
              and daily challenges wrapped around trade logging — the habit traders never keep,
              turned into one they actually do.
            </p>
            <div className="vk-mono flex flex-wrap items-center gap-2.5 text-xs">
              <span
                className="vk-pill"
                style={{ color: 'var(--vk-success)', borderColor: 'color-mix(in oklab, var(--vk-success) 40%, transparent)' }}
              >
                <span className="h-1.5 w-1.5 rounded-full bg-current" />
                Live at verdikt.jaklabs.io
              </span>
              <span className="vk-pill">Read-only broker access</span>
              <span className="vk-pill">Free to start</span>
            </div>

            {/* The streak strip — the product's whole thesis rendered as an
                object, so it gets the one gradient frame on the page. */}
            <div className="vk-frame mt-10 p-6">
              <div className="mb-5 flex flex-wrap items-baseline justify-between gap-4">
                <div>
                  <div
                    className="text-4xl font-bold leading-none"
                    style={{ color: 'var(--vk-accent)', fontFamily: 'var(--font-space-grotesk)' }}
                  >
                    14
                  </div>
                  <div className="vk-mono vk-dim mt-1.5 text-[11px] uppercase tracking-[0.14em]">
                    day logging streak
                  </div>
                </div>
                <div className="text-right">
                  <div className="vk-mono vk-dim text-[11px] uppercase tracking-[0.14em]">league</div>
                  <div
                    className="vk-fg text-lg font-semibold"
                    style={{ fontFamily: 'var(--font-space-grotesk)' }}
                  >
                    Diamond
                  </div>
                </div>
              </div>
              {/* 14 columns is outside Tailwind's default scale (it stops at 12),
                  so this is set explicitly rather than via a class that would
                  silently not exist and collapse the strip to one column. */}
              <div
                className="grid gap-[5px]"
                style={{ gridTemplateColumns: 'repeat(14, minmax(0, 1fr))' }}
              >
                {DAYS.map((d, i) => (
                  <span
                    key={i}
                    className="aspect-square rounded-[3px]"
                    style={{
                      background:
                        d === 1
                          ? 'var(--vk-accent)'
                          : 'color-mix(in oklab, var(--vk-accent) 45%, var(--vk-lift))',
                    }}
                  />
                ))}
              </div>
              <p className="vk-mono vk-dim mt-4 text-xs">
                the point isn’t the streak. it’s that you have fourteen days of your own decisions
                written down.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="pb-16">
        <div className="container-custom">
          <div className="max-w-3xl">
            <Eyebrow>Why gamify it</Eyebrow>
            <h2 className="heading-lg vk-fg mb-6">
              Discipline is a habit problem,{' '}
              <span className="vk-dim">not an information problem.</span>
            </h2>
            <div className="space-y-4">
              <p>
                Every trader already knows they should log entries, exits, position size, and what
                they were feeling when they clicked. The knowledge was never the gap. The gap is that
                a journal is homework, and homework loses to a live chart every single time.
              </p>
              <p>
                Streaks, XP and leagues are not decoration here — they are the mechanism. They make
                the boring, correct thing the thing you come back for. What you end up with is the
                actual asset:{' '}
                <span className="vk-fg font-medium">
                  a written record of your own decisions, with the reasoning attached, from before
                  you knew how it turned out.
                </span>
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="pb-16">
        <div className="container-custom">
          <div className="max-w-3xl">
            <Eyebrow>What&rsquo;s in it</Eyebrow>
          </div>
          <div className="vk-grid sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((f) => (
              <div key={f.title} className="vk-cell">
                <span
                  className="vk-mono mb-2 block text-[11px] uppercase tracking-[0.13em]"
                  style={{ color: 'var(--vk-accent)' }}
                >
                  {f.tag}
                </span>
                <h3 className="vk-fg mb-1.5 text-base font-semibold">{f.title}</h3>
                <p className="text-sm">{f.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="pb-16">
        <div className="container-custom">
          <div className="max-w-3xl">
            <Eyebrow>Auto-import</Eyebrow>
            <h2 className="heading-lg vk-fg mb-6">
              It reads your fills so you don&rsquo;t retype them.
            </h2>
            <p className="mb-8">
              Connect an account and filled trades import themselves. Retyping is where journaling
              actually dies. Twelve connectors today:
            </p>
            <div className="vk-mono flex flex-wrap gap-2 text-xs">
              {BROKERS.map((b) => (
                <span
                  key={b}
                  className="rounded-md px-3 py-1.5"
                  style={{ background: 'var(--vk-card)', border: '1px solid var(--vk-border)' }}
                >
                  {b}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="pb-16">
        <div className="container-custom">
          <div className="max-w-3xl">
            <Eyebrow>While you trade</Eyebrow>
            <h2 className="heading-lg vk-fg mb-6">
              A coach that watches you, and is{' '}
              <span className="vk-grad">structurally unable to watch the market.</span>
            </h2>
            <p className="mb-8">
              Mid-session you need a signal, not a paragraph. So the live coach is a{' '}
              <span className="vk-fg font-medium">
                pure function — no model, no network, no prompt.
              </span>{' '}
              It compares what you are doing to the plan you wrote, and it can run on every single
              fill.
            </p>
          </div>
          <div className="vk-grid sm:grid-cols-2">
            {OBSERVES.map((o) => (
              <div key={o.title} className="vk-cell">
                <span
                  className="vk-mono mb-2 block text-[11px] uppercase tracking-[0.13em]"
                  style={{ color: 'var(--vk-accent)' }}
                >
                  it observes
                </span>
                <h3 className="vk-fg mb-1.5 text-base font-semibold">{o.title}</h3>
                <p className="text-sm">{o.body}</p>
              </div>
            ))}
          </div>
          <div className="mt-8 max-w-3xl space-y-5">
            <p className="vk-note text-sm">
              Every one of those is about <span className="vk-fg">restraint or adherence</span>. None
              of them can be &ldquo;take this trade.&rdquo; That isn&rsquo;t a policy — a function
              that compares numbers to a plan is <span className="vk-fg">structurally incapable</span>{' '}
              of suggesting a position. Zero latency, zero cost, and nothing that could drift
              off-script.
            </p>
            <p>
              The language model gets the <span className="vk-fg font-medium">weekly review</span>{' '}
              instead, where synthesising a week of your behaviour is genuinely the value and a few
              seconds of latency costs nothing.
            </p>
          </div>
        </div>
      </section>

      <section className="pb-16">
        <div className="container-custom">
          <div className="max-w-3xl">
            <Eyebrow>Finding your edge</Eyebrow>
            <h2 className="heading-lg vk-fg mb-6">
              Every journal will show you a win rate.{' '}
              <span className="vk-dim">This one refuses to, until the sample earns it.</span>
            </h2>
            <p className="mb-8">
              Your fills get split into the cohorts you <em>actually</em> trade — by setup, by
              session, by instrument — and each cohort gets a verdict rather than a flattering
              statistic.
            </p>
          </div>
          <div className="vk-grid md:grid-cols-3">
            {VERDICTS.map((v) => (
              <div key={v.kind} className="vk-cell" style={{ borderTop: `2px solid ${v.tone}` }}>
                <span className="vk-mono vk-dim mb-2 block text-[11px] uppercase tracking-[0.13em]">
                  verdict
                </span>
                <h3 className="mb-1.5 text-base font-semibold" style={{ color: v.tone }}>
                  {v.kind}
                </h3>
                <p className="text-sm">{v.body}</p>
              </div>
            ))}
          </div>
          <div className="mt-8 max-w-3xl space-y-5">
            <p className="vk-note text-sm">
              This is where the name comes from. Not a dashboard, not a score, not a streak — a{' '}
              <span className="vk-fg">verdict</span>, delivered only when your own trades have earned
              one.
            </p>
            <p>
              Two rules sit above all of it, and they are the reason to trust the third verdict when
              it finally arrives:{' '}
              <span className="vk-fg font-medium">
                an undetermined cohort is never treated as an edge
              </span>
              , and{' '}
              <span className="vk-fg font-medium">
                nothing in the product ever implies that trading more is progress.
              </span>
            </p>
            <p className="vk-note text-sm">
              This is the arc the journal is actually for. <span className="vk-fg">Log honestly</span>{' '}
              → the session coach holds you to your own plan while it is happening → the weekly review
              shows you the pattern you cannot see from inside it → and after enough real trades, the
              engine tells you which of your setups is genuinely yours. Months, not days. That is the
              honest timescale for the question, and anything that answers it faster is guessing.
            </p>
          </div>
        </div>
      </section>

      <section className="pb-16">
        <div className="container-custom">
          <div className="max-w-3xl">
            <Eyebrow>About your keys</Eyebrow>
            <div
              className="rounded-[0.875rem] p-6 sm:p-7"
              style={{
                border: '1px solid color-mix(in oklab, var(--vk-success) 32%, transparent)',
                background: 'color-mix(in oklab, var(--vk-success) 7%, var(--vk-card))',
              }}
            >
              <h2 className="vk-fg mb-4 text-xl font-semibold">
                It cannot place a trade. That is a property of the design.
              </h2>
              <ul className="space-y-3 pl-5 text-sm [&>li]:list-disc">
                <li>
                  <span className="vk-fg font-semibold">Connections are read-only.</span> The
                  connectors request read access and nothing else. Even a total compromise of this app
                  does not move your money, because there is no code path that places an order.
                </li>
                <li>
                  <span className="vk-fg font-semibold">
                    Keys are encrypted at rest with AES-256-GCM
                  </span>{' '}
                  — not stored as plain text, not logged.
                </li>
                <li>
                  <span className="vk-fg font-semibold">It is your record.</span> The app exists to
                  read what you already did and show it back to you accurately.
                </li>
              </ul>
            </div>
            <p className="vk-note mt-6 text-sm">
              You are handing a third-party app credentials to a brokerage account, and you should be
              suspicious of that by default — including here.{' '}
              <span className="vk-fg">
                Use read-only API keys, scoped to read-only at the broker, every time
              </span>
              , with any product. That advice costs this app nothing and it is the correct habit
              regardless of who is asking.
            </p>
          </div>
        </div>
      </section>

      <section className="pb-16">
        <div className="container-custom">
          <div className="max-w-3xl">
            <Eyebrow>The advice boundary</Eyebrow>
            <h2 className="heading-lg vk-fg mb-6">
              The coach comments on the trader, never on the market.
            </h2>
            <p className="mb-8">
              That line is what separates software you operate from personalised investment advice,
              which is regulated. A line stated only in a document is not a control, so it is defended
              in three places — deepest first:
            </p>
            <ol className="space-y-5">
              {LAYERS.map((l, i) => (
                <li key={l.name} className="grid grid-cols-[2rem_1fr] gap-3">
                  <span className="vk-mono pt-0.5 text-sm" style={{ color: 'var(--vk-accent)' }}>
                    {i + 1}.
                  </span>
                  <p>
                    <span className="vk-fg font-semibold">{l.name}</span> {l.body}
                  </p>
                </li>
              ))}
            </ol>
            <p className="vk-note mt-8 text-sm">
              The filter is deliberately the <span className="vk-fg">weakest</span> layer, and is
              documented as such. A regex cannot prove text is advice-free — it exists to catch a
              model that drifts, not to make an unsafe design safe. That is why the input layer is
              first.
            </p>
            <p className="mt-6">
              <span className="vk-fg font-medium">
                And the reward loop is kept away from the order button.
              </span>{' '}
              Execution lives on the desktop surface — charts, order entry, your journal and edge
              verdicts beside them — carrying <em>no</em> XP, streaks, coins or badges. The gamified
              client has no order entry on any screen size. A reward loop that terminates in a buy
              button is a pattern regulators have fined brokerages over, and separating the two
              clients makes that structurally hard rather than something a reviewer has to remember.
            </p>
            <p
              className="mt-8 pl-5 text-sm"
              style={{ borderLeft: '3px solid var(--vk-accent)' }}
            >
              <span className="vk-fg font-semibold">Status, plainly:</span> the journal, the
              gamification and the broker import are live today. The professional desktop surface is
              designed and decided but <span className="vk-fg font-semibold">not yet released</span> —
              so if you are here for order entry across monitors, you are early.
            </p>
          </div>
        </div>
      </section>

      <section className="pb-16">
        <div className="container-custom">
          <div className="max-w-3xl">
            <Eyebrow>What this is not</Eyebrow>
            <h2 className="heading-lg vk-fg mb-6">
              It is a journal. It does not tell you what to buy.
            </h2>
            <p className="mb-8">
              There are no signals here, no alerts, no copy-trading, no strategy anyone is selling
              you, and no claim — stated or implied — that keeping a journal will make you profitable.
              It records what you did and shows it back to you honestly, including the parts you would
              rather not look at. What you do with that is entirely yours.
            </p>
            <div className="vk-panel p-5 text-sm">
              <span className="vk-fg font-semibold">Not financial advice.</span> Verdikt is a
              record-keeping and educational tool. Nothing in it is a recommendation to buy, sell, or
              hold any asset, and nothing in it is a solicitation. Trading carries a substantial risk
              of loss. Past results do not indicate future results. You are responsible for your own
              decisions — consult a licensed professional before risking capital.
            </div>
          </div>
        </div>
      </section>

      <section className="pb-24">
        <div className="container-custom">
          <div className="max-w-2xl">
            <Eyebrow>Start the streak</Eyebrow>
            <h2 className="heading-lg vk-fg mb-6">Fourteen days from now, you have a record.</h2>
            <p className="mb-8">
              Free to start, read-only broker access, and an engine that will tell you plainly when
              your own numbers do not say anything yet.
            </p>
            <div className="flex flex-wrap gap-4">
              <a href={APP} className="vk-btn" target="_blank" rel="noopener noreferrer">
                Open Verdikt
              </a>
              <Link href="/engineering" className="vk-btn-ghost">
                How I build things like this
              </Link>
            </div>
            <p className="vk-mono vk-dim mt-6 text-xs">
              Verdikt lives at verdikt.jaklabs.io. Signup and the app all happen there.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
