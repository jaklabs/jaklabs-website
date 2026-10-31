// Lambda: forward mail received at contact@jaklabs.io to JD's inbox.
//
// SES receives the message, stores it in S3 (MAIL_BUCKET/MAIL_PREFIX<messageId>), then
// invokes this. The rewrite rules live in rewrite.mjs and are tested offline.
//
// ⚠️ WORKMAIL STILL GETS ITS COPY, AND THAT IS DELIBERATE. `contact@jaklabs.io` is an alias
// on the WorkMail mailbox contact@hasletthandyman.info, reached by the rule
// `m-76c90ae2...` in the same shared rule set. Taking jaklabs.io off that rule's recipients
// would have meant editing the rule that carries ALL of Haslett's mail — including the
// work-order intake that bills — to gain nothing a second delivery does not already give
// us. So this rule is additive and carries no StopAction: mail lands in Gmail AND stays in
// the mailbox as an archive. It is ordered BEFORE the WorkMail rule so that it fires
// whatever the WorkMail action does to rule evaluation.
//
// ⚠️ A FAILURE THROWS. SES invokes asynchronously, so a throw is retried twice and lands in
// the logs, while a swallowed error would look exactly like a quiet inbox. The message
// itself is never lost: it stays in S3 for 90 days either way, and WorkMail has it too.
//
// ⚠️ DEBUGGING THIS: A MISSING OBJECT PRESENTS AS `AccessDenied`, NOT `NoSuchKey`, and the
// error names `s3:ListBucket`. The role has `s3:GetObject` on `contact/*` and deliberately
// NO `ListBucket` — and S3 consults ListBucket only to decide whether to answer 404 or 403,
// so without it a GetObject for a key that is not there returns AccessDenied rather than
// leaking the key's existence. That is correct and the grant should NOT be widened.
//
// The trap is that the next person to see `AccessDenied` in these logs will go hunting for
// an IAM problem that does not exist, and may "fix" it by adding ListBucket. Read WHICH
// ACTION the message names: `s3:ListBucket` means the key is absent; `s3:GetObject` would
// mean the grant is genuinely wrong. Found 24 Oct 2026 in the Morrell sibling while
// smoke-testing a deploy with a made-up messageId.

import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import { SESv2Client, SendEmailCommand } from '@aws-sdk/client-sesv2';
import { rewrite, verdictAction, recipients } from './rewrite.mjs';

const s3 = new S3Client({});
const ses = new SESv2Client({});

function need(name) {
  const v = process.env[name];
  if (!v) throw new Error(`${name} is not set`);
  return v;
}

export const handler = async (event) => {
  const rec = event?.Records?.[0]?.ses;
  if (!rec?.mail?.messageId) throw new Error('not an SES receipt event');
  const { mail, receipt } = rec;

  const action = verdictAction(receipt);
  if (action === 'drop') {
    console.log(JSON.stringify({ messageId: mail.messageId, outcome: 'dropped', reason: 'virus' }));
    return;
  }

  const obj = await s3.send(new GetObjectCommand({
    Bucket: need('MAIL_BUCKET'), Key: `${process.env.MAIL_PREFIX || ''}${mail.messageId}`,
  }));
  const raw = Buffer.from(await obj.Body.transformToByteArray()).toString('latin1');
  const out = rewrite(raw, {
    fromAddress: need('FROM_ADDRESS'),
    brand: need('BRAND'),
    spam: action === 'forward-flagged',
  });

  // ⚠️ REFUSED RATHER THAN SENT TO NOBODY. SES rejects the whole SendEmail on one invalid
  // address, so an empty entry from a stray comma in FORWARD_TO would stop the valid
  // recipient receiving it too — with a quiet inbox as the only symptom.
  const to = recipients(need('FORWARD_TO'));
  if (to.length === 0) throw new Error('FORWARD_TO names no usable mailbox');

  // ⚠️ NO `FromEmailAddress` HERE, AND THAT IS NOT AN OVERSIGHT. With Raw content, SESv2
  // treats `FromEmailAddress` as an OVERRIDE of the message's own From header — so passing
  // it silently discarded the `"<Name> via <brand>" <contact@…>` line that `rewrite()` had
  // just built, and every forwarded enquiry arrived showing nothing but the bare contact
  // address. The reader could not tell who had written without opening each one.
  //
  // It was invisible to everything: the offline test asserts the header `rewrite()`
  // PRODUCES, which was always correct, and SES accepted the send and returned a MessageId.
  // Found 24 Oct 2026 in the Morrell sibling, only by reading the raw headers of a message
  // that actually arrived. Fleet rule 2's cousin — a value that is right everywhere except
  // where it is used.
  //
  // Omitting it is safe because `rewrite()` always puts FROM_ADDRESS in the From line, so
  // the raw message's sender is the verified identity either way.
  const sent = await ses.send(new SendEmailCommand({
    Destination: { ToAddresses: to },
    Content: { Raw: { Data: Buffer.from(out.raw, 'latin1') } },
  }));
  console.log(JSON.stringify({ messageId: mail.messageId, outcome: 'forwarded', to: to.length, flagged: action === 'forward-flagged', sesId: sent.MessageId }));
};
