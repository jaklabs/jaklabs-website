import type { Metadata } from 'next'

// The page itself is a client component and cannot export metadata, so it lives
// here. Before this every page on the site returned the same title and
// description, which meant they competed with each other and none of them
// described what it was.
export const metadata: Metadata = {
  title: 'About JD Kemp',
  description: "One engineer in the Lansing area. I built the software my own service business runs on, I build it for other local businesses, and I take forward-deployed engineering contracts.",
  alternates: { canonical: '/about' },
  openGraph: {
    title: 'About JD Kemp | JAK Labs',
    description: "One engineer in the Lansing area. I built the software my own service business runs on, I build it for other local businesses, and I take forward-deployed engineering contracts.",
    url: '/about',
    type: 'website',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
