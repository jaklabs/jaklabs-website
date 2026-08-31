import type { Metadata } from 'next'
import Link from 'next/link'

/**
 * Verdikt on the parent site.
 *
 * The product lives at verdikt.jaklabs.io with its own Cognito pool, its own
 * backend and its own charcoal-and-cyan identity. This page is the door from
 * jaklabs.io: it explains the product and hands the reader over. Signup and the
 * app itself stay there — same rule as /hood-dev, and for the same reason.
 *
 * WHY IT WEARS THE SITE'S CHROME BUT THE PRODUCT'S ACCENT
 *
 * The design artifact this is built from uses Verdikt's own oklch palette. Ported
 * wholesale that would read as an iframe of a different company sitting inside the
 * JAK Labs nav. So the page keeps the site's shell and typography and takes only
 * the accent — cyan instead of the site's purple — which is enough to say "this is
 * a distinct product" without saying "you have left the site".
 *
 * EVERY CLAIM CHECKED against ~/claude-server/trademaster-gamified before shipping:
 *   12 broker connectors ....... apps/api/src/brokers/connectors/ (12 files + index)
 *   30 / 10,000 / 95% / 0.15R .. packages/edge-engine/src/constants.ts
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
 *    more is progress. Those are the product's own two standing rules and a
 *    marketing page is exactly where they get broken first — a growth-flavoured
 *    edit to this file can undo a boundary the codebase defends in three layers.
 *
 * DELIBERATELY NOT CLAIMED: no user count, no returns, no testimonials, no
 * outcomes. The desktop surface is named as unreleased rather than implied.
 */

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

// The 14-day strip. `mid` is a partial day — the habit is not all-or-nothing, and
// a wall of solid blocks would quietly imply perfection is the bar.
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
    body:
      'XP, coins, daily challenges and league placement — the loop that gets you back tomorrow.',
  },
]

const BROKERS = [
  'Coinbase', 'Kraken', 'Binance', 'Bybit', 'OKX', 'KuCoin',
  'Bitget', 'MEXC', 'Phemex', 'dYdX', 'Robinhood', 'Fidelity',
]

