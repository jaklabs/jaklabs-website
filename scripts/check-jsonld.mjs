#!/usr/bin/env node
//  Every JSON-LD block must survive the <script> element it is printed into.
//
//  WHY THIS EXISTS
//
//  Six pages emit structured data through
//  `dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}`, and
//  JSON.stringify does not escape `<`. Inside a <script>, the HTML parser is not
//  reading JSON: it ends the element at the first `</script`, wherever that
//  falls, including the middle of a string. Blog post titles and excerpts go
//  into those blocks and are CMS text written in the CRM, so the input is
//  reachable without touching this repository.
//
//  `src/lib/jsonLd.ts` is the fix. This is what stops the SEVENTH block being
//  written without it — the pattern is easy to copy and the damage is invisible
//  until someone types the wrong title.
//
//  WHY IT READS THE BUILD OUTPUT AND NOT THE SOURCE
//
//  Same reason as check-og.mjs: a source-pattern check is a proxy for what the
//  browser receives, and proxies drift. The prerendered HTML is the artifact.
//
//  Run after `next build`.   `--self-test` proves the assertions can fail.

import { readdirSync, readFileSync, statSync, existsSync } from 'node:fs'
import { join } from 'node:path'

const DIR = '.next/server/app'
const BLOCK = /<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g

/** Returns a reason the block is unsafe, or null. */
function faultIn(body) {
    // A raw `<` is the breakout character — `</script` ends the element and
    // `<!--` shifts the tokenizer. Either means a sink skipped the helper.
    if (body.includes('<')) return `raw "<" in the payload (should be \\u003c)`
    try {
        JSON.parse(body)
    } catch (e) {
        // Also catches a block already truncated by a breakout: the extracted
        // text stops mid-string and will not parse.
        return `does not parse as JSON — ${e.message.slice(0, 80)}`
    }
    return null
}

if (process.argv.includes('--self-test')) {
    // A check never seen to fail is a rumour.
    const cases = [
        ['raw < breaks out', '{"headline":"Why </script><img src=x> breaks it"}'],
        ['truncated by a breakout', '{"headline":"Why '],
        ['html comment opener', '{"headline":"a <!-- b"}'],
    ]
    let bad = 0
    for (const [name, body] of cases) {
        const r = faultIn(body)
        console.log(`  ${r ? 'rejected' : 'ACCEPTED (WRONG)'}  ${name}${r ? ` — ${r}` : ''}`)
        if (!r) bad++
    }
    const good = faultIn(JSON.stringify({ headline: 'Trades & Service' }).replace(/</g, '\\u003c'))
    console.log(`  ${good ? `REJECTED A GOOD BLOCK (WRONG) — ${good}` : 'accepted'}  a correctly escaped block`)
    if (good) bad++
    console.log(bad ? `\n  self-test FAILED (${bad})` : '\n  self-test passed')
    process.exit(bad ? 1 : 0)
}

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

const broken = []
let blocks = 0
let pages = 0

for (const file of walk(DIR).sort()) {
    const html = readFileSync(file, 'utf8')
    const route = '/' + file.slice(DIR.length + 1).replace(/\.html$/, '').replace(/^index$/, '')
    let m
    let seen = 0
    BLOCK.lastIndex = 0
    while ((m = BLOCK.exec(html)) !== null) {
        seen++
        blocks++
        const fault = faultIn(m[1])
        if (fault) broken.push([route, fault])
    }
    if (seen) pages++
}

for (const [route, why] of broken) console.error(`  ✗ ${route}\n      ${why}`)

if (broken.length) {
    console.error(`\n  ${broken.length} of ${blocks} JSON-LD blocks are unsafe.`)
    console.error('  Route the block through `jsonLd()` from src/lib/jsonLd.ts.')
    process.exit(1)
}

// A pass with zero blocks found is not a pass — it is the check not running.
if (blocks === 0) {
    console.error('  no JSON-LD blocks found at all — the selector or the build is wrong.')
    process.exit(1)
}

console.log(`  ${blocks} JSON-LD blocks across ${pages} pages: all escaped and parseable`)
