import type { Metadata } from 'next'
import Link from 'next/link'
import { Terminal, ShieldCheck, GitBranch, ArrowRight, Ban, Check } from 'lucide-react'

/**
 * The free tool, on the agency site.
 *
 * Aura Rank has its own landing page at rank.jaklabs.io, which wears the
 * product's identity and drops this site's chrome entirely. That page sells the
 * tool to a developer who already arrived looking for it.
 *
 * This page is the other half, and it has a different job: jaklabs.io never
 * mentioned Aura existed. A visitor here is usually a business owner weighing up
 * whether JAK Labs can build, not a developer hunting for a scanner — so this
 * page leads with the engineering decision that makes the tool credible (it
 * cannot phone home, and you can prove that before running it) and lets the
 * product page do the conversion.
 *
 * Server component, no animation. Someone skimming for whether this is real
 * should reach the GitHub link fast.
 */

export const metadata: Metadata = {
  title: 'Aura Rank — a developer rank that never sees your code',
  description:
    'A free, open-source tool from JAK Labs. It reads your repositories offline and grades '
    + 'them out of 100 — your source never leaves your machine, and you can verify that with '
    + 'one grep before you run it.',
  alternates: { canonical: '/aura' },
  openGraph: {
    type: 'website',
    url: '/aura',
    title: 'Aura Rank — a developer rank that never sees your code',
    description:
      'One command, entirely offline. Eight grades, four measured dimensions, and four it '
      + 'refuses to guess at.',
  },
}

/** The ladder, cold to white-hot. Same bands the scanner ships with. */
const GRADES = [
  { name: 'Dormant', range: '0–14', meaning: 'little engineering signal yet — a scratch or scratch-shaped repo', color: '#5A606C' },
  { name: 'Kindled', range: '15–29', meaning: 'working code, shipped, but no test or CI discipline behind it', color: '#7E4C2E' },
  { name: 'Drawn', range: '30–44', meaning: 'discipline appearing — some tests, some structure', color: '#A86024' },
  { name: 'Formed', range: '45–59', meaning: 'real practice: tested, documented, maintained over time', color: '#CE7E20' },
  { name: 'Marked', range: '60–72', meaning: 'professional open-source standard — others could rely on this', color: '#E39C2D' },
  { name: 'Sealed', range: '73–81', meaning: 'a strong, well-maintained library others do rely on', color: '#F0BE4E' },
  { name: 'Sovereign', range: '82–88', meaning: 'flagship quality — among the best-run projects in its language', color: '#F8DE86' },
  { name: 'Apex', range: '89–100', meaning: 'best-in-class. Reference-grade engineering', color: '#FFF4D6' },
]

const MEASURED = [
  { dim: 'Ship', signal: 'tests, CI, release tags, tenure, project shape' },
  { dim: 'Architecture', signal: 'function length and nesting distributions, real typing' },
  { dim: 'Judgment', signal: 'revisit ratio, exception precision, sustained cadence' },
  { dim: 'Transmission', signal: 'doc ratio, docstring coverage, contributors' },
]

const REFUSED = [
  { dim: 'Embed', why: 'whether you can map a messy business is not in your AST' },
  { dim: 'Fundamentals', why: 'a timed exercise, not a property of a repository' },
  { dim: 'Reach', why: 'public dependents and installs — verifiable, not local' },
  { dim: 'Renown', why: 'public record — verifiable, not local' },
]

const CALIBRATION = [
  ['scrapy', 88], ['flask', 87], ['fastapi', 86], ['requests', 84],
  ['express', 78], ['axios', 76], ['zod', 72], ['react-window', 55],
] as const

