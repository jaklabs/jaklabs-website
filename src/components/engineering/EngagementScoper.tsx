'use client'

import { useState } from 'react'

/**
 * The engagement scoper.
 *
 * Four questions, then a real engagement brief the reader can forward to
 * whoever signs off.
 *
 * WHY THERE IS NO MODEL BEHIND IT
 *
 * The same four answers always produce the same brief. That is not a shortcut —
 * it is the page's own argument applied to the page itself. Two sections below,
 * this page claims that ranking in the prospecting pipeline "runs in code with no
 * model call, so the same input produces the same output", and that an LLM
 * verdict cannot be audited after the fact. A scoping tool on the same page that
 * quietly called a model would refute the paragraph next to it.
 *
 * It also means nothing is transmitted. There is no endpoint, no key, no request:
 * the reader taps four buttons in their own browser and gets a brief. The only
 * network action available is a mailto they choose to open, pre-filled and
 * editable, which is why the copy can promise that plainly.
 *
 * WHY IT CAN SAY NO
 *
 * Two answers — ongoing headcount, or six-months-continuous — produce a
 * "probably not me" verdict rather than a fit. A qualifier that qualifies
 * everybody is a lead form with extra steps, and the reader knows it. Refusing
 * two of the paths is what makes the other verdicts worth reading, and it is the
 * same position the CTA already takes in prose ("if I am not the right person I
 * will say so"). Do not soften those two into a maybe.
 */

type Key = 'situation' | 'domain' | 'timeline' | 'worry'

const QUESTIONS: { key: Key; n: string; label: string; opts: { v: string; t: string }[] }[] = [
  {
    key: 'situation',
    n: '01',
    label: 'What’s actually stuck?',
    opts: [
      { v: 'stalled', t: 'A customer deployment has stalled' },
      { v: 'data', t: 'Their data is a mess and we can’t ingest it' },
      { v: 'proto', t: 'A prototype has to close a specific deal' },
      { v: 'integration', t: 'An integration nobody owns' },
      { v: 'ai', t: 'An AI feature isn’t reliable enough to ship' },
      { v: 'team', t: 'We need ongoing headcount' },
    ],
  },
  {
    key: 'domain',
    n: '02',
    label: 'Whose world is it?',
    opts: [
      { v: 'trades', t: 'Trades & home services' },
      { v: 'clinics', t: 'Clinics & wellness' },
      { v: 'local', t: 'Other local services' },
      { v: 'b2b', t: 'A different vertical' },
      { v: 'internal', t: 'Internal — no external customer' },
    ],
  },
  {
    key: 'timeline',
    n: '03',
    label: 'Over what window?',
    opts: [
      { v: 'weeks', t: 'Two to eight weeks' },
      { v: 'quarter', t: 'About a quarter' },
      { v: 'ongoing', t: 'Six months or more, continuous' },
    ],
  },
  {
    key: 'worry',
    n: '04',
    label: 'What worries you most about bringing someone in?',
    opts: [
      { v: 'domain', t: 'They’ll never learn our customer’s world' },
      { v: 'handover', t: 'We’ll be left with something only they can run' },
      { v: 'stakeholders', t: 'They can’t talk to non-engineers' },
      { v: 'security', t: 'They’ll be loose in our environment' },
    ],
  },
]

