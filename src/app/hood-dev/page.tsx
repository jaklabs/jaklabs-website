import type { Metadata } from 'next'
import Link from 'next/link'

/**
 * Hood Dev on the parent site.
 *
 * The school lives at hood.jaklabs.io with its own identity, its own Cognito pool
 * and its own brand. This page is the door from jaklabs.io and nothing more —
 * signup, auth and the product all stay over there, because duplicating the flow
 * here would split the auth surface across two domains for no gain.
 *
 * REBUILT 2026-08-31 against the Hood Dev design artifact. The earlier version
 * described the school in the abstract ("assesses you first, builds a track");
 * this one shows the instrument — the seven phases, the nine leaks, the blocking
 * order, the rank ladder. The difference matters commercially: a developer
 * deciding whether an assessment is real needs to see its taxonomy, not adjectives
 * about it. Every competitor can claim personalisation. Only one can print the DAG.
 *
 * VOICE: a different reader from the rest of the site. Everything else talks to a
 * business owner buying software; this talks to a developer, tradesman to
 * apprentice. The vocabulary (Teardown, Bench, Read, Leak, Work Order, Bay Time)
 * is load-bearing brand, not decoration.
 *
 * EVERY CLAIM HERE WAS CHECKED against ~/claude-server/hood-dev before it shipped:
 *   23 modules / ~188h ....... content/modules/README.md
 *   2 of 9 → ~6 of 9 ......... ROADMAP.md §Status, calibration/PROTOCOL.md
 *   phases 0–6 ............... ASSESSMENT-ENGINE.md
 *   rank gates ............... ASSESSMENT-ENGINE.md §ranks
 *   zero-network scoring ..... tests/test_engine.py::test_the_scoring_path_makes_no_network_calls
 *   $155K invoiced ........... content-engine/facts.toml → haslett-invoiced
 *
 * WHAT IS STILL NOT CLAIMED, deliberately: no student count, no outcomes, no
 * placement rate, no pricing beyond free. Sittings so far are zero and VISION.md
 * is explicit that the pricing ladder must not be committed to publicly before the
 * day-90 gate. The "where this stands" section says the coverage limit out loud
 * rather than letting somebody discover it after forty minutes — an assessment
 * that oversells its own resolution has destroyed the only thing it sells.
 */

const HOOD = 'https://hood.jaklabs.io'
const AURA_REPO = 'https://github.com/jaklabs/aura-rank'

export const metadata: Metadata = {
  title: 'Hood Dev — the school that looks under your hood first',
  description:
    'A developer school that assesses how you actually work — seven phases, nine measured leaks, '
    + 'evidence cited — then builds the track around what it found. Free for 90 days from launch.',
  alternates: { canonical: '/hood-dev' },
  openGraph: {
    type: 'website',
    url: '/hood-dev',
    title: 'Every course tells you what to learn. None of them look under your hood.',
    description:
      'Dev as a trade, not an academy. Assessed first, then a track built for your specific leaks.',
  },
}

// Phases 0–6 of the Teardown, in order. Phase 4 is starred because it is the one
// nobody else runs: AI use permitted and itself measured.
const PHASES = [
  {
    name: 'Intake',
    meta: '5 min · ungated',
    body: 'Where you are, what you have shipped, what you are trying to become.',
  },
  {
    name: 'The Written',
    meta: '25 min · adaptive',
    body:
      'Scenarios, not trivia. The questions get harder or easier based on what you have already '
      + 'shown.',
  },
  {
    name: 'The Bench',
    meta: '60–90 min · read and repair',
    body:
      'An unfamiliar codebase with real defects. Measures time-to-first-edit and how much you read '
      + 'before you touched anything.',
  },
  {
    name: 'The Build',
    meta: '2–4 hours · ambiguity under load',
    body:
      'A deliberately underspecified brief. What you put in QUESTIONS.md matters more than what you '
      + 'put in the code.',
  },
  {
    name: 'The Verification Bay',
    meta: '30 min · the AI-native phase',
    star: true,
    body:
      'AI use is allowed, expected, and itself measured. Nobody is proctoring abstinence. The '
      + 'question is whether you can direct, verify and correct a model — the actual 2026 competency.',
  },
  {
    name: 'The Read',
    meta: 'delivered, not taken',
    body: 'Your type, your leaks, and every claim cited to something you actually did.',
  },
  {
    name: 'The Contract',
    meta: '10 min',
    body:
      'You accept the Work Order, or you do not. The track is generated from the findings, not from '
      + 'a catalogue.',
  },
]

