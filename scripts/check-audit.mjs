#!/usr/bin/env node
//  The audit endpoint must actually launch a browser and load a page.
//
//  WHY THIS EXISTS
//
//  A runtime bump to nodejs22 broke Chromium's navigation inside
//  `jaklabs-audit`. Every check it performed answered `reachable: false` —
//  google.com and example.com included — and phrased it as a fact about the
//  visitor: "That site didn't load. It may be down, or blocking automated
//  checks." The free audit on jaklabs.io, which the blog posts lead with, spent
//  an evening telling prospects their working website was broken.
//
//  NOTHING CAUGHT IT, AND EVERY SIGNAL LOOKED HEALTHY:
//    - `cdk deploy` succeeded.
//    - The function returned HTTP 200 with `success: true`.
//    - CloudWatch logged no error; the throw was swallowed by a bare `catch {}`.
//    - Warm nodejs20 containers served CORRECT results for ~80 minutes after the
//      change, so "I deployed and checked it" was true and proved nothing.
//
//  WHY IT PROBES A KNOWN-GOOD URL AND NOT THE ENDPOINT'S HEALTH
//
//  A 200 from this API is not evidence that the browser works — that is the
//  precise proxy that failed. The only thing that proves a browser launched and
//  loaded a page is asking it about a site that cannot plausibly be down and
//  requiring a real `issues` array back. `reachable: false` from example.com is
//  a FAILURE here, however healthy the response envelope looks (fleet rule 5:
//  if this were completely broken, what would I see?).
//
//    node scripts/check-audit.mjs                 # after any deploy
//    node scripts/check-audit.mjs --self-test     # prove it can fail
//
//  Run it after EVERY change to the audit Lambda, especially a runtime change.

const API = process.env.AUDIT_API
  || 'https://eml064cbzg.execute-api.us-east-1.amazonaws.com/v1/audit'

//  Two, because one could be an outage. Both being down at once is not the
//  likely reading when the third possibility is "our browser is broken".
const KNOWN_GOOD = ['https://example.com', 'https://www.google.com']

async function probe(url) {
  const res = await fetch(API, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ url }),
    signal: AbortSignal.timeout(90_000),
  })
  if (!res.ok) return { ok: false, why: `HTTP ${res.status}` }
  const body = await res.json().catch(() => null)
  if (!body) return { ok: false, why: 'response was not JSON' }
  const d = body.data || {}
  //  `success: true` is NOT the check. This is the assertion that broke.
  if (d.reachable !== true) {
    return { ok: false, why: `reachable=${d.reachable} — ${d.message || 'no message'}` }
  }
  //  A reachable page with no issues array means the checks did not run.
  if (!Array.isArray(d.issues)) return { ok: false, why: 'no issues array — checks did not run' }
  return { ok: true, why: `${d.issues.length} issue(s), loaded in ${d.loadSeconds ?? '?'}s` }
}

const selfTest = process.argv.includes('--self-test')

if (selfTest) {
  //  Proves the assertions can fail, against a URL that genuinely does not
  //  resolve. A check that has never been observed failing is a rumour.
  const r = await probe('https://this-domain-does-not-exist-jaklabs-probe.invalid')
  if (r.ok) {
    console.error('✖ SELF-TEST FAILED: a non-existent domain reported reachable')
    process.exit(1)
  }
  console.log(`✓ self-test: unreachable domain correctly rejected — ${r.why}`)
  process.exit(0)
}

let bad = 0
for (const url of KNOWN_GOOD) {
  const r = await probe(url)
  console.log(`  ${r.ok ? '✓' : '✖'} ${url.padEnd(26)} ${r.why}`)
  if (!r.ok) bad += 1
}

if (bad) {
  console.error(`\n✖ the audit could not load ${bad}/${KNOWN_GOOD.length} known-good site(s).`)
  console.error('  These are not down. The browser is not working — check the Lambda runtime')
  console.error('  and @sparticuz/chromium compatibility before trusting any audit result,')
  console.error('  and remember warm containers can mask this for over an hour.')
  process.exit(1)
}
console.log('\n✓ the audit launches a browser and loads real pages.')
