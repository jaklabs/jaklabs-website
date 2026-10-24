'use client'

import { useState } from 'react'

/**
 * The meter — what per-tech pricing costs you to hire.
 *
 * ⚠️ THE RULE THIS COMPONENT EXISTS TO OBEY
 *
 * It must never state, imply or pre-fill what any named competitor charges.
 * ServiceTitan does not publish pricing, so any figure here would have no
 * checkable source, and a specific invented price against a named competitor is
 * the one claim on this site that could actually draw a letter. The same number
 * ("~$245 / tech / month") was pulled out of /ops-platform for exactly this
 * reason — see the header note on that page. Do not reintroduce it here in a
 * default value, a placeholder, a preset button or an example.
 *
 * So the reader supplies the rate off their own invoice. That is not a
 * workaround; it is the better version of the argument. A number the reader
 * typed from their own bill is one they cannot dispute, and "go and look at what
 * you actually pay per tech" is a more persuasive instruction than any figure I
 * could put on the page.
 *
 * WHY THERE IS NO PRICE ON THE FLAT SIDE
 *
 * D4 (plans and prices) is open in master-crm/PLATFORM-PROJECT-MANAGEMENT.md,
 * and the recommendation on record is explicit that the tiers get tested on
 * founding shops BEFORE being published. A price rendered here would close that
 * decision by accident, and a published price is hard to raise. So the flat side
 * shows the SHAPE — a bar that does not move when the slider does — which is the
 * whole claim and needs no number to land.
 *
 * Nothing is transmitted. No endpoint, no key, no request: the arithmetic runs
 * in the reader's browser.
 */

const MAX_TECHS = 20

// Formats whole dollars. Intl rather than toFixed, so thousands separate.
const usd = (n: number) =>
  n.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })

