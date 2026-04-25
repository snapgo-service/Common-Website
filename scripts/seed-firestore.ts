/**
 * Firestore Seed Script
 *
 * Seeds Firestore with default data from lib/constants.ts
 * Run with: npm run seed:firestore
 *
 * Supports two modes:
 * 1. Admin SDK (preferred): Set FIREBASE_SERVICE_ACCOUNT_KEY env var
 * 2. Client SDK (fallback): Uses NEXT_PUBLIC_FIREBASE_* env vars
 *
 * This script will:
 * 1. Clear all existing Firestore collections
 * 2. Seed fresh data from constants.ts (primary source of truth)
 * 3. Ensure all images, favicons, and content match the website
 */

// Import constants as source of truth
import {
  SITE_CONFIG,
  HERO_CONTENT,
  STATS,
  FEATURES,
  HOW_IT_WORKS,
  TESTIMONIALS,
  ABOUT_STORY,
  TEAM_MEMBERS,
  SAFETY_FEATURES,
  JOURNEY_TIMELINE,
  MAIN_NAV,
  isNavGroup,
} from '../lib/constants'

import { DEFAULT_IMAGES } from '../lib/types/images'

// App ID for path prefix
const APP_ID = process.env.NEXT_PUBLIC_APP_ID || 'default'

// ========================================
// Firebase abstraction layer
// ========================================

interface FirestoreAdapter {
  setDocument(path: string, data: Record<string, unknown>): Promise<void>
  batchWrite(operations: Array<{ path: string; data: Record<string, unknown> }>): Promise<void>
  clearCollection(collectionPath: string): Promise<void>
}

// Admin SDK adapter
async function createAdminAdapter(): Promise<FirestoreAdapter | null> {
  const serviceAccountKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY
  if (!serviceAccountKey) return null

  try {
    const admin = await import('firebase-admin')
    const serviceAccount = JSON.parse(serviceAccountKey)
    admin.default.initializeApp({
      credential: admin.default.credential.cert(serviceAccount),
    })
    const db = admin.default.firestore()

    return {
      async setDocument(path: string, data: Record<string, unknown>) {
        await db.doc(path).set(data)
      },
      async batchWrite(operations) {
        // Firestore batches limited to 500 operations
        for (let i = 0; i < operations.length; i += 450) {
          const chunk = operations.slice(i, i + 450)
          const batch = db.batch()
          chunk.forEach(op => batch.set(db.doc(op.path), op.data))
          await batch.commit()
        }
      },
      async clearCollection(collectionPath: string) {
        const snapshot = await db.collection(collectionPath).get()
        if (snapshot.docs.length === 0) return
        const batch = db.batch()
        snapshot.docs.forEach(doc => batch.delete(doc.ref))
        await batch.commit()
        console.log(`  Cleared ${snapshot.docs.length} docs from ${collectionPath}`)
      },
    }
  } catch (error) {
    console.warn('Admin SDK init failed:', error)
    return null
  }
}

// Client SDK adapter (fallback)
async function createClientAdapter(): Promise<FirestoreAdapter | null> {
  const config = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  }

  if (!config.apiKey || !config.projectId) return null

  try {
    const { initializeApp } = await import('firebase/app')
    const { getAuth, signInAnonymously } = await import('firebase/auth')
    const {
      getFirestore,
      doc,
      setDoc,
      getDocs,
      collection,
      writeBatch,
    } = await import('firebase/firestore')

    const app = initializeApp(config)
    const db = getFirestore(app)

    // Sign in anonymously so Firestore rules (request.auth != null) allow writes
    const auth = getAuth(app)
    console.log('  Signing in anonymously for Firestore write access...')
    await signInAnonymously(auth)
    console.log('  Anonymous auth successful')

    return {
      async setDocument(path: string, data: Record<string, unknown>) {
        const segments = path.split('/')
        const docId = segments.pop()!
        const collPath = segments.join('/')
        const docRef = doc(db, collPath, docId)
        await setDoc(docRef, data)
      },
      async batchWrite(operations) {
        for (let i = 0; i < operations.length; i += 450) {
          const chunk = operations.slice(i, i + 450)
          const batch = writeBatch(db)
          chunk.forEach(op => {
            const segments = op.path.split('/')
            const docId = segments.pop()!
            const collPath = segments.join('/')
            const docRef = doc(db, collPath, docId)
            batch.set(docRef, op.data)
          })
          await batch.commit()
        }
      },
      async clearCollection(collectionPath: string) {
        const colRef = collection(db, collectionPath)
        const snapshot = await getDocs(colRef)
        if (snapshot.docs.length === 0) return
        const batch = writeBatch(db)
        snapshot.docs.forEach(d => batch.delete(d.ref))
        await batch.commit()
        console.log(`  Cleared ${snapshot.docs.length} docs from ${collectionPath}`)
      },
    }
  } catch (error) {
    console.warn('Client SDK init failed:', error)
    return null
  }
}

