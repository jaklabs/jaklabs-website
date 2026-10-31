// Name, email and phone for JAK Labs, in ONE place.
//
// WHY THIS EXISTS — the measurement, taken 2026-10-31
//
// Swapping the published contact address from a personal Gmail to
// contact@jaklabs.io was logged in an earlier session as "a three-line change",
// on the strength of three call sites somebody had written down. It was
// ELEVEN, across NINE files: the JSON-LD block in the root layout, the contact
// page (display text and href, separately), the footer (display text and href,
// separately), the CTA section (both again), and five `MAILTO` constants in
// telehealth, ballast, ops-platform, quarry and EngagementScoper. Nothing
// connected them, so the only way to know the count was to grep — which is to
// say the only way to get it right was to already suspect it was wrong.
//
// This is the same disease `haslett-website` was built to cure: that project's
// own `src/lib/business.ts` exists because the Webflow site it replaced spelled
// the company five ways and routed ten pages of calls to a personal mobile. The
// fix there is this file plus a test that fails the build on a hard-coded copy,
// and the identical fix belongs here. `scripts/check-contact.mjs` is that test.
//
// ⚠️ DO NOT HARD-CODE THE EMAIL OR PHONE ANYWHERE ELSE. The build fails if you
// do. The failure mode being prevented is not ugliness — it is the twelfth call
// site added six months from now, which keeps the old address and is wrong on
// exactly one page that nobody checks.
//
// ── WHICH ADDRESS, AND WHY NOT THE OBVIOUS ONE ──────────────────────────────
//
// `contact@jaklabs.io` is a live alias on the WorkMail mailbox
// contact@hasletthandyman.info, and since 2026-10-31 an SES rule forwards it to
// JD's inbox (`infrastructure/create-inbound-mail.sh`). Verified by a message
// that actually arrived, not by a deploy that succeeded.
//
// ⚠️ NOT `jdakemp@jaklabs.io`. It is a verified SES identity — so it can SEND —
// but it is NOT an alias on either WorkMail user, and the WorkMail receipt rule
// claims the whole jaklabs.io domain. Mail to it therefore reaches WorkMail,
// finds no mailbox and bounces. Verified-for-sending and able-to-receive are
// different facts, and the SES identity list shows only the first.
//
// ⚠️ The footer used to carry a comment asserting that the apex "has no MX
// record, so that address receives nothing" and that "mail is configured on
// email.jaklabs.io". Both halves were false on 2026-10-31: the apex resolves
// `10 inbound-smtp.us-east-1.amazonaws.com` (WorkMail set it up), and
// `email.jaklabs.io` has no MX, no A and no CNAME — it does not exist. Its
// conclusion was right for the wrong reason, which is the worst kind: a reader
// acting on the stated premise would have gone looking for a host that was
// never there. Same shape as the `d1nlj4ijs1cqcv.cloudfront.net` fiction that
// blocked the Haslett media migration for a week.

/** Trading name, as it appears to readers. */
export const NAME = 'JAK Labs';

/** Registered entity. Contracts and JSON-LD `legalName` use this, not NAME. */
export const LEGAL_NAME = 'Jak Development LLC';

/** The published contact address. Forwards to JD's inbox; see the note above. */
export const EMAIL = 'contact@jaklabs.io';

/** `mailto:` for the address above. Append `?subject=…` where a page needs one. */
export const MAILTO = `mailto:${EMAIL}`;

/** Phone as a human reads it. */
export const PHONE_DISPLAY = '(517) 505-7135';

/** Phone for a `tel:` href — no punctuation, so dialers do not choke. */
export const PHONE_HREF = 'tel:+15175057135';

/** Phone in the hyphenated E.164 form schema.org expects for `telephone`. */
export const PHONE_E164 = '+1-517-505-7135';
