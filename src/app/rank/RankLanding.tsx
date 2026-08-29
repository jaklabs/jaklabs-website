'use client'

import { useCallback, useRef, useState } from 'react'

/**
 * The Aura landing page.
 *
 * Client-side because the tier selector re-colours the whole hero -- the product's
 * output IS the pitch, so letting someone flick through all eight grades explains
 * the ladder faster than a paragraph about it can.
 */

type Tier = {
  name: string
  lo: number
  hi: number
  means: string
  token: string
  score: number
  dims: [number, number, number, number]
}

const TIERS: Tier[] = [
  { name: 'Dormant',   lo: 0,  hi: 14,  token: '--t1', score: 9,
    means: 'little engineering signal yet — a scratch or scratch-shaped repo',
    dims: [0.8, 1.9, 1.2, 0.9] },
  { name: 'Kindled',   lo: 15, hi: 29,  token: '--t2', score: 24,
    means: 'working code, shipped, but no test or CI discipline behind it',
    dims: [1.9, 4.1, 3.4, 2.6] },
  { name: 'Drawn',     lo: 30, hi: 44,  token: '--t3', score: 38,
    means: 'discipline appearing — some tests, some structure',
    dims: [3.4, 5.6, 4.6, 3.9] },
  { name: 'Formed',    lo: 45, hi: 59,  token: '--t4', score: 52,
    means: 'real practice: tested, documented, maintained over time',
    dims: [5.1, 6.2, 5.8, 5.4] },
  { name: 'Marked',    lo: 60, hi: 72,  token: '--t5', score: 66,
    means: 'professional open-source standard — others could rely on this',
    dims: [7.2, 6.4, 7.1, 6.6] },
  { name: 'Sealed',    lo: 73, hi: 81,  token: '--t6', score: 76,
    means: 'a strong, well-maintained library others do rely on',
    dims: [9.1, 6.9, 8.0, 7.5] },
  { name: 'Sovereign', lo: 82, hi: 88,  token: '--t7', score: 85,
    means: 'flagship quality — among the best-run projects in its language',
    dims: [9.7, 7.6, 9.0, 8.4] },
  { name: 'Apex',      lo: 89, hi: 100, token: '--t8', score: 92,
    means: 'best-in-class. Reference-grade engineering',
    dims: [10, 8.5, 9.4, 9.1] },
]

const DIM_NAMES = ['ship', 'architecture', 'judgment', 'transmission']
const CLONE_CMD = 'git clone https://github.com/jaklabs/aura-rank && cd aura-rank'
const ANCHORS: [string, number][] = [
  ['scrapy', 88], ['flask', 87], ['fastapi', 86], ['requests', 84],
  ['express', 78], ['axios', 76], ['zod', 72], ['react-window', 55],
]