// ========================================
// Path helpers
// ========================================

function getCollectionPath(...segments: string[]): string {
  return ['artifacts', APP_ID, 'public', 'data', ...segments].join('/')
}

function getDocPath(collectionPath: string, docId: string): string {
  return `${collectionPath}/${docId}`
}

// ========================================
// Seed functions
// ========================================

async function seedHeroContent(adapter: FirestoreAdapter): Promise<void> {
  console.log('Seeding hero content...')
  await adapter.setDocument(getDocPath(getCollectionPath('content'), 'hero'), {
    headline: HERO_CONTENT.headline,
    subtext: HERO_CONTENT.subtext,
    updatedAt: new Date().toISOString(),
  })
}

async function seedStats(adapter: FirestoreAdapter): Promise<void> {
  console.log('Seeding stats...')
  const ops = STATS.map((stat, index) => ({
    path: getDocPath(getCollectionPath('stats'), `stat_${index}`),
    data: { ...stat, order: index, updatedAt: new Date().toISOString() },
  }))
  await adapter.batchWrite(ops)
}

async function seedFeatures(adapter: FirestoreAdapter): Promise<void> {
  console.log('Seeding features...')
  const ops = FEATURES.map((feature, index) => ({
    path: getDocPath(getCollectionPath('features'), `feature_${index}`),
    data: { ...feature, order: index, updatedAt: new Date().toISOString() },
  }))
  await adapter.batchWrite(ops)
}

async function seedHowItWorks(adapter: FirestoreAdapter): Promise<void> {
  console.log('Seeding how it works...')
  const ops = HOW_IT_WORKS.map((step, index) => ({
    path: getDocPath(getCollectionPath('howItWorks'), `step_${index}`),
    data: { ...step, order: index, updatedAt: new Date().toISOString() },
  }))
  await adapter.batchWrite(ops)
}

async function seedTestimonials(adapter: FirestoreAdapter): Promise<void> {
  console.log('Seeding testimonials...')
  const ops = TESTIMONIALS.map((testimonial, index) => ({
    path: getDocPath(getCollectionPath('testimonials'), `testimonial_${index}`),
    data: { ...testimonial, order: index, updatedAt: new Date().toISOString() },
  }))
  await adapter.batchWrite(ops)
}

async function seedAbout(adapter: FirestoreAdapter): Promise<void> {
  console.log('Seeding about content...')
  await adapter.setDocument(getDocPath(getCollectionPath('content'), 'about'), {
    ...ABOUT_STORY,
    updatedAt: new Date().toISOString(),
  })
}

async function seedApps(adapter: FirestoreAdapter): Promise<void> {
  console.log('Seeding app links...')
  await adapter.setDocument(getDocPath(getCollectionPath('content'), 'apps'), {
    android: {
      url: 'https://play.google.com/store/apps/details?id=in.snapgo.app&hl=en_IN',
      isLive: true,
      qrCodeUrl: '/images/qr code/playstore-qr.png',
    },
    ios: {
      url: 'https://apps.apple.com/in/app/snapgo-connect-split-fare/id6748761741',
      isLive: true,
      qrCodeUrl: '/images/qr code/appstore-qr.png',
    },
    updatedAt: new Date().toISOString(),
  })
}

async function seedContact(adapter: FirestoreAdapter): Promise<void> {
  console.log('Seeding contact info...')
  await adapter.setDocument(getDocPath(getCollectionPath('content'), 'contact'), {
    email: SITE_CONFIG.email,
    phone: SITE_CONFIG.phone,
    address: SITE_CONFIG.address,
    updatedAt: new Date().toISOString(),
  })
}

async function seedSocial(adapter: FirestoreAdapter): Promise<void> {
  console.log('Seeding social links...')
  await adapter.setDocument(getDocPath(getCollectionPath('content'), 'social'), {
    ...SITE_CONFIG.social,
    updatedAt: new Date().toISOString(),
  })
}

