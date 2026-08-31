'use client'

import { Wrench } from 'lucide-react'
import { ProductSpotlight } from './ProductSpotlight'

/**
 * Hood Dev on the homepage — the left half of the mirrored pair.
 *
 * The layout, the placement rationale and the rule about verifying every figure
 * all live in ProductSpotlight. This file is only the content.
 *
 * The copy changed 2026-08-31: it used to say the school "assesses you first,
 * tells you what kind of developer you are and where you leak, then builds a
 * track around that". Accurate, and word-for-word what every competitor also
 * claims. The spec card carries the same argument in numbers a reader can check,
 * which is the version that survives scepticism.
 */
export function HoodDev() {
    return (
        <ProductSpotlight
            side="left"
            accent="#bf5af2"
            accentGradient="text-gradient-neon"
            icon={<Wrench className="w-5 h-5 text-neon-purple" />}
            eyebrow="Also from JAK Labs — for developers"
            title="Hood Dev —"
            titleAccent="software is a trade"
            body={[
                'A school that assesses how you actually work before it teaches you anything, then '
                + 'builds the track around what it found — applied to a real project of your own.',
                'Every course tells you what to learn. This one looks under the hood first, names the '
                + 'specific thing holding you back, and cites the moment you proved it.',
                'Free for 90 days from launch. Not for absolute beginners — it diagnoses developers, '
                + 'so there has to be something to diagnose.',
            ]}
            spec={[
                { label: 'assessment', value: 'The Teardown — 7 phases, ~40 min in-browser' },
                { label: 'measures', value: '9 leaks, each scored 0–100 with evidence cited' },
                { label: 'curriculum', value: '23 modules, ~188 hours, built per-Read' },
                { label: 'price', value: 'Free — 90 days from launch' },
            ]}
            detailHref="/hood-dev"
            detailLabel="How the Teardown works"
            appHref="https://hood.jaklabs.io/signup"
            appLabel="Sit it now"
            footnote="The school lives at hood.jaklabs.io"
        />
    )
}