const VERDICTS = [
  {
    kind: 'Insufficient',
    body:
      'Under 30 closed trades in that cohort, no judgement is offered at all. A 62% win rate over '
      + '11 trades is noise, and the product says so instead of congratulating you.',
  },
  {
    kind: 'Undetermined',
    body:
      'Past the sample gate, but the data still cannot separate a real edge from zero. This is not '
      + '“you have no edge” — it is “keep going,” with an estimate of how many more trades would '
      + 'settle it.',
  },
  {
    kind: 'Proven',
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

export default function VerdiktPage() {
  return (
    <>
      <section className="pt-32 pb-16">
        <div className="container-custom">
          <div className="max-w-3xl">
            <p className="mb-4 font-mono text-xs uppercase tracking-[0.2em] text-accent-cyan">
              Verdikt · a JAK Labs product
            </p>
            <h1 className="heading-xl mb-6">
              Every trading book tells you to keep a journal.{' '}
              <span className="bg-gradient-to-r from-accent-cyan to-primary-light bg-clip-text text-transparent">
                Almost nobody does.
              </span>
            </h1>
            <p className="mb-8 text-lg text-white/70">
              So this one is built like Duolingo instead of like a spreadsheet. Streaks, XP, leagues
              and daily challenges wrapped around trade logging — the habit traders never keep,
              turned into one they actually do.
            </p>
            <div className="flex flex-wrap items-center gap-3 font-mono text-xs text-white/50">
              <span className="inline-flex items-center gap-2 rounded-full border border-accent-cyan/30 bg-secondary-dark px-3 py-1 text-accent-cyan">
                <span className="h-1.5 w-1.5 rounded-full bg-current" />
                Live at verdikt.jaklabs.io
              </span>
              <span className="rounded-full border border-white/10 bg-secondary-dark px-3 py-1">
                Read-only broker access
              </span>
              <span className="rounded-full border border-white/10 bg-secondary-dark px-3 py-1">
                Free to start
              </span>
            </div>

            {/* The streak strip — the thesis rendered as an object. */}
            <div className="mt-10 rounded-2xl border border-white/10 bg-secondary-dark p-6">
              <div className="mb-5 flex flex-wrap items-baseline justify-between gap-4">
                <div>
                  <div className="font-heading text-3xl font-bold leading-none text-accent-cyan">14</div>
                  <div className="mt-1 font-mono text-[11px] uppercase tracking-[0.14em] text-white/40">
                    day logging streak
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-mono text-[11px] uppercase tracking-[0.14em] text-white/40">
                    league
                  </div>
                  <div className="font-heading text-lg font-semibold text-white">Diamond</div>
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
                      backgroundColor:
                        d === 1 ? '#22d3ee' : d === 0.5 ? 'rgba(34,211,238,0.45)' : '#2a2a38',
                    }}
                  />
                ))}
              </div>
              <p className="mt-4 font-mono text-xs text-white/40">
                the point isn’t the streak. it’s that you have fourteen days of your own decisions
                written down.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-secondary/30">
        <div className="container-custom">
          <div className="max-w-3xl">
            <p className="subheading mb-4">Why gamify it</p>
            <h2 className="heading-lg mb-6">
              Discipline is a habit problem,{' '}
              <span className="text-white/40">not an information problem.</span>
            </h2>
            <div className="space-y-4 text-white/70">
              <p>
                Every trader already knows they should log entries, exits, position size, and what
                they were feeling when they clicked. The knowledge was never the gap. The gap is that
                a journal is homework, and homework loses to a live chart every single time.
              </p>
              <p>
                Streaks, XP and leagues are not decoration here — they are the mechanism. They make
                the boring, correct thing the thing you come back for. What you end up with is the
                actual asset:{' '}
                <span className="text-white">
                  a written record of your own decisions, with the reasoning attached, from before
                  you knew how it turned out.
                </span>
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-custom">
          <div className="max-w-3xl mb-10">
            <p className="subheading mb-4">What&rsquo;s in it</p>
            <h2 className="heading-lg">Six surfaces, one loop</h2>
          </div>
          <div className="grid gap-px overflow-hidden rounded-xl border border-white/10 bg-white/10 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((f) => (
              <div key={f.title} className="bg-secondary-dark p-6">
                <span className="mb-2 block font-mono text-[11px] uppercase tracking-[0.13em] text-accent-cyan">
                  {f.tag}
                </span>
                <h3 className="mb-2 font-semibold text-white">{f.title}</h3>
                <p className="text-sm text-white/60">{f.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-secondary/30">
        <div className="container-custom">
          <div className="max-w-3xl">
            <p className="subheading mb-4">Auto-import</p>
            <h2 className="heading-lg mb-6">It reads your fills so you don&rsquo;t retype them.</h2>
            <p className="mb-8 text-white/70">
              Connect an account and filled trades import themselves. Retyping is where journaling
              actually dies. Twelve connectors today:
            </p>
            <div className="flex flex-wrap gap-2 font-mono text-xs">
              {BROKERS.map((b) => (
                <span
                  key={b}
                  className="rounded-md border border-white/10 bg-secondary-dark px-3 py-1.5 text-white/70"
                >
                  {b}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-custom">
          <div className="max-w-3xl mb-10">
            <p className="subheading mb-4">While you trade</p>
            <h2 className="heading-lg mb-6">
              A coach that watches you, and is{' '}
              <span className="text-gradient-neon">structurally unable to watch the market.</span>
            </h2>
            <p className="text-white/70">
              Mid-session you need a signal, not a paragraph. So the live coach is a{' '}
              <span className="text-white">pure function — no model, no network, no prompt.</span> It
              compares what you are doing to the plan you wrote, and it can run on every single fill.
            </p>
          </div>
          <div className="grid gap-px overflow-hidden rounded-xl border border-white/10 bg-white/10 sm:grid-cols-2">
            {OBSERVES.map((o) => (
              <div key={o.title} className="bg-secondary-dark p-6">
                <span className="mb-2 block font-mono text-[11px] uppercase tracking-[0.13em] text-accent-cyan">
                  it observes
                </span>
                <h3 className="mb-2 font-semibold text-white">{o.title}</h3>
                <p className="text-sm text-white/60">{o.body}</p>
              </div>
            ))}
          </div>
          <div className="mt-8 max-w-3xl space-y-4">
            <p className="border-l-2 border-white/15 pl-5 text-sm text-white/50">
              Every one of those is about <span className="text-white/80">restraint or adherence</span>.
              None of them can be &ldquo;take this trade.&rdquo; That isn&rsquo;t a policy — a function
              that compares numbers to a plan is{' '}
              <span className="text-white/80">structurally incapable</span> of suggesting a position.
              Zero latency, zero cost, and nothing that could drift off-script.
            </p>
            <p className="text-white/70">
              The language model gets the <span className="text-white">weekly review</span> instead,
              where synthesising a week of your behaviour is genuinely the value and a few seconds of
              latency costs nothing.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 bg-secondary/30">
        <div className="container-custom">
          <div className="max-w-3xl mb-10">
            <p className="subheading mb-4">Finding your edge</p>
            <h2 className="heading-lg mb-6">
              Every journal will show you a win rate.{' '}
              <span className="text-white/40">This one refuses to, until the sample earns it.</span>
            </h2>
            <p className="text-white/70">
              Your fills get split into the cohorts you <em>actually</em> trade — by setup, by
              session, by instrument — and each cohort gets a verdict rather than a flattering
              statistic.
            </p>
          </div>
          <div className="grid gap-px overflow-hidden rounded-xl border border-white/10 bg-white/10 md:grid-cols-3">
            {VERDICTS.map((v) => (
              <div key={v.kind} className="bg-secondary-dark p-6">
                <span className="mb-2 block font-mono text-[11px] uppercase tracking-[0.13em] text-accent-cyan">
                  verdict
                </span>
                <h3 className="mb-2 font-semibold text-white">{v.kind}</h3>
                <p className="text-sm text-white/60">{v.body}</p>
              </div>
            ))}
          </div>
          <div className="mt-8 max-w-3xl space-y-4">
            <p className="border-l-2 border-white/15 pl-5 text-sm text-white/50">
              This is where the name comes from. Not a dashboard, not a score, not a streak — a{' '}
              <span className="text-white/80">verdict</span>, delivered only when your own trades have
              earned one.
            </p>
            <p className="text-white/70">
              Two rules sit above all of it, and they are the reason to trust the third verdict when
              it finally arrives:{' '}
              <span className="text-white">an undetermined cohort is never treated as an edge</span>,
              and{' '}
              <span className="text-white">
                nothing in the product ever implies that trading more is progress.
              </span>
            </p>
            <p className="border-l-2 border-white/15 pl-5 text-sm text-white/50">
              This is the arc the journal is actually for. <span className="text-white/80">Log
              honestly</span> → the session coach holds you to your own plan while it is happening →
              the weekly review shows you the pattern you cannot see from inside it → and after
              enough real trades, the engine tells you which of your setups is genuinely yours.
              Months, not days. That is the honest timescale for the question, and anything that
              answers it faster is guessing.
            </p>
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-custom">
          <div className="max-w-3xl">
            <p className="subheading mb-4">About your keys</p>
            <div className="rounded-xl border border-accent-cyan/25 bg-accent-cyan/[0.05] p-6 sm:p-7">
              <h2 className="mb-4 text-xl font-semibold text-white">
                It cannot place a trade. That is a property of the design.
              </h2>
              <ul className="space-y-3 pl-5 text-sm text-white/70 [&>li]:list-disc">
                <li>
                  <span className="font-semibold text-white">Connections are read-only.</span> The
                  connectors request read access and nothing else. Even a total compromise of this app
                  does not move your money, because there is no code path that places an order.
                </li>
                <li>
                  <span className="font-semibold text-white">
                    Keys are encrypted at rest with AES-256-GCM
                  </span>{' '}
                  — not stored as plain text, not logged.
                </li>
                <li>
                  <span className="font-semibold text-white">It is your record.</span> The app exists
                  to read what you already did and show it back to you accurately.
                </li>
              </ul>
            </div>
            <p className="mt-6 border-l-2 border-white/15 pl-5 text-sm text-white/50">
              You are handing a third-party app credentials to a brokerage account, and you should be
              suspicious of that by default — including here.{' '}
              <span className="text-white/80">
                Use read-only API keys, scoped to read-only at the broker, every time
              </span>
              , with any product. That advice costs this app nothing and it is the correct habit
              regardless of who is asking.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 bg-secondary/30">
        <div className="container-custom">
          <div className="max-w-3xl">
            <p className="subheading mb-4">The advice boundary</p>
            <h2 className="heading-lg mb-6">
              The coach comments on the trader, never on the market.
            </h2>
            <p className="mb-8 text-white/70">
              That line is what separates software you operate from personalised investment advice,
              which is regulated. A line stated only in a document is not a control, so it is defended
              in three places — deepest first:
            </p>
            <ol className="space-y-5">
              {LAYERS.map((l, i) => (
                <li key={l.name} className="grid grid-cols-[2rem_1fr] gap-3">
                  <span className="pt-0.5 font-mono text-sm text-accent-cyan">{i + 1}.</span>
                  <p className="text-white/70">
                    <span className="font-semibold text-white">{l.name}</span> {l.body}
                  </p>
                </li>
              ))}
            </ol>
            <p className="mt-8 border-l-2 border-white/15 pl-5 text-sm text-white/50">
              The filter is deliberately the <span className="text-white/80">weakest</span> layer, and
              is documented as such. A regex cannot prove text is advice-free — it exists to catch a
              model that drifts, not to make an unsafe design safe. That is why the input layer is
              first.
            </p>
            <p className="mt-6 text-white/70">
              <span className="text-white">And the reward loop is kept away from the order button.</span>{' '}
              Execution lives on the desktop surface — charts, order entry, your journal and edge
              verdicts beside them — carrying <em>no</em> XP, streaks, coins or badges. The gamified
              client has no order entry on any screen size. A reward loop that terminates in a buy
              button is a pattern regulators have fined brokerages over, and separating the two
              clients makes that structurally hard rather than something a reviewer has to remember.
            </p>
            <p className="mt-6 border-l-2 border-accent-coral pl-5 text-sm text-white/60">
              <span className="font-semibold text-white">Status, plainly:</span> the journal, the
              gamification and the broker import are live today. The professional desktop surface is
              designed and decided but <span className="font-semibold text-white">not yet released</span>{' '}
              — so if you are here for order entry across monitors, you are early.
            </p>
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-custom">
          <div className="max-w-3xl">
            <p className="subheading mb-4">What this is not</p>
            <h2 className="heading-lg mb-6">It is a journal. It does not tell you what to buy.</h2>
            <p className="mb-8 text-white/70">
              There are no signals here, no alerts, no copy-trading, no strategy anyone is selling
              you, and no claim — stated or implied — that keeping a journal will make you profitable.
              It records what you did and shows it back to you honestly, including the parts you would
              rather not look at. What you do with that is entirely yours.
            </p>
            <div className="rounded-xl border border-white/10 bg-secondary-dark p-5 text-sm text-white/50">
              <span className="font-semibold text-white/80">Not financial advice.</span> Verdikt is a
              record-keeping and educational tool. Nothing in it is a recommendation to buy, sell, or
              hold any asset, and nothing in it is a solicitation. Trading carries a substantial risk
              of loss. Past results do not indicate future results. You are responsible for your own
              decisions — consult a licensed professional before risking capital.
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-secondary/30">
        <div className="container-custom">
          <div className="max-w-2xl">
            <p className="subheading mb-4">Start the streak</p>
            <h2 className="heading-lg mb-6">Fourteen days from now, you have a record.</h2>
            <p className="mb-8 text-white/70">
              Free to start, read-only broker access, and an engine that will tell you plainly when
              your own numbers do not say anything yet.
            </p>
            <div className="flex flex-wrap gap-4">
              <a href={APP} className="btn-primary" target="_blank" rel="noopener noreferrer">
                Open Verdikt
              </a>
              <Link href="/engineering" className="btn-secondary">
                How I build things like this
              </Link>
            </div>
            <p className="mt-6 text-xs text-white/40">
              Verdikt lives at verdikt.jaklabs.io. Signup and the app all happen there.
            </p>
          </div>
        </div>
      </section>
    </>
  )
}
