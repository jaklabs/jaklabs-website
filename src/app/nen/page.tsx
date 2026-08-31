import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

/**
 * 水見式 Water Divination — the second free tool.
 *
 * The sibling of /aura, and built to the same rule: the tool is the thing that
 * gets shared, and this page exists so somebody who lands on jaklabs.io can
 * find it. Aura Rank had that page already; the Nen test had none at all, so
 * the repo was reachable only by knowing it existed.
 *
 * WHY THE JOKE IS LOAD-BEARING
 *
 * A Hunter × Hunter reference is not decoration here — it is why anyone shares
 * this. Nobody forwards "static analysis of your commit history". People forward
 * "it says I'm a Conjurer". The reference gets it opened; the fact that the
 * reading cites what it read is what stops it being a horoscope.
 *
 * So the page commits to the bit properly — kanji, the six readings, the
 * hexagon rule — and then shows the evidence line, because both halves are
 * needed. Whimsy without substance is a toy; substance without whimsy does not
 * travel.
 *
 * Server component, no animation. Same as /aura: somebody deciding whether this
 * is real should reach GitHub fast.
 */

const REPO = 'https://github.com/jaklabs/nen-test'

export const metadata: Metadata = {
  title: '水見式 Water Divination — your Nen type, from the code you write',
  description:
    'A Hunter × Hunter water divination for developers. Reads your repository offline and tells '
    + 'you which of the six categories you write like — citing what it read. Python, no '
    + 'dependencies, no network, MIT.',
  alternates: { canonical: '/nen' },
  openGraph: {
    type: 'website',
    url: '/nen',
    title: '水見式 — find out your Nen type from the code you actually write',
    description: 'The glass is your repository. The aura is your commit history.',
  },
}

// From the tool's own table. Each row is a canon reaction, its category, and
// what that category looks like in a codebase.
const READINGS = [
  { reaction: 'the water increases in volume', cat: 'Enhancer', jp: '強化系', code: 'force applied head-on' },
  { reaction: 'the taste changes', cat: 'Transmuter', jp: '変化系', code: 'glue, adapters, making things fit' },
  { reaction: 'impurities appear', cat: 'Conjurer', jp: '具現化系', code: 'types, schemas, structure declared first' },
  { reaction: 'the water changes colour', cat: 'Emitter', jp: '放出系', code: 'async, queues, deploys, the edges' },
  { reaction: 'the leaf moves', cat: 'Manipulator', jp: '操作系', code: 'cron, pipelines, agents, control at distance' },
  { reaction: 'something else entirely', cat: 'Specialist', jp: '特質系', code: 'a reading that refuses the other five' },
]

