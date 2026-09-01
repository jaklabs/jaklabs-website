import type { Metadata } from 'next'
import './globals.css'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { SiteChrome } from '@/components/layout/SiteChrome'

/**
 * Facebook App ID, for fb:app_id.
 *
 * NOT a secret — it is published in the HTML by definition, which is why it
 * lives here rather than in an env var or Secrets Manager.
 *
 * It is also NOT required for link previews, whatever Facebook's sharing
 * debugger says when it lists the property as "missing". The image, title and
 * description all render without it. What it actually buys is attribution:
 * shares of this domain get tied to a Facebook App so they show up in that
 * app's Insights.
 *
 * Empty string means the tag is omitted entirely. That is deliberate — an
 * fb:app_id has to be a real numeric ID for an app you own, and emitting a
 * placeholder or somebody else's number is worse than emitting nothing: it
 * fails validation, or it attributes your shares to a stranger.
 *
 * To turn it on: create an app at developers.facebook.com/apps, copy the App
 * ID, and paste it below. Applied at the root so every page carries it, not
 * just the blog.
 */
const FB_APP_ID = ''

export const metadata: Metadata = {
  metadataBase: new URL('https://jaklabs.io'),
  // A template, so every page gets its own title with the brand appended rather
  // than eight pages sharing one string and competing with each other. Pages
  // that set nothing fall back to `default`.
  title: {
    default: 'Operations Software for Michigan Service Businesses | JAK Labs',
    template: '%s | JAK Labs',
  },
  description: 'I build the scheduling, quoting and invoicing software that lets a local service business run without its owner. One senior engineer, Lansing, Michigan. Most builds $2,500–$10,000.',
  keywords: ['operations software', 'small business software michigan', 'CRM for service business',
             'scheduling software', 'invoicing software', 'Lansing', 'Michigan', 'custom software'],
  alternates: { canonical: '/' },
  ...(FB_APP_ID ? { other: { 'fb:app_id': FB_APP_ID } } : {}),
  openGraph: {
    title: 'Operations Software for Michigan Service Businesses | JAK Labs',
    description: 'I build the scheduling, quoting and invoicing software that lets a local service business run without its owner. One senior engineer, Lansing, Michigan. Most builds $2,500–$10,000.',
    url: 'https://jaklabs.io',
    siteName: 'JAK Labs',
    images: [
      {
        url: '/images/og-image.png',
        width: 1200,
        height: 630,
        alt: 'JAK Labs — operations software for local service businesses',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Operations Software for Michigan Service Businesses | JAK Labs',
    description: 'I build the scheduling, quoting and invoicing software that lets a local service business run without its owner. One senior engineer, Lansing, Michigan. Most builds $2,500–$10,000.',
    images: ['/images/og-image.png'],
  },
}

export default function RootLayout({
                                     children,
                                   }: {
  children: React.ReactNode
}) {
  return (
      <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'ProfessionalService',
              '@id': 'https://jaklabs.io/#business',
              name: 'JAK Labs',
              legalName: 'Jak Development LLC',
              alternateName: 'JAK Labs',
              url: 'https://jaklabs.io',
              email: 'jdakemp@gmail.com',
              telephone: '+1-517-505-7135',
              description:
                'Operations software for local service businesses — scheduling, quoting, '
                + 'invoicing and follow-up. One senior engineer based in the Lansing, Michigan area.',
              founder: { '@type': 'Person', name: 'JD Kemp' },
              address: {
                '@type': 'PostalAddress',
                addressLocality: 'Lansing',
                addressRegion: 'MI',
                addressCountry: 'US',
              },
              areaServed: [
                { '@type': 'State', name: 'Michigan' },
                { '@type': 'City', name: 'Lansing' },
                { '@type': 'City', name: 'East Lansing' },
                { '@type': 'City', name: 'Okemos' },
                { '@type': 'City', name: 'Haslett' },
                { '@type': 'City', name: 'Grand Rapids' },
                { '@type': 'City', name: 'Detroit' },
              ],
              knowsAbout: ['operations software', 'CRM', 'job scheduling', 'invoicing',
                           'small business automation', 'AWS', 'React'],
              makesOffer: [
                {
                  '@type': 'Offer',
                  itemOffered: { '@type': 'Service', name: 'Operations Audit' },
                  price: '0',
                  priceCurrency: 'USD',
                  description: 'A free 30-minute review of your site and your process.',
                },
                {
                  '@type': 'Offer',
                  itemOffered: { '@type': 'Service', name: 'Custom operations software build' },
                  priceCurrency: 'USD',
                  priceSpecification: {
                    '@type': 'PriceSpecification',
                    minPrice: '2500',
                    maxPrice: '10000',
                    priceCurrency: 'USD',
                  },
                },
              ],
            }),
          }}
        />
      </head>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
            href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Poppins:wght@400;500;600;700&display=swap"
            rel="stylesheet"
        />
      </head>
      <body className="font-sans">
      <SiteChrome><Navbar /></SiteChrome>
      <main>{children}</main>
      <SiteChrome><Footer /></SiteChrome>
      </body>
      </html>
  )
}
