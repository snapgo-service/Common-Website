'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import Image from 'next/image'
import { Shield, Star, Award } from 'lucide-react'
import type { AppStoreLinksData } from '@/lib/content'

interface CTASectionProps {
  appLinks?: AppStoreLinksData
}

const defaultLinks: AppStoreLinksData = {
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
}

export function CTASection({ appLinks }: CTASectionProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })
  const links = appLinks || defaultLinks

  return (
    <section ref={ref} className="py-20 sm:py-24 bg-[#0e4493]">
      <div className="container mx-auto px-4 xs:px-6 sm:px-8 md:px-12 lg:px-16 xl:px-20 2xl:px-24">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
              Start saving on every ride.
            </h2>
            <p className="text-lg text-white/80 mb-10 max-w-lg mx-auto">
              Download Snapgo. Verify with Aadhaar. Book your first shared ride in under 2 minutes.
            </p>

            {/* App store buttons */}
            <div className="flex flex-col xs:flex-row gap-3 justify-center mb-12">
              <Button
                size="lg"
                className="bg-white hover:bg-gray-50 text-gray-900 px-6 rounded-xl h-14"
                asChild
              >
                <Link href={links.ios.url} target="_blank" className="flex items-center gap-3">
                  <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current" xmlns="http://www.w3.org/2000/svg">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                  </svg>
                  <div className="text-left">
                    <div className="text-[10px] leading-tight opacity-60">Download on the</div>
                    <div className="text-sm font-semibold leading-tight">App Store</div>
                  </div>
                </Link>
              </Button>
              <Button
                size="lg"
                className="bg-white hover:bg-gray-50 text-gray-900 px-6 rounded-xl h-14"
                asChild
              >
                <Link href={links.android.url} target="_blank" className="flex items-center gap-3">
                  <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3.609 1.814L13.792 12 3.61 22.186a.996.996 0 01-.61-.92V2.734a1 1 0 01.609-.92zm10.89 10.893l2.302 2.302-10.937 6.333 8.635-8.635zm3.199-3.198l2.807 1.626a1 1 0 010 1.73l-2.808 1.626L15.206 12l2.492-2.491zM5.864 2.658L16.802 8.99l-2.303 2.303-8.635-8.635z"/>
                  </svg>
                  <div className="text-left">
                    <div className="text-[10px] leading-tight opacity-60">Get it on</div>
                    <div className="text-sm font-semibold leading-tight">Google Play</div>
                  </div>
                </Link>
              </Button>
            </div>

            {/* QR Codes — desktop only */}
            <div className="hidden md:flex justify-center gap-12 mb-12">
              <div className="text-center">
                <div className="bg-white rounded-xl p-3 w-28 h-28 mx-auto mb-2 shadow-sm">
                  <div className="relative w-full h-full rounded-lg overflow-hidden">
                    <Image
                      src={links.android.qrCodeUrl || '/images/qr code/playstore-qr.png'}
                      alt="Download on Google Play"
                      fill
                      className="object-contain"
                    />
                  </div>
                </div>
                <span className="text-white/50 text-xs">Android</span>
              </div>
              <div className="text-center">
                <div className="bg-white rounded-xl p-3 w-28 h-28 mx-auto mb-2 shadow-sm">
                  <div className="relative w-full h-full rounded-lg overflow-hidden">
                    <Image
                      src={links.ios.qrCodeUrl || '/images/qr code/appstore-qr.png'}
                      alt="Download on App Store"
                      fill
                      className="object-contain"
                    />
                  </div>
                </div>
                <span className="text-white/50 text-xs">iOS</span>
              </div>
            </div>

            {/* Stats with dividers */}
            <div className="flex flex-wrap justify-center items-center gap-6 sm:gap-0 mb-10">
              {[
                { value: '10,000+', label: 'Downloads' },
                { value: '₹80', label: 'Starting Fare' },
                { value: '75%', label: 'Average Savings' },
                { value: '0', label: 'Surge Pricing' },
              ].map((stat, index) => (
                <div key={stat.label} className="flex items-center">
                  {index > 0 && <div className="hidden sm:block w-px h-10 bg-white/20 mx-8" />}
                  <div className="text-center">
                    <div className="text-2xl sm:text-3xl font-bold text-white">{stat.value}</div>
                    <div className="text-xs text-white/50 mt-1">{stat.label}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Recognition */}
            <div className="flex flex-wrap justify-center gap-3">
              {[
                { icon: Shield, label: 'DPIIT Recognized' },
                { icon: Star, label: 'Startup India' },
                { icon: Award, label: 'Startup Uttarakhand' },
              ].map((badge) => (
                <div
                  key={badge.label}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/8 border border-white/12 rounded-full"
                >
                  <badge.icon className="w-3.5 h-3.5 text-white/60" />
                  <span className="text-white/70 text-xs font-medium">{badge.label}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
