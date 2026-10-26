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
//  IT ALSO CHECKS THE CARDS ARE DISTINCT (2026-10-25, JD's requirement).
//
//  Presence was never the whole ask. Before this, 15 marketing pages shared one
//  `default` card, so posting /quarry and posting /telehealth put the identical
//  image in the feed — and the page cards were visually indistinguishable from
//  the blog covers on top of that. Each page now carries its own, and a shared
//  card is a build failure rather than something you notice months later in a
//  feed. `default` was deleted from social.ts so sharing is not spellable, and
//  this is the check that the rendered HTML agrees.
//
//  /_not-found is allowed to carry the site card: it is not a page anyone posts.
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
const byImage = new Map()
let ok = 0

// Blog posts are excluded from the uniqueness check: each carries its own
// per-post cover from the CMS, and a post with no cover deliberately falls back
// to a shared placeholder (FALLBACK_COVER). Asserting uniqueness there would
// fail on a correct fallback.
const isPost = (r) => r.startsWith('/blog/') && r !== '/blog/'
const EXEMPT = new Set(['/_not-found'])

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
        if (!isPost(route) && !EXEMPT.has(route)) {
            if (!byImage.has(ogImage)) byImage.set(ogImage, [])
            byImage.get(ogImage).push(route)
        }
    }
}

const shared = [...byImage.entries()].filter(([, routes]) => routes.length > 1)

if (lying.length) {
    console.error(`\n  ${lying.length} page(s) send twitter:card=summary_large_image with NO og:image.`)
    console.error('  These post as a bare link on Facebook and LinkedIn:\n')
    for (const r of lying) console.error(`    ${r}`)
}
if (bare.length) {
    console.error(`\n  ${bare.length} page(s) have no og:image:\n`)
    for (const r of bare) console.error(`    ${r}`)
}

if (shared.length) {
    console.error(`\n  ${shared.length} social card(s) are used by more than one page.`)
    console.error('  Posting these pages puts the same image in the feed:\n')
    for (const [img, routes] of shared) {
        console.error(`    ${img.split('/').pop()}`)
        for (const r of routes) console.error(`        ${r}`)
    }
    console.error('\n  Give each page its own: add a card to')
    console.error('  marketing/scripts/make-page-cards.py, regenerate, copy the PNG')
    console.error('  into public/images, and point the page at it via social().')
}

if (lying.length || bare.length || shared.length) {
    console.error('\n  Set the card through social() in src/lib/social.ts.\n')
    process.exit(1)
}

console.log(`  og:image present on all ${ok} prerendered pages`)
console.log(`  ${byImage.size} distinct page cards, none shared`)
