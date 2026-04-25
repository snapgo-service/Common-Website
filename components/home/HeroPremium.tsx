'use client'

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import Image from 'next/image'
import { ShieldCheck, Users, Leaf } from 'lucide-react'
import { HeroContentData } from '@/lib/content'

const DEFAULT_HERO: HeroContentData = {
  id: 'default',
  headline: 'Share the Ride. Keep the Savings.',
  subtext: "India's smartest way to share cabs. Verified riders, zero surge, up to 75% cheaper than riding solo.",
  badge: 'Trusted by 4,500+ riders',
  ctaPrimary: 'Book a Ride',
  ctaSecondary: 'Offer a Ride',
  isActive: true,
}

interface HeroPremiumProps {
  hero?: HeroContentData
  heroMockupUrl?: string
}

export function HeroPremium({ hero, heroMockupUrl }: HeroPremiumProps = {}) {
  const displayHero = hero || DEFAULT_HERO
  const mockupUrl = heroMockupUrl || '/images/mockups/iphone15/home-screen.png'

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#f8faff] to-white">
      <div className="container mx-auto px-4 xs:px-6 sm:px-8 md:px-12 lg:px-16 xl:px-20 2xl:px-24 py-20 sm:py-24 lg:py-28">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left — Text */}
          <div className="text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#0e4493]/8 border border-[#0e4493]/12 rounded-full mb-8"
            >
              <Users className="w-3.5 h-3.5 text-[#0e4493]" />
              <span className="text-[#0e4493] text-xs sm:text-sm font-medium">
                Trusted by 4,500+ riders in Delhi/NCR
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight mb-6 leading-[1.08]"
            >
              <span className="text-gray-900">Share the Ride.</span>
              <br />
              <span className="text-[#0e4493]">Keep the Savings.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="text-base sm:text-lg text-gray-500 max-w-lg mx-auto lg:mx-0 mb-10 leading-relaxed"
            >
              {displayHero.subtext}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="flex flex-col xs:flex-row gap-3 justify-center lg:justify-start mb-10"
            >
              <Button
                size="lg"
                className="bg-[#0e4493] hover:bg-[#0b3a7d] text-white px-8 rounded-xl h-13 text-base font-semibold shadow-md shadow-[#0e4493]/20"
                asChild
              >
                <Link href="#download">Book a Ride</Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-[#0e4493] text-[#0e4493] hover:bg-[#0e4493]/5 px-8 rounded-xl h-13 text-base font-semibold"
                asChild
              >
                <Link href="#download">Offer a Ride</Link>
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="flex flex-wrap items-center gap-x-5 gap-y-2 justify-center lg:justify-start"
            >
              <div className="flex items-center gap-1.5 text-sm font-medium text-gray-600">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span>Aadhaar Verified</span>
              </div>
              <span className="text-gray-300">|</span>
              <div className="flex items-center gap-1.5 text-sm font-medium text-gray-600">
                <Leaf className="w-4 h-4 text-emerald-500" />
                <span>Eco-Friendly</span>
              </div>
              <span className="text-gray-300">|</span>
              <div className="flex items-center gap-1.5 text-sm font-medium text-gray-600">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span>DPIIT Recognized</span>
              </div>
            </motion.div>
          </div>

          {/* Right — Phone mockup with depth */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex justify-center lg:justify-end"
          >
            <div className="relative">
              {/* Background depth card */}
              <div className="absolute -inset-4 bg-[#0e4493]/[0.04] rounded-[2.5rem] -rotate-2" />
              <div className="relative w-[230px] xs:w-[260px] sm:w-[290px] md:w-[310px] lg:w-[290px] xl:w-[330px]">
                <Image
                  src={mockupUrl}
                  alt="Snapgo App"
                  width={330}
                  height={672}
                  className="w-full h-auto drop-shadow-2xl relative z-10"
                  priority
                />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