const SITUATION: Record<string, { label: string; w1: string; wk: string }> = {
  stalled: {
    label: 'a customer deployment that has stalled',
    w1:
      'Week one is diagnosis, not code. I sit with whoever owns the account, read the deployment '
      + 'as it actually is rather than as the runbook describes it, and come back with the two or '
      + 'three real reasons it is stuck — which in my experience is rarely the thing everyone is '
      + 'currently arguing about.',
    wk:
      'Then I unblock the largest one and ship it into their environment, with the second-largest '
      + 'scoped in writing so you can decide whether it is worth a second stretch.',
  },
  data: {
    label: 'customer data the product cannot ingest',
    w1:
      'Week one I take a real extract — not a sample, the actual mess — and characterise it: what '
      + 'is malformed, what is inconsistently keyed, what is duplicated, and which of those the '
      + 'product genuinely has to tolerate versus what the customer should fix at source.',
    wk:
      'Then I build the pipeline that normalises it, idempotent so a re-run is safe, with the '
      + 'rejects surfaced rather than silently dropped. Silent dropping is how ingestion bugs '
      + 'survive for months.',
  },
  proto: {
    label: 'a prototype that has to close a specific deal',
    w1:
      'Week one is finding out what the prospect actually needs to see to sign, which is usually '
      + 'narrower and stranger than the brief suggests, and cutting everything that does not serve '
      + 'it.',
    wk:
      'Then I build that, on their real data if we can get it, because a prototype that only works '
      + 'on clean input is the thing that loses deals in the room.',
  },
  integration: {
    label: 'an integration nobody owns',
    w1:
      'Week one I map the actual contract — what the other side really returns, including the '
      + 'undocumented cases and the ways it fails — rather than what its documentation claims.',
    wk:
      'Then I build it behind a typed boundary so the vendor can be swapped without touching '
      + 'anything downstream, with the failure modes handled explicitly instead of discovered in '
      + 'production.',
  },
  ai: {
    label: 'an AI feature that is not reliable enough to ship',
    w1:
      'Week one is building the evaluation layer, not tuning prompts. Until you can measure '
      + 'whether an answer is good enough to show a customer, every change is a guess and no one '
      + 'can tell you whether it improved anything.',
    wk:
      'Then I fix what the evals expose, and put a gate in front of the feature so a wrong answer '
      + 'is caught before a customer sees it rather than after.',
  },
}

const DOMAIN: Record<string, { t: string; d: string }> = {
  trades: {
    t: 'Strong domain match.',
    d:
      'I own a home-services company and operate the software that runs it. I have quoted the job, '
      + 'chased the invoice, and lost a customer to a booking form that did not work — this year, '
      + 'with my own money on the line. I will not need your team to explain what a work order is.',
  },
  clinics: {
    t: 'Good domain match.',
    d:
      'I built and own a multi-tenant clinical platform — storefront, patient portal, clinic CRM, '
      + 'webhook ingest — so the shape of the problem is familiar. Stated plainly: it has no live '
      + 'client, and I will not imply otherwise.',
  },
  local: {
    t: 'Strong domain match.',
    d:
      'Local services is the world I sell into and operate in. The gap between how these businesses '
      + 'are assumed to work and how they actually work is the thing that sinks deployments, and I '
      + 'have been on the wrong side of it as the owner.',
  },
  b2b: {
    t: 'No domain advantage — judge me on the artifacts.',
    d:
      'I have no special knowledge of your vertical and will not pretend otherwise. What transfers '
      + 'is the method: learn the customer’s real workflow fast, ship onto their real data, and '
      + 'leave something their team can operate. Weigh the code below more heavily than the '
      + 'biography.',
  },
  internal: {
    t: 'Worth a conversation, but I am not the obvious hire.',
    d:
      'My edge is being the customer — and on internal tooling there is no external customer for '
      + 'that to matter with. I can still do the work, but you are paying for something you may not '
      + 'need. Say so on the call and I will tell you honestly whether it is worth it.',
  },
}

