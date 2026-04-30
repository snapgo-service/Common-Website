import type { Metadata } from 'next'
import { generatePageMetadata } from '@/lib/seo'
import GalgotiaFormClient from './GalgotiaFormClient'

export const metadata: Metadata = generatePageMetadata({
  title: 'Daily Shared Cab — Galgotia ↔ Alpha 2',
  description:
    'Sign up for the Snapgo daily shared cab service between Galgotia College and Alpha 2 (Greater Noida). Affordable fixed timings, ₹50–60 per ride.',
  path: '/galgotia-alpha2',
  keywords: [
    'galgotia cab',
    'alpha 2 shared cab',
    'greater noida cab pool',
    'galgotia college transport',
    'daily shared cab service',
  ],
})

export default function GalgotiaAlpha2Page() {
  return <GalgotiaFormClient />
}
