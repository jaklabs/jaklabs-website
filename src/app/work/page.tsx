import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { social } from '@/lib/social'

/**
 * Work — the sites and systems I have actually built and still run.
 *
 * ⚠️⚠️ THIS IS NOT A CLIENT PAGE, AND IT MUST NEVER BECOME ONE.
 *
 * JAK Labs has zero active clients and zero booked revenue. The "first paying
 * client 2026-08-12" claim was never true and was retired on 2026-09-07; the one
 * deal that got close (Becoming Wellness) is CHURNED — never signed, never
 * invoiced. A page that lists these two as clients would be the same class of
 * invention as the "150+ Projects Delivered" and "98% Client Satisfaction" that
 * used to sit on the home page, and it is the most expensive possible thing to
 * be caught in on a site whose entire argument is that every claim is checkable.
 *
 * So each entry states the relationship plainly:
 *
 *   Haslett Handyman   — BUILT BY JAK LABS, and also owned by me. Both halves
 *                        are true, and the BUILD is the half that belongs on a
 *                        work page: JAK Labs did the development, the
 *                        infrastructure and the ongoing IT, exactly as it would
 *                        for anyone else. Ownership is disclosed rather than led
 *                        with — it is a fact about the commercial relationship,
 *                        not about who wrote the software, and leading with it
 *                        gave away credit for a build JAK Labs did end to end.
 *   Morrell Ministries — a real 501(c)(3) I built and maintain the site for.
 *                        A forward-deployed engagement, NOT a paid engagement.
 *
 * ⚠️ MORRELL: DO NOT WRITE "LIVE DONATIONS" HERE.
 * As of 2026-09-20 the production bundle still carries a Stripe `pk_test_` key,
 * and the checkout is EmbeddedCheckout, which mounts client-side against that
 * publishable key. A test key in production cannot take a real card. The repo's
 * own STATUS.md still lists this as an open red item. Describing the donate flow
 * as working would be a false claim about someone else's money.
 *
 * ⚠️ WHY THE OUTBOUND LINKS ARE SHAPED THE WAY THEY ARE.
 * Google's spam policy defines link spam as links created "primarily for the
 * purpose of manipulating search rankings", and names "partner pages exclusively
 * for the sake of cross-linking". This page is the opposite of that by
 * construction: it exists to describe the work, the links are editorial and
 * carry the organisation's own name as the anchor, and there is no exchange
 * behind any of them. Three rules follow, and they are cheap to keep:
 *
 *   · Anchor text is the ORGANISATION'S NAME, never a keyword phrase.
 *   · rel="noopener" only — NOT noreferrer. Stripping the Referer would make
 *     every referral land in their analytics as direct traffic, which throws
 *     away the one measurable benefit of the link.
 *   · No nofollow. These are not paid or sponsored placements; they are a
 *     description of work, and marking them sponsored would be inaccurate.
 *
 * One mechanical caveat, which is about the link graph and NOT about the copy:
 * hasletthandyman.info and jaklabs.io share an owner, and Google infers that from
 * registrar, host and analytics footprints — not from any sentence on this page.
 * So disclosing it costs no ranking value, and hiding it would gain none. What it
 * does mean is that the Morrell link is the genuinely independent one, and the
 * Haslett pair is a build credit between two properties. Keep the anchors as
 * brand names in both directions and that stays well inside editorial use.
 */

export const metadata: Metadata = {
  title: 'Work',
  description:
    'Two sites JAK Labs built end to end: Haslett Handyman, a Michigan service business running on '
    + 'software written for it, and Morrell Ministries, a 501(c)(3) whose site I build and maintain.',
  alternates: { canonical: '/work' },
  ...social('default', {
    type: 'website',
    url: '/work',
    title: 'Work | JAK Labs',
    description:
      'Two sites JAK Labs built end to end, both live — a Michigan service business and a 501(c)(3).',
  }),
}

type Project = {
  name: string
  href: string
  host: string
  relationship: string
  what: string
  detail: string[]
  stack: string
}

