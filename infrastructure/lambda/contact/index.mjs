// jaklabs-contact-form — POST /contact on the "JAKLabs Contact API" (mfo28du4bj).
//
// ⚠️ HAND-DEPLOYED, NOT IN THE CDK APP. This file is the source of record; the
// function was created by hand in January and has no CloudFormation stack, so
// `cdk deploy` does not touch it. Deploy with:
//
//   cd infrastructure/lambda/contact && zip -q -r fn.zip index.mjs \
//     && aws lambda update-function-code --function-name jaklabs-contact-form \
//        --zip-file fileb://fn.zip && rm fn.zip
//
// Folding it into the CDK app is worth doing, but it would mean CloudFormation
// adopting a live function behind a live API — a separate, careful job.
//
// Uses @aws-sdk/client-ses from the runtime rather than a bundled copy, which
// is why there is no package.json here.

import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb';
import { randomBytes } from 'node:crypto';

const ses = new SESClient({ region: 'us-east-1' });
// Must match what the website displays, or a visitor writes to one address
// while the form delivers to another — which was the case: the site showed two
// addresses and the form used a third.
//
// NOT jdakemp@jaklabs.io: the apex domain has no MX record, so it receives
// nothing. Both of these are SES-verified, which Source requires.
const RECIPIENT_EMAIL = 'jdakemp@gmail.com';

const ddb = DynamoDBDocumentClient.from(new DynamoDBClient({}), {
  marshallOptions: { removeUndefinedValues: true },
});
const CRM_TABLE = process.env.CRM_TABLE || 'jaklabs-crm-prod';

// Mirrors backend/src/shared/ids.js. No l/o/0/1 — these get read out on the phone.
const ALPHABET = 'abcdefghijkmnpqrstuvwxyz23456789';
function slug(length = 8) {
  const bytes = randomBytes(length);
  let out = '';
  for (let i = 0; i < length; i += 1) out += ALPHABET[bytes[i] % ALPHABET.length];
  return out;
}

/**
 * Write the enquiry into the CRM as an inbound lead.
 *
 * Until now a submission existed only as an email. If SES failed, or the mail
 * was filtered, the enquiry was gone with nothing to recover — a single point
 * of failure on the only inbound channel the business has.
 *
 * The item shape mirrors backend/src/shared/schema.js EXACTLY. Getting GSI1PK
 * wrong does not error; it writes a lead that never appears on the board, which
 * is worse than failing outright. Keys are:
 *   PK/SK      LEAD#<id> / METADATA
 *   GSI1PK/SK  STAGE#<stage> / updatedAt   — the pipeline board
 *   GSI2PK/SK  ENTITY#LEAD / createdAt     — the directory
 *
 * The message body goes on an ACTIVITY item rather than into `notes`, so the
 * lead's timeline shows the enquiry as the first touch, the way it would if it
 * had come in by phone.
 */
async function saveLead({ name, email, phone, subject, message }) {
  const now = new Date().toISOString();
  const leadId = `lead_${slug()}`;

  await ddb.send(new PutCommand({
    TableName: CRM_TABLE,
    Item: {
      PK: `LEAD#${leadId}`,
      SK: 'METADATA',
      GSI1PK: 'STAGE#NEW',
      GSI1SK: now,
      GSI2PK: 'ENTITY#LEAD',
      GSI2SK: now,
      entityType: 'LEAD',
      leadId,
      stage: 'NEW',
      dealType: 'SERVICE',
      source: 'INBOUND',
      ownerName: name,
      business: '',
      businessType: '',
      email,
      phone: phone || '',
      // They came to us, which is the strongest signal a lead can carry, so it
      // starts warm rather than at the cold default.
      warmth: 4,
      howIKnowThem: 'Submitted the contact form on jaklabs.io',
      painSignal: subject,
      nextStep: 'Reply — inbound enquiry',
      notes: '',
      lastTouchedAt: now,
      createdAt: now,
      updatedAt: now,
    },
  }));

  const actId = `act_${slug()}`;
  await ddb.send(new PutCommand({
    TableName: CRM_TABLE,
    Item: {
      PK: `LEAD#${leadId}`,
      SK: `ACTIVITY#${now}#${actId}`,
      entityType: 'ACTIVITY',
      activityId: actId,
      leadId,
      type: 'EMAIL',
      body: `Contact form — ${subject}\n\n${message}`,
      system: true,
      createdAt: now,
    },
  }));

  return leadId;
}

/**
 * Escape before interpolating into the notification email.
 *
 * Every field here is attacker-controlled — it is a public form — and each one
 * was being dropped into an HTML email raw. A `<img src=x onerror=...>` in the
 * "name" field became live markup in the inbox, and mail clients are a weaker
 * sandbox than a browser. The message field additionally turns newlines into
 * <br>, which is the one piece of markup a visitor is allowed to cause, and it
 * happens AFTER escaping so it cannot be used to smuggle a tag.
 */
const esc = (v) => String(v ?? '')
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')
  .replace(/'/g, '&#39;');

export const handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json',
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  try {
    const body = JSON.parse(event.body || '{}');
    const { name, email, phone, subject, message } = body;

    if (!name || !email || !subject || !message) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Missing required fields' }),
      };
    }

    const emailParams = {
      Source: RECIPIENT_EMAIL,
      Destination: { ToAddresses: [RECIPIENT_EMAIL] },
      Message: {
        Subject: { Data: `[JAKLabs Contact] ${String(subject).slice(0, 120)}`, Charset: 'UTF-8' },
        Body: {
          Html: {
            Data: `
              <h2>New Contact Form Submission</h2>
              <p><strong>Name:</strong> ${esc(name)}</p>
              <p><strong>Email:</strong> ${esc(email)}</p>
              <p><strong>Phone:</strong> ${esc(phone) || 'Not provided'}</p>
              <p><strong>Subject:</strong> ${esc(subject)}</p>
              <hr />
              <p><strong>Message:</strong></p>
              <p>${esc(message).replace(/\n/g, '<br>')}</p>
            `,
            Charset: 'UTF-8',
          },
        },
      },
      // Only set a reply-to we believe SES will accept. A malformed address
      // makes the whole send throw, which loses the submission entirely — the
      // message matters more than the convenience of hitting reply.
      ...(/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(String(email)) ? { ReplyToAddresses: [email] } : {}),
    };

    // Two independent destinations, and NEITHER may take the other down.
    // The email is the channel Jak actually watches; the CRM row is the
    // durable record. A visitor's enquiry must survive either one failing, so
    // both are settled rather than awaited in sequence, and a rejection is
    // logged loudly instead of thrown.
    const [mail, crm] = await Promise.allSettled([
      ses.send(new SendEmailCommand(emailParams)),
      saveLead({ name, email, phone, subject, message }),
    ]);

    if (mail.status === 'rejected') console.error('SES send failed:', mail.reason);
    if (crm.status === 'rejected') console.error('CRM write failed:', crm.reason);

    // Only a total loss is an error to the visitor. If either landed, the
    // enquiry is recoverable and they should not be asked to send it twice.
    if (mail.status === 'rejected' && crm.status === 'rejected') {
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: 'Failed to send message' }),
      };
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ message: 'Email sent successfully' }),
    };
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Failed to send email' }),
    };
  }
};
