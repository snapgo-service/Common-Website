/**
 * @deprecated This file serves ONLY as fallback when Firebase is unavailable.
 *
 * All constants here now serve as DEFAULT fallback values when:
 * 1. Firebase is not configured
 * 2. Firestore data fetch fails
 * 3. Running in development without Firebase
 *
 * To update content, use the admin panel at /admin instead of editing this file.
 * Changes made here will NOT appear on the website unless Firebase is unavailable.
 *
 * See lib/content.ts for the primary data fetching layer.
 */

export const SITE_CONFIG = {
  name: 'Snapgo',
  legalName: 'Snapgo Service Private Limited',
  tagline: 'Share the Cab. Keep the Cash.',
  description: "Delhi/NCR's shared cab platform. Shuttles from ₹80, airport cabs at 50% off, outstation trips at your price. 100% legal, Aadhaar verified, zero surge.",
  url: 'https://snapgo.co.in',
  email: 'info@snapgo.co.in',
  phone: '+91 6398786105',
  address: 'Block 45, Sharda University, Knowledge Park 3, Greater Noida, Uttar Pradesh, India',
  social: {
    facebook: 'https://www.facebook.com/profile.php?id=61578285621863',
    instagram: 'https://www.instagram.com/snapgo.co.in/',
    linkedin: 'https://www.linkedin.com/company/snapgo-service-private-limited/',
  },
  founders: ['Mohit Purohit', 'Surya Purohit'],
}

export const HERO_CONTENT = {
  headline: "Smart Ride Sharing for Delhi/NCR",
  subtext: "Share rides with verified co-travellers. Save up to 75% on daily commutes, airport trips, and outstation travel. Aadhaar verified. Zero surge.",
}

export const STATS = [
  { label: 'Cheaper Than Solo Cabs', value: 75, suffix: '%', prefix: '' },
  { label: 'Lowest Ride Price', value: 80, suffix: '', prefix: '₹' },
  { label: 'Aadhaar-Verified Riders', value: 4500, suffix: '+', prefix: '' },
  { label: 'Trees Worth CO₂ Saved', value: 500, suffix: '+', prefix: '', isEco: true },
]

export const FEATURES = [
  {
    title: 'Save ₹200+ Per Ride',
    description: 'Average solo cab in Delhi/NCR: ₹300-400. Average Snapgo fare: ₹80-100. You do the math.',
    icon: 'Wallet',
  },
  {
    title: 'Aadhaar KYC — No Exceptions',
    description: 'Every rider verified via DigiLocker. Real names, real photos. Zero fake profiles.',
    icon: 'ShieldCheck',
  },
  {
    title: 'Women-Only Cab Option',
    description: 'Women filter to match only with verified female riders. Gender verified via Aadhaar.',
    icon: 'Users',
  },
  {
    title: 'Book Now or Schedule Ahead',
    description: 'Need a ride in 10 minutes or tomorrow 6 AM? Both work. Your schedule, your choice.',
    icon: 'Clock',
  },
  {
    title: '75% Less Pollution',
    description: '4 people, 1 cab instead of 4 separate cabs. Same destination, 75% less carbon.',
    icon: 'Leaf',
  },
  {
    title: 'Zero Surge, Ever',
    description: 'Rain or rush hour, ₹80 means ₹80. No dynamic pricing games.',
    icon: 'Shuffle',
  },
]

export const HOW_IT_WORKS = [
  {
    step: 1,
    title: 'Tell Us Where You\'re Going',
    description: 'Open the app, enter pickup & drop. Snapgo scans riders within 750m of your route in seconds.',
    icon: 'MapPin',
  },
  {
    step: 2,
    title: 'Pick Your Co-Riders',
    description: 'See Aadhaar-verified profiles heading your way. Check names, ratings, gender. You choose who you ride with.',
    icon: 'Search',
  },
  {
    step: 3,
    title: 'Ride Together, Pay Less',
    description: 'Share the cab, split the fare. Average savings: ₹200+ per ride. That\'s ₹6,000/month.',
    icon: 'Users',
  },
]

