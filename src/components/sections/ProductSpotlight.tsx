'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'

/**
 * A product spotlight on the homepage — one shared component, mirrored.
 *
 * WHY ONE COMPONENT AND NOT TWO
 *
 * Hood Dev sits left, Verdikt sits right. Mirroring is the entire visual idea:
 * two things that are peers, alternating down the page so neither reads as the
 * main event. Built as two files they would drift the first time either was
 * touched — one would gain a row the other lacked, and the mirror would break in
 * a way nobody notices until it looks wrong. `side` makes the symmetry a
 * property rather than a convention someone has to maintain.
 *
 * WHY THE SPEC CARD IS FACTS AND NOT ADJECTIVES
 *
 * The old section sold Hood Dev with "assesses you first, builds a track around
 * that" — true, and indistinguishable from what every competitor claims. Four
 * concrete rows do more work than a paragraph, and they are cheap to verify,
 * which is the point. Every figure here is checked:
 *
 *   Hood Dev  7 phases · 9 leaks · 23 modules / ~188h .. ~/claude-server/hood-dev
 *             (ASSESSMENT-ENGINE.md, content/modules/README.md)
 *   Verdikt   12 connectors · 30-trade gate · 10,000 resamples · 95% CI
 *             (trademaster-gamified: brokers/connectors/, edge-engine/constants.ts)
 *
 * ⚠️ Do not add a row here without checking it in the source repo. A homepage is
 * the highest-traffic surface on the site and the easiest place for a number
 * nobody re-derived to become permanent.
 *
 * PLACEMENT: both sit AFTER the CTA that asks a business owner to book an audit.
 * The homepage has one job — convert a local business owner — and these speak to
 * a developer and a trader respectively. Above the booking CTA they would
 * interrupt the buying path with an offer the reader cannot use. Below it they
 * cost the primary conversion nothing.
 */

export type SpotlightSpec = { label: string; value: string }

export interface ProductSpotlightProps {
  /** Which edge the column hugs. Alternates down the page. */
  side: 'left' | 'right'
  eyebrow: string
  icon: React.ReactNode
  /** Rendered before the gradient fragment. */
  title: string
  titleAccent: string
  body: string[]
  spec: SpotlightSpec[]
  /** The detail page on this site — always the primary action. */
  detailHref: string
  detailLabel: string
  /** The product itself, off-site. */
  appHref: string
  appLabel: string
  footnote: string
  /** CSS colour for the accent: purple for the school, cyan for the app. */
  accent: string
  /** Gradient class for the heading fragment, from the site's own palette. */
  accentGradient: string
}

export function ProductSpotlight({
  side,
  eyebrow,
  icon,
  title,
  titleAccent,
  body,
  spec,
  detailHref,
  detailLabel,
  appHref,
  appLabel,
  footnote,
  accent,
  accentGradient,
}: ProductSpotlightProps) {
  const right = side === 'right'

  return (
    <section className="py-20 border-t border-white/10">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className={`max-w-4xl ${right ? 'ml-auto' : ''}`}
        >
          <div className={`flex items-center gap-3 mb-4 ${right ? 'lg:justify-end' : ''}`}>
            <div
              className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
              style={{ backgroundColor: `${accent}1a` }}
            >
              {icon}
            </div>
            <p className="subheading">{eyebrow}</p>
          </div>

          <h2 className={`heading-lg mb-6 ${right ? 'lg:text-right' : ''}`}>
            {title} <span className={accentGradient}>{titleAccent}</span>
          </h2>

          {/* On the mirrored side the prose and the spec card swap places, so the
              spec card always sits against the outer edge of the page. */}
          <div
            className={`grid lg:grid-cols-2 gap-10 items-start ${
              right ? 'lg:[&>*:first-child]:order-2' : ''
            }`}
          >
            <div className={`space-y-4 text-white/70 ${right ? 'lg:text-right' : ''}`}>
              {body.map((p, i) => (
                <p key={i} className={i === body.length - 1 ? 'text-white/50 text-sm' : undefined}>
                  {p}
                </p>
              ))}

              <div className={`flex flex-wrap gap-4 pt-2 ${right ? 'lg:justify-end' : ''}`}>
                <Link href={detailHref} className="btn-primary group">
                  {detailLabel}
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <a
                  href={appHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-secondary"
                >
                  {appLabel}
                </a>
              </div>
              <p className={`text-xs text-white/40 ${right ? 'lg:text-right' : ''}`}>{footnote}</p>
            </div>

            {/* Four rows of checkable facts. Deliberately monospaced and
                unstyled-looking — it should read as a spec sheet, not a feature
                list, because that is what makes it believable. */}
            <div className="rounded-xl border border-white/10 bg-secondary-dark p-5 sm:p-6">
              <div
                className="font-mono text-[11px] uppercase tracking-[0.16em] mb-4"
                style={{ color: accent }}
              >
                At a glance
              </div>
              <dl className="space-y-3">
                {spec.map((s) => (
                  <div
                    key={s.label}
                    className="grid grid-cols-[6.5rem_1fr] gap-3 border-b border-white/5 pb-3 last:border-0 last:pb-0"
                  >
                    <dt className="font-mono text-xs text-white/40 pt-0.5">{s.label}</dt>
                    <dd className="text-sm text-white/80">{s.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
