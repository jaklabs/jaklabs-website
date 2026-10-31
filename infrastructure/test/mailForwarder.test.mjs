/**
 * The contact@jaklabs.io forwarder (lambda/mail-forwarder/rewrite.mjs).
 * Each test names the broken build it fails against.
 *
 * Carried over from morrell-crm/src/lib/mailForwarder.test.ts, which is the suite that
 * caught four production bugs in the module this one is a copy of. The copy is the point:
 * if the ministry's tests were the only ones, a change made here would be unguarded.
 */
import assert from 'node:assert/strict';
import { test } from 'node:test';
import { readFileSync } from 'node:fs';
import { rewrite, displayName, verdictAction, recipients } from '../lambda/mail-forwarder/rewrite.mjs';

const FROM = 'contact@jaklabs.io';
const BRAND = 'JAK Labs';
const opts = { fromAddress: FROM, brand: BRAND };
const msg = (head, body = 'Hello,\r\nI need help automating my invoicing.\r\n') =>
  head.split('\n').join('\r\n') + '\r\n\r\n' + body;

const sample = msg(`Return-Path: <jane@example.com>
DKIM-Signature: v=1; a=rsa-sha256; d=example.com;
 b=abc123
From: "Jane Doe" <jane@example.com>
To: contact@jaklabs.io
Subject: Automation enquiry
Message-ID: <1@example.com>
MIME-Version: 1.0
Content-Type: text/plain`);

test('a reply reaches the person who wrote, not our own address', () => {
  // Fails against a build that drops Reply-To: JD would answer his own address and the
  // prospect would hear nothing. This is the whole reason the forwarder rewrites at all.
  const { raw, replyTo } = rewrite(sample, opts);
  assert.equal(replyTo, '"Jane Doe" <jane@example.com>');
  assert.match(raw, /^Reply-To: "Jane Doe" <jane@example\.com>$/m);
});

test('it sends From our verified address, never as the original sender', () => {
  // Fails against a build that keeps the original From: SES refuses it and Gmail fails DMARC.
  const { raw } = rewrite(sample, opts);
  const froms = raw.split('\r\n\r\n')[0].split('\r\n').filter((l) => /^From:/i.test(l));
  assert.deepEqual(froms, ['From: "Jane Doe via JAK Labs" <contact@jaklabs.io>']);
});

