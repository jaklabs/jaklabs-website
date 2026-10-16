'use client'

import Link from 'next/link'
import { Wrench, LineChart, ArrowUpRight } from 'lucide-react'

/**
 * The two JAK Labs products, as one compact strip at the foot of the homepage.
 *
 * WHY A STRIP AND NOT TWO SECTIONS
 *
 * This replaced `ProductSpotlight` + `HoodDev` + `Verdikt` on 2026-10-15: a
 * mirrored pair of full-height sections, Hood Dev left and Verdikt right. The
 * mirroring was a real idea — two peers alternating so neither reads as the main
 * event — and it cost about two phone screens to express. Feedback from a reader
 * in a Facebook group was that the mobile site is "a page scroll of doom" and
 * that he would have left before finding what he came for. The products are the
 * part of the page with the least claim on a local business owner's attention,
 * so they are where the height came from. The full versions live at /hood-dev
 * and /verdikt, which is where an interested reader was always going to end up.
 *
 * ⚠️ PLACEMENT IS STILL BELOW THE CTA, AND THAT IS STILL DELIBERATE. The
 * homepage has one job — convert a local business owner — and these speak to a
 * developer and a trader respectively. Above the booking CTA they would
 * interrupt the buying path with an offer the reader cannot use. Below it they
 * cost the primary conversion nothing.
 *
 * ⚠️ EVERY FIGURE HERE IS CHECKED, AND NO ROW GOES IN WITHOUT CHECKING IT IN THE
 * SOURCE REPO. A homepage is the highest-traffic surface on the site and the
 * easiest place for a number nobody re-derived to become permanent.
 *
 *   Hood Dev  7 phases · 9 leaks · 23 modules .. ~/claude-server/hood-dev
 *             (ASSESSMENT-ENGINE.md, content/modules/README.md)
 *   Verdikt   12 connectors · 30-trade gate ... ~/claude-server/verdikt
 *             (brokers/connectors/, edge-engine/constants.ts)
 *
 * ⚠️ VERDIKT'S LINE CARRIES A REGULATORY CONSTRAINT AND COMPRESSION IS EXACTLY
 * WHERE IT GETS LOST. Nothing may imply that keeping a journal makes anyone
 * profitable, or that trading more is progress — the product's own two standing
 * rules. That is why "no signals, no recommendations" and the 30-trade gate are
 * both on the strip rather than left behind on /verdikt: they are the sentences
 * that keep the rest of it safe to say.
 */

const products = [
    {
        name: 'Hood Dev',
        tagline: 'software is a trade',
        audience: 'for developers',
        blurb: 'A school that assesses how you actually work before it teaches you anything.',
        specs: ['7-phase Teardown', '9 leaks scored with evidence', '23 modules', 'Free for 90 days'],
        href: '/hood-dev',
        linkLabel: 'How the Teardown works',
        icon: Wrench,
        iconColor: 'text-neon-purple',
        iconBg: 'bg-neon-purple/10',
    },
    {
        name: 'Verdikt',
        tagline: 'the journal traders actually keep',
        audience: 'for traders',
        blurb: 'A record-keeping and educational tool. No signals, no alerts, no recommendations.',
        specs: ['12 read-only connectors', 'No verdict under 30 closed trades', 'Free to start'],
        href: '/verdikt',
        linkLabel: 'How the edge engine works',
        icon: LineChart,
        iconColor: 'text-accent-cyan',
        iconBg: 'bg-accent-cyan/10',
    },
]

export function ProductStrip() {
    return (
        <section className="py-12 md:py-20 border-t border-white/10">
            <div className="container-custom">
                <h2 className="text-sm font-semibold uppercase tracking-wider text-white/40 mb-6">
                    Also from JAK Labs
                </h2>

                <div className="grid gap-4 md:grid-cols-2">
                    {products.map((p) => (
                        <Link
                            key={p.name}
                            href={p.href}
                            className="group rounded-2xl bg-secondary/60 border border-white/5 p-5 hover:border-white/20 transition-colors"
                        >
                            <div className="flex items-start gap-4">
                                <div className={`w-10 h-10 shrink-0 rounded-xl ${p.iconBg} flex items-center justify-center`}>
                                    <p.icon className={`w-5 h-5 ${p.iconColor}`} />
                                </div>

                                <div className="min-w-0 flex-1">
                                    <div className="flex items-baseline gap-2 flex-wrap">
                                        <h3 className="font-bold">{p.name}</h3>
                                        <span className="text-sm text-white/50">— {p.tagline}</span>
                                    </div>

                                    <p className="mt-1 text-sm text-white/60">{p.blurb}</p>

                                    <ul className="mt-3 flex flex-wrap gap-x-2 gap-y-1.5">
                                        {p.specs.map((spec) => (
                                            <li
                                                key={spec}
                                                className="text-xs px-2.5 py-1 rounded-full bg-white/5 text-white/50 border border-white/5"
                                            >
                                                {spec}
                                            </li>
                                        ))}
                                    </ul>

                                    <span className="mt-3 inline-flex items-center gap-1 text-sm text-white/70 group-hover:text-white transition-colors">
                                        {p.linkLabel}
                                        <ArrowUpRight className="w-3.5 h-3.5" />
                                    </span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    )
}