export const TESTIMONIALS = [
  {
    quote: 'I used to spend ₹400/day on cabs from Knowledge Park to Pari Chowk. Now I pay ₹80 on SnapRide. That\'s ₹9,600 saved every month — I bought a new phone with the savings!',
    author: 'Priya S.',
    location: 'Sharda University, Greater Noida',
  },
  {
    quote: 'Airport cab to Noida was always ₹1,200+. With SnapAir, I split it 3 ways and pay ₹400. Driver was confirmed the night before. No stress.',
    author: 'Rahul M.',
    location: 'Sector 62, Noida',
  },
  {
    quote: 'As a woman, the female-only filter is a game-changer. Every co-rider is Aadhaar-verified with real photos. I feel completely safe sharing cabs now.',
    author: 'Anisha K.',
    location: 'Delhi NCR',
  },
]

export const ABOUT_STORY = {
  origin: "It was a regular day when we, Mohit and Surya Purohit, were heading to Ghaziabad Railway Station from our society. We booked a cab and noticed another person also taking a cab from our area. When we reached the station, we saw the same person at the parking lot. That's when it hit us - we both paid ₹300 separately for the same route. If we had known we were going to the same place, we could have shared the ride and paid just ₹300 total, saving ₹300 together!",
  spark: "This sparked an idea, but we didn't want to do traditional carpooling with private cars — that's not legal for commercial use and bypasses taxi drivers who depend on fares. Instead, we pioneered 'Cab Pooling' — pooling commercial cabs among verified riders. It's 100% legal, supports drivers, AND reduces road emissions by 75%. That's how Snapgo was born.",
  mission: 'To make every cab ride in Delhi/NCR shareable within 2 taps — so no student pays ₹400 alone, no professional sits in traffic alone, and no cab drives with 3 empty seats.',
  vision: "To become the default way Delhi/NCR moves — starting with Greater Noida, then every city where commuters overpay for empty seats.",
  values: 'Legal and ethical operations, driver-friendly ecosystem, environmental sustainability, user safety, and creating value for our entire community.',
}

export const JOURNEY_TIMELINE = [
  {
    title: 'WhatsApp Pilot',
    description: '1000+ members in pilot group, proving the concept works',
    icon: 'MessageCircle',
  },
  {
    title: '150+ Daily Rides',
    description: 'Peak daily rides achieved during pilot project',
    icon: 'Car',
  },
  {
    title: 'Startup Recognition',
    description: 'Officially recognized by Startup India, Startup Uttarakhand & received DPIIT number',
    icon: 'Award',
  },
  {
    title: 'Growing Demand',
    description: 'Multiple colleges requested expansion and creation of groups',
    icon: 'TrendingUp',
  },
]

export const SAFETY_FEATURES = [
  {
    title: 'Aadhaar KYC Verification',
    description: 'Every user must complete Aadhaar-based KYC verification powered by DigiLocker before using Snapgo.',
    points: [
      'Real Identities - No fake profiles or anonymous users',
      'Gender Verification - Users cannot change or fake their gender',
      'Government Backed - Verified through official DigiLocker system',
      'KYC Badge - Verified users display prominent KYC-approved badge',
    ],
    icon: 'ShieldCheck',
  },
  {
    title: 'Female Safety Features',
    description: 'Special features designed for women travelers.',
    points: [
      'Female-Only Filter - Women can enable filter to see/connect only with verified female riders',
      'No Gender Manipulation - Thanks to Aadhaar KYC, users cannot fake/change gender',
      'Verified Profiles - Every profile shows KYC verification status',
    ],
    icon: 'UserCheck',
  },
  {
    title: 'Emergency SOS Feature',
    description: 'One tap to alert emergency contacts with your location and trip details.',
    points: [
      'Add up to 3 emergency contacts',
      'One-tap SOS activation',
      'Instant SMS & app notification',
      'Live location tracking link',
    ],
    icon: 'AlertTriangle',
  },
]

export const INDIAN_CITIES = [
  { name: 'Mumbai', lat: 19.076, lng: 72.8777 },
  { name: 'Delhi', lat: 28.6139, lng: 77.209 },
  { name: 'Bangalore', lat: 12.9716, lng: 77.5946 },
  { name: 'Pune', lat: 18.5204, lng: 73.8567 },
  { name: 'Hyderabad', lat: 17.385, lng: 78.4867 },
  { name: 'Chennai', lat: 13.0827, lng: 80.2707 },
  { name: 'Greater Noida', lat: 28.4744, lng: 77.504 },
]

export const NAV_LINKS = [
  { href: '/#services', label: 'Services' },
  { href: '/about', label: 'About' },
  { href: '/safety', label: 'Safety' },
]