// Every figure here is in content-engine/facts.toml. The route count for Morrell
// was verified directly on 2026-09-20 — all eleven public routes returned 200.
const PROJECTS: Project[] = [
  {
    name: 'Haslett Handyman',
    href: 'https://www.hasletthandyman.info',
    host: 'hasletthandyman.info',
    // "Built by JAK Labs" first, ownership second. The earlier copy led with
    // ownership, which read as a disclaimer about the work rather than a
    // disclosure about the buyer — and quietly gave away the credit for a build
    // JAK Labs actually did end to end.
    relationship: 'Built by JAK Labs · also owned by me',
    what: 'A handyman and property-maintenance business in Haslett, Michigan, and the software that runs it.',
    detail: [
      'Email arrives, a ticket is created, the job gets scheduled, the invoice goes out.',
      '253 jobs processed through the system, and 3,235 transactions categorised by it.',
      '51 scheduled automations, 18 of which move money without being asked.',
      'The public site replaced a Webflow build: 123 URLs, every existing post preserved.',
    ],
    stack: 'Next.js · AWS Amplify · Lambda · DynamoDB',
  },
  {
    name: 'Morrell Ministries',
    href: 'https://www.morrellministries.com',
    host: 'morrellministries.com',
    relationship: 'A Michigan 501(c)(3) — I build and maintain the site',
    what: 'A faith-based nonprofit running counseling, mentorship, re-entry housing and community outreach.',
    detail: [
      'Eleven public pages, from pastoral services to the transitional housing programme.',
      'Rebuilt on the organisation’s own brand rather than a template.',
      'Contact routed to real delivery — the form it replaced showed "sent" and discarded every message.',
    ],
    stack: 'Next.js · TypeScript · Tailwind · AWS Amplify',
  },
]

export default function WorkPage() {
  return (
    <>
      <section className="pt-32 pb-12">
        <div className="container-custom max-w-3xl">
          <p className="subheading mb-4">Work</p>
          <h1 className="heading-xl mb-6">Two sites, and the systems behind them.</h1>
          <p className="text-lg text-white/70">
            JAK Labs built both of these end to end — design, code, infrastructure and the
            systems behind them. Neither is a logo on a wall: both are running right now, and both
            links go straight to the live site so you can check.
          </p>
        </div>
      </section>

      <section className="pb-24">
        <div className="container-custom max-w-3xl">
          <div className="flex flex-col gap-8">
            {PROJECTS.map((p) => (
              <article
                key={p.name}
                className="rounded-2xl border border-white/10 bg-secondary/40 p-7 md:p-9"
              >
                <div className="mb-5 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
                  <h2 className="text-2xl font-bold font-heading text-white">{p.name}</h2>
                  <span className="text-xs uppercase tracking-[0.14em] text-primary">
                    {p.relationship}
                  </span>
                </div>

                <p className="mb-6 text-white/70">{p.what}</p>

                <ul className="mb-7 flex flex-col gap-2.5">
                  {p.detail.map((d) => (
                    <li key={d} className="flex gap-3 text-white/70">
                      <span aria-hidden="true" className="mt-2.5 h-1 w-1 shrink-0 rounded-full bg-primary" />
                      <span>{d}</span>
                    </li>
                  ))}
                </ul>

                <div className="flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-5">
                  <span className="font-mono text-xs text-white/40">{p.stack}</span>
                  {/*
                    Anchor text is the organisation's name. rel="noopener" and
                    deliberately not "noreferrer" — see the note at the top of
                    this file.
                  */}
                  <a
                    href={p.href}
                    target="_blank"
                    rel="noopener"
                    className="inline-flex items-center gap-1.5 font-semibold text-primary hover:underline"
                  >
                    {p.host}
                    <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                  </a>
                </div>
              </article>
            ))}
          </div>

          <p className="mt-10 text-sm text-white/50">
            This is work, not a client roster — I own Haslett Handyman as well as having built it,
            and Morrell is a nonprofit rather than a paid engagement. Both are disclosed above for
            that reason. The development, the infrastructure and the IT were the same work either
            way. If you want the engineering rather than the websites, that is on{' '}
            <Link href="/engineering" className="text-primary hover:underline">
              the engineering page
            </Link>
            , and the numbers behind Haslett are on{' '}
            <Link href="/ops-platform" className="text-primary hover:underline">
              the ops platform page
            </Link>
            .
          </p>
        </div>
      </section>
    </>
  )
}
