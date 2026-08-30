// SSRF boundary tests for the public website-audit endpoint.
//
// WHY THIS FILE EXISTS, AND WHY IT SHOULD HAVE EXISTED FIRST
//
// /website-audit is unauthenticated and public. Anyone can hand it a URL and it
// will drive headless Chromium at that URL from inside AWS. That is a
// server-side request forgery primitive unless assertPublicHttpUrl holds, and
// the thing it most obviously reaches is the EC2 instance metadata endpoint at
// 169.254.169.254 — which, if the Lambda ever ran with a role that mattered,
// hands over credentials.
//
// The boundary was written carefully and the vectors below were checked by hand
// against the deployed endpoint when it shipped. What did not exist was any
// REGRESSION protection: nothing stopped a later edit — a refactor, a "just let
// localhost through for testing" — from quietly reopening it. A security control
// with no test is a security control with a shelf life.
//
// Run: node --test handler.test.ts     (Node strips the types natively)

import { test } from 'node:test'
import assert from 'node:assert/strict'
import { assertPublicHttpUrl } from './url-guard.ts'

/** Every input that must be refused, and the reason it matters. */
const BLOCKED: [string, string][] = [
  // The one that turns SSRF into credential theft.
  ['http://169.254.169.254/latest/meta-data/', 'EC2 instance metadata'],
  ['http://169.254.169.254', 'link-local, bare'],

  // Loopback, in the spellings people actually try.
  ['http://localhost', 'localhost'],
  ['http://localhost:8080/admin', 'localhost with port and path'],
  ['http://api.localhost', 'localhost subdomain'],
  ['http://127.0.0.1', 'IPv4 loopback'],
  ['http://[::1]', 'IPv6 loopback'],
  ['http://0.0.0.0', 'unspecified address'],

  // RFC1918 — the internal network the Lambda might sit next to.
  ['http://10.0.0.1', 'RFC1918 10/8'],
  ['http://172.16.0.1', 'RFC1918 172.16/12 lower bound'],
  ['http://172.31.255.254', 'RFC1918 172.16/12 upper bound'],
  ['http://192.168.1.1', 'RFC1918 192.168/16'],
  ['http://100.64.0.1', 'carrier-grade NAT'],
  ['http://239.255.255.250', 'multicast'],

  // Internal DNS suffixes.
  ['http://consul.internal', '.internal suffix'],
  ['http://printer.local', '.local suffix'],

  // Non-HTTP schemes.
  ['file:///etc/passwd', 'file scheme'],
  ['gopher://evil.example.com/', 'gopher scheme'],
  ['ftp://example.com/', 'ftp scheme'],

  // Credentials in the URL: a way to authenticate to something internal.
  ['http://user:pass@example.com', 'credentials in URL'],
  ['https://admin:hunter2@internal.example.com', 'credentials, https'],

  // Not an address at all.
  ['notahost', 'no dot, not a hostname'],
  ['', 'empty'],
]

for (const [input, why] of BLOCKED) {
  test(`blocks ${why}: ${input || '(empty)'}`, () => {
    assert.throws(() => assertPublicHttpUrl(input), Error,
      `${input} was NOT blocked — this is an SSRF hole`)
  })
}

/** Ordinary public addresses must still work, or the tool is useless. */
const ALLOWED: [string, string][] = [
  ['example.com', 'bare hostname, scheme added'],
  ['https://example.com', 'https'],
  ['http://example.com', 'http'],
  ['https://example.com/some/path?q=1', 'path and query'],
  ['https://sub.domain.example.co.uk', 'multi-level domain'],
  ['EXAMPLE.COM', 'uppercase'],
  ['https://8.8.8.8', 'public IP literal'],
  ['https://172.15.0.1', 'just below RFC1918 172.16 — must NOT be blocked'],
  ['https://172.32.0.1', 'just above RFC1918 172.31 — must NOT be blocked'],
  ['https://192.169.0.1', 'adjacent to 192.168 — must NOT be blocked'],
  ['https://11.0.0.1', 'adjacent to 10/8 — must NOT be blocked'],
]

for (const [input, why] of ALLOWED) {
  test(`allows ${why}: ${input}`, () => {
    assert.doesNotThrow(() => assertPublicHttpUrl(input),
      `${input} was blocked — the boundary is too tight and the tool stops working`)
  })
}

// The four cases above that sit one address either side of a private range are
// the ones worth keeping. A boundary that blocks 172.16-172.31 is correct; one
// that blocks all of 172/8 is a bug that nobody notices because the failure is
// "some sites do not work" rather than an error.
test('the ranges are bounded, not blanket', () => {
  assert.throws(() => assertPublicHttpUrl('http://172.16.0.1'))
  assert.throws(() => assertPublicHttpUrl('http://172.31.0.1'))
  assert.doesNotThrow(() => assertPublicHttpUrl('http://172.15.0.1'))
  assert.doesNotThrow(() => assertPublicHttpUrl('http://172.32.0.1'))
})

test('returns a URL with the scheme filled in', () => {
  const u = assertPublicHttpUrl('example.com')
  assert.equal(u.protocol, 'https:')
  assert.equal(u.hostname, 'example.com')
})
