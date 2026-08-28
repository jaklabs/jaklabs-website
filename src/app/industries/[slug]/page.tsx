import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { INDUSTRIES, getIndustry, industrySlugs, OFFERS } from '@/lib/industries'

/**
 * One page per industry, generated from the shared taxonomy.
 *
 * Generated rather than hand-written because the *shape* is the same every time
 * — who this is for, what hurts, what I build, what it costs, the questions
 * they actually ask. The content is not: every string lives in
 * lib/industries.ts and is specific to that industry, because a page whose only
 * difference from its neighbour is the noun is a page that deserves to rank
 * nowhere.
 *
 * Only tiers 1 and 2 are in the data, so only they get built. Adding a tier-3
 * industry here means first having something true to say on it.
 *
 * The FAQ is deliberate GEO work: question-shaped headings with direct answers
 * are the shape retrieval pulls, and FAQPage structured data makes it explicit.
 */

export const dynamicParams = false

export function generateStaticParams() {
  return industrySlugs().map((slug) => ({ slug }))
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> },
): Promise<Metadata> {
  const { slug } = await params
  const ind = getIndustry(slug)
  if (!ind) return {}

  // Michigan is named in the description rather than the title: it is the
  // geography that matters for these searches, but a title that leads with it
  // reads as small when the work is not all local.
  const description = `${ind.pain} What I build for ${ind.name.toLowerCase()} businesses in `
    + `Michigan and the Midwest, and what it costs.`

  return {
    title: ind.headline,
    description,
    alternates: { canonical: `/industries/${ind.slug}` },
    openGraph: {
      type: 'website',
      url: `/industries/${ind.slug}`,
      title: `${ind.headline} | JAK Labs`,
      description,
    },
  }
}

export default async function IndustryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const ind = getIndustry(slug)
  if (!ind) notFound()

  const offer = ind.offer ? OFFERS[ind.offer] : null
  const others = INDUSTRIES.filter((i) => i.slug !== ind.slug)

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: ind.faq.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <section className="pt-32 pb-16">
        <div className="container-custom">
          <div className="max-w-3xl">
            <Link href="/industries" className="subheading mb-4 inline-block hover:text-neon-pink">
              ← Industries
            </Link>
            <h1 className="heading-xl mb-6">{ind.headline}</h1>
            <p className="text-sm text-white/40 mb-8">{ind.includes}</p>
            <p className="text-xl text-white/80">{ind.pain}</p>
          </div>
        </div>
      </section>

      {ind.proof && (
        <section className="py-12 bg-secondary/30">
          <div className="container-custom">
            <div className="max-w-3xl border-l-2 border-neon-purple pl-6">
              <p className="text-xs uppercase tracking-wide text-white/40 mb-2">
                What I can actually show you
              </p>
              <p className="text-lg text-white/80">{ind.proof}</p>
            </div>
          </div>
        </section>
      )}

      <section className="section-padding">
        <div className="container-custom">
          <h2 className="heading-lg mb-12 max-w-2xl">
            What I build for{' '}
            <span className="text-gradient-neon">{ind.name.toLowerCase()}</span>
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {ind.builds.map((b, i) => (
              <div key={b.title} className="border-t border-white/10 pt-6">
                <span className="text-sm text-neon-purple font-mono">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <h3 className="text-xl font-semibold mt-2 mb-3">{b.title}</h3>
                <p className="text-white/60 text-sm">{b.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {offer && (
        <section className="py-16 bg-secondary/30">
          <div className="container-custom">
            <div className="max-w-3xl">
              <p className="subheading mb-4">Where this usually starts</p>
              <h2 className="heading-md mb-4">
                {offer.name} — <span className="text-gradient-neon">{offer.price}</span>
              </h2>
              <p className="text-white/70 mb-8">
                Published pricing, fixed scope, and a free Operations Audit first so we both know
                whether the build is worth doing before either of us commits to it.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/contact" className="btn-primary">
                  Book the free audit
                </Link>
                <Link href={offer.href} className="btn-secondary">
                  What&apos;s included
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      <section className="section-padding">
        <div className="container-custom">
          <div className="max-w-3xl">
            <h2 className="heading-lg mb-10">Questions I get asked</h2>
            <div className="space-y-8">
              {ind.faq.map((f) => (
                <div key={f.q} className="border-t border-white/10 pt-6">
                  <h3 className="text-lg font-semibold mb-3">{f.q}</h3>
                  <p className="text-white/60">{f.a}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-secondary/30">
        <div className="container-custom">
          <p className="subheading mb-6">Not you? Try one of these</p>
          <div className="flex flex-wrap gap-3">
            {others.map((o) => (
              <Link
                key={o.slug}
                href={`/industries/${o.slug}`}
                className="rounded-full border border-white/10 px-4 py-2 text-sm text-white/60 hover:border-neon-purple/50 hover:text-white transition-colors"
              >
                {o.name}
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
