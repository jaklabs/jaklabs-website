import type { Metadata } from 'next'
import { Bricolage_Grotesque, DM_Mono, Instrument_Sans } from 'next/font/google'
import './rank.css'

/**
 * Aura lives at rank.jaklabs.io but is served by this app, so it needs its own
 * type and its own metadata. It deliberately does not wear the agency site's
 * identity: it sells a free tool to developers, and developers bounce off
 * agency marketing. The site chrome is suppressed for this route in the root
 * layout (see SiteChrome).
 */

const display = Bricolage_Grotesque({
  subsets: ['latin'],
  weight: ['500', '700', '800'],
  variable: '--font-display',
  display: 'swap',
})

const body = Instrument_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-body',
  display: 'swap',
})

const mono = DM_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-mono',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL('https://rank.jaklabs.io'),
  // `absolute` opts out of the root layout's '%s | JAK Labs' template. Aura is a
  // product in its own right, not an agency page, and the suffix undercut that.
  title: {
    absolute: 'Aura — a developer rank that never sees your code',
  },
  description:
    'An open-source developer rank. It reads your repositories offline and grades them across four '
    + 'measurable dimensions — and your source never leaves your machine, verifiably. No account, '
    + 'no upload, no dependencies.',
  keywords: ['developer rank', 'code quality', 'static analysis', 'open source',
             'developer portfolio', 'engineering assessment', 'offline'],
  alternates: { canonical: 'https://rank.jaklabs.io' },
  openGraph: {
    title: 'Aura — a developer rank that never sees your code',
    description:
      'Grades your repositories offline, across four dimensions it can measure and four it refuses '
      + 'to guess at. Your source never leaves your machine.',
    url: 'https://rank.jaklabs.io',
    siteName: 'Aura',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Aura — a developer rank that never sees your code',
    description:
      'Grades your repositories offline. Your source never leaves your machine, and you can verify '
      + 'that before you run it.',
  },
}

export default function RankLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`${display.variable} ${body.variable} ${mono.variable}`}>{children}</div>
  )
}
