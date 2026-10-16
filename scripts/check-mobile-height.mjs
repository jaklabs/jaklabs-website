#!/usr/bin/env node
//  The mobile homepage has a height budget, and it is MEASURED, not estimated.
//
//  WHY THIS EXISTS
//
//  On 2026-10-15 the homepage was 9,204px at 393x852 — 10.8 phone screens — and
//  nobody knew. The estimate written down at the time, derived carefully from
//  padding classes and card heights in the source, was 5.7 screens. It was wrong
//  by nearly half, in the reassuring direction, and it was wrong because a page
//  height is an emergent property of wrapped text, stacked grids and collapsed
//  breakpoints. You cannot read it off the source. Every number this file prints
//  comes out of a real browser at a real viewport.
//
//  THE BUG CLASS IT GUARDS, which is the reusable part:
//
//  `sm:` is 640px and `md:` is 768px, so at 393px EVERY `sm:grid-cols-*` and
//  `md:grid-cols-*` on the page silently collapses to one column. Five separate
//  grids — the hero stats, the why-items, the why-stats, the footer and the
//  industries row — were each laid out for the desktop they were designed on and
//  each quietly stacked on the device most visitors use. Nothing errors. Nothing
//  looks broken in a desktop browser. The page just gets twice as tall.
//
//  WHY IT IS NOT IN amplify.yml
//
//  It needs a real Chrome, and the Amplify build container has none. Wiring it
//  into the build would fail every deploy. It is a local gate — `npm run
//  check:mobile` — in the same family as check:og and check:images.
//
//  ⚠️ IT FAILS WHEN IT CANNOT MEASURE. It never skips. A height checker that
//  exits 0 because Chrome was missing, or because the server was not up, reports
//  exactly what a healthy page reports, and the only thing it would then be
//  guarding is its own reputation.
//
//  Usage:  npm run build && npx next start -p 3999 &   then  npm run check:mobile
//          npm run check:mobile -- https://jaklabs.io

import { existsSync } from 'node:fs'
import puppeteer from 'puppeteer-core'

// iPhone 14 Pro logical viewport. Narrower than most, which is the point: the
// budget should hold for the small end, not the comfortable middle.
const VW = 393
const VH = 852

// NOT 3000 — trading-hub occupies it on the dev machine, and pointing this at
// it produced a full set of plausible numbers that passed three checks out of
// four. See the identity assertion below.
const URL = process.argv[2] || 'http://localhost:3999'

// Budgets sit just above what was measured on 2026-10-15 after the cuts, so a
// little drift is allowed and a real regression is not. Raising one is a
// decision somebody should have to make on purpose, in a diff, with a reason.
const BUDGET = {
    totalPx: 8200,        // measured 7,711
    heroScreens: 1.0,     // the hero must not exceed ONE viewport — the first
                          // scroll has to land on the offers, not on more hero
    firstPricePx: 2000,   // measured 1,463. This is the real metric: how far a
                          // visitor scrolls before seeing what anything costs
}

const CHROMES = [
    process.env.CHROME_PATH,
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    '/Applications/Chromium.app/Contents/MacOS/Chromium',
    '/usr/bin/google-chrome',
    '/usr/bin/chromium',
].filter(Boolean)

// An explicitly-set CHROME_PATH is authoritative. Falling back to a different
// browser when the one you NAMED is missing means you measure something you did
// not choose and are never told — and it made this branch untestable, which is
// how the gap was noticed.
if (process.env.CHROME_PATH && !existsSync(process.env.CHROME_PATH)) {
    console.error(`  FAILED: CHROME_PATH is set to "${process.env.CHROME_PATH}" but nothing is there.`)
    process.exit(1)
}

const chrome = CHROMES.find((p) => existsSync(p))
if (!chrome) {
    console.error('  FAILED: no Chrome found. Set CHROME_PATH.')
    console.error('  Looked in:\n' + CHROMES.map((p) => `    ${p}`).join('\n'))
    process.exit(1)
}

let browser
try {
    browser = await puppeteer.launch({
        executablePath: chrome,
        headless: 'new',
        args: ['--no-sandbox', '--hide-scrollbars'],
    })
} catch (err) {
    console.error(`  FAILED: could not launch Chrome — ${err.message}`)
    process.exit(1)
}