async function seedImages(adapter: FirestoreAdapter): Promise<void> {
  console.log('Seeding images config...')
  await adapter.setDocument(getDocPath(getCollectionPath('content'), 'images'), {
    ...DEFAULT_IMAGES,
    updatedAt: new Date().toISOString(),
  })
}

async function seedTeam(adapter: FirestoreAdapter): Promise<void> {
  console.log('Seeding team members...')
  const ops = TEAM_MEMBERS.map((member, index) => ({
    path: getDocPath(getCollectionPath('team'), `member_${index}`),
    data: {
      name: member.name,
      role: member.role || '',
      bio: member.details,
      details: member.details,
      imageUrl: member.imageUrl || null,
      linkedin: member.linkedin || null,
      twitter: null,
      order: member.order,
      isActive: true,
      updatedAt: new Date().toISOString(),
    },
  }))
  await adapter.batchWrite(ops)
}

async function seedFAQ(adapter: FirestoreAdapter): Promise<void> {
  console.log('Seeding FAQ...')
  const faqs = [
    { question: 'How does Snapgo work?', answer: 'Snapgo offers two ways to pool: No car? Match with verified co-riders, book a cab together via any app (Ola, Uber, etc.), and split the fare. Have a car? Create a ride for others to join. Either way, save up to 75% while reducing your carbon footprint.', category: 'general', order: 1 },
    { question: 'Is Snapgo safe to use?', answer: 'Yes! Safety is our top priority. All users are verified through Aadhaar KYC powered by DigiLocker. We also offer a female-only option for women riders, real-time ride tracking, emergency SOS features, and a rating system for accountability.', category: 'safety', order: 2 },
    { question: 'How much can I save with Snapgo?', answer: 'You can save up to 75% on your cab fares! For example, a ₹400 solo ride becomes just ₹100 when shared with 3 other riders. Regular users save ₹3,000-5,000 per month on average.', category: 'pricing', order: 3 },
    { question: 'What is the female-only option?', answer: 'The female-only option allows women riders to match exclusively with other verified female riders. This feature provides an extra layer of comfort and security for women commuters.', category: 'safety', order: 4 },
    { question: 'Is cab pooling legal?', answer: "Yes! Unlike carpooling with private vehicles (which is not legal for commercial use in India), cab pooling uses commercial taxis and cabs that are already licensed for passenger transport. Snapgo simply helps riders find others heading the same way to share the fare.", category: 'general', order: 5 },
  ]

  const ops = faqs.map((faq, index) => ({
    path: getDocPath(getCollectionPath('faq'), `faq_${index}`),
    data: { ...faq, isActive: true, updatedAt: new Date().toISOString() },
  }))
  await adapter.batchWrite(ops)
}

async function seedFeaturesPage(adapter: FirestoreAdapter): Promise<void> {
  console.log('Seeding features page data...')
  const featuresPageData = [
    { icon: 'ShieldCheck', title: 'Aadhaar KYC Verification', description: 'All users are verified through Aadhaar and DigiLocker integration. Every profile displays a KYC-approved badge, eliminating fake profiles and ensuring complete identity verification. Your safety starts with knowing who you\'re riding with.', highlight: true },
    { icon: 'Users', title: 'Female-Only Option', description: 'Women can filter to connect exclusively with verified female riders for enhanced safety and comfort. This feature empowers women to travel confidently, knowing they\'re matched with fellow verified female commuters.', highlight: true },
    { icon: 'MapPin', title: 'Smart Radius Matching', description: 'Our intelligent algorithm matches riders within a 750m radius for both source and destination, ensuring perfect route alignment. The radius auto-expands to 1km if no immediate matches are found, maximizing your ride opportunities.', highlight: false },
    { icon: 'AlertTriangle', title: 'SOS Safety Feature', description: 'One-tap emergency alert instantly shares your live location and complete trip details with your saved emergency contacts. In any situation, help is just one tap away. Your safety is our absolute priority.', highlight: true },
    { icon: 'MessageCircle', title: 'In-App Group Chat', description: 'A secure group chat is automatically created when riders match. Coordinate pickup points, share ETAs, and communicate seamlessly with your co-riders without exchanging personal phone numbers.', highlight: false },
    { icon: 'Clock', title: 'Real-Time & Scheduled Rides', description: 'Need a ride now? Find matches instantly. Planning ahead? Schedule rides in advance. Snapgo adapts to your lifestyle, whether you\'re spontaneous or prefer to plan your commute meticulously.', highlight: false },
    { icon: 'Navigation', title: 'Optimal Path Suggestion', description: 'Our smart algorithm calculates and suggests the most convenient meeting point for all matched riders. No more complicated coordination—just show up at the optimized pickup location.', highlight: false },
    { icon: 'Wallet', title: 'Transparent Fare Splitting', description: 'Crystal-clear cost breakdown shows exactly what you pay. Save up to 75% compared to solo cab rides. If no match is found, you get an instant refund—no questions asked, no delays.', highlight: false },
    { icon: 'Leaf', title: 'Eco-Friendly Impact', description: 'Every shared ride contributes to a greener planet. Track your personal carbon footprint savings and see the collective impact. Together, we\'re reducing traffic congestion and urban pollution.', highlight: false },
  ]

  const ops = featuresPageData.map((feature, index) => ({
    path: getDocPath(getCollectionPath('featuresPage'), `fp_${index}`),
    data: { ...feature, order: index, isActive: true, updatedAt: new Date().toISOString() },
  }))
  await adapter.batchWrite(ops)
}

