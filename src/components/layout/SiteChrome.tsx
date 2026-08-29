'use client'

import { usePathname } from 'next/navigation'

/**
 * Hides the agency navbar and footer on routes that carry their own identity.
 *
 * Next's root layout wraps every route, and escaping it would mean moving every
 * existing page into a route group -- a large, risky refactor of a live site for
 * one page. This is the small, reversible version: the chrome asks whether it
 * belongs here.
 */
const OWN_IDENTITY = ['/rank']

export function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  if (OWN_IDENTITY.some((p) => pathname?.startsWith(p))) return null
  return <>{children}</>
}