export default function BallastMeter() {
  // Deliberately empty, NOT a plausible default. See the header note: a
  // pre-filled rate would read as "this is what field service software costs",
  // which is precisely the claim this component may not make.
  const [rate, setRate] = useState('')
  const [techs, setTechs] = useState(4)

  const parsed = Number.parseFloat(rate)
  // A rate is usable only if it is a positive finite number. An empty box, a
  // stray minus sign and "abc" all have to land in the same place — unanswered —
  // rather than producing a $0 bill that reads like a finding.
  const hasRate = Number.isFinite(parsed) && parsed > 0

  const perYearNow = hasRate ? parsed * techs * 12 : null
  const perYearMax = hasRate ? parsed * MAX_TECHS * 12 : null
  const nextThree = hasRate ? parsed * 3 * 12 : null

  // The metered bar is scaled against this shop's own bill at a full crew, so
  // the bar is always meaningful regardless of the rate typed in.
  const meterPct = (techs / MAX_TECHS) * 100

  return (
    <div className="bl-panel overflow-hidden">
      <div
        className="flex flex-wrap items-center gap-3 border-b px-5 py-3.5 bl-panel-2"
        style={{ borderColor: 'var(--bl-line)' }}
      >
        <span className="bl-mono text-[11px] font-medium uppercase tracking-[0.16em] bl-level">
          The meter
        </span>
        <span className="bl-mono bl-faint ml-auto text-[11px]">
          runs in your browser · nothing is sent
        </span>
      </div>

      <div className="p-5 md:p-7">
        <div className="grid gap-6 md:grid-cols-2">
          {/* Their rate, off their own invoice. */}
          <div>
            <label htmlFor="bl-rate" className="block text-sm font-semibold bl-ink">
              What you pay per tech, per month
            </label>
            <p className="mt-1 text-[13px] leading-relaxed bl-faint">
              Your number, off your own invoice. I&rsquo;m not quoting anyone else&rsquo;s price.
            </p>
            <div
              className="mt-3 flex items-center gap-2 rounded-lg border px-3 py-2.5"
              style={{ borderColor: 'var(--bl-line)', background: 'var(--bl-panel-2)' }}
            >
              <span className="bl-mono text-base bl-faint">$</span>
              <input
                id="bl-rate"
                type="number"
                inputMode="decimal"
                min={0}
                step={1}
                value={rate}
                onChange={(e) => setRate(e.target.value)}
                placeholder="—"
                aria-describedby="bl-rate-help"
                className="bl-num w-full bg-transparent text-base outline-none placeholder:opacity-40"
                style={{ color: 'var(--bl-ink)' }}
              />
              <span className="bl-mono whitespace-nowrap text-[12px] bl-faint">/ tech / mo</span>
            </div>
            <p id="bl-rate-help" className="sr-only">
              Enter the monthly amount you pay per technician for your current software.
            </p>
          </div>

          {/* Headcount. */}
          <div>
            <label htmlFor="bl-techs" className="block text-sm font-semibold bl-ink">
              Techs in the field
            </label>
            <p className="mt-1 text-[13px] leading-relaxed bl-faint">
              Drag it up. Watch which bar moves.
            </p>
            <div className="mt-3 flex items-center gap-4">
              <input
                id="bl-techs"
                type="range"
                min={1}
                max={MAX_TECHS}
                step={1}
                value={techs}
                onChange={(e) => setTechs(Number(e.target.value))}
                className="w-full"
                style={{ accentColor: 'var(--bl-level)' }}
              />
              <span className="bl-num min-w-[2.5rem] text-right text-lg">{techs}</span>
            </div>
          </div>
        </div>

        {/* The two bars. This is the argument. */}
        <div className="mt-8 space-y-5">
          <div>
            <div className="mb-2 flex items-baseline justify-between gap-3">
              <span className="bl-mono text-[12px] uppercase tracking-[0.1em] bl-warn">
                Priced per tech
              </span>
              <span className="bl-num text-sm">
                {perYearNow === null ? (
                  <span className="bl-faint">enter your rate</span>
                ) : (
                  <>{usd(perYearNow)} / yr</>
                )}
              </span>
            </div>
            <div
              className="h-2.5 w-full overflow-hidden rounded-full"
              style={{ background: 'var(--bl-panel-2)' }}
            >
              <div
                className="h-full rounded-full"
                style={{
                  width: `${meterPct}%`,
                  background: 'linear-gradient(90deg, var(--bl-warn), #f0a868)',
                  transition: 'width 0.28s ease',
                }}
              />
            </div>
          </div>

          <div>
            <div className="mb-2 flex items-baseline justify-between gap-3">
              <span className="bl-mono text-[12px] uppercase tracking-[0.1em] bl-level">
                Priced per shop — Ballast
              </span>
              <span className="bl-num text-sm bl-faint">same at {techs} as at 1</span>
            </div>
            <div
              className="h-2.5 w-full overflow-hidden rounded-full"
              style={{ background: 'var(--bl-panel-2)' }}
            >
              {/* Fixed width on purpose. The slider must not move this bar. */}
              <div
                className="h-full rounded-full"
                style={{ width: '22%', background: 'var(--bl-level)' }}
              />
            </div>
          </div>
        </div>

        {/* The finding, in their own numbers. */}
        <div
          className="mt-7 rounded-lg border p-4 md:p-5"
          style={{ borderColor: 'var(--bl-line)', background: 'var(--bl-level-ghost)' }}
        >
          {nextThree === null ? (
            <p className="text-[14px] leading-relaxed">
              Put your per-tech rate in and this will tell you what your next three hires cost
              you in software before anyone swings a hammer.
            </p>
          ) : (
            <div className="space-y-2 text-[14px] leading-relaxed">
              <p>
                Hiring three more techs adds{' '}
                <strong className="bl-num bl-ink">{usd(nextThree)}</strong> a year to your software
                bill. Not to payroll — to <em>software</em>, before anyone swings a hammer.
              </p>
              <p>
                At a full crew of {MAX_TECHS} you&rsquo;d be paying{' '}
                <strong className="bl-num bl-ink">{usd(perYearMax as number)}</strong> a year for
                the same software you&rsquo;re using today.
              </p>
              <p className="bl-faint">
                That is the part worth noticing: per-tech pricing makes growing the crew a
                software decision. Priced per shop, it isn&rsquo;t one.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
