import type { Metadata } from 'next'
import localFont from 'next/font/local'
import './rank.css'
import { social } from '@/lib/social'

/**
 * Aura lives at rank.jaklabs.io but is served by this app, so it needs its own
 * type and its own metadata. It deliberately does not wear the agency site's
 * identity: it sells a free tool to developers, and developers bounce off
 * agency marketing. The site chrome is suppressed for this route in the root
 * layout (see SiteChrome).
 */

/*
 * Fonts are SELF-HOSTED. Do not put `next/font/google` back.
 *
 * Amplify build 109 failed outright because next/font could not reach Google to
 * fetch Instrument Sans -- a commit that only touched the homepage hero died on
 * a network call for a font on a different page. Ten families were fetched at
 * build time across five files, so any one of them being slow or rate-limited
 * took the whole deploy down. It is also invisible locally, where the fonts are
 * already cached, so it only ever fails in CI and looks like your code broke.
 *
 * The woff2 files in src/fonts are the latin subset at exactly the weights
 * these pages use. Adding a weight means adding a file -- see
 * scripts/fetch-fonts.py, which is the thing that downloaded them.
 */

const display = localFont({
  src: [
    { path: '../../fonts/BricolageGrotesque/500.woff2', weight: '500', style: 'normal' },
    { path: '../../fonts/BricolageGrotesque/700.woff2', weight: '700', style: 'normal' },
    { path: '../../fonts/BricolageGrotesque/800.woff2', weight: '800', style: 'normal' },
  ],
  variable: '--font-display',
  display: 'swap',
})

const body = localFont({
  src: [
    { path: '../../fonts/InstrumentSans/400.woff2', weight: '400', style: 'normal' },
    { path: '../../fonts/InstrumentSans/500.woff2', weight: '500', style: 'normal' },
    { path: '../../fonts/InstrumentSans/600.woff2', weight: '600', style: 'normal' },
  ],
  variable: '--font-body',
  display: 'swap',
})

const mono = localFont({
  src: [
    { path: '../../fonts/DMMono/400.woff2', weight: '400', style: 'normal' },
    { path: '../../fonts/DMMono/500.woff2', weight: '500', style: 'normal' },
  ],
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
  ...social('default', {
    title: 'Aura — a developer rank that never sees your code',
    description:
      'Grades your repositories offline, across four dimensions it can measure and four it refuses '
      + 'to guess at. Your source never leaves your machine.',
    url: 'https://rank.jaklabs.io',
    siteName: 'Aura',
    type: 'website',
  }),
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
