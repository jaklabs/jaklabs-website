import type { Metadata } from 'next'
import { social } from '@/lib/social'
import { OFFERS, subtitle } from '@/lib/pricing'

// Built from the price source, not written out, so a reprice cannot leave the
// search snippet quoting last month's number. Front Office is named without a
// figure because it has none — see lib/pricing.ts.
const DESC = `${OFFERS.aiReliability.title} ${OFFERS.aiReliability.price} · `
  + `${OFFERS.localSeo.title} ${OFFERS.localSeo.price} · `
  + `${OFFERS.llmSprint.title} ${OFFERS.llmSprint.price.toLowerCase()} · `
  + `${OFFERS.opsAutomation.title} ${OFFERS.opsAutomation.price.toLowerCase()} · `
  + `Front Office and embedded engineering monthly. Fixed scope, published prices.`

// The page itself is a client component and cannot export metadata, so it lives
// here. Before this every page on the site returned the same title and
// description, which meant they competed with each other and none of them
// described what it was.
export const metadata: Metadata = {
  title: 'Services & Pricing',
  description: DESC,
  alternates: { canonical: '/services' },
  ...social('services', {
    title: 'Services & Pricing | JAK Labs',
    description: DESC,
    url: '/services',
    type: 'website',
  }),
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
