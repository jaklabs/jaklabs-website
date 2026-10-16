'use client'

import { Target, Rocket, Shield, HeartHandshake } from 'lucide-react'

/**
 * The four reasons to pick one engineer over an agency, sitting just above the
 * booking CTA — the last thing read before the ask.
 *
 * WHY THIS IS A COMPACT BLOCK AND NOT THE OLD SECTION
 *
 * These four lines were the body of `WhyChooseUs`, removed on 2026-10-15 because
 * it was 1,312px — 1.54 phone screens — on a page that measured 9 screens. The
 * copy was never the problem; the packaging was. It carried a full-height
 * two-column layout, an animated stat block and 64px gaps to say four things.
 * Same words here, a fraction of the height.
 *
 * ⚠️ THE COPY IS VERBATIM FROM THE ORIGINAL AND SHOULD STAY THAT WAY. It is the
 * most differentiated writing on the site and the only place the site says out
 * loud that it will talk you out of a purchase. If this block ever needs to be
 * shorter, drop a WHOLE item rather than trimming the sentences — the specifics
 * ("$2,500 and $10,000", "not a project manager and three juniors") are what
 * make it worth reading, and a trimmed version is indistinguishable from every
 * agency's boilerplate.
 *
 * ⚠️ WHAT MUST NOT COME BACK WITH IT: the old section also carried a stat block
 * reading "5x Average ROI" and "30% Cost Reduction". Both were template
 * inventions with nothing behind them — there are no clients to average — and
 * both were live until they were deleted. Nothing goes in a stat slot on this
 * site unless it is registered in content-engine/facts.toml.
 */

const reasons = [
    {
        icon: Target,
        title: 'One senior engineer',
        description: 'Not a project manager and three juniors. The person you talk to is the person writing the code. Ask anyone else you are considering who is actually building it.',
    },
    {
        icon: Rocket,
        title: 'I did it to myself first',
        description: 'Haslett Handyman runs on a CRM I wrote — email in, tickets created, jobs scheduled, invoices out. I will show you the real system, not a slide about it.',
    },
    {
        icon: Shield,
        title: 'Published pricing',
        description: 'Most builds land between $2,500 and $10,000. It is on the blog, in public, so you do not spend three calls finding out.',
    },
    {
        icon: HeartHandshake,
        title: 'I will tell you to buy nothing',
        description: 'If your problem is a reminder and a template, you do not need a platform. Software should be the last resort, not the first. I have said this more than once.',
    },
]

export function WhyMe() {
    return (
        <section className="py-10 md:py-24">
            <div className="container-custom">
                <h2 className="text-2xl md:text-4xl font-bold mb-5 md:mb-12 max-w-2xl">
                    Why me, and not an agency
                </h2>

                <div className="grid gap-3 md:grid-cols-2 md:gap-6">
                    {reasons.map((r) => (
                        <div
                            key={r.title}
                            className="flex gap-3 rounded-xl bg-secondary/40 border border-white/5 p-4"
                        >
                            <div className="w-9 h-9 shrink-0 rounded-lg bg-neon-purple/10 flex items-center justify-center">
                                <r.icon className="w-4.5 h-4.5 text-neon-purple" />
                            </div>
                            <div className="min-w-0">
                                <h3 className="font-semibold leading-snug mb-1">{r.title}</h3>
                                <p className="text-sm text-white/55 leading-snug">{r.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
