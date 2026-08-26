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
 * Strip markup entirely. For fields that are text, not HTML.
 *
 * An excerpt and a title are rendered in places React does not escape for you —
 * a <meta> description, JSON-LD, an RSS item, an og:title. Storing them as
 * plain text means there is no markup to escape wherever they end up.
 */
export function toPlainText(html: string): string {
  return sanitize(html, { allowedTags: [], allowedAttributes: {} })
    .replace(/&nbsp;/g, ' ')
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
