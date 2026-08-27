import type { Metadata } from 'next'

// The page itself is a client component and cannot export metadata, so it lives
// here. Before this every page on the site returned the same title and
// description, which meant they competed with each other and none of them
// described what it was.
export const metadata: Metadata = {
  title: 'What I Build',
  description: "Three things: getting work in, running the work, getting paid. Custom operations software for Michigan service businesses. Most builds $2,500–$10,000.",
  alternates: { canonical: '/services' },
  openGraph: {
    title: 'What I Build | JAK Labs',
    description: "Three things: getting work in, running the work, getting paid. Custom operations software for Michigan service businesses. Most builds $2,500–$10,000.",
    url: '/services',
    type: 'website',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
