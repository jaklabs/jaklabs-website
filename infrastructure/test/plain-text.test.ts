/**
 * Tests for toPlainText — written from the incident, not for coverage.
 *
 * THE INCIDENT: the post titled `Trades & Service Business Owner was the
 * surprise on this list` rendered as `Trades &amp; Service Business Owner`, and
 * the live <title> read `Trades &amp;amp; Service`. Nobody typed that. Every
 * title goes through toPlainText, which is `sanitize-html` with
 * `allowedTags: []` — it strips markup, which is intended, and entity-encodes
 * the text it keeps, which is not. Consumers that escape properly then escaped
 * it a second time.
 *
 * It was invisible for as long as it was because it needs an `&` in a title, and
 * exactly one of 48 posts had one.
 *
 * ⚠️ THE ORDERING TEST IS THE ONE THAT MATTERS. Decoding `&amp;` before `&lt;`
 * turns text that was written as a visible `&lt;` into real markup — the fix
 * reintroducing the class of problem it was meant to remove.
 *
 *   npx ts-node --transpile-only test/plain-text.test.ts
 */
import assert from 'node:assert/strict'
import test from 'node:test'
import { toPlainText, buildExcerpt } from '../lambda/shared/utils'

test('an ampersand survives as an ampersand', () => {
  assert.equal(
    toPlainText('Trades & Service Business Owner was the surprise on this list'),
    'Trades & Service Business Owner was the surprise on this list',
  )
})

test('IDEMPOTENT: storing a stored value does not re-encode it', () => {
  // The repair script reads a row, writes it back, and re-reads it. If this
  // function were not a fixed point the value would drift on every edit.
  const once = toPlainText('Trades & Service')
  assert.equal(toPlainText(once), once)
})

test('markup is still stripped — that part was never the problem', () => {
  assert.equal(toPlainText('<b>bold</b> and <script>alert(1)</script> text'), 'bold and text')
  assert.equal(toPlainText('<img src=x onerror=alert(1)>Hello'), 'Hello')
})

test('ORDER: text written as a visible &lt; stays visible text', () => {
  // `&amp;lt;` is what sanitize-html produces from the literal text `&lt;`.
  // Decoding `&amp;` first would yield `&lt;` and then `<` — real markup out of
  // something the author typed as characters.
  assert.equal(toPlainText('write &amp;lt; to show a less-than'), 'write &lt; to show a less-than')
})

test('a real less-than is decoded, not left as an entity', () => {
  assert.equal(toPlainText('a &lt; b and c &gt; d'), 'a < b and c > d')
})

test('quotes and apostrophes come back as characters', () => {
  assert.equal(toPlainText('say &quot;hi&quot; and it&#39;s fine'), 'say "hi" and it\'s fine')
  assert.equal(toPlainText('it&#x27;s'), "it's")
})

test('nbsp collapses to a single space, as before', () => {
  assert.equal(toPlainText('a&nbsp;&nbsp;b'), 'a b')
})

test('whitespace is still collapsed and trimmed', () => {
  assert.equal(toPlainText('  a\n\n  b  '), 'a b')
})

test('buildExcerpt inherits the fix', () => {
  // It calls toPlainText, so the index summary carried the same double-escape.
  assert.equal(buildExcerpt('Tom & Jerry', '<p>ignored</p>'), 'Tom & Jerry')
})

test('the excerpt is still derived from SANITISED content, never raw input', () => {
  // Guarding the older incident recorded above buildExcerpt: a <script> was
  // stripped from the post and kept verbatim in the excerpt beside it.
  const excerpt = buildExcerpt(undefined, '<p>safe body</p>')
  assert.equal(excerpt, 'safe body')
})