async function seedSettings(adapter: FirestoreAdapter): Promise<void> {
  console.log('Seeding site settings...')
  await adapter.setDocument(getDocPath(getCollectionPath('settings'), 'config'), {
    siteName: SITE_CONFIG.name,
    legalName: SITE_CONFIG.legalName,
    tagline: SITE_CONFIG.tagline,
    description: SITE_CONFIG.description,
    url: SITE_CONFIG.url,
    email: SITE_CONFIG.email,
    phone: SITE_CONFIG.phone,
    address: SITE_CONFIG.address,
    social: SITE_CONFIG.social,
    founders: SITE_CONFIG.founders,
    favicon: '/favicon.png',
    logoWhite: '/images/logo/Snapgo Logo White.png',
    logoBlue: '/images/logo/Snapgo Logo Blue.png',
    ogImage: '/images/og-image.png',
    updatedAt: new Date().toISOString(),
  })
}

async function seedSafetyFeatures(adapter: FirestoreAdapter): Promise<void> {
  console.log('Seeding safety features...')
  const ops = SAFETY_FEATURES.map((feature, index) => ({
    path: getDocPath(getCollectionPath('safety'), `feature_${index}`),
    data: { ...feature, order: index, updatedAt: new Date().toISOString() },
  }))
  await adapter.batchWrite(ops)
}

async function seedJourneyTimeline(adapter: FirestoreAdapter): Promise<void> {
  console.log('Seeding journey timeline...')
  const ops = JOURNEY_TIMELINE.map((item, index) => ({
    path: getDocPath(getCollectionPath('journey'), `item_${index}`),
    data: { ...item, order: index, updatedAt: new Date().toISOString() },
  }))
  await adapter.batchWrite(ops)
}

async function seedNavigation(adapter: FirestoreAdapter): Promise<void> {
  console.log('Seeding navigation (header + footer)...')

  const headerLinks = MAIN_NAV.flatMap((entry) =>
    isNavGroup(entry) ? entry.items.map(({ href, label }) => ({ href, label })) : [{ href: entry.href, label: entry.label }]
  )

  const headerOps = headerLinks.map((link, index) => ({
    path: getDocPath(getCollectionPath('navigation'), `link_${index}`),
    data: { ...link, order: index, isActive: true, location: 'header', updatedAt: new Date().toISOString() },
  }))

  const footerLinks = [
    { label: 'About Us', href: '/about', section: 'company', order: 0 },
    { label: 'Our Team', href: '/team', section: 'company', order: 1 },
    { label: 'Blog', href: '/blog', section: 'company', order: 2 },
    { label: 'Contact', href: '/contact', section: 'company', order: 3 },
    { label: 'How It Works', href: '/how-it-works', section: 'resources', order: 0 },
    { label: 'Features', href: '/features', section: 'resources', order: 1 },
    { label: 'Safety', href: '/safety', section: 'resources', order: 2 },
    { label: 'FAQ', href: '/faq', section: 'resources', order: 3 },
    { label: 'Terms of Service', href: '/terms', section: 'legal', order: 0 },
    { label: 'Privacy Policy', href: '/privacy', section: 'legal', order: 1 },
    { label: 'Refund Policy', href: '/refund', section: 'legal', order: 2 },
  ]

  const footerOps = footerLinks.map((link, index) => ({
    path: getDocPath(getCollectionPath('navigation'), `footer_${index}`),
    data: { ...link, isActive: true, location: 'footer', updatedAt: new Date().toISOString() },
  }))

  await adapter.batchWrite([...headerOps, ...footerOps])
}