export interface NavItem {
  href: string
  label: string
  description?: string
}

export interface NavGroup {
  label: string
  items: NavItem[]
}

export type NavEntry = NavItem | NavGroup

export const isNavGroup = (entry: NavEntry): entry is NavGroup => 'items' in entry

export const MAIN_NAV: NavEntry[] = [
  {
    label: 'Services',
    items: [
      { href: '/snapride', label: 'Snapgo Shared Rides', description: 'Daily shuttle from ₹80/seat' },
      { href: '/snapair', label: 'Snapgo Airport Cabs', description: 'Delhi IGI T1, T2 & T3 — 50% off' },
      { href: '/schedule-ride', label: 'Schedule Ride', description: 'Plan ahead. Lock in savings.' },
      { href: '/realtime-ride', label: 'Realtime Ride', description: 'Match instantly. Ride now.' },
      { href: '/outstation-cabs', label: 'Outstation Cabs', description: 'Intercity travel made affordable' },
    ],
  },
  {
    label: 'Company',
    items: [
      { href: '/about', label: 'About Us', description: 'Our story and mission' },
      { href: '/team', label: 'Team', description: 'Meet the founders' },
      { href: '/safety', label: 'Safety', description: 'How we protect every rider' },
      { href: '/greencalculator', label: 'Green Impact', description: 'Your CO2 savings' },
    ],
  },
  { href: '/blog', label: 'Blog' },
  { href: '/faq', label: 'FAQ' },
  { href: '/contact', label: 'Contact' },
]

export const TEAM_MEMBERS = [
  { name: 'Mohit Purohit', role: 'Founder & CTO', details: 'Serial entrepreneur with experience building, scaling, and selling mobile applications. Drives product development and technology strategy for Snapgo.', linkedin: 'https://www.linkedin.com/in/mohitpurohitbr/', imageUrl: '/images/team/mohit.png', order: 1 },
  { name: 'Surya Purohit', role: 'Co-Founder & CEO', details: 'Digital marketing specialist expert in Meta Ads, Google Ads, and performance marketing. Drives growth and strategic partnerships.', linkedin: 'https://www.linkedin.com/in/snapgosurya/', imageUrl: '/images/team/surya.png', order: 2 },
  { name: 'Anurag Tiwari', role: 'Chief Marketing Officer', details: 'Multi-business founder with deep knowledge of traditional and digital marketing channels. Leads strategic communications and market intelligence.', linkedin: 'https://www.linkedin.com/in/snapgoanurag/', imageUrl: '/images/team/anurag.png', order: 3 },
]

export const COLORS = {
  primary: '#0e4493',
  secondary: '#1a5cb8',
  teal: '#0d9488',
  tealDark: '#0f766e',
  purple: '#7c3aed',
  dark: '#111827',
  light: '#f3f4f6',
  white: '#ffffff',
}

// ============================================
// NEW DEFAULT CONSTANTS (ADMIN-EDITABLE CONTENT)
// ============================================

/**
 * Cab Pooling Comparison - Default Data
 * Used in CabPoolingComparison component
 */
export const DEFAULT_COMPARISON = {
  carpooling: {
    title: 'Traditional Carpooling',
    subtitle: 'Private Cars',
    iconName: 'X',
    colorScheme: 'red' as const,
    points: [
      { text: 'Uses private vehicles for commercial use', negative: true },
      { text: 'Not legal in India', negative: true },
      { text: 'Bypasses taxi drivers', negative: true },
      { text: 'Same emissions per car', negative: true },
    ],
  },
  cabPooling: {
    title: 'Snapgo Cab Pooling',
    subtitle: 'Commercial Cabs',
    iconName: 'Check',
    colorScheme: 'green' as const,
    points: [
      { text: 'Uses licensed commercial cabs', negative: false },
      { text: '100% legal and regulated', negative: false },
      { text: "Doesn't bypass taxi drivers", negative: false },
      { text: '75% less emissions per person', negative: false },
    ],
  },
  benefits: [
    {
      iconName: 'Leaf',
      title: 'Planet Wins',
      description: '4 people in 1 cab instead of 4 separate cabs = 75% less pollution',
      colorScheme: 'emerald' as const,
      order: 0
    },
    {
      iconName: 'Wallet',
      title: 'You Win',
      description: 'Split the fare and save up to 75% on every ride',
      colorScheme: 'blue' as const,
      order: 1
    },
    {
      iconName: 'Users',
      title: 'Flexible Pooling',
      description: 'No car? Book together. Have a car? Offer rides. Your choice, same savings.',
      colorScheme: 'purple' as const,
      order: 2
    },
  ],
  tagline: 'Why pay for the full cab when you can save money AND the environment?',
  isActive: true,
}