export default function NenPage() {
  return (
    <main className="pt-24">
      <section className="section-padding">
        <div className="container-custom max-w-4xl">
          <p className="mb-4 font-mono text-xs uppercase tracking-[0.2em] text-accent-cyan">
            Free &amp; open source · Python 3.9+ · no dependencies · MIT
          </p>
          <h1 className="mb-6 text-4xl font-bold leading-[1.05] sm:text-5xl lg:text-6xl">
            <span className="block mb-3 text-3xl sm:text-4xl tracking-[0.15em]">水見式</span>
            Find out your Nen type from{' '}
            <span className="bg-gradient-to-r from-accent-coral to-primary-light bg-clip-text text-transparent">
              the code you actually write
            </span>
          </h1>
          <p className="mb-8 max-w-2xl text-lg text-muted-foreground">
            In <em>Hunter × Hunter</em> you discover your category by floating a leaf on a glass of
            water and channelling aura. The water tells you what you are. Here the glass is your
            repository and the aura is your commit history.
          </p>

          <div className="mb-10 overflow-x-auto rounded-xl border border-white/10 bg-black/40 p-5 font-mono text-sm">
            <p className="text-muted-foreground">
              <span className="text-accent-cyan">$</span> python3 -m nen ~/code/my-project
            </p>
            <p className="mt-3 text-2xl font-semibold" style={{ color: '#72BE94' }}>
              CONJURER <span className="text-muted-foreground text-lg">具現化系</span>
            </p>
            <p className="mt-1 text-muted-foreground">impurities appear in the water · 49.0%</p>
            <p className="mt-3 text-xs text-muted">
              your opposite is emitter — 40% affinity · nothing left this machine
            </p>
          </div>

          <div className="flex flex-wrap gap-4">
            <a href={REPO} className="btn-primary" target="_blank" rel="noopener noreferrer">
              Read the source
              <ArrowRight className="ml-2 h-4 w-4" />
            </a>
            <Link href="/aura" className="btn-secondary">
              The other one — Aura Rank
            </Link>
          </div>
        </div>
      </section>

      {/* The six readings — the substance behind the reference. */}
      <section className="section-padding border-t border-white/10">
        <div className="container-custom max-w-4xl">
          <p className="mb-4 font-mono text-xs uppercase tracking-[0.2em] text-muted">
            The six readings
          </p>
          <h2 className="heading-md mb-8">What the water does, and what it means in code</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10 text-left font-mono text-xs uppercase tracking-wider text-muted">
                  <th className="py-3 pr-4 font-medium">Reaction</th>
                  <th className="py-3 pr-4 font-medium">Category</th>
                  <th className="py-3 font-medium">In code</th>
                </tr>
              </thead>
              <tbody>
                {READINGS.map((r) => (
                  <tr key={r.cat} className="border-b border-white/5">
                    <td className="py-3 pr-4 text-muted-foreground">{r.reaction}</td>
                    <td className="py-3 pr-4 whitespace-nowrap font-semibold text-white">
                      {r.cat} <span className="ml-1 font-normal text-muted">{r.jp}</span>
                    </td>
                    <td className="py-3 text-muted-foreground">{r.code}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-8 max-w-2xl text-muted-foreground">
            The hexagon is ordered so <span className="text-white">opposites sit three apart</span>,
            exactly as in canon — Enhancer↔Specialist, Transmuter↔Manipulator, Conjurer↔Emitter.
            That is what the affinity percentages read from: 100 / 80 / 60 / 40 by distance. A skill
            native to your opposite costs you the most, and that is a budget line rather than an
            insult.
          </p>
        </div>
      </section>

      {/* The part that stops it being a horoscope. */}
      <section className="section-padding border-t border-white/10">
        <div className="container-custom max-w-4xl">
          <p className="mb-4 font-mono text-xs uppercase tracking-[0.2em] text-muted">
            It is not random
          </p>
          <h2 className="heading-md mb-6">Every reading cites what it read</h2>
          <div className="overflow-x-auto rounded-xl border border-white/10 bg-black/40 p-5 font-mono text-sm leading-relaxed">
            <p className="text-muted-foreground">read from</p>
            <p className="mt-2 text-white">
              substantial_functions{' '}
              <span className="text-muted">mean function length 15 lines</span>
            </p>
            <p className="text-white">
              declares_before_use <span className="text-muted">19/55 functions annotated</span>
            </p>
            <p className="text-white">
              materialises_structure <span className="text-muted">14 classes, 0 dataclasses</span>
            </p>
            <p className="text-white">
              controls_other_systems{' '}
              <span className="text-muted">5 cron/pipeline/agent references</span>
            </p>
          </div>
          <p className="mt-6 max-w-2xl text-muted-foreground">
            The argument for each mapping is written out in{' '}
            <code className="text-white">docs/DIVINATION.md</code> — deliberately, so you can
            disagree with it specifically rather than in general. That is the whole difference
            between this and a horoscope: a horoscope cannot be wrong about anything in particular.
          </p>
        </div>
      </section>

      <section className="section-padding border-t border-white/10">
        <div className="container-custom max-w-4xl">
          <p className="mb-4 font-mono text-xs uppercase tracking-[0.2em] text-muted">
            Channel your aura
          </p>
          <h2 className="heading-md mb-6">No install. No dependencies. No network.</h2>
          <div className="mb-6 overflow-x-auto rounded-xl border border-white/10 bg-black/40 p-5 font-mono text-sm">
            <p className="text-white">git clone {REPO}</p>
            <p className="text-white">cd nen-test</p>
            <p className="text-white">python3 -m nen ~/code/your-project</p>
          </div>
          <p className="mb-8 max-w-2xl text-muted-foreground">
            Nothing leaves your machine — the glass is yours. Same rule as{' '}
            <Link href="/aura" className="text-accent-cyan hover:underline">
              Aura Rank
            </Link>
            : a tool that reads your code has no business phoning home, and you should be able to
            confirm that before you run it rather than take a privacy policy on trust.
          </p>
          <div className="flex flex-wrap gap-4">
            <a href={REPO} className="btn-primary" target="_blank" rel="noopener noreferrer">
              Read the source on GitHub
              <ArrowRight className="ml-2 h-4 w-4" />
            </a>
            <Link href="/hood-dev" className="btn-secondary">
              The school this came out of
            </Link>
          </div>
        </div>
      </section>

      <section className="section-padding border-t border-white/10">
        <div className="container-custom max-w-4xl">
          <h2 className="heading-md mb-4">Why a joke tool is on a consulting site</h2>
          <div className="max-w-2xl space-y-4 text-muted-foreground">
            <p>
              Because the reading is the fun part and the method is the real part. It classifies you
              from things that are actually measurable — function length, annotation density, how
              much structure you declare before you use it, how often you reach for cron and
              pipelines — and it shows you those numbers rather than asking you to trust a verdict.
            </p>
            <p>
              That is the same instinct behind everything else I build: the answer is worth less
              than the evidence for it. If you want the serious version of the idea, that is{' '}
              <Link href="/aura" className="text-accent-cyan hover:underline">
                Aura Rank
              </Link>
              . If you want the version that diagnoses a developer properly and then does something
              about it, that is{' '}
              <Link href="/hood-dev" className="text-accent-cyan hover:underline">
                Hood Dev
              </Link>
              .
            </p>
          </div>
        </div>
      </section>
    </main>
  )
}