// The weakness taxonomy. L7–L9 are flagged because they are the ones that separate
// somebody who can be dropped into a real business from somebody who needs a
// perfect ticket — and no competitor measures them at all.
const LEAKS = [
  { id: 'L1', name: 'Fundamentals', sym: 'Shaky on data structures, complexity, concurrency. Solutions work by luck.' },
  { id: 'L2', name: 'Debugging', sym: 'Guesses instead of observing. Changes several things at once. No hypothesis.' },
  { id: 'L3', name: 'Delivery', sym: 'Starts, doesn’t finish. Scope creeps until nothing ships.' },
  { id: 'L4', name: 'Reading', sym: 'Can only write greenfield. Freezes in an unfamiliar codebase.' },
  { id: 'L5', name: 'Systems design', sym: 'Can’t structure beyond a file. Coupling everywhere.' },
  { id: 'L6', name: 'Production', sym: 'Never operated anything. No deploys, monitoring, rollback, incidents.' },
  { id: 'L7', name: 'Ambiguity & scoping', fde: true, sym: 'Needs a perfect ticket. Won’t interrogate a spec. Builds the wrong thing correctly.' },
  { id: 'L8', name: 'Communication', fde: true, sym: 'Can’t explain a tradeoff to a non-engineer. Can’t demo. Can’t say no.' },
  { id: 'L9', name: 'Verification', fde: true, sym: 'Trusts output that looks right. No skepticism of AI, or of self.' },
]

const PRINCIPLES = [
  {
    title: 'evidence or nothing',
    body:
      'No statement in a Read exists without a citation to something you actually did. That is the '
      + 'difference between a mechanic’s estimate and a horoscope.',
  },
  {
    title: 'deterministic scoring',
    body:
      'The model writes the prose, never the verdict. Given identical telemetry the engine returns '
      + 'an identical type and identical leak scores, forever. A test asserts the scoring path makes '
      + 'zero network calls.',
  },
  {
    title: 'unknown never flatters',
    body:
      'Insufficient evidence returns INSUFFICIENT — never a generous guess. A confident wrong Read '
      + 'is worse than an incomplete one.',
  },
  {
    title: 'type is stable, leaks move',
    body:
      'You are never re-typed — that would destroy the thing you identify with. You are always '
      + 're-scored on leaks, every eight weeks or at each gate.',
  },
]

const RANKS = [
  {
    name: 'Rookie',
    req: 'Teardown complete, Work Order accepted',
    unlocks: 'Discord, curriculum, your track',
  },
  {
    name: 'Apprentice',
    req: 'Fundamentals and debugging both below 40',
    unlocks: 'Advanced modules, peer review',
  },
  {
    name: 'Journeyman',
    star: true,
    req:
      'Your project shipped to production with real users · verified leak deltas on re-assessment · '
      + 'a written scope doc · a 10-minute live defence of your own work',
    unlocks: 'Bay Time — 1:1 with me on your project',
  },
  {
    name: 'Craftsman',
    req: 'You operated it: a real incident handled, iteration on user feedback, an uptime record',
    unlocks: 'Recurring Bay Time, teaching privileges',
  },
  {
    name: 'Hood Dev',
    req: 'You did it for someone else — client or employer — end to end',
    unlocks: 'Case study, referral pipeline, alumni tier',
  },
]

/**
 * The blocking order.
 *
 * This is the one diagram on the page that is load-bearing rather than
 * illustrative: it is the reason the engine will refuse to give an ambitious
 * learner the track they asked for. Drawn rather than described because a
 * dependency graph in prose reads as a caveat, and as a graph it reads as a rule.
 */
