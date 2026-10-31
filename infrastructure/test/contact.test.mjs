/**
 * The contact form's destination (lambda/contact/index.mjs).
 * Each test names the broken build it fails against.
 *
 * WHY THIS FILE EXISTS: index.mjs has said since it was written that the recipient
 * "must match what the website displays, or a visitor writes to one address while the
 * form delivers to another — which was the case: the site showed two addresses and the
 * form used a third." That invariant was stated in PROSE and enforced by NOTHING, which
 * is how it came to be violated in the first place. On 2026-10-31 the site moved to
 * contact@jaklabs.io and the form was moved with it; this suite is what stops them
 * drifting apart a third time.
 */
import assert from 'node:assert/strict';
import { test } from 'node:test';
import { readFileSync } from 'node:fs';

const handler = readFileSync(new URL('../lambda/contact/index.mjs', import.meta.url), 'utf8');
const business = readFileSync(new URL('../../src/lib/business.ts', import.meta.url), 'utf8');

/** Source with comments blanked, so prose discussing an old address is not a value. */
const code = (t) => t.replace(/\/\*[\s\S]*?\*\//g, ' ').replace(/(^|[^:\\])\/\/.*$/gm, '$1 ');

const constant = (src, name) => {
  const m = new RegExp(`const\\s+${name}\\s*=\\s*'([^']+)'`).exec(code(src));
  assert.ok(m, `${name} is not a single-quoted string literal any more`);
  return m[1];
};

test('⭐ the form delivers to the address the website publishes', () => {
  // THE test for this file. Fails against any build where the two drift — which is the
  // documented original fault: the site showed two addresses and the form used a third,
  // so a visitor's reply-to expectations and their message went to different places.
  const published = constant(business, 'EMAIL');
  const recipient = constant(handler, 'RECIPIENT_EMAIL');
  assert.equal(recipient, published,
    `the form sends to ${recipient} but the site publishes ${published}`);
});

test('the published address is one that can actually RECEIVE mail', () => {
  // Fails against jdakemp@jaklabs.io, which AUDIT.md once recommended because it "reads
  // like a business". It is a verified SES *sending* identity and not an alias on either
  // WorkMail user, so mail to it reaches WorkMail, finds no mailbox and bounces.
  // Verified-for-sending and able-to-receive are different facts.
  const published = constant(business, 'EMAIL');
  assert.notEqual(published, 'jdakemp@jaklabs.io', 'that address bounces; see src/lib/business.ts');
  assert.match(published, /^contact@jaklabs\.io$/,
    'if this address changed, confirm it is an alias on a WorkMail user AND has an SES receipt rule');
});

test('⭐ the forwarder does not point back at an address this rule set receives', () => {
  // A loop guard. The form now sends TO contact@jaklabs.io, which SES receives and
  // forwards. That terminates only because FORWARD_TO is an external mailbox. Pointing it
  // at anything on jaklabs.io or hasletthandyman.info would make every form submission
  // circulate, and the symptom would be a mail storm rather than a quiet failure.
  const script = readFileSync(new URL('../create-inbound-mail.sh', import.meta.url), 'utf8');
  assert.match(script, /FORWARD_TO is passed in, never written in this file/,
    'FORWARD_TO is now hard-coded; check it is not an address this rule set receives');
  assert.doesNotMatch(script, /FORWARD_TO=["']?[a-z0-9._%+-]+@(jaklabs\.io|hasletthandyman\.(info|com))/i,
    'FORWARD_TO points at a domain SES receives for — that is a mail loop');
});

test('the sender stays a jaklabs.io address, and is NOT the recipient', () => {
  // Fails against a build that collapses Source and Destination into one constant. Sending
  // as gmail.com was tried and the mail silently vanished: SES accepted it, gmail.com
  // publishes p=none sp=quarantine, so there is no bounce — it is just dropped.
  const sender = constant(handler, 'SENDER_EMAIL');
  assert.match(sender, /@jaklabs\.io$/, 'Source must be on the verified SES domain');
  assert.notEqual(sender, constant(handler, 'RECIPIENT_EMAIL'),
    'Source and Destination are different things and must not be one constant');
});

test("a valid enquirer address is still set as Reply-To", () => {
  // This is the only property of the message that survives mattering. With the extra
  // forwarder hop, rewrite() prefers an existing Reply-To over the From it finds — so
  // losing this line would make every reply go to no-reply@jaklabs.io instead of the
  // person who filled in the form, and they would never hear back.
  assert.match(code(handler), /ReplyToAddresses:\s*\[\s*email\s*\]/,
    'the enquirer is no longer set as Reply-To');
});
