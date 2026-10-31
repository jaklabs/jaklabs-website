// Inbound mail for contact@jaklabs.io: turn a received message into one we may send on to
// JD's inbox. PURE: takes the raw message text and returns new text.
//
// ⚠️ WE CANNOT RESEND AS THE ORIGINAL SENDER. SES only sends From a verified identity, and
// a forwarded message still claiming "From: someone@gmail.com" would fail DMARC at Gmail
// anyway. So From becomes "<Name> via JAK Labs <contact@jaklabs.io>" and Reply-To carries
// the real sender, which means pressing Reply in Gmail answers the person who wrote, not
// ourselves. Losing Reply-To is the failure that matters: a reply to an agency enquiry
// would go to our own address and the enquirer would hear nothing.
//
// ⚠️ The message is handled as latin1 text so every byte survives the round trip (bodies
// may be binary attachments). Only header lines are touched; the body is never rewritten.
//
// ── PROVENANCE, AND THE SIBLING THAT MUST BE FIXED WITH IT ──────────────────────────────
// This is morrell-crm/lambda/mail-forwarder/rewrite.mjs with ONE change: the "via <brand>"
// label is a parameter instead of the literal "Morrell Ministries". Everything else is
// byte-for-byte that file, including four bugs it already paid for in production (see the
// comments below and in index.mjs).
//
// ⚠️ SO THERE ARE TWO COPIES IN THE FLEET, AND A FIX APPLIED TO ONE OF THEM IS HALF A FIX.
// The alternative — this agency's front door importing a module out of the ministry's repo
// at deploy time — was rejected: the fleet has already paid for a guard that could only run
// on the one machine where somebody had built the sibling. If a third mailbox ever needs
// forwarding, that is the point at which this becomes a shared package rather than a
// parameter, and `brand` is a parameter precisely so that move is mechanical.

const DROP = new Set(['dkim-signature', 'return-path', 'sender', 'message-id', 'from', 'reply-to']);

/** Split raw MIME into unfolded header fields and the untouched body. */
export function splitMessage(raw) {
  const m = /\r?\n\r?\n/.exec(raw);
  const head = m ? raw.slice(0, m.index) : raw;
  const body = m ? raw.slice(m.index + m[0].length) : '';
  const eol = m && m[0].startsWith('\r') ? '\r\n' : '\n';
  const fields = [];
  for (const line of head.split(/\r?\n/)) {
    if (/^[ \t]/.test(line) && fields.length) fields[fields.length - 1].raw += eol + line;
    else if (line) fields.push({ name: line.slice(0, line.indexOf(':')).trim(), raw: line });
  }
  return { fields, body, eol };
}

const valueOf = (f) => f.raw.slice(f.raw.indexOf(':') + 1).replace(/\r?\n[ \t]+/g, ' ').trim();

/** The display name to show in "<name> via <brand>", safe inside quotes. */
export function displayName(from) {
  const m = /^\s*"?([^"<]*?)"?\s*<([^>]+)>/.exec(from || '');
  let name = m ? m[1].trim() : '';
  const addr = (m ? m[2] : from || '').trim();
  // An RFC 2047 encoded-word may not sit inside a quoted string, so fall back to the address.
  if (!name || /=\?/.test(name)) name = addr;
  return name.replace(/["\\<>\r\n]/g, '').slice(0, 80) || 'Unknown sender';
}

/**
 * Rewrite a received message for forwarding.
 *
 * ⚠️ `brand` IS REQUIRED AND IS NOT DEFAULTED. It is the only thing that differs from the
 * Morrell copy, so it is the only thing a careless deploy can get wrong — and the wrong
 * value is not a crash, it is every forwarded enquiry arriving labelled "via " or, worse,
 * "via Morrell Ministries" in JD's agency inbox. A missing brand throws here rather than
 * producing a message that looks almost right. Fleet rule 2: a missing value and a real
 * one must not produce the same output.
 *
 * @returns {{ raw: string, replyTo: string }} the message to send, and who a reply reaches
 */
export function rewrite(raw, { fromAddress, brand, spam = false }) {
  if (!fromAddress) throw new Error('fromAddress is required');
  if (!brand || !String(brand).trim()) throw new Error('brand is required');
  const label = String(brand).replace(/["\\<>\r\n]/g, '').trim();
  const { fields, body, eol } = splitMessage(raw);
  const get = (n) => fields.find((f) => f.name.toLowerCase() === n);
  const from = get('from') ? valueOf(get('from')) : '';
  const replyTo = get('reply-to') ? valueOf(get('reply-to')) : from;
  if (!replyTo) throw new Error('message has no From or Reply-To; a reply could reach nobody');

  const kept = fields.filter((f) => !DROP.has(f.name.toLowerCase()));
  if (spam) {
    const s = kept.find((f) => f.name.toLowerCase() === 'subject');
    if (s) s.raw = `Subject: [Possible spam] ${valueOf(s)}`;
    else kept.push({ name: 'Subject', raw: 'Subject: [Possible spam]' });
  }
  const out = [
    `From: "${displayName(from)} via ${label}" <${fromAddress}>`,
    `Reply-To: ${replyTo}`,
    `X-Original-From: ${from.replace(/[\r\n]/g, ' ')}`,
    ...kept.map((f) => f.raw),
  ];
  return { raw: out.join(eol) + eol + eol + body, replyTo };
}

/** What to do with a message given SES's scan verdicts. Unknown verdicts forward. */
export function verdictAction(receipt) {
  if (receipt?.virusVerdict?.status === 'FAIL') return 'drop';
  if (receipt?.spamVerdict?.status === 'FAIL') return 'forward-flagged';
  return 'forward';
}

/**
 * Who a forwarded message goes to, from a comma-separated FORWARD_TO.
 *
 * ⚠️ IT FILTERS EMPTY ENTRIES, AND THAT IS THE WHOLE POINT. The Morrell original used
 * `need('FORWARD_TO').split(',').map((s) => s.trim())` with no filter, so a trailing comma
 * or a double comma yielded `['a@x.org', '']` — and SES rejects the ENTIRE SendEmail on an
 * invalid address, so **nobody** receives the message, not even the valid recipient. A
 * one-character typo in an environment variable silently switches the whole forwarder off,
 * and the only symptom is a quiet inbox. Found 24 Oct 2026 in the ministry's copy, which is
 * exactly when somebody edits that variable by hand for the first time.
 *
 * ⚠️ AN EMPTY RESULT IS NOT SILENTLY ACCEPTABLE either; the caller must refuse to send
 * rather than call SES with no destination, because "forwarded to nobody" and "forwarded"
 * must not share an observable.
 */
export function recipients(raw) {
  return String(raw || '')
    .split(',')
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
}
