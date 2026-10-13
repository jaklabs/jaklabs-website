import { v4 as uuidv4 } from 'uuid'
import sanitize from 'sanitize-html'

export function generateId(): string {
  return uuidv4()
}

export function generateSlug(title: string): string {
  return title.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').substring(0, 100)
}

export function calculateReadingTime(content: string): number {
  const wordsPerMinute = 200
  const wordCount = content.trim().split(/\s+/).length
  return Math.max(1, Math.ceil(wordCount / wordsPerMinute))
}

export function getCurrentTimestamp(): string {
  return new Date().toISOString()
}

export function formatDateKey(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toISOString().split('T')[0] + '#' + d.getTime()
}

export function getUserFromEvent(event: any): { userId: string; email: string; groups: string[] } | null {
  const claims = event.requestContext?.authorizer?.claims
  if (!claims) return null
  return { userId: claims.sub, email: claims.email, groups: claims['cognito:groups']?.split(',') || [] }
}

export function isAdmin(event: any): boolean {
  const user = getUserFromEvent(event)
  return user?.groups.includes('Admins') || false
}

/** Who a written post is attributed to. */
export interface Author { authorId: string; authorName: string }

/**
 * The IAM-signed machine caller, or null.
 *
 * WHY THIS EXISTS — and why it is not a second way to be an admin.
 *
 * `content-engine/push.py` runs in a terminal, which has no Cognito session.
 * Getting a verified draft into the CRM therefore meant a human pasting a
 * browser id token. The two shortcuts around that are both bad: invoking this
 * Lambda directly with a hand-written `requestContext.authorizer.claims` forges
 * the identity stamped onto the byline, and parking a 30-day refresh token in a
 * secret store hands a month of impersonation to whatever reads it.
 *
 * So the engine gets its OWN identity instead, authenticated by AWS SigV4 on a
 * route of its own. API Gateway verifies the signature before any code runs —
 * exactly as the Cognito authorizer does for a person — and the post is authored
 * by the machine rather than by a human it is pretending to be.
 *
 * ⚠️ BOTH CONDITIONS ARE LOAD-BEARING.
 *
 * The resource path must be a /machine/ route AND API Gateway must have attested
 * an IAM principal. Neither alone is enough:
 *
 *   * `event.resource` is the matched route TEMPLATE, filled in by API Gateway,
 *     not anything a client sends — but on its own it would mean a route whose
 *     authorizer was later loosened to NONE still minted a machine author.
 *   * `requestContext.identity.userArn` is populated only when IAM auth actually
 *     ran, and is null on the Cognito routes and on public GET /blogs — but on
 *     its own it would let any future IAM-authorised route author posts.
 *
 * Requiring both means the only way to be a machine author is to have signed a
 * request to a route that was declared IAM-authorised in the stack.
 *
 * ⚠️ It returns an author, NOT admin rights. isAdmin() is untouched and still
 * means "a Cognito user in the Admins group", so nothing that guards on it —
 * draft visibility in the listings, update, delete — silently widens to the
 * machine. A machine route that wants a capability has to be given it by name.
 */
export function machineCallerFromEvent(event: any): Author | null {
  if (!String(event?.resource || '').startsWith('/machine/')) return null
  const arn = event?.requestContext?.identity?.userArn
  if (!arn) return null

  // arn:aws:sts::<acct>:assumed-role/<RoleName>/<session>  → RoleName
  // arn:aws:iam::<acct>:user/<UserName>                    → UserName
  const parts = String(arn).split('/')
  const name = (String(arn).includes(':assumed-role/') ? parts[1] : parts[parts.length - 1]) || 'machine'
  return { authorId: String(arn), authorName: name }
}

/**
 * Who to attribute a new post to, or null if nobody may write one.
 *
 * One definition, so the Cognito path and the machine path cannot drift into
 * attributing posts differently. The Cognito branch is byte-identical to what it
 * was before this function existed — `claims.sub` and the local part of the
 * email — because the posts already in the table carry those values.
 */
export function authorFor(event: any): Author | null {
  const machine = machineCallerFromEvent(event)
  if (machine) return machine
  if (!isAdmin(event)) return null
  const user = getUserFromEvent(event)
  if (!user) return null
  return { authorId: user.userId, authorName: user.email.split('@')[0] }
}

/**
 * Post content, reduced to markup we are willing to render on a public page.
 *
 * This used to be two regexes: strip <script> blocks, strip on*="..." handlers.
 * Both are trivially evaded — single-quoted and unquoted handlers survive
 * (`onerror='...'`, `onerror=alert(1)`), as do `javascript:` hrefs, <iframe>,
 * <object>, and `<svg onload=…>`. Blocklists lose this game by construction:
 * every one only knows the attacks someone thought of.
 *
 * So this is an ALLOWLIST, and a library's rather than mine. Sanitising HTML
 * correctly means parsing it the way a browser does, and hand-rolled regex
 * parsers are the single most reliable way to ship an XSS hole.
 *
 * The allowlist is deliberately what a blog post needs and nothing else. There
 * is no <style>, no <form>, no <iframe> — if a post ever needs an embed, add
 * that one case here on purpose rather than widening the list.
 */
