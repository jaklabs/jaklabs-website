#!/usr/bin/env node
// Every published price lives in src/lib/pricing.ts and NOWHERE else.
// This fails the build on a hard-coded copy.
//
// WHY: the five service prices were written out as string literals across the site with
// nothing connecting them. Converting them to one source was scoped at "five files" from
// a grep of the obvious ones. It was ELEVEN files and twenty call sites — the services
// page and its metadata, the root metadata, /payments (an independent copy of the whole
// ladder), /quarry, the Services / Hero / WhyMe sections, lib/social.ts, and lib/
// industries.ts SEVEN TIMES, four of them inside prose FAQ answers.
//
// That is `business.ts`'s lesson exactly — one contact address logged as "a three-line
// change" was eleven across nine files — and a price is worse than an address. A stale
// address bounces and somebody tells you. A stale price is a number a prospect reads,
// believes, and quotes back at you.
//
// ⚠️ IT FORBIDS THE CURRENT PRICES TOO, not just old ones. The failure being prevented is
// the NEXT reprice missing a site, so a guard that only banned superseded figures would
// go green the moment somebody pasted the new one and be useless the time after.
//
// ⚠️ COMMENTS ARE STRIPPED BEFORE SCANNING. pricing.ts and the services page both discuss
// these numbers in prose deliberately — the one-time/recurring incident is written out in
// full — and a guard that cannot tell prose from a call site forces the explanation to be
// deleted to make the build pass.
//
// Run `node scripts/check-pricing.mjs --self-test` to watch it fail: a check never
// observed failing is a rumour.

import { readFileSync, readdirSync, statSync, mkdtempSync, mkdirSync, writeFileSync } from 'node:fs';
import { join, relative } from 'node:path';
import { tmpdir } from 'node:os';

const ROOT = new URL('..', import.meta.url).pathname;
const SOURCE_OF_TRUTH = join('src', 'lib', 'pricing.ts');

// Read from the source file itself, so adding or repricing an offer needs no edit here.
// A guard carrying its own copy of the list is a second place for the list to live.
function pricesFromSource(root) {
  const src = readFileSync(join(root, SOURCE_OF_TRUTH), 'utf8');
  const out = new Set();
  for (const m of src.matchAll(/price:\s*'([^']+)'/g)) out.add(m[1].replace(/^From\s+/i, ''));
  for (const m of src.matchAll(/^export const BUILD_RANGE\w*\s*=\s*'([^']+)'/gm)) out.add(m[1]);
  out.delete('');
  return [...out];
}

const strip = (t) =>
  t.replace(/\/\*[\s\S]*?\*\//g, '')
   .split('\n').map((l) => l.replace(/(^|\s)\/\/.*$/, '')).join('\n');

function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) walk(full, out);
    else if (/\.(ts|tsx|js|mjs)$/.test(name)) out.push(full);
  }
  return out;
}

function scan(root) {
  const prices = pricesFromSource(root);
  // Escaped, and `$` matters: a bare "2,500" in a transaction count is not a price.
  const res = prices.map((p) => [p, new RegExp(p.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
                                                .replace(/[–-]/g, '[–-]'), 'i')]);
  const problems = [];
  for (const file of walk(join(root, 'src'))) {
    const rel = relative(root, file);
    if (rel === SOURCE_OF_TRUTH) continue;
    strip(readFileSync(file, 'utf8')).split('\n').forEach((line, i) => {
      for (const [price, re] of res) {
        if (re.test(line)) problems.push({ rel, line: i + 1, price, text: line.trim().slice(0, 100) });
      }
    });
  }
  return { prices, problems };
}

if (process.argv.includes('--self-test')) {
  const tmp = mkdtempSync(join(tmpdir(), 'pricecheck-'));
  mkdirSync(join(tmp, 'src', 'lib'), { recursive: true });
  mkdirSync(join(tmp, 'src', 'app'), { recursive: true });
  writeFileSync(join(tmp, SOURCE_OF_TRUTH),
    `export const OFFERS = { a: { price: 'From $6,000' } }\nexport const BUILD_RANGE = '$2,500–$10,000'\n`);
  writeFileSync(join(tmp, 'src', 'app', 'clean.tsx'),
    `// A comment mentioning $6,000 must NOT trip it.\nexport const x = OFFERS.a.price\n`);
  const clean = scan(tmp);
  writeFileSync(join(tmp, 'src', 'app', 'dirty.tsx'), `export const y = 'From $6,000 one-time'\n`);
  const dirty = scan(tmp);
  const ok = clean.problems.length === 0 && dirty.problems.length === 1
             && clean.prices.includes('$6,000') && clean.prices.includes('$2,500–$10,000');
  console.log(ok
    ? `✓ self-test: prices read from source ${JSON.stringify(clean.prices)}; a comment passed, a literal failed`
    : `✗ self-test FAILED: clean=${clean.problems.length} dirty=${dirty.problems.length} prices=${JSON.stringify(clean.prices)}`);
  process.exit(ok ? 0 : 1);
}

const { prices, problems } = scan(ROOT);
if (!prices.length) {
  // An empty price list would make every file pass. That is the decorative failure.
  console.error(`✗ no prices could be read out of ${SOURCE_OF_TRUTH} — the check would pass on anything`);
  process.exit(1);
}
if (problems.length) {
  console.error(`✗ ${problems.length} hard-coded price(s) outside ${SOURCE_OF_TRUTH}:`);
  for (const p of problems) console.error(`    ${p.rel}:${p.line}  ${p.price}  ${p.text}`);
  console.error(`\n  Import from '@/lib/pricing' instead. The next reprice must not have to find these.`);
  process.exit(1);
}
console.log(`✓ ${prices.length} price(s) live only in ${SOURCE_OF_TRUTH}`);