function BlockingOrder() {
  const box = 'fill-secondary stroke-white/10'
  const boxFde = 'stroke-accent-coral/45'
  return (
    <svg
      viewBox="0 0 640 210"
      role="img"
      aria-label={
        'Blocking order: fundamentals and debugging gate reading, which gates systems design, which '
        + 'gates production. Delivery gates ambiguity, which gates communication and feeds verification.'
      }
      className="h-auto w-full max-w-2xl font-mono"
    >
      <defs>
        <marker id="hd-arrow" markerWidth="7" markerHeight="7" refX="6" refY="2.6" orient="auto">
          <path d="M0,0 L6,2.6 L0,5.2 z" fill="#2a2a38" />
        </marker>
      </defs>
      <g fontSize={10} fill="#a1a1aa" textAnchor="middle">
        <rect x="4" y="14" width="118" height="30" rx="5" fill="rgba(249,115,22,0.10)" className={boxFde} />
        <text x="63" y="33" fill="#f97316">L1 fundamentals</text>
        <rect x="4" y="62" width="118" height="30" rx="5" fill="rgba(249,115,22,0.10)" className={boxFde} />
        <text x="63" y="81" fill="#f97316">L2 debugging</text>
        <rect x="4" y="150" width="118" height="30" rx="5" className={box} />
        <text x="63" y="169">L3 delivery</text>
        <rect x="170" y="38" width="110" height="30" rx="5" className={box} />
        <text x="225" y="57">L4 reading</text>
        <rect x="320" y="38" width="132" height="30" rx="5" className={box} />
        <text x="386" y="57">L5 systems</text>
        <rect x="500" y="38" width="132" height="30" rx="5" className={box} />
        <text x="566" y="57">L6 production</text>
        <rect x="200" y="150" width="132" height="30" rx="5" className={box} />
        <text x="266" y="169">L7 ambiguity</text>
        <rect x="380" y="150" width="140" height="30" rx="5" className={box} />
        <text x="450" y="169">L8 communication</text>
        <rect x="380" y="100" width="140" height="30" rx="5" className={box} />
        <text x="450" y="119">L9 verification</text>
      </g>
      <g fill="none" stroke="#2a2a38" strokeWidth={1.4} markerEnd="url(#hd-arrow)">
        <path d="M122,29 H150 V53 H168" />
        <path d="M122,77 H150 V53 H168" />
        <path d="M280,53 H318" />
        <path d="M452,53 H498" />
        <path d="M122,165 H198" />
        <path d="M332,165 H378" />
        <path d="M386,68 V150" />
        <path d="M450,150 V132" />
      </g>
    </svg>
  )
}