let m
try {
    const page = await browser.newPage()
    await page.setViewport({ width: VW, height: VH, deviceScaleFactor: 2, isMobile: true, hasTouch: true })
    await page.goto(URL, { waitUntil: 'networkidle2', timeout: 60000 })

    // Scroll the length of the page first. Sections animate in on view and some
    // only take their final height once they have, so measuring a page that was
    // never scrolled reads short — in the flattering direction, again.
    await page.evaluate(async () => {
        await new Promise((res) => {
            let y = 0
            const step = () => {
                y += 400
                window.scrollTo(0, y)
                if (y < document.body.scrollHeight) setTimeout(step, 40)
                else { window.scrollTo(0, 0); setTimeout(res, 600) }
            }
            step()
        })
    })

    // ⚠️ IS THIS EVEN THE RIGHT SITE? The first run of this script pointed at
    // localhost:3000, which on this machine is trading-hub, not jaklabs.io. It
    // measured that app's homepage, printed 6,601px and "+$28.70" as the first
    // price, and PASSED three of its four checks. A height budget verified
    // against the wrong application is worse than no budget, because it reports
    // success. Everything below is meaningless unless this holds.
    const title = await page.title()
    if (!/JAK ?Labs/i.test(title)) {
        console.error(`  FAILED: ${URL} is not the JAK Labs site.`)
        console.error(`  <title> was "${title}"`)
        console.error('  Start the right server: npm run build && npx next start -p 3999')
        await browser.close()
        process.exit(1)
    }

    m = await page.evaluate(() => {
        const doc = document.documentElement
        const hero = document.querySelector('section')
        // The first element carrying a dollar figure, whatever section it is in.
        // Deliberately NOT "the second section" — that encodes today's page order
        // and would pass silently if the order regressed.
        const priceEl = [...document.querySelectorAll('p,span,h3')]
            .find((e) => /\$[\d,]+/.test(e.textContent) && e.children.length === 0)
        return {
            total: doc.scrollHeight,
            hero: hero ? Math.round(hero.getBoundingClientRect().height) : null,
            scrollW: doc.scrollWidth,
            clientW: doc.clientWidth,
            firstPrice: priceEl ? Math.round(priceEl.getBoundingClientRect().top + window.scrollY) : null,
            priceText: priceEl ? priceEl.textContent.trim().slice(0, 40) : null,
            sections: [...document.querySelectorAll('section')].map((s) => ({
                h: Math.round(s.getBoundingClientRect().height),
                label: (s.querySelector('h1,h2')?.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 38),
            })),
        }
    })
} catch (err) {
    console.error(`  FAILED: could not measure ${URL} — ${err.message}`)
    console.error('  Is the server running? `npm run build && npm start`')
    await browser.close()
    process.exit(1)
} finally {
    if (browser && browser.connected) await browser.close().catch(() => {})
}

console.log(`${URL} @ ${VW}x${VH}\n`)
for (const s of m.sections) {
    console.log(`  ${String(s.h).padStart(5)}px  ${(s.h / VH).toFixed(2)} scr  ${s.label}`)
}
console.log()

const fails = []
const line = (ok, label, got, limit) => {
    console.log(`  ${ok ? 'PASS' : 'FAIL'}  ${label.padEnd(30)} ${got}  (budget ${limit})`)
    if (!ok) fails.push(label)
}

line(m.total <= BUDGET.totalPx, 'total height',
    `${m.total}px / ${(m.total / VH).toFixed(2)} screens`, `${BUDGET.totalPx}px`)

if (m.hero === null) {
    line(false, 'hero height', 'NO <section> FOUND', 'one viewport')
} else {
    line(m.hero <= VH * BUDGET.heroScreens + 1, 'hero fits one screen',
        `${m.hero}px / ${(m.hero / VH).toFixed(2)} screens`, `${VH}px`)
}

line(m.scrollW <= m.clientW, 'no horizontal overflow',
    m.scrollW > m.clientW ? `${m.scrollW}px vs ${m.clientW}px` : 'none', `${m.clientW}px`)

if (m.firstPrice === null) {
    // A homepage with no price on it is itself the regression this guards.
    line(false, 'a price is on the page', 'NO PRICE FOUND', `within ${BUDGET.firstPricePx}px`)
} else {
    line(m.firstPrice <= BUDGET.firstPricePx, 'first price reachable',
        `${m.firstPrice}px / ${(m.firstPrice / VH).toFixed(2)} screens — "${m.priceText}"`,
        `${BUDGET.firstPricePx}px`)
}

console.log()
if (fails.length) {
    console.error(`  ${fails.length} check(s) failed: ${fails.join(', ')}`)
    console.error('  Most likely cause: a grid using sm:/md: columns, which collapse')
    console.error('  to ONE column below 640/768px. Check new sections at 393px wide.')
    process.exit(1)
}
console.log('  All mobile height checks passed.')
