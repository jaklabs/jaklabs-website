import type { Metadata } from 'next'
import Link from 'next/link'
import AuditTool from './AuditTool'

/**
 * The free website audit — the one page that reaches every kind of local
 * business, because the checks behind it are industry-agnostic.
 *
 * A server component wrapping a client tool: the copy, metadata and structured
 * data are in the HTML for crawlers and answer engines, and only the form is
 * interactive. The FAQ block is deliberate GEO work — question-shaped headings
 * with direct answers are what retrieval pulls.
 */

export const metadata: Metadata = {
  title: 'Free Website Audit for Michigan Businesses | JAK Labs',
  description:
    'Check your website the way a customer on a phone would. Seven checks, real answers, '
    + 'no signup — built by JD Kemp after auditing 456 Michigan business sites.',
  alternates: { canonical: '/website-audit' },
  openGraph: {
    type: 'website',
    url: '/website-audit',
    title: 'Free Website Audit for Michigan Businesses',
    description: 'Seven checks, run on your homepage at phone width. Free, no signup.',
  },
}

const FAQ = [
  {
    q: 'What does the free website audit check?',
    a: 'Seven things a visitor on a phone would run into: JavaScript errors on the homepage, '
      + 'whether your phone number is tappable, how long the page takes to load on mobile, '
      + 'whether the page scrolls sideways, whether there is an obvious way to book or get in '
      + 'touch, whether the site is on HTTPS, and whether it is built for phones at all.',
  },
  {
    q: 'Is it really free, and do I need to give you my email?',
    a: 'It is free and there is no signup. You get the full result on the page, including how '
      + 'to fix each problem. I would rather you see something true about your own business '
      + 'than fill in a form.',
  },
  {
    q: 'How long does it take?',
    a: 'About 30 seconds. Your homepage is loaded once at phone width, with no login and no '
      + 'interaction, and what breaks is recorded.',
  },
  {
    q: 'What is the most common problem on small business websites?',
    a: 'A JavaScript error on the homepage. Across 456 Michigan business websites I audited in '
      + 'August 2026, 47% had one. It is invisible to the owner — the page looks fine — but the '
      + 'thing erroring is often a booking widget or a contact form quietly failing.',
  },
  {
    q: 'Does this work for any kind of business?',
    a: 'Yes. Six of the seven checks are identical whether you run a plumbing company, a dental '
      + 'practice, a restaurant or a med spa. The seventh looks for a way to book or make '
      + 'contact, which every service business needs.',
  },
  {
    q: 'What happens after the audit?',
    a: 'Nothing automatic. You get the results and the fixes. If you want someone to look at the '
      + 'parts a tool cannot check — whether your booking flow completes, whether enquiries '
      + 'reach you, where customers give up — that is the free 30-minute Operations Audit.',
  },
]

export default function WebsiteAuditPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            {
              '@context': 'https://schema.org',
              '@type': 'WebApplication',
              name: 'JAK Labs Free Website Audit',
              url: 'https://jaklabs.io/website-audit',
              applicationCategory: 'BusinessApplication',
              operatingSystem: 'Any',
              offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
              description:
                'Free website audit for local service businesses. Seven checks run on your '
                + 'homepage at phone width.',
              provider: { '@type': 'Organization', name: 'JAK Labs', url: 'https://jaklabs.io' },
            },
            // FAQPage is the highest-leverage schema for GEO: an answer engine
            // asked one of these questions gets a matching question and a
            // written answer, rather than having to infer either.
            {
              '@context': 'https://schema.org',
              '@type': 'FAQPage',
              mainEntity: FAQ.map(({ q, a }) => ({
                '@type': 'Question',
                name: q,
                acceptedAnswer: { '@type': 'Answer', text: a },
              })),
            },
          ]),
        }}
      />

      <section className="relative px-6 pt-32 pb-20">
        <div className="mx-auto max-w-4xl text-center">
          <span className="inline-block rounded-full border border-purple-400/30 bg-purple-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-purple-300">
            Free · No signup
          </span>
          <h1 className="mt-6 text-4xl font-bold leading-tight text-white md:text-6xl">
            See your website the way{' '}
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              a customer on a phone
            </span>{' '}
            does
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-white/60">
            I audited 456 Michigan business websites. Nearly half had a JavaScript error on the
            homepage and a third had a phone number you could not tap. This runs the same seven
            checks on yours, right now.
          </p>
        </div>

        <div className="mt-12">
          <AuditTool />
        </div>
      </section>

      <section className="border-t border-white/10 px-6 py-20">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-2xl font-bold text-white">What it checks, and why each one matters</h2>
          <div className="mt-8 space-y-6">
            {[
              ['JavaScript errors on the homepage',
               'The most common fault by a distance — 47% of the Michigan sites I checked. Invisible to the owner, because the page looks fine. What is usually erroring is a booking widget or a contact form.'],
              ['A phone number you can tap',
               'A third of sites show the number as plain text. On a phone that means memorising ten digits and switching apps. For a business that lives on calls, it is the cheapest fix there is.'],
              ['Load time on a phone connection',
               'Not your office wifi. Most slowness is images that were never resized — a photo straight off a camera is often twenty times bigger than the page needs.'],
              ['Sideways scroll',
               'One element wider than the screen drags the whole page with it. It reads as broken, and people leave pages that feel broken.'],
              ['An obvious way to book or get in touch',
               'Visitors decide in seconds. If it takes more than one obvious tap from the top of the page, most will not go looking.'],
              ['HTTPS',
               'Without it Chrome tells every visitor your site is not secure before they read a word. Certificates are free.'],
              ['Built for phones at all',
               'The rarest fault and the worst one — the page loads at desktop width and has to be pinched and zoomed.'],
            ].map(([title, body]) => (
              <div key={title} className="border-l-2 border-purple-400/30 pl-5">
                <h3 className="font-semibold text-white">{title}</h3>
                <p className="mt-1 text-white/55">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-white/10 px-6 py-20">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-2xl font-bold text-white">Questions</h2>
          <dl className="mt-8 space-y-8">
            {FAQ.map(({ q, a }) => (
              <div key={q}>
                <dt className="font-semibold text-white">{q}</dt>
                <dd className="mt-2 text-white/55">{a}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-12 text-white/55">
            The numbers here come from a survey of 501 Michigan businesses in August 2026, 456 of
            which had a reachable website.{' '}
            <Link href="/blog/what-i-found-auditing-456-michigan-wellness-websites"
              className="text-purple-300 underline">
              The full results are on the blog
            </Link>.
          </p>
        </div>
      </section>
    </>
  )
}