export function sanitizeHtml(html: string): string {
  return sanitize(html, {
    allowedTags: [
      'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      'p', 'br', 'hr', 'blockquote', 'pre', 'code',
      'strong', 'em', 'b', 'i', 'u', 's', 'sub', 'sup', 'mark',
      'ul', 'ol', 'li', 'dl', 'dt', 'dd',
      'a', 'img', 'figure', 'figcaption',
      'table', 'thead', 'tbody', 'tfoot', 'tr', 'th', 'td', 'caption',
      'span', 'div',
    ],
    allowedAttributes: {
      a: ['href', 'title', 'target', 'rel'],
      img: ['src', 'alt', 'title', 'width', 'height', 'loading'],
      // Language hints drive syntax highlighting; they are the only class
      // names worth keeping, and the transform below strips anything else.
      code: ['class'],
      pre: ['class'],
      th: ['colspan', 'rowspan', 'scope'],
      td: ['colspan', 'rowspan'],
      '*': ['id'],
    },
    // No `javascript:`, no `data:` — a data: URL in an href is a script vector.
    allowedSchemes: ['http', 'https', 'mailto'],
    allowedSchemesByTag: { img: ['http', 'https'] },
    // An external link opened in a new tab hands the opener to the target
    // unless this is set, so it is set for every link rather than trusted to
    // whoever wrote the post.
    transformTags: {
      a: (tagName, attribs) => ({
        tagName,
        attribs: attribs.target === '_blank'
          ? { ...attribs, rel: 'noopener noreferrer' }
          : attribs,
      }),
      code: (tagName, attribs) => ({
        tagName,
        attribs: /^language-[\w+-]+$/.test(attribs.class || '')
          ? { class: attribs.class }
          : ({} as Record<string, string>),
      }),
    },
    // Comments can carry payloads for downstream template engines and are
    // never useful in stored post content.
    allowedIframeHostnames: [],
    disallowedTagsMode: 'discard',
  })
}

/**
 * Entity decoding, innermost first and `&amp;` LAST.
 *
 * ⚠️ THE ORDER IS THE WHOLE THING. Decode `&amp;` first and `&amp;lt;` becomes
 * `&lt;` becomes `<` on the next pass — text that was deliberately written as a
 * visible `&lt;` turns into real markup, which is precisely what the caller is
 * trying not to produce. Going the other way, `&amp;lt;` contains no `&lt;`
 * substring, so the inner passes leave it alone and the final `&amp;` pass
 * yields the literal text `&lt;`. Correct.
 */
function decodeEntities(text: string): string {
  return text
    .replace(/&nbsp;/g, ' ')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#0*39;|&#x0*27;/gi, "'")
    .replace(/&amp;/g, '&')   // ⚠️ LAST. See above.
}

/**
 * Strip markup entirely. For fields that are text, not HTML.
 *
 * An excerpt and a title are rendered in places React does not escape for you —
 * a <meta> description, JSON-LD, an og:title. Stripping the markup is what makes
 * them safe to put there.
 *
 * ⚠️ IT DECODES, AND IT DID NOT UNTIL 2026-10-12. `sanitize-html` with
 * `allowedTags: []` strips tags — intended — and ALSO entity-encodes the text it
 * keeps, which is a RENDERING decision made at REST:
 *
 *     "Trades & Service"  ->  "Trades &amp; Service"
 *     "a < b"             ->  "a &lt; b"
 *
 * Every consumer that escapes properly then escaped it a second time, so the
 * live <title> read `Trades &amp;amp; Service Business Owner` — the line search
 * results and social previews show. No title containing `&` could be stored with
 * a bare `&` through this API at all; a repair script sent the right string, got
 * a 2xx, and read its own value back unchanged.
 *
 * ⚠️ THE ENCODING WAS LOAD-BEARING UNTIL `src/lib/jsonLd.ts` SHIPPED. The blog
 * pages print structured data through `dangerouslySetInnerHTML` with
 * `JSON.stringify`, which does not escape `<`, so a title containing
 * `</script>` would have broken out of that block. That escaping now happens at
 * the JSON-LD boundary, where it belongs, and `scripts/check-jsonld.mjs` fails
 * the build if a block skips it. Do not reintroduce encoding here as a second
 * line of defence — two half-applied escapes are what produced the visible bug.
 */
export function toPlainText(html: string): string {
  return decodeEntities(sanitize(html, { allowedTags: [], allowedAttributes: {} }))
    .replace(/\s+/g, ' ')
    .trim()
}

/**
 * The summary shown on the blog index.
 *
 * Derived from the SANITISED content, never the raw body. This previously read
 * `body.excerpt || body.content.substring(0, 200)` — off the raw input, before
 * sanitizeHtml touched it — so a <script> in the post body was stripped from
 * the post and kept verbatim in the excerpt that renders on the index page. The
 * sanitiser was doing its job and the hole was next to it.
 *
 * Truncated on a word boundary; a summary that stops mid-word looks broken.
 */
export function buildExcerpt(provided: string | undefined, sanitizedContent: string, max = 200): string {
  const text = toPlainText(provided || sanitizedContent)
  if (text.length <= max) return text
  const cut = text.slice(0, max)
  const lastSpace = cut.lastIndexOf(' ')
  return (lastSpace > max * 0.6 ? cut.slice(0, lastSpace) : cut).trimEnd() + '…'
}

export function validateRequired(data: Record<string, any>, requiredFields: string[]): { valid: boolean; missing: string[] } {
  const missing = requiredFields.filter(field => data[field] === undefined || data[field] === null || data[field] === '')
  return { valid: missing.length === 0, missing }
}