// ========================================
// Main seed function
// ========================================

async function seedFirestore(): Promise<void> {
  console.log('='.repeat(60))
  console.log('Snapgo Firestore Seed Script')
  console.log('='.repeat(60))
  console.log(`App ID: ${APP_ID}`)
  console.log('')

  // Try Admin SDK first, then fall back to Client SDK
  console.log('Initializing Firebase...')
  let adapter = await createAdminAdapter()
  if (adapter) {
    console.log('  Using: Firebase Admin SDK (service account)')
  } else {
    console.log('  Admin SDK not available, trying Client SDK...')
    adapter = await createClientAdapter()
    if (adapter) {
      console.log('  Using: Firebase Client SDK')
      console.log('  Note: Client SDK may fail if Firestore rules block writes.')
      console.log('  For guaranteed writes, set FIREBASE_SERVICE_ACCOUNT_KEY env var.')
    }
  }

  if (!adapter) {
    console.error('')
    console.error('ERROR: No Firebase credentials found!')
    console.error('')
    console.error('Option 1 (Recommended): Set FIREBASE_SERVICE_ACCOUNT_KEY')
    console.error('  1. Go to Firebase Console > Project Settings > Service Accounts')
    console.error('  2. Click "Generate new private key"')
    console.error('  3. Add to .env.local:')
    console.error("     FIREBASE_SERVICE_ACCOUNT_KEY='{...json contents...}'")
    console.error('')
    console.error('Option 2: Set NEXT_PUBLIC_FIREBASE_* env vars for Client SDK')
    process.exit(1)
  }

  console.log('')

  try {
    // Clear existing collections
    console.log('Clearing existing data...')
    const collectionsToClean = [
      'stats', 'features', 'howItWorks', 'testimonials',
      'team', 'faq', 'safety', 'journey', 'navigation', 'featuresPage',
    ]
    for (const col of collectionsToClean) {
      await adapter.clearCollection(getCollectionPath(col))
    }
    console.log('')

    // Seed all data
    console.log('Seeding new data...')
    await seedHeroContent(adapter)
    await seedStats(adapter)
    await seedFeatures(adapter)
    await seedHowItWorks(adapter)
    await seedTestimonials(adapter)
    await seedAbout(adapter)
    await seedApps(adapter)
    await seedContact(adapter)
    await seedSocial(adapter)
    await seedImages(adapter)
    await seedTeam(adapter)
    await seedFAQ(adapter)
    await seedFeaturesPage(adapter)
    await seedSettings(adapter)
    await seedSafetyFeatures(adapter)
    await seedJourneyTimeline(adapter)
    await seedNavigation(adapter)

    console.log('')
    console.log('='.repeat(60))
    console.log('Firestore seeded successfully!')
    console.log('='.repeat(60))
    console.log('')
    console.log('Collections seeded:')
    console.log('  - content/hero, about, apps, contact, social, images')
    console.log('  - stats/ (4 items)')
    console.log('  - features/ (6 items)')
    console.log('  - howItWorks/ (3 items)')
    console.log('  - testimonials/ (3 items)')
    console.log('  - team/ (3 members)')
    console.log('  - faq/ (5 items)')
    console.log('  - featuresPage/ (9 items)')
    console.log('  - settings/config')
    console.log('  - safety/ features')
    console.log('  - journey/ timeline')
    console.log('  - navigation/ (header + footer links)')
  } catch (error) {
    console.error('')
    console.error('Error seeding Firestore:', error)
    if (String(error).includes('PERMISSION_DENIED')) {
      console.error('')
      console.error('PERMISSION_DENIED: Firestore rules are blocking writes.')
      console.error('To fix this, set FIREBASE_SERVICE_ACCOUNT_KEY in .env.local:')
      console.error('  1. Go to Firebase Console > Project Settings > Service Accounts')
      console.error('  2. Click "Generate new private key"')
      console.error('  3. Copy the JSON and add to .env.local:')
      console.error("     FIREBASE_SERVICE_ACCOUNT_KEY='{...json contents...}'")
    }
    process.exit(1)
  }
}

// Run the seed
seedFirestore().then(() => {
  console.log('')
  console.log('Done! You can now verify the data in the Firebase console.')
  process.exit(0)
})
