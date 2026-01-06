import type { Metadata } from 'next'
import './globals.css'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'

export const metadata: Metadata = {
  title: 'JAKLabs | Marketing Consulting & App Development',
  description: 'Premier marketing consulting and application development for service-based businesses. Real estate, HVAC, plumbing, and more.',
  keywords: ['marketing', 'consulting', 'app development', 'service business', 'real estate marketing', 'HVAC marketing'],
}

export default function RootLayout({
                                     children,
                                   }: {
  children: React.ReactNode
}) {
  return (
      <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
            href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Poppins:wght@400;500;600;700&display=swap"
            rel="stylesheet"
        />
      </head>
      <body className="font-sans">
      <Navbar />
      <main>{children}</main>
      <Footer />
      </body>
      </html>
  )
}
