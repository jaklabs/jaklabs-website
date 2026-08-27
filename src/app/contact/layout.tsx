import type { Metadata } from 'next'

// The page itself is a client component and cannot export metadata, so it lives
// here. Before this every page on the site returned the same title and
// description, which meant they competed with each other and none of them
// described what it was.
export const metadata: Metadata = {
  title: 'Book a Free Operations Audit',
  description: "Thirty minutes, no charge, no pitch. I walk your site and your process the way a customer would and tell you what I find — including when you don't need me.",
  alternates: { canonical: '/contact' },
  openGraph: {
    title: 'Book a Free Operations Audit | JAK Labs',
    description: "Thirty minutes, no charge, no pitch. I walk your site and your process the way a customer would and tell you what I find — including when you don't need me.",
    url: '/contact',
    type: 'website',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