const WORRY: Record<string, { t: string; d: string }> = {
  domain: {
    t: 'On learning the customer’s world',
    d:
      'This is the one I am least worried about and the reason to pick me over a stronger pure '
      + 'engineer. I have run the operations job we are building for.',
  },
  handover: {
    t: 'On handover',
    d:
      'Everything is documented as it is built, and the test I hold myself to is whether one of '
      + 'your engineers can operate it after I leave without calling me. An embedded engineer who '
      + 'leaves behind something only they can run has made the problem worse.',
  },
  stakeholders: {
    t: 'On non-engineers',
    d:
      'Half of this job is sitting with an operations manager working out what they actually do all '
      + 'day. I have been the operations manager, and I do not condescend to them.',
  },
  security: {
    t: 'On being loose in your environment',
    d:
      'Fair, and it should be the default posture. The audit endpoint on my site is '
      + 'unauthenticated, public, and points headless Chromium at whatever a stranger types — so it '
      + 'refuses link-local metadata, private ranges, embedded credentials and non-HTTP schemes, '
      + 'and resolves DNS before fetching. 36 tests against that boundary. Read that one first.',
  },
}

const ARTIFACT: Record<string, string> = {
  security: 'The website-audit SSRF boundary — jaklabs.io/website-audit',
  data: 'The prospecting pipeline — github.com/jaklabs/web-browse',
  integration: 'The prospecting pipeline — github.com/jaklabs/web-browse',
  ai: 'The prospecting pipeline’s no-model ranking — github.com/jaklabs/web-browse',
  handover: 'The multi-tenant clinical platform’s adapter boundary — source on request',
  stalled: 'The Haslett operations CRM — jaklabs.io/blog/the-software-that-runs-my-handyman-company',
  proto: 'The Haslett operations CRM — jaklabs.io/blog/the-software-that-runs-my-handyman-company',
  domain: 'The Haslett operations CRM — jaklabs.io/blog/the-software-that-runs-my-handyman-company',
  stakeholders: 'The Haslett operations CRM — jaklabs.io/blog/the-software-that-runs-my-handyman-company',
}

type Block = { title: string; body: string; warn?: boolean }

function buildBrief(s: Record<string, string>) {
  const notFit = s.situation === 'team' || s.timeline === 'ongoing'

  if (notFit) {
    const reason =
      s.situation === 'team'
        ? 'You described ongoing headcount rather than a scoped engagement. I am one engineer '
          + 'taking defined stretches against named outcomes; hiring me as a substitute for a role '
          + 'you actually need filled would leave you with the same gap in six months, plus a '
          + 'dependency.'
        : 'Six months of continuous work is a role, not an engagement. I work in weeks against a '
          + 'named outcome, and I would rather tell you that now than discover it together in '
          + 'month four.'
    const blocks: Block[] = [
      { title: 'Why I said no', body: reason, warn: true },
      {
        title: 'What I would do instead',
        body:
          'If there is a sharp, bounded piece inside the larger need — the integration, the '
          + 'migration, the prototype that unlocks the decision — that piece is worth a '
          + 'conversation on its own. Send it and I will tell you whether it stands alone.',
      },
      {
        title: 'Still worth one email',
        body:
          'If you think I have read this wrong, say so. It costs you one email and I will give you '
          + 'a straight answer.',
      },
    ]
    return {
      fit: false,
      head: 'This is the honest answer, not a negotiating position.',
      blocks,
      subject: 'FDE engagement — think this might not be a fit, second opinion?',
    }
  }

  const sit = SITUATION[s.situation]
  const dom = DOMAIN[s.domain]
  const wor = WORRY[s.worry]
  const win =
    s.timeline === 'weeks'
      ? 'Two to eight weeks is exactly the shape this works in: one named outcome, scoped in '
        + 'writing, with a go/no-go at the end of week one.'
      : 'A quarter works, run as two or three scoped stretches rather than one long open-ended '
        + 'one, so there is a real decision point between them instead of momentum carrying it.'

  const blocks: Block[] = [
    { title: 'Week one', body: sit.w1 },
    { title: 'The stretch after that', body: sit.wk },
    { title: 'The window', body: win },
    { title: dom.t, body: dom.d },
    { title: wor.t, body: wor.d },
    {
      title: 'Read this one first',
      body: ARTIFACT[s.worry] || ARTIFACT[s.situation] || ARTIFACT.domain,
    },
    {
      title: 'What I would need from you',
      body:
        'One person who genuinely knows the customer’s workflow and can answer questions in the '
        + 'same week I ask them, access to real data early rather than at the end, and a named '
        + 'outcome we both agree counts as done.',
    },
  ]
  return {
    fit: true,
    head: `An engagement on ${sit.label}.`,
    blocks,
    subject: `FDE engagement — ${sit.label}`,
  }
}

