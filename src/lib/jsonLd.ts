/**
 * JSON-LD, escaped for the <script> element it has to live inside.
 *
 * WHY THIS EXISTS
 *
 * Six pages emit structured data as
 *
 *     dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
 *
 * and `JSON.stringify` does not escape `<`. Inside a `<script>`, the HTML parser
 * is not reading JSON — it ends the element at the first `</script`, wherever it
 * appears, including in the middle of a string. So a post titled
 *
 *     Why </script><img src=x onerror=alert(1)> breaks your blog
 *
 * closes the script early and the rest of the title is parsed as markup. The
 * title is CMS text, written in the CRM, so this is reachable without touching
 * the repository. `<!--` shifts the parser's state too, and `\u2028` / `\u2029`
 * are emitted literally by JSON.stringify while being line terminators to a JS
 * parser — all three are escaped here.
 *
 * ⚠️ USE THIS FOR EVERY JSON-LD BLOCK, including the ones whose data looks
 * static today. `scripts/check-jsonld.mjs` reads the built HTML and fails the
 * build on a raw `<` in any ld+json script, so a new block that forgets this
 * helper does not get to be the exception.
 *
 * ⚠️ IT IS SAFE TO REPLACE EVERY `<`. JSON's structural characters are
 * `{}[]":,` — a `<` can only ever occur inside a string value, and `<` is
 * the same character to any JSON parser, so the structured data a crawler reads
 * is unchanged.
 *
 * ⚠️ THIS IS HALF OF A TWO-PART FIX AND MUST LAND FIRST. The blog API currently
 * entity-encodes titles on write (`toPlainText` in lambda/shared/utils.ts), which
 * is why `Trades & Service` renders as `Trades &amp; Service`. That encoding is
 * what has been standing in for this escaping; removing it before this exists
 * would open the hole described above.
 */
export function jsonLd(data: unknown): string {
  return JSON.stringify(data)
    .replace(/</g, '\\u003c')
    // ⚠️ Written as escapes, not as the characters themselves. The first draft
    // of this file pasted the literal U+2028 into the regex, where it is a line
    // terminator to the JS parser — tsc called it an unterminated regular
    // expression. The character this line defends against broke the line.
    .replace(/\u2028/g, '\\u2028')
    .replace(/\u2029/g, '\\u2029')
}
