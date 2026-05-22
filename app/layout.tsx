import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/providers/ThemeProvider'
import { SettingsProvider } from '@/components/providers/SettingsProvider'
import { GoogleAnalytics } from '@/components/GoogleAnalytics'
import { AuthProvider } from '@/components/providers/AuthProvider'
import { SITE_CONFIG } from '@/lib/constants'
import { Analytics } from '@vercel/analytics/next'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

import { getSiteUrl } from '@/lib/utils/url'

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: {
    default: `${SITE_CONFIG.name} - ${SITE_CONFIG.tagline}`,
    template: `%s | ${SITE_CONFIG.name}`,
  },
  description: SITE_CONFIG.description,
  keywords: [
    'snapgo',
    'ride sharing',
    'cab sharing',
    'save money',
    'carpool',
    'fare splitting',
    'ride sharing india',
    'college students',
    'verified rides',
    'safe travel',
    'eco-friendly',
    'startup india',
    'DPIIT certified',
  ],
  authors: [
    { name: 'Mohit Purohit' },
    { name: 'Surya Purohit' },
  ],
  creator: SITE_CONFIG.legalName,
  publisher: SITE_CONFIG.legalName,
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: SITE_CONFIG.url,
    siteName: SITE_CONFIG.name,
    title: `${SITE_CONFIG.name} - ${SITE_CONFIG.tagline}`,
    description: SITE_CONFIG.description,
    images: [
      {
        url: '/images/og-image.png',
        width: 1200,
        height: 630,
        alt: SITE_CONFIG.name,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${SITE_CONFIG.name} - ${SITE_CONFIG.tagline}`,
    description: SITE_CONFIG.description,
    images: ['/images/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/favicon.png',
    shortcut: '/favicon.png',
    apple: '/favicon.png',
  },
  manifest: '/manifest.json',
}

export const viewport: Viewport = {
  themeColor: '#0066B3', // Snapgo primary blue
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
}

// Enhanced JSON-LD structured data with multiple schema types
const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    // Organization Schema
    {
      '@type': 'Organization',
      '@id': `${SITE_CONFIG.url}/#organization`,
      name: SITE_CONFIG.name,
      legalName: SITE_CONFIG.legalName,
      url: SITE_CONFIG.url,
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_CONFIG.url}/images/logo/Snapgo%20Logo%20Blue.png`,
        width: 512,
        height: 512,
      },
      description: SITE_CONFIG.description,
      foundingDate: '2024',
      founders: SITE_CONFIG.founders.map((founder) => ({
        '@type': 'Person',
        name: founder,
      })),
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'Block 45, Sharda University',
        addressLocality: 'Greater Noida',
        addressRegion: 'Uttar Pradesh',
        postalCode: '201310',
        addressCountry: 'IN',
      },
      contactPoint: {
        '@type': 'ContactPoint',
        telephone: SITE_CONFIG.phone,
        contactType: 'customer service',
        email: SITE_CONFIG.email,
        availableLanguage: ['English', 'Hindi'],
      },
      sameAs: [
        SITE_CONFIG.social.facebook,
        SITE_CONFIG.social.instagram,
        SITE_CONFIG.social.linkedin,
      ],
    },
    // Website Schema
    {
      '@type': 'WebSite',
      '@id': `${SITE_CONFIG.url}/#website`,
      url: SITE_CONFIG.url,
      name: SITE_CONFIG.name,
      description: SITE_CONFIG.description,
      publisher: { '@id': `${SITE_CONFIG.url}/#organization` },
      inLanguage: 'en-IN',
    },
    // Mobile Application Schema
    {
      '@type': 'MobileApplication',
      '@id': `${SITE_CONFIG.url}/#app`,
      name: 'Snapgo - Pool Cabs, Save Money',
      operatingSystem: 'ANDROID, IOS',
      applicationCategory: 'TravelApplication',
      description: SITE_CONFIG.description,
      downloadUrl: [
        'https://play.google.com/store/apps/details?id=in.snapgo.app',
        'https://apps.apple.com/in/app/snapgo-connect-split-fare/id6748761741',
      ],
      installUrl: 'https://play.google.com/store/apps/details?id=in.snapgo.app',
      screenshot: `${SITE_CONFIG.url}/images/mockups/iphone15/home-screen.png`,
      softwareVersion: '1.0.0',
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'INR',
      },
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: '4.5',
        ratingCount: '1000',
        bestRating: '5',
        worstRating: '1',
      },
      author: { '@id': `${SITE_CONFIG.url}/#organization` },
    },
    // Local Business Schema (for local SEO)
    {
      '@type': 'LocalBusiness',
      '@id': `${SITE_CONFIG.url}/#localbusiness`,
      name: SITE_CONFIG.name,
      image: `${SITE_CONFIG.url}/images/logo/Snapgo%20Logo%20Blue.png`,
      telephone: SITE_CONFIG.phone,
      email: SITE_CONFIG.email,
      url: SITE_CONFIG.url,
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'Block 45, Sharda University',
        addressLocality: 'Greater Noida',
        addressRegion: 'Uttar Pradesh',
        postalCode: '201310',
        addressCountry: 'IN',
      },
      geo: {
        '@type': 'GeoCoordinates',
        latitude: 28.4744,
        longitude: 77.504,
      },
      priceRange: 'Free',
      openingHoursSpecification: {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
        opens: '00:00',
        closes: '23:59',
      },
    },
  ],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-screen-dynamic bg-background antialiased" suppressHydrationWarning>
        <GoogleAnalytics />
        <ThemeProvider>
          <SettingsProvider>
            <AuthProvider>
              {children}
            </AuthProvider>
          </SettingsProvider>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  )
}
