import type { Metadata } from 'next'

// The page itself is a client component and cannot export metadata, so it lives
// here. Before this every page on the site returned the same title and
// description, which meant they competed with each other and none of them
// described what it was.
export const metadata: Metadata = {
  title: 'Services & Pricing',
  description: "AI Reliability Audit $2,500 · LLM Integration Sprint from $7,500 · Ops-Automation Build from $6,000 · embedded engineering monthly. Fixed scope, published prices.",
  alternates: { canonical: '/services' },
  openGraph: {
    title: 'Services & Pricing | JAK Labs',
    description: "AI Reliability Audit $2,500 · LLM Integration Sprint from $7,500 · Ops-Automation Build from $6,000 · embedded engineering monthly. Fixed scope, published prices.",
    url: '/services',
    type: 'website',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
