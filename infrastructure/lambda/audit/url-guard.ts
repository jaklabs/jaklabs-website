// The SSRF boundary for the public /website-audit endpoint.
//
// Its own module for one reason: it is the security control, and a security
// control you cannot test in isolation does not get tested. Inside handler.ts it
// sat behind imports of puppeteer, @sparticuz/chromium and the aws-lambda types,
// so loading it outside the bundler was impossible — which is why it shipped
// with no test coverage at all.
//
// Nothing here imports anything. That is deliberate and worth preserving.

// Exported for testing. This is the security boundary of a public,
// unauthenticated endpoint that drives headless Chromium at whatever URL a
// stranger supplies — it is the single most important function in this file
// and it had no test coverage at all until 2026-08-29.
export function assertPublicHttpUrl(raw: string): URL {
  let u: URL
  try {
    u = new URL(/^https?:\/\//i.test(raw) ? raw : `https://${raw}`)
  } catch {
    throw new Error("That doesn't look like a web address. Try something like example.com")
  }
  if (u.protocol !== 'http:' && u.protocol !== 'https:') throw new Error('Only http and https addresses can be checked')
  if (u.username || u.password) throw new Error('Addresses with credentials in them cannot be checked')

  const host = u.hostname.toLowerCase()
  if (host === 'localhost' || host.endsWith('.localhost') || host.endsWith('.internal')
      || host.endsWith('.local') || host === '::1' || host === '[::1]') {
    throw new Error('That address is not reachable from the public internet')
  }
  // Literal private IPv4. A hostname resolving to one is caught after DNS.
  const v4 = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/.exec(host)
  if (v4) {
    const [a, b] = [Number(v4[1]), Number(v4[2])]
    if (a === 10 || a === 127 || a === 0
        || (a === 172 && b >= 16 && b <= 31)
        || (a === 192 && b === 168)
        || (a === 169 && b === 254)          // link-local: the metadata endpoint
        || (a === 100 && b >= 64 && b <= 127) // carrier-grade NAT
        || a >= 224) {
      throw new Error('That address is not reachable from the public internet')
    }
  }
  if (!host.includes('.')) throw new Error("That doesn't look like a web address. Try something like example.com")
  return u
}

// Exported for testing. A public hostname can resolve to a private address,
// which the string checks above cannot catch — so this is the second half of
// the boundary and not an optimisation.
export async function resolvesPublicly(hostname: string): Promise<boolean> {
  const dns = await import('node:dns/promises')
  try {
    const addrs = await dns.lookup(hostname, { all: true })
    return addrs.every(({ address }) => {
      const m = /^(\d{1,3})\.(\d{1,3})\./.exec(address)
      if (!m) return !/^(::1|fc|fd|fe80)/i.test(address)   // IPv6 private ranges
      const [a, b] = [Number(m[1]), Number(m[2])]
      return !(a === 10 || a === 127 || a === 0 || a >= 224
               || (a === 172 && b >= 16 && b <= 31)
               || (a === 192 && b === 168)
               || (a === 169 && b === 254)
               || (a === 100 && b >= 64 && b <= 127))
    })
  } catch {
    return false
  }
}