export default function RankLanding() {
  const [active, setActive] = useState(5)
  const [copyLabel, setCopyLabel] = useState('Copy')
  const cmdRef = useRef<HTMLElement>(null)
  const tier = TIERS[active]

  const copy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(CLONE_CMD)
      setCopyLabel('Copied')
    } catch {
      // Clipboard is unavailable in some embedded contexts. Selecting the text
      // still lets the reader copy it, so the control never silently does nothing.
      const node = cmdRef.current
      if (node) {
        const range = document.createRange()
        range.selectNodeContents(node)
        const sel = window.getSelection()
        sel?.removeAllRanges()
        sel?.addRange(range)
      }
      setCopyLabel('Selected')
    }
    setTimeout(() => setCopyLabel('Copy'), 1600)
  }, [])

  return (
    <div className="aura-root" style={{ ['--heat' as string]: `var(${tier.token})` }}>
      {/* ---------------- hero ---------------- */}
      <div className="hero">
        <div className="wrap">
          <span className="eyebrow">rank.jaklabs.io &nbsp;·&nbsp; open source &nbsp;·&nbsp; no dependencies</span>
          <h1>
            A developer rank that
            <br />
            <span className="g">never sees your code</span>.
          </h1>
          <p className="lede">
            One command, entirely offline. It reads your repositories and gives you a grade — and your
            source never leaves the machine, in a way you can verify before you run it.
          </p>

          <div className="card">
            <div className="top">
              <span className="dot" />
              <span className="dot" />
              <span className="dot" />
              <span className="ttl">aura scan ~/code/my-project</span>
            </div>
            <div className="cbody">
              <div>
                <span className="grade">{tier.name.toUpperCase()}</span>
                <span className="score">{tier.score} / 100</span>
              </div>
              <div className="means">{tier.means}</div>
              <div className="dims">
                {DIM_NAMES.map((d, i) => (
                  <div className="row" key={d}>
                    <span className="k">{d}</span>
                    <span className="track">
                      <span className="fill" style={{ width: `${tier.dims[i] * 10}%` }} />
                    </span>
                    <span className="v">{tier.dims[i].toFixed(1)}</span>
                  </div>
                ))}
              </div>
              <div className="foot">
                self-assessed · 4 of 8 dimensions measured · nothing left this machine
              </div>
            </div>
          </div>

          <div className="chips">
            {TIERS.map((t, i) => (
              <button
                key={t.name}
                type="button"
                className="chip"
                aria-pressed={i === active}
                onClick={() => setActive(i)}
                style={
                  i === active
                    ? { background: `var(${t.token})`, borderColor: `var(${t.token})` }
                    : undefined
                }
              >
                {t.name}
              </button>
            ))}
          </div>
          <p className="hint">Eight grades. Pick one to see what it looks like.</p>

          <div className="cmd">
            <code ref={cmdRef}>
              <span className="p">$</span> {CLONE_CMD}
            </code>
            <button type="button" onClick={copy}>
              {copyLabel}
            </button>
          </div>
          <p className="sub-cmd">
            Python 3.9+ and <code>git</code>. Nothing else — there are no dependencies, deliberately.
          </p>
        </div>
      </div>

      {/* ---------------- why ---------------- */}
      <section>
        <div className="wrap">
          <span className="eyebrow">01 — why</span>
          <h2>There&rsquo;s no signal for a developer without a logo behind them.</h2>
          <p className="sub">
            Stars measure marketing. Years measure patience. LeetCode measures LeetCode. The people who
            are actually good — running production systems alone, for real businesses, with no famous
            employer on the r&eacute;sum&eacute; — have nothing legible to point at.
          </p>
          <p className="sub tight">
            And the obvious fix is unacceptable. <strong>Nobody is uploading their private codebase to
            a website for a score.</strong> Not their client&rsquo;s code, not their startup&rsquo;s,
            not their own. Any tool that asks is dead on arrival, and deserves to be.
          </p>
        </div>
      </section>

      {/* ---------------- guarantee ---------------- */}
      <section>
        <div className="wrap">
          <span className="eyebrow">02 — the guarantee</span>
          <h2>Don&rsquo;t trust us. Grep the file.</h2>
          <p className="sub">
            The scanner imports no HTTP client and opens no socket. That isn&rsquo;t a privacy policy —
            it&rsquo;s a property of the source, and you can confirm it in one command <em>before</em>{' '}
            you ever run the thing.
          </p>

          <div className="proof">
            <span className="k">verify before you run it</span>
            <pre className="block bare">
              <b>grep -rnE &apos;requests|urllib|http|socket|subprocess|eval&apos; aura/</b>
              {'\n\n'}
              <u>the only matches are the docstrings telling you to run this command</u>
            </pre>
          </div>

          <div className="grid3" style={{ marginTop: 20 }}>
            <div className="panel">
              <h3>Numbers, not source</h3>
              <p>
                Output is integers and ratios. No source text, no file contents, no absolute paths.
                Author emails are hashed on read.
              </p>
            </div>
            <div className="panel">
              <h3>Read it first</h3>
              <p>
                <code>--print</code> shows the exact payload before you share it with anyone. Nothing
                is sent by default, or at all.
              </p>
            </div>
            <div className="panel">
              <h3>Network is a separate tool</h3>
              <p>
                Anything that touches the internet lives in a different binary. The scanner provably
                can&rsquo;t phone home.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- measures ---------------- */}
      <section>
        <div className="wrap">
          <span className="eyebrow">03 — what it measures</span>
          <h2>Four dimensions from your code. Four it refuses to guess.</h2>
          <p className="sub">
            A tool claiming to measure whether you can sit with a customer by reading your AST would be
            nonsense, and every good engineer would spot it in a second. So it doesn&rsquo;t.
          </p>

          <div className="tbl">
            <table>
              <thead>
                <tr><th>Dimension</th><th>Source</th><th>Signal</th></tr>
              </thead>
              <tbody>
                <tr><td>Ship</td><td><span className="yes">measured</span></td>
                  <td>tests, CI, release tags, tenure, project shape</td></tr>
                <tr><td>Architecture</td><td><span className="yes">measured</span></td>
                  <td>function length &amp; nesting distributions, typing (<code>: any</code> doesn&rsquo;t count)</td></tr>
                <tr><td>Judgment</td><td><span className="yes">measured</span></td>
                  <td>revisit ratio, exception precision, sustained cadence</td></tr>
                <tr><td>Transmission</td><td><span className="yes">measured</span></td>
                  <td>doc ratio, docstring coverage, contributors</td></tr>
                <tr><td>Embed</td><td><span className="no">refused</span></td>
                  <td>whether you can map a messy business isn&rsquo;t in your AST</td></tr>
                <tr><td>Fundamentals</td><td><span className="no">refused</span></td>
                  <td>a timed exercise, not a repository property</td></tr>
                <tr><td>Reach</td><td><span className="no">public</span></td>
                  <td>dependents and installs — verifiable, not local</td></tr>
                <tr><td>Renown</td><td><span className="no">public</span></td>
                  <td>public record — verifiable, not local</td></tr>
              </tbody>
            </table>
          </div>

          <div className="panel" style={{ marginTop: 20 }}>
            <span className="eyebrow" style={{ color: 'var(--heat)' }}>the load-bearing signal</span>
            <h3 style={{ fontSize: 19, margin: '9px 0 10px' }}>
              <code style={{ fontSize: 17 }}>revisit_ratio</code>
            </h3>
            <p style={{ fontSize: 17 }}>
              The share of files you touched in more than one calendar month. It separates maintained
              work from dump-and-run, it&rsquo;s invisible to anyone optimising for stars, and{' '}
              <strong>it can&rsquo;t be faked without actually doing it.</strong> Every vanity metric
              rewards volume. This one rewards coming back.
            </p>
          </div>
        </div>
      </section>

      {/* ---------------- calibration ---------------- */}
      <section>
        <div className="wrap">
          <span className="eyebrow">04 — calibration</span>
          <h2>Check it against code you already know.</h2>
          <p className="sub">
            Bands are set against 52 public repositories across Python, JavaScript and TypeScript, then{' '}
            <em>validated</em> rather than percentile-fitted. Clone any of these and run it yourself —
            you should get the same number.
          </p>
          <div className="anchors">
            {ANCHORS.map(([name, score]) => (
              <span className="anchor" key={name}>
                {name} <b>{score}</b>
              </span>
            ))}
          </div>
          <p className="sub tight" style={{ marginTop: 26 }}>
            A typical solo project lands in the <strong>15–45</strong> range. That is not an insult — it
            is what an untested, un-CI&rsquo;d, actively used codebase actually looks like, and most
            working software is exactly that.
          </p>
        </div>
      </section>

      {/* ---------------- ladder ---------------- */}
      <section>
        <div className="wrap">
          <span className="eyebrow">05 — the grades</span>
          <h2>Eight bands, each with a plain meaning.</h2>
          <p className="sub">
            No stars, no belts, no borrowed hierarchy. Every grade says what it actually describes, so a
            low one is a diagnosis rather than a scolding.
          </p>
          <div className="ladder">
            {TIERS.map((t) => (
              <div className="rung" key={t.name}>
                <span className="sw" style={{ background: `var(${t.token})` }} />
                <span className="nm">{t.name}</span>
                <span className="ds">
                  <span className="r">{t.lo}–{t.hi}</span>
                  {t.means}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- portfolio ---------------- */}
      <section>
        <div className="wrap">
          <span className="eyebrow">06 — a person, not a directory</span>
          <h2>One repo isn&rsquo;t a developer.</h2>
          <p className="sub">
            Point it at everything and it builds a profile — weighting each repository by <em>your share
            of its commits</em>, so a project you sent three patches to isn&rsquo;t counted as yours.
          </p>
          <pre className="block">
            <b>$ python3 -m aura.portfolio ~/code/*/</b>
            {`

  +--------------------------------------------------------------+
  |  AURA PORTFOLIO  ·  22 repos  ·  spec v0.7.0                 |
  +--------------------------------------------------------------+
  |  `}<i>DRAWN   39/100</i>{`                                              |
  |  from your core 15 repos (60% of your output)                |
  +--------------------------------------------------------------+
  |  ship           `}<b>###</b>{`.................  1.7                    |
  |  architecture   `}<b>###########</b>{`.........  5.4                    |
  |  judgment       `}<b>#########</b>{`...........  4.6                    |
  |  transmission   `}<b>########</b>{`............  3.9                    |
  +--------------------------------------------------------------+
  |  active 8/9 months  ·  `}<i>focus 0.069</i>{`  ·  spread 15            |
  +--------------------------------------------------------------+`}
          </pre>
          <div className="grid3" style={{ marginTop: 20 }}>
            <div className="panel">
              <h3>Not the mean</h3>
              <p>
                That punishes exploration — every scratch directory would drag you down, which is
                backwards. Your rank comes from your <strong>core body of work</strong>.
              </p>
            </div>
            <div className="panel">
              <h3>Agent commits count</h3>
              <p>
                A coding agent writes under your direction, so the work is yours. Dependency bots are
                excluded entirely — a version bump is nobody&rsquo;s craft.
              </p>
            </div>
            <div className="panel">
              <h3><code>focus</code></h3>
              <p>
                How concentrated your effort is across projects. Low means scattered. Most people find
                this one uncomfortable.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- honesty ---------------- */}
      <section>
        <div className="wrap">
          <span className="eyebrow">07 — honesty</span>
          <h2>What this isn&rsquo;t.</h2>
          <p className="sub">
            A ranking system that hides its own uncertainty deserves to be ignored. So:
          </p>
          <ul className="limits">
            <li>
              <strong>Not official, and not claiming to be.</strong> No one can declare a standard; that
              gets earned by adoption or not at all.
            </li>
            <li>
              <strong>Not verified.</strong> The scan runs on your machine and the file is yours, so
              it&rsquo;s trivially editable — every output says <em>self-assessed</em>, and always will.
            </li>
            <li>
              <strong>Not fully calibrated.</strong> 52 repositories is a small, elite sample. It anchors
              the top of the scale credibly and says less about the middle.
            </li>
            <li>
              <strong>Not a measure of you.</strong> It reads repositories. Half of what makes someone
              good — judgment under ambiguity, working with people, knowing what not to build — leaves no
              trace in a git history.
            </li>
            <li>
              <strong>Python, JavaScript and TypeScript only</strong> so far. Other languages get
              Architecture marked unmeasured rather than guessed at.
            </li>
          </ul>
          <p className="sub tight" style={{ marginTop: 28 }}>
            The scoring spec is a versioned file in the repo. When someone finds a way to game it, they
            publish it and it gets patched like a CVE. That only works in the open, which is why
            it&rsquo;s open.
          </p>
        </div>
      </section>

      {/* ---------------- run it ---------------- */}
      <section>
        <div className="wrap" style={{ textAlign: 'center' }}>
          <span className="eyebrow">08 — run it</span>
          <h2>Sixty seconds, offline, no account.</h2>
          <p className="sub center">
            Clone it, read the scanner if you want to, point it at something you&rsquo;ve built.
          </p>
          <pre className="block" style={{ textAlign: 'left', maxWidth: 620, margin: '0 auto' }}>
            {`$ git clone https://github.com/jaklabs/aura-rank
$ cd aura-rank
$ `}<b>python3 -m aura.scan ~/code/your-project</b>{`

`}<u># and when you want the whole picture</u>{`
$ `}<b>python3 -m aura.portfolio ~/code/*/</b>
          </pre>
        </div>
      </section>

      <footer>
        <div className="wrap">
          <div className="row">
            <div>
              <div className="brand">Aura</div>
              <div className="muted" style={{ marginTop: 4 }}>
                rank.jaklabs.io — a free tool from <a href="https://jaklabs.io">JAK Labs</a>
              </div>
            </div>
            <div className="muted" style={{ maxWidth: '44ch' }}>
              Open source, permissively licensed, forkable. Auditability is the whole point — a
              restrictive licence would defeat it.
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