test('⭐ the brand is OURS, not the ministry it was copied from', () => {
  // THE test for this copy. rewrite.mjs is byte-for-byte morrell-crm's but for the brand
  // parameter, so the cheapest possible mistake is a literal left behind — and the symptom
  // is agency enquiries arriving in JD's inbox labelled "via Morrell Ministries", which
  // reads as a misdirected email rather than as a bug.
  const head = rewrite(sample, opts).raw.split('\r\n\r\n')[0];
  assert.match(head, /via JAK Labs/);
  assert.doesNotMatch(head, /Morrell|Ministries/i);
  const src = readFileSync(new URL('../lambda/mail-forwarder/rewrite.mjs', import.meta.url), 'utf8');
  const code = src.replace(/\/\*[\s\S]*?\*\//g, ' ').replace(/(^|[^:])\/\/.*$/gm, '$1 ');
  assert.doesNotMatch(code, /Morrell/i, 'a Morrell literal is back in the code');
});

test('⭐ a missing brand throws rather than forwarding mail labelled "via "', () => {
  // Fails against a build that defaults the brand to '' or to the sibling's value. A
  // defaulted brand is the dangerous version: it forwards successfully and looks almost
  // right, so nothing ever reports it. Rule 2 — a missing value and a real one must not
  // produce the same output.
  for (const bad of [undefined, '', '   ', null]) {
    assert.throws(() => rewrite(sample, { fromAddress: FROM, brand: bad }), /brand is required/,
      `brand=${JSON.stringify(bad)}`);
  }
});

test('a brand carrying header metacharacters cannot break out of the From line', () => {
  // Fails against a build that interpolates the brand raw: a newline would inject a header.
  const { raw } = rewrite(sample, { fromAddress: FROM, brand: 'JAK"\r\nBcc: evil@x.com' });
  const head = raw.split('\r\n\r\n')[0];
  assert.doesNotMatch(head, /^Bcc:/mi);
  assert.equal(head.split('\r\n').filter((l) => /^From:/i.test(l)).length, 1);
});

test('the old signature, return path and message id are removed, folded lines included', () => {
  // Fails against a build that leaves a folded DKIM continuation line orphaned in the header.
  const head = rewrite(sample, opts).raw.split('\r\n\r\n')[0];
  assert.doesNotMatch(head, /DKIM-Signature|Return-Path|Message-ID|b=abc123/i);
  assert.match(head, /^Subject: Automation enquiry$/m);
  assert.match(head, /^To: contact@jaklabs\.io$/m);
});

test('the body is passed through byte for byte', () => {
  const body = 'line one\r\n\r\nline \xe9 two\r\n';
  const out = rewrite(msg('From: a@b.com\nSubject: x', body), opts);
  assert.ok(out.raw.endsWith('\r\n\r\n' + body));
});

test('an existing Reply-To wins over From', () => {
  const out = rewrite(msg('From: list@x.org\nReply-To: real@y.org\nSubject: s'), opts);
  assert.equal(out.replyTo, 'real@y.org');
  assert.equal(out.raw.split('\r\n').filter((l) => /^Reply-To:/i.test(l)).length, 1);
});

test('a message with nobody to reply to is refused, not forwarded blind', () => {
  assert.throws(() => rewrite(msg('Subject: hi'), opts), /reply could reach nobody/);
});

test('display names that would break the header fall back safely', () => {
  assert.equal(displayName('"Smith, Bob" <bob@x.com>'), 'Smith, Bob');
  assert.equal(displayName('=?UTF-8?B?Sm9zw6k=?= <jose@x.com>'), 'jose@x.com');
  assert.equal(displayName('plain@x.com'), 'plain@x.com');
  assert.equal(displayName('"Evil\\" <x>" <e@x.com>'), 'Evil');
});

test('virus is dropped, spam is flagged, unknown verdicts still forward', () => {
  // Fails against a build that drops on an unknown verdict: a missing scan must not lose mail.
  assert.equal(verdictAction({ virusVerdict: { status: 'FAIL' } }), 'drop');
  assert.equal(verdictAction({ spamVerdict: { status: 'FAIL' } }), 'forward-flagged');
  assert.equal(verdictAction({ spamVerdict: { status: 'GRAY' } }), 'forward');
  assert.equal(verdictAction(undefined), 'forward');
  const flagged = rewrite(sample, { ...opts, spam: true }).raw;
  assert.match(flagged, /^Subject: \[Possible spam\] Automation enquiry$/m);
});

// ── FORWARD_TO ───────────────────────────────────────────────────────────────────────────

test('⭐ a stray comma in FORWARD_TO does not switch the forwarder off', () => {
  // THE test for this. The Morrell original used `.split(',').map(s => s.trim())` with no
  // filter, so "a@x.org," yielded ['a@x.org', ''] — and SES rejects the ENTIRE SendEmail on
  // one invalid address, so NOBODY receives the message, not even the valid recipient. A
  // one-character typo in an environment variable silently stops every inbound agency
  // enquiry reaching a human, and the only symptom is a quiet inbox.
  assert.deepEqual(recipients('a@x.org,'), ['a@x.org']);
  assert.deepEqual(recipients(',a@x.org'), ['a@x.org']);
  assert.deepEqual(recipients('a@x.org,,b@x.org'), ['a@x.org', 'b@x.org']);
});

test('whitespace around an address is trimmed, not preserved', () => {
  // A human editing this variable will put spaces after the commas.
  assert.deepEqual(recipients(' a@x.org , b@x.org '), ['a@x.org', 'b@x.org']);
});

test('an unset or empty FORWARD_TO yields NO recipients, never a blank one', () => {
  // The handler refuses to call SES on an empty list rather than sending to nobody:
  // "forwarded to nobody" and "forwarded" must not share an observable.
  for (const blank of ['', '   ', ',', ' , , ', undefined, null]) {
    assert.deepEqual(recipients(blank), [], JSON.stringify(blank ?? null));
  }
});

test('the handler refuses an empty recipient list rather than calling SES', () => {
  // Read off the source, because the refusal is the point and a test that only checked
  // `recipients` would pass against a handler that ignored it.
  const src = readFileSync(new URL('../lambda/mail-forwarder/index.mjs', import.meta.url), 'utf8');
  assert.match(src, /const to = recipients\(need\('FORWARD_TO'\)\)/);
  assert.match(src, /if \(to\.length === 0\) throw new Error/);
  assert.doesNotMatch(src, /FORWARD_TO'\)\.split/, 'the unfiltered split is back');
});

test('⭐ the handler reads BRAND from the environment and requires it', () => {
  // Fails against a handler that hardcodes the brand or lets it be absent. `need()` is what
  // makes a missing BRAND a loud deploy failure instead of a mislabelled inbox.
  const src = readFileSync(new URL('../lambda/mail-forwarder/index.mjs', import.meta.url), 'utf8');
  assert.match(src, /brand: need\('BRAND'\)/);
});

test('⭐ the handler does not let SES override the From it just built', () => {
  // `rewrite()` builds `"<Name> via JAK Labs" <contact@…>` so the reader can see WHO wrote
  // without opening the message. With Raw content, SESv2 treats FromEmailAddress as an
  // OVERRIDE of that header — so passing it threw the display name away and every forwarded
  // enquiry arrived as a bare contact address.
  //
  // ⚠️ NOTHING OFFLINE COULD SEE IT. The test above asserts the header rewrite() PRODUCES,
  // which was always right; SES accepted the send and returned a MessageId. It was found by
  // reading the raw headers of a delivered message. So the guard has to be on the CALL, and
  // it reads the source.
  const src = readFileSync(new URL('../lambda/mail-forwarder/index.mjs', import.meta.url), 'utf8');
  const call = src.slice(src.indexOf('new SendEmailCommand'));
  assert.doesNotMatch(call, /FromEmailAddress/, 'FromEmailAddress is back; it overrides the From header');
  assert.match(call, /Content: \{ Raw:/, 'the send is no longer raw, so this guard no longer applies');
});