/**
 * Why Snapgo - Default Reasons
 * Used in WhySnapgoSection component
 */
export const DEFAULT_WHY_SNAPGO = [
  {
    id: 'reason_1',
    iconName: 'Wallet',
    title: 'Save Up to 75%',
    description: 'Pool a cab with verified co-riders and split the fare',
    gradient: 'from-teal-50 to-primary-50',
    order: 0,
    isActive: true
  },
  {
    id: 'reason_2',
    iconName: 'Shield',
    title: '100% Legal & Verified',
    description: 'We pool commercial cabs with Aadhaar-verified riders',
    gradient: 'from-primary-50 to-purple-50',
    order: 1,
    isActive: true
  },
  {
    id: 'reason_3',
    iconName: 'Car',
    title: 'Pool Your Way',
    description: 'No car? Book together. Have a car? Share your ride',
    gradient: 'from-purple-50 to-teal-50',
    order: 2,
    isActive: true
  },
  {
    id: 'reason_4',
    iconName: 'Leaf',
    title: 'Green Cab Pooling',
    description: '4 people, 1 cab = 75% less emissions',
    gradient: 'from-teal-50 to-primary-50',
    order: 3,
    isActive: true
  },
]

/**
 * CO2 Impact Tracker - Default Config
 * Used in CO2ImpactTracker component
 */
export const DEFAULT_CO2_CONFIG = {
  headline: 'Your Green Impact',
  subheadline: 'Track your contribution to a cleaner planet',
  defaultRides: 10,
  co2PerRide: 2.5, // kg
  treesEquivalent: 0.1, // trees per ride
  metricsLabels: {
    rides: 'Pooled Rides',
    co2Saved: 'CO₂ Saved (kg)',
    treesEquiv: 'Trees Equivalent',
  },
  isActive: true,
}

/**
 * Savings Calculator - Default Config
 * Used in SavingsCalculator component
 */
export const DEFAULT_SAVINGS_CONFIG = {
  headline: 'Calculate Your Savings',
  subheadline: 'See how much you save by not riding alone',
  defaultFare: 400,
  defaultRiders: 4,
  riderOptions: [2, 3, 4],
  currencySymbol: '₹',
  isActive: true,
}

/**
 * Trust Badges - Default Data
 * Used in TrustBadgesSection component
 */
export const DEFAULT_TRUST_BADGES = [
  { id: 'badge_1', iconName: 'Award', title: 'DPIIT Recognized Startup', description: 'Government certified startup', order: 0, isActive: true },
  { id: 'badge_2', iconName: 'Shield', title: 'Startup India Certified', description: 'Official initiative member', order: 1, isActive: true },
  { id: 'badge_3', iconName: 'ShieldCheck', title: 'Aadhaar KYC — Every Rider', description: 'Every rider Aadhaar-verified via DigiLocker', order: 2, isActive: true },
  { id: 'badge_4', iconName: 'Users', title: 'Women-Only Cab Option', description: 'Women connect only with women', order: 3, isActive: true },
  { id: 'badge_5', iconName: 'AlertTriangle', title: 'SOS Emergency — 1 Tap', description: 'One-tap emergency alerts', order: 4, isActive: true },
  { id: 'badge_6', iconName: 'Scale', title: '100% Legal Commercial Cabs', description: 'Licensed commercial cabs only', order: 5, isActive: true },
  { id: 'badge_7', iconName: 'Clock', title: 'Driver Confirmed 24hr Before', description: 'Your driver is confirmed a full day early', order: 6, isActive: true },
  { id: 'badge_8', iconName: 'Wallet', title: '₹80 Rides, No Surge Ever', description: 'Fixed pricing, zero dynamic surge', order: 7, isActive: true },
]

/**
 * Services - Default Data
 * Used in ServicesSection component
 */
