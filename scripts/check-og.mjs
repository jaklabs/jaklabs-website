#!/usr/bin/env node
//  Every page must ship a social card. Checked against the RENDERED HTML.
//
//  WHY THIS EXISTS
//
//  21 of 38 pages had no og:image. Next does not deep-merge `openGraph`: a page
//  defining its own block replaces the root layout's, images included. Those
//  pages still inherited `twitter:card = summary_large_image` from the root, so
//  they told crawlers to render a large image card and gave Facebook and
//  LinkedIn nothing to render — and being CSS-driven, they had no <img> on the
//  page to fall back to either. Every one of them posted bare.
//
//  It ran undetected because the homepage and blog posts DO set their own
//  images, and those are the two anyone would spot-check.
//
//  WHY IT READS THE BUILD OUTPUT AND NOT THE SOURCE
//
//  A source-pattern check ("does this file spell `images`") is a proxy, and the
//  proxy drifts: it passes for metadata that is present but overridden, which is
//  exactly the mistake made while fixing this — routing blog posts through the
//  shared helper left the `images` key in the source and discarded it at render.
//  The prerendered HTML is the artifact a crawler actually sees.
//
//  Run after `next build`.

import { readdirSync, readFileSync, statSync, existsSync } from 'node:fs'
import { join } from 'node:path'

const DIR = '.next/server/app'

if (!existsSync(DIR)) {
    console.error(`  ${DIR} not found — run \`npm run build\` first.`)
    process.exit(1)
}

function walk(dir) {
    const out = []
    for (const name of readdirSync(dir)) {
        const p = join(dir, name)
        if (statSync(p).isDirectory()) out.push(...walk(p))
        else if (name.endsWith('.html')) out.push(p)
    }
    return out
}

const meta = (html, re) => (html.match(re) || [])[1]

const bare = []
const lying = []
let ok = 0

for (const file of walk(DIR).sort()) {
    const html = readFileSync(file, 'utf8')
    const route = '/' + file.slice(DIR.length + 1).replace(/\.html$/, '').replace(/^index$/, '')

    const ogImage = meta(html, /property="og:image"\s+content="([^"]*)"/)
    const twCard = meta(html, /name="twitter:card"\s+content="([^"]*)"/)

    if (!ogImage) {
        // Distinguish "no card at all" from "claims a big card and has none",
        // because the second is the worse failure: it asks a crawler for a
        // layout it cannot fill.
        ;(twCard === 'summary_large_image' ? lying : bare).push(route)
    } else {
        ok++
    }
}

if (lying.length) {
    console.error(`\n  ${lying.length} page(s) send twitter:card=summary_large_image with NO og:image.`)
    console.error('  These post as a bare link on Facebook and LinkedIn:\n')
    for (const r of lying) console.error(`    ${r}`)
}
if (bare.length) {
    console.error(`\n  ${bare.length} page(s) have no og:image:\n`)
    for (const r of bare) console.error(`    ${r}`)
}

if (lying.length || bare.length) {
    console.error('\n  Set the card through social() in src/lib/social.ts.\n')
    process.exit(1)
}

console.log(`  og:image present on all ${ok} prerendered pages`)
