import chromium from '@sparticuz/chromium'
import puppeteer from 'puppeteer-core'
// `import type` so a type-only dependency is erased at runtime rather than
// resolved. Without this the module cannot be loaded outside the bundler —
// which is exactly what a test does.
import type { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { assertPublicHttpUrl, resolvesPublicly } from './url-guard'
import { success, error, validationError, serverError } from '../shared/response'

/**
 * The public website auditor: POST /audit { url }
 *
 * This is the same seven checks the prospecting tool runs against leads, made
 * self-serve. It is the one asset that reaches every kind of local business —
 * six of the seven faults are identical for a plumber, a dentist or a bakery,
 * and the seventh looks for words every service business uses.
 *
 * PUBLIC AND UNAUTHENTICATED, which makes the guard rails the important part of
 * this file. A endpoint that fetches an arbitrary URL on command and reports
 * what it saw is a server-side request forgery engine and an open proxy unless
 * it is fenced properly. See `assertPublicHttpUrl` — that function is the
 * security boundary, not a validation nicety.
 *
 * Chromium rather than a plain HTTP fetch, because the single most common fault
 * in the Michigan data — a JavaScript error on the homepage, 47% of sites — can
 * only be seen by something that actually executes the page. A "free audit"
 * that cannot detect the most common problem is not worth shipping.
 */

/** Ordered by how much an owner will care. The first hit becomes the headline. */
const ORDER = ['no_viewport_meta', 'horizontal_scroll', 'console_errors', 'no_booking',
               'no_tel_link', 'not_https', 'slow'] as const
type Fault = typeof ORDER[number]

const FINDING_TEXT: Record<Fault, string> = {
  no_viewport_meta: "your site isn't built for phones at all — it loads at desktop width, so visitors have to pinch and zoom to read it",
  horizontal_scroll: 'your homepage scrolls sideways on a phone, so part of the page sits off the edge of the screen',
  console_errors: 'something on your homepage is erroring in the browser — usually that is a form or a booking widget quietly failing',
  no_booking: "there's no obvious way to book or get in touch from your homepage on a phone",
  no_tel_link: "your phone number isn't tappable on mobile — people have to memorize it and switch apps to call you",
  not_https: 'your site isn\'t on HTTPS, so Chrome shows visitors a "Not secure" warning in the address bar',
  slow: 'your homepage took over five seconds to load on a phone connection',
}

const FIX_TEXT: Record<Fault, string> = {
  no_viewport_meta: 'One line in the page head tells a phone how wide the page is. Without it the browser guesses, and it guesses desktop.',
  horizontal_scroll: 'Usually one element wider than the screen — a table, an image, or a fixed pixel width. Everything else is collateral.',
  console_errors: 'Open the page on a phone and try every button. The error is invisible until the thing it broke is the thing someone needed.',
  no_booking: 'Visitors decide in seconds. If booking or contacting takes more than one obvious tap from the top of the page, most will not look for it.',
  no_tel_link: 'A phone number needs to be a tel: link, not text. One attribute, and it turns ten digits into one tap.',
  not_https: 'A certificate is free and takes minutes. Until then Chrome tells every visitor your site is not secure, before they read a word.',
  slow: 'Usually images that were never resized. A photo straight off a phone camera is often 20x bigger than the page needs.',
}

const SEVERITY: Record<Fault, 'high' | 'medium' | 'low'> = {
  no_viewport_meta: 'high', horizontal_scroll: 'medium', console_errors: 'high',
  no_booking: 'high', no_tel_link: 'medium', not_https: 'high', slow: 'medium',
}

const LABEL: Record<Fault, string> = {
  no_viewport_meta: 'Not built for phones',
  horizontal_scroll: 'Scrolls sideways on mobile',
  console_errors: 'JavaScript errors on the homepage',
  no_booking: 'No obvious way to book or get in touch',
  no_tel_link: 'Phone number not tappable',
  not_https: 'No HTTPS — Chrome warns visitors',
  slow: 'Slow to load on mobile',
}

const BOOKING_WORDS = ['book', 'appointment', 'schedule', 'consult', 'reserve',
                       'get started', 'sign up', 'contact', 'quote', 'estimate', 'call us']

/**
 * The security boundary.
 *
 * Refuses anything that is not a public http(s) host: no other schemes, no
 * credentials in the URL, no localhost, no link-local, and no RFC1918 or
 * carrier-grade-NAT ranges. Without this, anyone could point the tool at
 * 169.254.169.254 and have it read this Lambda's own credentials back to them,
 * or at an internal address to map a private network from the outside.
 *
 * Hostnames are checked by name here; the DNS-rebinding case (a name that
 * resolves to a private address) is handled by resolving before we navigate.
 */
export async function handler(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
  if (event.httpMethod === 'OPTIONS') return success({})
  if (event.httpMethod !== 'POST') return error('Method not allowed', 405)

  let browser
  try {
    const body = JSON.parse(event.body || '{}')
    if (!body.url) return validationError('Enter a website address')
    if (String(body.url).length > 500) return validationError('That address is too long')

    let target: URL
    try {
      target = assertPublicHttpUrl(String(body.url).trim())
    } catch (err) {
      return validationError(err instanceof Error ? err.message : 'Invalid address')
    }
    if (!(await resolvesPublicly(target.hostname))) {
      return validationError("That address doesn't resolve to a public website")
    }

    browser = await puppeteer.launch({
      args: chromium.args,
      executablePath: await chromium.executablePath(),
      headless: true,
    })
    const page = await browser.newPage()
    // A phone, because that is where the visitor is and where these faults live.
    await page.setViewport({ width: 390, height: 844, isMobile: true, deviceScaleFactor: 2 })
    await page.setUserAgent('Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) '
      + 'AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1 '
      + 'jaklabs-audit/1.0 (+https://jaklabs.io/website-audit)')

    const errors: string[] = []
    page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()) })
    page.on('pageerror', (e) => errors.push(String(e)))

    const started = Date.now()
    try {
      await page.goto(target.toString(), { waitUntil: 'domcontentloaded', timeout: 20000 })
      await new Promise((r) => setTimeout(r, 2500))   // let deferred scripts fail
    } catch (err) {
      // ⚠️ THIS USED TO BE A BARE `catch {}`, AND THAT IS HOW THIS TOOL SPENT AN
      // EVENING TELLING EVERY VISITOR THEIR WORKING WEBSITE WAS DOWN.
      //
      // A runtime bump to nodejs22 broke Chromium's navigation. The browser
      // still launched, so the outer handler never saw it; every page.goto threw
      // and every throw became "That site didn't load. It may be down." The
      // audit answered reachable:false for google.com and example.com, with
      // HTTP 200 and success:true, and nothing alarmed.
      //
      // The runtime was the trigger. The DEFECT is right here: a failure to
      // MEASURE was reported as a MEASUREMENT (fleet rule 2). Four different
      // facts — their DNS is wrong, their server is slow, our renderer crashed,
      // our browser is broken — all produced one sentence blaming them.
      //
      // So the error is now read, and ANYTHING WE DO NOT RECOGNISE IS TREATED AS
      // OURS. The asymmetry is the whole argument: telling a prospect their site
      // is broken when it is not costs trust we cannot get back and is invisible
      // to us, while a 5xx is visible, alarmed, and costs one retry.
      const msg = err instanceof Error ? `${err.name}: ${err.message}` : String(err)
      // Faults that genuinely belong to the site being checked. Deliberately an
      // ALLOWLIST: a new failure mode we have never seen is our problem until
      // somebody looks at it and decides otherwise.
      const theirs = /TimeoutError|ERR_NAME_NOT_RESOLVED|ERR_CONNECTION_REFUSED|ERR_CONNECTION_TIMED_OUT|ERR_CONNECTION_RESET|ERR_CONNECTION_CLOSED|ERR_ADDRESS_UNREACHABLE|ERR_EMPTY_RESPONSE|ERR_TOO_MANY_REDIRECTS|ERR_SSL|ERR_CERT|ERR_HTTP2|ERR_QUIC|ERR_SOCKET_NOT_CONNECTED|ERR_BLOCKED_BY/i
        .test(msg)
      if (!theirs) {
        // Rethrown, so it reaches the outer catch: console.error + a 5xx. A
        // caller that cannot get a number must be told it cannot get a number —
        // send_batch refuses to mail stale figures on exactly this signal.
        throw new Error(`navigation failed in a way that is probably OURS: ${msg}`)
      }
      console.warn('audit: site did not load', target.hostname, msg)
      return success({
        url: target.toString(), reachable: false,
        message: "That site didn't load. It may be down, or blocking automated checks.",
      })
    }
    const loadSeconds = Math.round((Date.now() - started) / 100) / 10

    const found: Partial<Record<Fault, boolean>> = {}
    try {
      found.no_viewport_meta = (await page.$('meta[name="viewport"]')) === null
      found.no_tel_link = (await page.$('a[href^="tel:"]')) === null

      // These two run INSIDE the page, not in this process. Passed as source
      // strings rather than closures on purpose: they reference `document` and
      // `window`, which do not exist in Node. Writing them as functions would
      // mean adding the DOM lib to this whole package, and every Lambda here
      // would then silently accept a stray `document` as valid.
      found.horizontal_scroll = (await page.evaluate(
        'document.documentElement.scrollWidth > window.innerWidth + 4',
      )) as boolean

      const haystack = (await page.evaluate(`(() => {
        var text = (document.body && document.body.innerText || '').slice(0, 6000);
        var links = Array.prototype.slice.call(document.querySelectorAll('a'), 0, 120)
          .map(function (a) { return (a.getAttribute('href') || '') + ' ' + (a.textContent || ''); })
          .join(' ');
        return (text + ' ' + links).toLowerCase();
      })()`)) as string
      found.no_booking = !BOOKING_WORDS.some((w) => haystack.includes(w))
    } catch {
      // A page that fights instrumentation still gets the checks that did run.
    }
    found.console_errors = errors.length > 0
    found.not_https = !page.url().startsWith('https://')
    found.slow = loadSeconds > 5

    const hits = ORDER.filter((k) => found[k])
    const title = await page.title().catch(() => '')

    return success({
      url: page.url(),
      reachable: true,
      checkedAt: new Date().toISOString(),
      title: title.slice(0, 120),
      loadSeconds,
      consoleErrorCount: errors.length,
      // Truncated: an error string can contain a whole stack trace, and this is
      // rendered straight onto a public page.
      firstConsoleError: errors[0] ? errors[0].slice(0, 200) : '',
      passed: ORDER.filter((k) => !found[k]).map((k) => ({ id: k, label: LABEL[k] })),
      issues: hits.map((k) => ({
        id: k, label: LABEL[k], severity: SEVERITY[k],
        finding: FINDING_TEXT[k], fix: FIX_TEXT[k],
      })),
      issueCount: hits.length,
      checkCount: ORDER.length,
      headline: hits.length ? FINDING_TEXT[hits[0]] : '',
    })
  } catch (err) {
    console.error('audit failed:', err)
    return serverError('The check could not be completed. Try again in a moment.')
  } finally {
    // Chromium outliving the request is how a Lambda runs out of memory on the
    // third invocation rather than the first.
    if (browser) await browser.close().catch(() => {})
  }
}
