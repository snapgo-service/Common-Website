const { withSentryConfig } = require('@sentry/nextjs')

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Image optimization
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'snapgo.in' },
      { protocol: 'https', hostname: 'snapgo.co.in' },
      { protocol: 'https', hostname: 'www.snapgo.co.in' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'img.youtube.com' },
      { protocol: 'https', hostname: '*.public.blob.vercel-storage.com' },
      { protocol: 'https', hostname: 'storage.googleapis.com' },
      { protocol: 'https', hostname: 'firebasestorage.googleapis.com' },
      { protocol: 'https', hostname: '*.firebasestorage.app' },
    ],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 days
  },

  // Server external packages (firebase-admin uses native modules)
  serverExternalPackages: ['firebase-admin', '@opentelemetry/instrumentation', '@prisma/instrumentation'],

  // Experimental features
  experimental: {
    optimizePackageImports: [
      'lucide-react',
      'recharts',
      '@react-three/drei',
      '@react-three/fiber',
      'framer-motion',
      'three',
      '@radix-ui/react-dialog',
      '@radix-ui/react-dropdown-menu',
      '@radix-ui/react-tabs',
      '@radix-ui/react-toast',
      'date-fns',
      'clsx',
      'class-variance-authority',
      '@tanstack/react-query',
      'react-hook-form',
      'zod',
    ],
  },

  // Enable compression
  compress: true,

  // React strict mode for better debugging
  reactStrictMode: true,

  // Remove X-Powered-By header
  poweredByHeader: false,

  // Generate ETags for caching
  generateEtags: true,

  // Remove console logs in production (except errors)
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? { exclude: ['error', 'warn'] } : false,
  },

  // Security and caching headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'X-XSS-Protection', value: '1; mode=block' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(self)' },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload'
          },
          {
            key: 'Content-Security-Policy',
            // Note: 'unsafe-inline' required for Next.js inline scripts
            // 'unsafe-eval' needed in dev for React Fast Refresh; safe to include since eval is not used in app code
            value: `default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.instagram.com https://www.googletagmanager.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob: https://*.public.blob.vercel-storage.com https://images.unsplash.com https://img.youtube.com https://www.instagram.com https://storage.googleapis.com https://firebasestorage.googleapis.com https://*.firebasestorage.app; font-src 'self'; connect-src 'self' https://*.googleapis.com https://*.firebaseio.com https://*.google-analytics.com wss://*.firebaseio.com https://*.ingest.sentry.io; frame-src https://www.instagram.com; object-src 'none'; base-uri 'self';`
          },
        ],
      },
      {
        source: '/images/(.*)',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
      },
      {
        source: '/uploads/(.*)',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
      },
      {
        source: '/_next/static/(.*)',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
      },
    ]
  },

  // Redirect www to non-www
  async redirects() {
    return [
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'www.snapgo.co.in' }],
        destination: 'https://snapgo.co.in/:path*',
        permanent: true,
      },
    ]
  },
}

// Wrap with Sentry (only when DSN is configured)
const sentryConfig = {
  silent: true,
  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,
  authToken: process.env.SENTRY_AUTH_TOKEN,
  widenClientFileUpload: true,
  hideSourceMaps: true,
  disableLogger: true,
}

module.exports = process.env.SENTRY_DSN
  ? withSentryConfig(nextConfig, sentryConfig)
  : nextConfig