export function EngagementScoper() {
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const done = QUESTIONS.every((q) => answers[q.key])
  const brief = done ? buildBrief(answers) : null

  const mailto = brief
    ? 'mailto:jdakemp@gmail.com?subject='
      + encodeURIComponent(brief.subject)
      + '&body='
      + encodeURIComponent(
        'Hi JD,\n\nI scoped this on your site and it came out as follows.\n\n'
        + `${brief.fit ? 'VERDICT: a fit' : 'VERDICT: probably not a fit'}\n\n`
        + `${brief.head}\n\n`
        + brief.blocks.map((b) => `${b.title.toUpperCase()}\n${b.body}`).join('\n\n')
        + '\n\n---\nHere is what I would add about our situation:\n\n',
      )
    : '#'

  return (
    <div className="rounded-2xl border border-white/10 bg-secondary-dark overflow-hidden">
      <div className="border-b border-white/10 bg-gradient-to-b from-primary/[0.09] to-transparent px-6 py-5">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-primary-light">
          Engagement scoper
        </p>
      </div>

      <div className="p-6 sm:p-7">
        {QUESTIONS.map((q) => (
          <fieldset key={q.key} className="mb-7 last:mb-0">
            <legend className="mb-3 block font-mono text-[11px] uppercase tracking-[0.15em] text-white/40">
              {q.n} — {q.label}
            </legend>
            <div className="flex flex-wrap gap-2">
              {q.opts.map((o) => {
                const on = answers[q.key] === o.v
                return (
                  <button
                    key={o.v}
                    type="button"
                    aria-pressed={on}
                    onClick={() => setAnswers((a) => ({ ...a, [q.key]: o.v }))}
                    className={`rounded-lg border px-4 py-2.5 text-sm text-left transition-colors ${
                      on
                        ? 'border-primary bg-primary/15 text-white font-medium'
                        : 'border-white/10 bg-secondary text-white/70 hover:border-primary-dark hover:text-white'
                    }`}
                  >
                    {o.t}
                  </button>
                )
              })}
            </div>
          </fieldset>
        ))}

        {brief && (
          <div className="mt-8 border-t border-white/10 pt-7">
            <p
              className={`mb-4 flex items-center gap-2.5 font-mono text-xs uppercase tracking-[0.14em] ${
                brief.fit ? 'text-emerald-400' : 'text-accent-coral'
              }`}
            >
              <span className="h-2 w-2 rounded-full bg-current" />
              {brief.fit ? 'This is the shape I work in' : 'Probably not me — and here is why'}
            </p>
            <h3 className="mb-5 text-xl font-semibold text-white">{brief.head}</h3>

            <div className="space-y-5">
              {brief.blocks.map((b) => (
                <div
                  key={b.title}
                  className={`border-l-2 pl-4 ${b.warn ? 'border-accent-coral' : 'border-primary-dark'}`}
                >
                  <p
                    className={`mb-1 font-mono text-[11px] uppercase tracking-[0.14em] ${
                      b.warn ? 'text-accent-coral' : 'text-primary-light'
                    }`}
                  >
                    {b.title}
                  </p>
                  <p className="text-sm text-white/70">{b.body}</p>
                </div>
              ))}
            </div>

            <div className="mt-7 flex flex-wrap gap-3">
              <a href={mailto} className="btn-primary">
                Send this as the email
              </a>
            </div>
            <p className="mt-4 text-xs text-white/40">
              The email opens in your own mail client, pre-filled and editable. Nothing was sent
              while you were tapping.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