export default function AuraPage() {
  return (
    <main className="pt-24">
      {/* ── hero ─────────────────────────────────────────────── */}
      <section className="section-padding">
        <div className="container-custom max-w-4xl">
          <p className="mb-4 font-mono text-xs uppercase tracking-[0.2em] text-accent-cyan">
            Free &amp; open source · from JAK Labs
          </p>
          <h1 className="mb-6 text-4xl font-bold leading-[1.05] sm:text-5xl lg:text-6xl">
            A developer rank that
            <br />
            <span className="bg-gradient-to-r from-accent-coral to-primary-light bg-clip-text text-transparent">
              never sees your code
            </span>
          </h1>
          <p className="mb-8 max-w-2xl text-lg text-muted-foreground">
            One command, entirely offline. It reads your repositories and grades them out of 100 —
            and your source never leaves the machine, in a way you can verify before you run it.
          </p>

          <div className="mb-10 overflow-x-auto rounded-xl border border-white/10 bg-black/40 p-5 font-mono text-sm">
            <p className="text-muted-foreground">
              <span className="text-accent-cyan">$</span> aura scan ~/code/my-project
            </p>
            <p className="mt-3 text-2xl font-semibold" style={{ color: '#F0BE4E' }}>
              SEALED <span className="text-muted-foreground">·</span> 76 / 100
            </p>
            <p className="mt-1 text-muted-foreground">
              a strong, well-maintained library others do rely on
            </p>
            <p className="mt-3 text-xs text-muted">
              self-assessed · 4 of 8 dimensions measured · nothing left this machine
            </p>
          </div>

          <div className="flex flex-wrap gap-4">
            <a href="https://rank.jaklabs.io" className="btn-primary">
              Try it — 60 seconds, no account
              <ArrowRight className="ml-2 h-4 w-4" />
            </a>
            <a
              href="https://github.com/jaklabs/aura-rank"
              className="btn-secondary"
              rel="noopener"
            >
              Read the source
            </a>
          </div>
        </div>
      </section>

      {/* ── the problem ──────────────────────────────────────── */}
      <section className="section-padding border-t border-white/5">
        <div className="container-custom max-w-4xl">
          <h2 className="mb-6 text-3xl font-bold">Why it exists</h2>
          <div className="max-w-2xl space-y-4 text-muted-foreground">
            <p>
              There is no signal for a developer without a logo behind them. Stars measure
              marketing. Years measure patience. LeetCode measures LeetCode. The people who are
              actually good — running production systems alone, for real businesses, with no famous
              employer on the résumé — have nothing legible to point at.
            </p>
            <p className="text-foreground">
              And the obvious fix is unacceptable. Nobody is uploading their private codebase to a
              website for a score. Not their client&rsquo;s code, not their startup&rsquo;s, not
              their own. Any tool that asks is dead on arrival, and deserves to be.
            </p>
          </div>
        </div>
      </section>

      {/* ── the guarantee ────────────────────────────────────── */}
      <section className="section-padding border-t border-white/5">
        <div className="container-custom max-w-4xl">
          <div className="mb-3 flex items-center gap-3">
            <ShieldCheck className="h-6 w-6 text-accent-cyan" />
            <h2 className="text-3xl font-bold">Don&rsquo;t trust us. Grep the file.</h2>
          </div>
          <p className="mb-6 max-w-2xl text-muted-foreground">
            The scanner imports no HTTP client and opens no socket. That is not a privacy policy —
            it is a property of the source, and you can confirm it in one command before you ever
            run the thing.
          </p>

          <div className="mb-8 overflow-x-auto rounded-xl border border-accent-cyan/20 bg-black/40 p-5 font-mono text-sm">
            <p className="mb-2 text-xs uppercase tracking-widest text-accent-cyan">
              verify before you run it
            </p>
            <p className="text-foreground">
              grep -rnE &apos;requests|urllib|http|socket|subprocess|eval&apos; aura/
            </p>
            <p className="mt-2 text-xs text-muted">
              the only matches are the docstrings telling you to run this command
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            {[
              ['Numbers, not source', 'Output is integers and ratios. No file contents, no absolute paths. Author emails are hashed on read.'],
              ['Read it first', '--print shows the exact payload before you share it with anyone. Nothing is sent by default, or at all.'],
              ['Network is a separate tool', 'Anything touching the internet lives in a different binary. The scanner provably cannot phone home.'],
            ].map(([title, body]) => (
              <div key={title} className="card">
                <h3 className="mb-2 font-semibold">{title}</h3>
                <p className="text-sm text-muted-foreground">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── measured / refused ───────────────────────────────── */}
      <section className="section-padding border-t border-white/5">
        <div className="container-custom max-w-4xl">
          <h2 className="mb-3 text-3xl font-bold">Four things it measures. Four it refuses to.</h2>
          <p className="mb-8 max-w-2xl text-muted-foreground">
            A tool claiming to judge whether you can sit with a customer by reading your AST would
            be nonsense, and every good engineer would spot it in a second. So it does not.
          </p>

          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <p className="mb-3 flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-accent-cyan">
                <Check className="h-4 w-4" /> measured
              </p>
              <div className="space-y-3">
                {MEASURED.map(({ dim, signal }) => (
                  <div key={dim} className="rounded-lg border border-white/10 p-4">
                    <p className="font-semibold">{dim}</p>
                    <p className="text-sm text-muted-foreground">{signal}</p>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <p className="mb-3 flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-muted">
                <Ban className="h-4 w-4" /> refused
              </p>
              <div className="space-y-3">
                {REFUSED.map(({ dim, why }) => (
                  <div key={dim} className="rounded-lg border border-white/5 bg-white/[0.02] p-4">
                    <p className="font-semibold text-muted-foreground">{dim}</p>
                    <p className="text-sm text-muted">{why}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-8 rounded-xl border border-accent-coral/20 bg-accent-coral/5 p-6">
            <p className="mb-1 font-mono text-xs uppercase tracking-widest text-accent-coral">
              the load-bearing signal
            </p>
            <p className="mb-2 font-mono text-lg font-semibold">revisit_ratio</p>
            <p className="text-muted-foreground">
              The share of files you touched in more than one calendar month. It separates
              maintained work from dump-and-run, it is invisible to anyone optimising for stars, and
              it cannot be faked without actually doing it.{' '}
              <span className="text-foreground">
                Every vanity metric rewards volume. This one rewards coming back.
              </span>
            </p>
          </div>
        </div>
      </section>

      {/* ── the ladder ───────────────────────────────────────── */}
      <section className="section-padding border-t border-white/5">
        <div className="container-custom max-w-4xl">
          <h2 className="mb-3 text-3xl font-bold">Eight grades</h2>
          <p className="mb-8 max-w-2xl text-muted-foreground">
            No stars, no belts, no borrowed hierarchy. Every grade says what it actually describes,
            so a low one is a diagnosis rather than a scolding.
          </p>

          <div className="space-y-2">
            {GRADES.map(({ name, range, meaning, color }) => (
              <div
                key={name}
                className="flex flex-wrap items-baseline gap-x-4 gap-y-1 rounded-lg border border-white/5 bg-white/[0.02] p-4"
              >
                <span
                  className="w-24 font-mono text-sm font-semibold uppercase tracking-wider"
                  style={{ color }}
                >
                  {name}
                </span>
                <span className="w-16 font-mono text-sm text-muted">{range}</span>
                <span className="flex-1 text-sm text-muted-foreground">{meaning}</span>
              </div>
            ))}
          </div>

          <div className="mt-8">
            <h3 className="mb-3 flex items-center gap-2 text-lg font-semibold">
              <GitBranch className="h-5 w-5 text-accent-cyan" />
              Check it against code you already know
            </h3>
            <p className="mb-4 max-w-2xl text-sm text-muted-foreground">
              Bands are set against 52 public repositories, then validated rather than
              percentile-fitted. Clone any of these and run it yourself — you should get the same
              number.
            </p>
            <div className="flex flex-wrap gap-2 font-mono text-sm">
              {CALIBRATION.map(([repo, score]) => (
                <span
                  key={repo}
                  className="rounded-md border border-white/10 bg-black/30 px-3 py-1.5"
                >
                  {repo} <span className="text-accent-cyan">{score}</span>
                </span>
              ))}
            </div>
            <p className="mt-4 max-w-2xl text-sm text-muted">
              A typical solo project lands in the 15–45 range. That is not an insult — it is what an
              untested, un-CI&rsquo;d, actively used codebase actually looks like, and most working
              software is exactly that.
            </p>
          </div>
        </div>
      </section>

      {/* ── honesty ──────────────────────────────────────────── */}
      <section className="section-padding border-t border-white/5">
        <div className="container-custom max-w-4xl">
          <h2 className="mb-3 text-3xl font-bold">What it isn&rsquo;t</h2>
          <p className="mb-6 max-w-2xl text-muted-foreground">
            A ranking system that hides its own uncertainty deserves to be ignored. So:
          </p>
          <ul className="max-w-2xl space-y-3 text-muted-foreground">
            {[
              ['Not official.', 'No one can declare a standard; that gets earned by adoption or not at all.'],
              ['Not verified.', 'The scan runs on your machine and the file is yours, so it is trivially editable. Every output says self-assessed, and always will.'],
              ['Not fully calibrated.', '52 repositories is a small, elite sample. It anchors the top of the scale credibly and says less about the middle.'],
              ['Not a measure of you.', 'It reads repositories. Half of what makes someone good — judgment under ambiguity, working with people, knowing what not to build — leaves no trace in a git history.'],
            ].map(([bold, rest]) => (
              <li key={bold} className="border-l-2 border-white/10 pl-4">
                <span className="font-semibold text-foreground">{bold}</span> {rest}
              </li>
            ))}
          </ul>
          <p className="mt-6 max-w-2xl text-sm text-muted">
            The scoring spec is a versioned file in the repo. When someone finds a way to game it,
            they publish it and it gets patched like a CVE. That only works in the open, which is
            why it is open.
          </p>
        </div>
      </section>

      {/* ── cta ──────────────────────────────────────────────── */}
      <section className="section-padding border-t border-white/5">
        <div className="container-custom max-w-4xl">
          <div className="card">
            <div className="mb-4 flex items-center gap-3">
              <Terminal className="h-6 w-6 text-primary-light" />
              <h2 className="text-2xl font-bold">Run it on something you built</h2>
            </div>
            <p className="mb-6 max-w-2xl text-muted-foreground">
              Sixty seconds, offline, no account. Python 3.9+ and git — there are no dependencies,
              deliberately.
            </p>
            <div className="mb-6 overflow-x-auto rounded-lg border border-white/10 bg-black/40 p-4 font-mono text-sm">
              <p className="text-muted-foreground">
                <span className="text-accent-cyan">$</span> git clone
                https://github.com/jaklabs/aura-rank
              </p>
              <p className="text-muted-foreground">
                <span className="text-accent-cyan">$</span> cd aura-rank
              </p>
              <p className="text-muted-foreground">
                <span className="text-accent-cyan">$</span> python3 -m aura.scan
                ~/code/your-project
              </p>
            </div>
            <div className="flex flex-wrap gap-4">
              <a href="https://rank.jaklabs.io" className="btn-primary">
                Open Aura Rank
                <ArrowRight className="ml-2 h-4 w-4" />
              </a>
              <Link href="/engineering" className="btn-secondary">
                Who built it
              </Link>
            </div>
          </div>

          <p className="mt-8 max-w-2xl text-sm text-muted">
            Aura is free and permissively licensed, and it is here because auditability is the whole
            point — a restrictive licence would defeat it. If you want the same standard applied to
            software you actually depend on,{' '}
            <Link href="/contact" className="text-primary-light underline underline-offset-4">
              that is what JAK Labs does for a living
            </Link>
            .
          </p>
        </div>
      </section>
    </main>
  )
}
