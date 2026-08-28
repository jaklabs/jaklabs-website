import type { Metadata } from 'next'
import Link from 'next/link'
import { INDUSTRIES, ALSO_SERVED, OFFERS } from '@/lib/industries'

/**
 * The industries hub.
 *
 * The footer has linked to /industries/* since before I got here and every one
 * of those links 404'd — eight dead links on every page of the site. This is
 * the page they should have pointed at.
 *
 * Ordered by tier, and the tiers are visible rather than hidden: the two with a
 * real case study lead, the five with an offer and a live target list follow,
 * and the rest are listed honestly as "I work here too" without a page
 * pretending to experience that has not happened.
 */

export const metadata: Metadata = {
  title: 'Industries I Build For',
  description:
    'Home services and trades, health and wellness, insurance and accounting, property '
    + 'management, staffing, logistics, and software teams shipping AI. What I build for each, '
    + 'and what it costs.',
  alternates: { canonical: '/industries' },
  openGraph: {
    type: 'website',
    url: '/industries',
    title: 'Industries I Build For | JAK Labs',
    description: 'What I build for each kind of business, and what it costs.',
  },
}

export default function IndustriesPage() {
  const proven = INDUSTRIES.filter((i) => i.tier === 1)
  const active = INDUSTRIES.filter((i) => i.tier === 2)

  return (
    <>
      <section className="pt-32 pb-16">
        <div className="container-custom">
          <div className="max-w-3xl">
            <p className="subheading mb-4">Industries</p>
            <h1 className="heading-xl mb-8">
              Different businesses,{' '}
              <span className="text-gradient-neon">the same three problems</span>
            </h1>
            <div className="space-y-4 text-lg text-white/70">
              <p>
                Getting work in, running the work, and getting paid. Nearly every business I build
                for is stuck on one of those three, and the reason it feels unique is that the
                paperwork around it is different every time.
              </p>
              <p>
                What actually changes by industry is which one hurts most, and what the documents
                are called. Find yours below.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Tier 1 — a case study exists. */}
      <section className="py-16 bg-secondary/30">
        <div className="container-custom">
          <p className="subheading mb-8">Where I have shipped and can show you</p>
          <div className="grid md:grid-cols-2 gap-8">
            {proven.map((ind) => (
              <Link
                key={ind.slug}
                href={`/industries/${ind.slug}`}
                className="group block rounded-2xl border border-white/10 bg-background/40 p-8 hover:border-neon-purple/50 transition-colors"
              >
                <h2 className="text-2xl font-semibold mb-3 group-hover:text-neon-purple transition-colors">
                  {ind.name}
                </h2>
                <p className="text-sm text-white/50 mb-4">{ind.includes}</p>
                <p className="text-white/70 mb-4">{ind.pain}</p>
                {ind.proof && (
                  <p className="text-sm text-neon-purple/90 border-l-2 border-neon-purple/40 pl-4">
                    {ind.proof}
                  </p>
                )}
                <span className="inline-block mt-6 text-sm text-neon-purple">
                  What I build for {ind.name.toLowerCase()} →
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Tier 2 — an offer and a list, no case study yet. */}
      <section className="section-padding">
        <div className="container-custom">
          <p className="subheading mb-2">Where the work is document-heavy</p>
          <p className="text-white/50 mb-8 max-w-2xl">
            These businesses all share one shape: a queue of documents or enquiries that a person
            currently reads one at a time.
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {active.map((ind) => (
              <Link
                key={ind.slug}
                href={`/industries/${ind.slug}`}
                className="group block rounded-xl border border-white/10 p-6 hover:border-neon-purple/50 transition-colors"
              >
                <h3 className="font-semibold mb-2 group-hover:text-neon-purple transition-colors">
                  {ind.name}
                </h3>
                <p className="text-xs text-white/40 mb-3">{ind.includes}</p>
                <p className="text-sm text-white/60">{ind.pain}</p>
                {ind.offer && (
                  <p className="mt-4 text-xs text-white/40">
                    {OFFERS[ind.offer].name} · {OFFERS[ind.offer].price}
                  </p>
                )}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Everything else, said honestly rather than given a thin page. */}
      <section className="py-16 bg-secondary/30">
        <div className="container-custom">
          <div className="max-w-3xl">
            <h2 className="heading-md mb-4">And the ones without a page yet</h2>
            <p className="text-white/70 mb-6">
              I build for these too. They do not have their own page because I would rather not
              write one that implies experience I have not had — the three problems are the same,
              so the conversation is worth having anyway.
            </p>
            <div className="flex flex-wrap gap-3">
              {ALSO_SERVED.map((name) => (
                <span
                  key={name}
                  className="rounded-full border border-white/10 px-4 py-2 text-sm text-white/60"
                >
                  {name}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-custom">
          <div className="max-w-2xl">
            <h2 className="heading-lg mb-6">
              Not sure which one <span className="text-gradient-neon">you are</span>?
            </h2>
            <p className="text-white/70 mb-8">
              Run the free website audit. It takes about a minute, works for any kind of business,
              and tells you what a customer on a phone actually experiences — which is usually
              where the conversation should start.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/website-audit" className="btn-primary">
                Run the free audit
              </Link>
              <Link href="/services" className="btn-secondary">
                See pricing
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