export default function HoodDevPage() {
  return (
    <>
      <section className="pt-32 pb-16">
        <div className="container-custom">
          <div className="max-w-3xl">
            <p className="subheading mb-4">Hood Dev · a JAK Labs school</p>
            <h1 className="heading-xl mb-6">
              Every course tells you what to learn.{' '}
              <span className="text-gradient-neon">None of them look under your hood.</span>
            </h1>
            <p className="mb-8 text-lg text-white/70">
              A developer school that assesses how you actually work — then builds the track around
              what it found. Dev as a trade, not an academy.
            </p>
            <div className="flex flex-wrap items-center gap-3 font-mono text-xs text-white/50">
              <span className="inline-flex items-center gap-2 rounded-full border border-accent-cyan/30 bg-secondary-dark px-3 py-1 text-accent-cyan">
                <span className="h-1.5 w-1.5 rounded-full bg-current" />
                The Teardown is live
              </span>
              <span className="rounded-full border border-white/10 bg-secondary-dark px-3 py-1">
                ~40 min, in-browser
              </span>
              <span className="rounded-full border border-white/10 bg-secondary-dark px-3 py-1">
                Free — 90 days from launch
              </span>
            </div>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link href={`${HOOD}/signup`} className="btn-primary"
                    target="_blank" rel="noopener noreferrer">
                Sit the Teardown
              </Link>
              <Link href={`${HOOD}/login`} className="btn-secondary"
                    target="_blank" rel="noopener noreferrer">
                Already signed up? Log in
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-secondary/30">
        <div className="container-custom">
          <div className="max-w-3xl">
            <p className="subheading mb-4">Who it is for</p>
            <h2 className="heading-lg mb-6">
              The stuck mid-level developer. <span className="text-white/40">Not beginners.</span>
            </h2>
            <div className="space-y-4 text-white/70">
              <p>
                You can build things. You have shipped. But you have been roughly the same developer
                for two years and nobody can tell you specifically why — only that you should
                &ldquo;learn system design&rdquo; or grind more LeetCode.
              </p>
              <p>
                <span className="text-white">Hood Dev diagnoses the developer, not the technology.</span>{' '}
                &ldquo;Your React is Level 2&rdquo; is what a course library sells. This answers{' '}
                <em>&ldquo;you cannot operate under ambiguity, and here is the exact moment you proved
                it.&rdquo;</em>
              </p>
              <p className="text-sm text-white/40">
                If you have never written code, this is not the place yet — it diagnoses developers,
                and with nothing to measure there is nothing to diagnose. I would rather say that now
                than take your time.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-custom">
          <div className="max-w-3xl mb-10">
            <p className="subheading mb-4">The Teardown · assessment structure</p>
            <h2 className="heading-lg mb-6">Seven phases, numbered from zero</h2>
            <p className="text-white/70">
              You are graded on the <span className="text-white">path</span>, not the artifact — in
              2026 the artifact proves nothing, because a model could have made it.
            </p>
          </div>
          <div className="max-w-3xl space-y-2">
            {PHASES.map((p, i) => (
              <div
                key={p.name}
                className={`grid grid-cols-[2.5rem_1fr] gap-4 rounded-lg border p-4 sm:p-5 ${
                  p.star
                    ? 'border-primary/30 bg-primary/[0.06]'
                    : 'border-white/5 bg-secondary-dark'
                }`}
              >
                <span className="pt-0.5 font-mono text-sm text-neon-purple">
                  {String(i).padStart(2, '0')}
                </span>
                <div>
                  <h3 className="mb-1 font-semibold">
                    {p.name}
                    <span className="ml-2 font-mono text-xs font-normal text-white/40">{p.meta}</span>
                  </h3>
                  <p className="text-sm text-white/60">{p.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-secondary/30">
        <div className="container-custom">
          <div className="max-w-3xl mb-10">
            <p className="subheading mb-4">Leaks · the weakness taxonomy</p>
            <h2 className="heading-lg mb-6">
              Type is orthogonal to competence.{' '}
              <span className="text-gradient-neon">Leaks are what&rsquo;s missing.</span>
            </h2>
            <p className="text-white/70">Nine of them, each scored 0–100 with evidence citations.</p>
          </div>

          <div className="overflow-x-auto rounded-xl border border-white/10">
            <table className="w-full min-w-[560px] text-sm">
              <thead>
                <tr className="bg-secondary text-left font-mono text-[11px] uppercase tracking-wider text-white/40">
                  <th className="px-4 py-3 font-medium">#</th>
                  <th className="px-4 py-3 font-medium">Leak</th>
                  <th className="px-4 py-3 font-medium">Symptom</th>
                </tr>
              </thead>
              <tbody>
                {LEAKS.map((l) => (
                  <tr key={l.id} className="border-t border-white/5">
                    <td
                      className={`whitespace-nowrap px-4 py-3 font-mono ${
                        l.fde ? 'text-accent-coral' : 'text-neon-purple'
                      }`}
                    >
                      {l.id}
                    </td>
                    <td
                      className={`whitespace-nowrap px-4 py-3 font-semibold ${
                        l.fde ? 'text-accent-coral' : 'text-white'
                      }`}
                    >
                      {l.name}
                    </td>
                    <td className="px-4 py-3 text-white/60">{l.sym}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="mt-6 max-w-3xl text-white/70">
            <span className="font-semibold text-accent-coral">
              L7, L8 and L9 are the ones no competitor measures at all
            </span>{' '}
            — and they are exactly what separates someone who can be dropped into a real business
            from someone who needs a perfect ticket.
          </p>

          <div className="mt-10 rounded-xl border border-white/10 bg-secondary-dark p-6 sm:p-8">
            <p className="mb-6 font-mono text-[11px] uppercase tracking-[0.14em] text-white/40">
              The blocking order
            </p>
            <BlockingOrder />
            <p className="mt-6 max-w-3xl text-sm text-white/70">
              <span className="font-semibold text-white">Hard rule:</span> if fundamentals or
              debugging score above 60, your track opens with them regardless of what you wanted to
              learn. You cannot teach systems design to someone who cannot debug — they fail and
              blame the curriculum. This is why the engine sometimes tells an ambitious learner
              something they do not want to hear. Saying it plainly <em>is</em> the brand.
            </p>
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-custom">
          <div className="max-w-3xl mb-10">
            <p className="subheading mb-4">How it refuses to be astrology</p>
            <h2 className="heading-lg">Four rules, and none of them are negotiable</h2>
          </div>
          <div className="grid gap-px overflow-hidden rounded-xl border border-white/10 bg-white/10 sm:grid-cols-2">
            {PRINCIPLES.map((p) => (
              <div key={p.title} className="bg-secondary-dark p-6">
                <h3 className="mb-2 font-mono text-sm font-semibold tracking-wide text-primary-light">
                  {p.title}
                </h3>
                <p className="text-sm text-white/60">{p.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-secondary/30">
        <div className="container-custom">
          <div className="max-w-3xl mb-10">
            <p className="subheading mb-4">Ranks · evidence-based, never time-based</p>
            <h2 className="heading-lg">You cannot sit your way up this ladder</h2>
          </div>
          <div className="overflow-x-auto rounded-xl border border-white/10">
            <table className="w-full min-w-[640px] text-sm">
              <thead>
                <tr className="bg-secondary text-left font-mono text-[11px] uppercase tracking-wider text-white/40">
                  <th className="px-4 py-3 font-medium">Rank</th>
                  <th className="px-4 py-3 font-medium">Requirement</th>
                  <th className="px-4 py-3 font-medium">Unlocks</th>
                </tr>
              </thead>
              <tbody>
                {RANKS.map((r) => (
                  <tr
                    key={r.name}
                    className={`border-t border-white/5 ${r.star ? 'bg-accent-coral/[0.06]' : ''}`}
                  >
                    <td
                      className={`whitespace-nowrap px-4 py-3 font-semibold ${
                        r.star ? 'text-accent-coral' : 'text-white'
                      }`}
                    >
                      {r.name}
                    </td>
                    <td className="px-4 py-3 text-white/60">{r.req}</td>
                    <td className={`px-4 py-3 ${r.star ? 'font-semibold text-white' : 'text-white/60'}`}>
                      {r.unlocks}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-6 max-w-3xl text-white/70">
            <span className="font-semibold text-white">Bay Time is earned, not scheduled.</span> You
            cannot buy an hour of one-to-one. You reach it by shipping something real, and the session
            is about <em>your</em> project — never a curriculum walkthrough. Earned access gets
            chased; purchased access does not.
          </p>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-custom">
          <div className="max-w-3xl">
            <p className="subheading mb-4">Where this actually stands</p>
            <div className="rounded-r-xl border-l-[3px] border-accent-coral bg-secondary-dark p-6 sm:p-7">
              <p className="text-white/70">
                <span className="font-semibold text-white">Read this before you sit it.</span> The
                Teardown is live and the curriculum is 23 modules covering every leak — but a
                browser-only sitting <span className="font-semibold text-white">measures 2 of the 9
                leaks.</span> Measured, not estimated. The Bench and the Build carry the rest and they
                are graded by hand, which takes your Read from roughly 2 of 9 to about 6 of 9.
              </p>
              <p className="mt-4 text-white/70">
                So a Read from the browser alone is a <em>sketch</em>. It is a real, evidence-cited
                sketch rather than a personality quiz — but you should know which one you are getting.
                The instrument is early and being calibrated in the open, and the whole thing is free
                for 90 days from launch precisely because of that.
              </p>
            </div>
            <p className="mt-8 text-white/70">
              The person building it runs a live production business on software he wrote himself —
              $155K invoiced through it, one engineer. The curriculum is the thing I would have wanted
              at the point I was stuck.
            </p>
            <p className="mt-4 text-sm text-white/40">
              More on the engineering side of what I do:{' '}
              <Link href="/engineering" className="text-neon-purple hover:text-neon-pink">
                jaklabs.io/engineering
              </Link>
              .
            </p>
          </div>
        </div>
      </section>

      <section className="py-20 bg-secondary/30">
        <div className="container-custom">
          <div className="max-w-2xl">
            <p className="subheading mb-4">Start</p>
            <h2 className="heading-lg mb-6">Find out what you&rsquo;re actually missing.</h2>
            <p className="mb-8 text-white/70">
              Forty minutes, in the browser, free. Or start with the zero-friction version:{' '}
              <Link href="/aura" className="text-neon-purple hover:text-neon-pink">
                Aura Rank
              </Link>{' '}
              grades your repositories entirely offline — nothing uploaded, nothing transmitted — and
              hands you to the Teardown when you want the developer assessed rather than the code.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href={`${HOOD}/signup`} className="btn-primary"
                    target="_blank" rel="noopener noreferrer">
                Sit the Teardown
              </Link>
              <a href={AURA_REPO} className="btn-secondary"
                 target="_blank" rel="noopener noreferrer">
                Scan your repos first
              </a>
            </div>
            <p className="mt-6 text-xs text-white/40">
              The school lives at hood.jaklabs.io. Signup, login and the assessment all happen there.
            </p>
          </div>
        </div>
      </section>
    </>
  )
}
