'use client'

import { LineChart } from 'lucide-react'
import { ProductSpotlight } from './ProductSpotlight'

/**
 * Verdikt on the homepage — the right half of the mirrored pair, below Hood Dev.
 *
 * Layout and the verify-every-figure rule live in ProductSpotlight. This file is
 * only the content.
 *
 * ⚠️ Same regulatory constraint as /verdikt itself, and it matters more here
 * because a homepage blurb is where compression does the damage: nothing in this
 * copy may imply that keeping a journal makes anyone profitable, or that trading
 * more is progress. Those are the product's own two standing rules. "Find your
 * edge" is safe because the spec card immediately says the engine refuses to
 * claim one under 30 trades; "find your edge fast" would not be.
 */
export function Verdikt() {
    return (
        <ProductSpotlight
            side="right"
            accent="#22d3ee"
            accentGradient="bg-gradient-to-r from-accent-cyan to-primary-light bg-clip-text text-transparent"
            icon={<LineChart className="w-5 h-5 text-accent-cyan" />}
            eyebrow="Also from JAK Labs — for traders"
            title="Verdikt —"
            titleAccent="the journal traders actually keep"
            body={[
                'Every trading book says keep a journal. Almost nobody does, because a journal is '
                + 'homework and homework loses to a live chart. So this one is built like Duolingo '
                + 'instead of like a spreadsheet.',
                'Streaks, XP and leagues are the mechanism, not the decoration. What you end up with '
                + 'is a written record of your own decisions, with the reasoning attached, from '
                + 'before you knew how they turned out.',
                'A record-keeping and educational tool. No signals, no alerts, no recommendations — '
                + 'it does not tell you what to buy.',
            ]}
            spec={[
                { label: 'import', value: '12 broker connectors, read-only, keys AES-256-GCM' },
                { label: 'gate', value: 'No verdict on a setup under 30 closed trades' },
                { label: 'method', value: '10,000 bootstrap resamples, 95% confidence interval' },
                { label: 'price', value: 'Free to start' },
            ]}
            detailHref="/verdikt"
            detailLabel="How the edge engine works"
            appHref="https://verdikt.jaklabs.io"
            appLabel="Open Verdikt"
            footnote="Verdikt lives at verdikt.jaklabs.io"
        />
    )
}
