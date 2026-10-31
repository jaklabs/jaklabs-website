#!/usr/bin/env node
// The published contact address and phone live in src/lib/business.ts and NOWHERE else.
// This fails the build on a hard-coded copy.
//
// WHY: swapping the contact address off a personal Gmail was logged as "a three-line
// change" on the strength of three call sites somebody had written down. It was ELEVEN,
// across NINE files, and the only way to learn that was to grep — i.e. the only way to get
// it right was to already suspect the note was wrong. `haslett-website` has the same guard
// for the same reason: the Webflow site it replaced spelled the company five ways and
// routed ten pages of calls to a personal mobile.
//
// ⚠️ IT FORBIDS THE CORRECT ADDRESS TOO. A literal `contact@jaklabs.io` in a page is just
// as bad as the old one, because the failure being prevented is the NEXT swap missing a
// site — not this address being wrong today. A guard that only banned the old value would
// go green the moment someone pasted the new one, and would be useless the next time.
//
// ⚠️ COMMENTS ARE STRIPPED BEFORE SCANNING. Both business.ts and Footer.tsx discuss
// jdakemp@jaklabs.io and email.jaklabs.io in prose, on purpose, to stop someone
// reintroducing them. Prose is not a call site, and a guard that cannot tell the two apart
// forces the explanation to be deleted to make the build pass.
//
// Run `node scripts/check-contact.mjs --self-test` to watch it fail: a check never
// observed failing is a rumour.

import { readFileSync, readdirSync, statSync, mkdtempSync, mkdirSync, writeFileSync } from 'node:fs';
import { join, relative } from 'node:path';

const ROOT = new URL('..', import.meta.url).pathname;
const SRC = join(ROOT, 'src');
const SOURCE_OF_TRUTH = join('src', 'lib', 'business.ts');

const FORBIDDEN = [
  ['the old personal Gmail',            /jdakemp@gmail\.com/i],
  ['jdakemp@jaklabs.io, which bounces', /jdakemp@jaklabs\.io/i],
  ['a hard-coded mailto address',       /mailto:[a-z0-9._%+-]+@[a-z0-9.-]+/i],
  ['a hard-coded contact address',      /contact@jaklabs\.io/i],
  ['a hard-coded phone number',         /\(?\b517\)?[ .)-]{0,2}505[ .-]?7135\b/],
  ['a hard-coded tel: href',            /tel:\+?1?517\s?505\s?7135/i],
];

/** Source with comments blanked out, so prose about an address is not a call site. */
function code(text) {
  return text
    .replace(/\/\*[\s\S]*?\*\//g, ' ')          // /* ... */ and JSX {/* ... */}
    .replace(/(^|[^:\\])\/\/.*$/gm, '$1 ');     // // ... but not the // in https://
}

function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p, out);
    else if (/\.(ts|tsx|js|jsx|mjs)$/.test(name)) out.push(p);
  }
  return out;
}

function scan(files, { sourceOfTruth = SOURCE_OF_TRUTH } = {}) {
  const problems = [];
  for (const file of files) {
    const rel = relative(ROOT, file);
    if (rel === sourceOfTruth) continue;
    const text = code(readFileSync(file, 'utf8'));
    for (const [what, re] of FORBIDDEN) {
      const m = re.exec(text);
      if (m) {
        const line = text.slice(0, m.index).split('\n').length;
        problems.push({ rel, line, what, found: m[0] });
      }
    }
  }
  return problems;
}

function selfTest() {
  const dir = mkdtempSync('/tmp/check-contact-');
  mkdirSync(join(dir, 'lib'), { recursive: true });
  const cases = [
    ['bad-gmail.tsx',  'export const A = "jdakemp@gmail.com"', true],
    ['bad-mailto.tsx', 'const M = "mailto:anyone@anywhere.com?subject=x"', true],
    ['bad-right.tsx',  'const E = "contact@jaklabs.io"', true],
    ['bad-phone.tsx',  'const P = "(517) 505-7135"', true],
    ['bad-tel.tsx',    'const T = "tel:+15175057135"', true],
    ['bad-bounce.tsx', 'const B = "jdakemp@jaklabs.io"', true],
    ['ok-import.tsx',  "import { EMAIL } from '@/lib/business'\nconst E = EMAIL", false],
    ['ok-prose.tsx',   '// NOT jdakemp@gmail.com -- see business.ts\n/* contact@jaklabs.io */\nconst X = 1', false],
    ['ok-url.tsx',     'const U = "https://jaklabs.io/contact"', false],
    ['ok-placeholder.tsx', 'const P = "john@example.com"', false],
  ];
  let pass = 0, fail = 0;
  for (const [name, body, shouldFlag] of cases) {
    const p = join(dir, name);
    writeFileSync(p, body);
    const flagged = scan([p], { sourceOfTruth: 'nothing' }).length > 0;
    if (flagged === shouldFlag) { pass++; console.log(`  ok    ${name} -> ${flagged ? 'flagged' : 'clean'}`); }
    else { fail++; console.log(`  FAIL  ${name} -> ${flagged ? 'flagged' : 'clean'}, expected ${shouldFlag ? 'flagged' : 'clean'}`); }
  }
  // The source of truth must be exempt, and must actually hold the address.
  const truth = readFileSync(join(ROOT, SOURCE_OF_TRUTH), 'utf8');
  const truthOk = /export const EMAIL = 'contact@jaklabs\.io'/.test(truth);
  truthOk ? pass++ : fail++;
  console.log(`  ${truthOk ? 'ok   ' : 'FAIL '} ${SOURCE_OF_TRUTH} exports EMAIL = contact@jaklabs.io`);
  console.log(`\n  self-test: ${pass} passed, ${fail} failed`);
  return fail === 0;
}

const files = walk(SRC);

if (process.argv.includes('--self-test')) {
  process.exit(selfTest() ? 0 : 1);
}

// ⚠️ AN EMPTY SCAN IS A FAILURE, NOT A PASS. A moved directory or a broken glob would make
// every forbidden pattern vanish while reporting the healthiest possible state — rule 5's
// decorative guard. A real tree here is ~100 files.
if (files.length < 40) {
  console.error(`check-contact: only ${files.length} source files found under src/ — that is not a scan, it is a broken path.`);
  process.exit(1);
}

const problems = scan(files);
if (problems.length) {
  console.error(`check-contact: ${problems.length} hard-coded contact detail(s). Import from @/lib/business instead.\n`);
  for (const p of problems) console.error(`  ${p.rel}:${p.line}  ${p.what}  (${p.found})`);
  console.error(`\n  The address and phone live in ${SOURCE_OF_TRUTH}. Changing them must be a one-line change.`);
  process.exit(1);
}
console.log(`check-contact: ${files.length} files, no hard-coded contact details — ${SOURCE_OF_TRUTH} is the only source.`);