export const DEFAULT_SERVICES = [
  {
    id: 'snapride',
    name: 'SnapRide',
    tagline: 'Daily Shuttle — ₹80/Seat',
    description: 'Fixed-route micro shuttle for daily commuters in Greater Noida & Delhi/NCR. Book a seat, show up, go. No matching, no waiting. ₹80/ride — less than an auto.',
    iconName: 'Bus',
    badgeType: 'confirmed' as const,
    extraBadge: 'most-booked' as const,
    trustLine: 'Guaranteed seat • No surge pricing',
    isPrimary: true,
    order: 1,
    isActive: true,
  },
  {
    id: 'snapair',
    name: 'SnapAir',
    tagline: 'Airport Cabs — 50% Off',
    description: 'Delhi Airport shared cabs at half the price of Ola/Uber. Driver confirmed 24 hours before. No surge, no surprises.',
    iconName: 'Plane',
    badgeType: 'confirmed' as const,
    trustLine: 'Driver confirmed 24hr before pickup',
    isPrimary: true,
    order: 2,
    isActive: true,
  },
  {
    id: 'snaptrip',
    name: 'SnapTrip',
    tagline: 'Outstation — Name Your Price',
    description: 'Delhi to Jaipur, Agra, Haridwar, Dehradun & more. Name your price or share the cab. 10% off all round trips.',
    iconName: 'MapPin',
    badgeType: 'confirmed' as const,
    trustLine: 'No surge • Transparent pricing always',
    isPrimary: true,
    order: 3,
    isActive: true,
  },
  {
    id: 'snappool',
    name: 'SnapPool',
    tagline: 'Free Cab Matching',
    description: "No confirmed service on your route? SnapPool finds co-riders heading your way. Always free, always Aadhaar-verified.",
    iconName: 'Search',
    badgeType: 'free-matching' as const,
    trustLine: '100% free • Aadhaar verified matches',
    isPrimary: false,
    order: 4,
    isActive: true,
  },
]

/**
 * CTA Sections - Default Data
 * Used in CTASection component
 */
export const DEFAULT_CTA_SECTIONS = [
  {
    id: 'cta_1',
    quote: 'Join thousands saving money while saving the planet',
    badge: '10,000+ Downloads',
    buttonText: 'Download Now',
    buttonLink: '/#download',
    backgroundStyle: 'gradient' as const,
    order: 0,
    isActive: true,
  },
]

/**
 * App Preview - Default Data
 * Used in AppPreviewSection component
 */
export const DEFAULT_APP_PREVIEW = {
  headline: 'Experience Snapgo',
  subheadline: 'Simple, safe, and eco-friendly shared cab rides',
  features: [
    { title: 'Real-time Matching', description: 'Find co-riders instantly' },
    { title: 'Verified Profiles', description: 'Aadhaar KYC for all users' },
    { title: 'Secure Payments', description: 'Split fares seamlessly' },
  ],
  mockupImages: {
    primary: '/images/mockups/home-screen.png',
    secondary: '/images/mockups/matching-screen.png',
  },
  isActive: true,
}

/**
 * Homepage Config - Default Section Visibility & Order
 * Controls which sections appear on homepage and in what order
 */
export const DEFAULT_HOMEPAGE_CONFIG = {
  sections: [
    { componentName: 'hero', label: 'Hero Section', visible: true, order: 1 },
    { componentName: 'trustBadges', label: 'Trust Badges', visible: true, order: 2 },
    { componentName: 'services', label: 'Our Services', visible: true, order: 3 },
    { componentName: 'comparison', label: 'Comparison Table', visible: true, order: 4 },
    { componentName: 'stats', label: 'Statistics Counter', visible: true, order: 5 },
    { componentName: 'howItWorks', label: 'How It Works', visible: true, order: 6 },
    { componentName: 'features', label: 'Features Grid', visible: true, order: 7 },
    { componentName: 'savingsCalc', label: 'Savings Calculator', visible: true, order: 8 },
    { componentName: 'testimonials', label: 'Testimonials', visible: true, order: 9 },
    { componentName: 'appPreview', label: 'App Preview', visible: true, order: 10 },
    { componentName: 'download', label: 'Download Section', visible: true, order: 11 },
    { componentName: 'cta', label: 'Call to Action', visible: true, order: 12 },
    { componentName: 'co2Impact', label: 'CO2 Impact Tracker', visible: false, order: 13 },
    { componentName: 'instagram', label: 'Instagram Feed', visible: false, order: 14 },
  ],
}
