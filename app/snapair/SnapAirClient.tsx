'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { SiteLayout } from '@/components/layout/SiteLayout'
import { PageHero } from '@/components/shared/PageHero'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Plane,
  ArrowLeftRight,
  Clock,
  Car,
  Users,
  ShieldCheck,
  Download,
  Wallet,
  CheckCircle,
} from 'lucide-react'

const steps = [
  {
    step: 1,
    title: 'Select Airport Cabs',
    description:
      'Open the Snapgo app and go to the Services tab. Tap on "Airport Cabs" to start your booking.',
    image: '/images/services/1.jpeg',
    alt: 'Snapgo app services hub showing Airport Cabs option',
  },
  {
    step: 2,
    title: 'Set Your Route',
    description:
      'Choose your direction — To Airport or From Airport. Select your terminal (T1, T2, or T3), enter your pickup location, and set your travel date & time.',
    image: '/images/services/2.jpeg',
    alt: 'Airport cab booking flow with map, terminal selection, and direction toggle',
  },
  {
    step: 3,
    title: 'Review & Pay',
    description:
      'See your complete ride details — fare breakdown, wallet balance, and advance payment. Confirm your booking and your driver will be assigned 24 hours before pickup.',
    image: '/images/services/3.jpeg',
    alt: 'Ride details and payment breakdown showing fare, wallet deduction, and Razorpay',
  },
]

const features = [
  { icon: ArrowLeftRight, title: 'To & From Airport', description: 'Book rides in both directions — pickups and drops' },
  { icon: Plane, title: 'All Terminals', description: 'Delhi IGI Terminal 1, 2 & 3 fully supported' },
  { icon: Car, title: 'Multiple Vehicles', description: 'Sedan, Ertiga, SUV, Innova, Tempo Traveller' },
  { icon: Clock, title: 'Driver Confirmed 24hr Before', description: 'Know your driver and vehicle details well in advance' },
  { icon: Users, title: 'Shared = 50% Cheaper', description: 'Share the ride, pay half the normal fare' },
  { icon: ShieldCheck, title: 'Safe & Verified', description: 'Aadhaar KYC verified riders and licensed commercial cabs' },
]

const pricingHighlights = [
  { label: 'Shared cab starts at', value: '₹399/seat' },
  { label: 'Advance payment', value: '25% only' },
  { label: 'Wallet balance', value: 'Applicable' },
  { label: 'Cancellation', value: 'Free up to 1hr before' },
]

export default function SnapAirClient() {
  const stepsRef = useRef<HTMLDivElement>(null)
  const stepsInView = useInView(stepsRef, { once: true, margin: '-100px' })
  const featuresRef = useRef<HTMLDivElement>(null)
  const featuresInView = useInView(featuresRef, { once: true, margin: '-100px' })
  const pricingRef = useRef<HTMLDivElement>(null)
  const pricingInView = useInView(pricingRef, { once: true, margin: '-100px' })

  return (
    <SiteLayout>
      <PageHero
        badge="Snapgo Airport Cabs"
        title="Airport Cabs"
        titleHighlight="Made Easy"
        description="Affordable airport pickups & drops to Delhi IGI T1, T2 & T3. Shared or private. Driver confirmed 24 hours before your pickup."
        icon={<Plane className="w-4 h-4 text-primary" />}
        trustBadges={[
          { label: '50% Savings', variant: 'teal' },
          { label: 'All Terminals', variant: 'primary' },
          { label: '24hr Driver Confirmation', variant: 'teal' },
        ]}
        cta={{ label: 'Download App', href: '/#download', variant: 'gradient' }}
      />

      {/* How It Works */}
      <section ref={stepsRef} className="py-20 sm:py-24 bg-[#fafbfd]">
        <div className="container mx-auto px-4 xs:px-6 sm:px-8 md:px-12 lg:px-16 xl:px-20 2xl:px-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={stepsInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.4 }}
            className="text-center mb-14"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-3">
              Book in <span className="text-[#0e4493]">3 Easy Steps</span>
            </h2>
            <p className="text-gray-500 max-w-xl mx-auto text-base sm:text-lg">
              From opening the app to confirmed booking — under 2 minutes.
            </p>
          </motion.div>

          <div className="space-y-20 max-w-5xl mx-auto">
            {steps.map((item, index) => {
              const isEven = index % 2 === 0
              return (
                <motion.div
                  key={item.step}
                  initial={{ opacity: 0, y: 30 }}
                  animate={stepsInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: index * 0.12 }}
                  className={`flex flex-col ${isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'} items-center gap-10 lg:gap-16`}
                >
                  {/* Phone screenshot */}
                  <div className="w-full lg:w-5/12 flex justify-center">
                    <div className="relative w-[220px] sm:w-[250px] md:w-[270px]">
                      <Image
                        src={item.image}
                        alt={item.alt}
                        width={270}
                        height={540}
                        className="w-full h-auto rounded-[2rem] shadow-xl border border-gray-200/50"
                      />
                    </div>
                  </div>

                  {/* Text content */}
                  <div className="w-full lg:w-7/12 text-center lg:text-left">
                    <div className="inline-flex items-center justify-center w-11 h-11 rounded-full bg-[#0e4493] text-white font-bold text-lg mb-5 shadow-sm">
                      {item.step}
                    </div>
                    <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">{item.title}</h3>
                    <p className="text-gray-500 leading-relaxed text-base sm:text-lg max-w-md mx-auto lg:mx-0">
                      {item.description}
                    </p>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Pricing Highlights */}
      <section ref={pricingRef} className="py-16 sm:py-20 bg-white">
        <div className="container mx-auto px-4 xs:px-6 sm:px-8 md:px-12 lg:px-16 xl:px-20 2xl:px-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={pricingInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.4 }}
            className="text-center mb-10"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
              Transparent Pricing
            </h2>
            <p className="text-gray-500 max-w-lg mx-auto">
              No hidden charges. No surge. What you see is what you pay.
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 max-w-4xl mx-auto">
            {pricingHighlights.map((item, index) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 20 }}
                animate={pricingInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.4, delay: index * 0.08 }}
                className="bg-[#fafbfd] rounded-2xl p-5 sm:p-6 text-center border border-gray-100"
              >
                <div className="text-xl sm:text-2xl font-bold text-[#0e4493] mb-1">{item.value}</div>
                <div className="text-xs sm:text-sm text-gray-500">{item.label}</div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={pricingInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.4, delay: 0.4 }}
            className="flex flex-wrap justify-center gap-4 mt-8 text-sm text-gray-500"
          >
            <div className="flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4 text-emerald-500" />
              <span>Use wallet balance</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4 text-emerald-500" />
              <span>Pay via Razorpay</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4 text-emerald-500" />
              <span>75% pay to driver directly</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section ref={featuresRef} className="py-20 sm:py-24 bg-[#fafbfd]">
        <div className="container mx-auto px-4 xs:px-6 sm:px-8 md:px-12 lg:px-16 xl:px-20 2xl:px-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={featuresInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.4 }}
            className="text-center mb-14"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-3">
              Why Snapgo Airport Cabs
            </h2>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 max-w-5xl mx-auto">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={featuresInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.4, delay: index * 0.08 }}
              >
                <Card className="h-full border border-gray-100 bg-white shadow-sm hover:shadow-md transition-shadow duration-300">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 rounded-xl bg-[#0e4493]/8 flex items-center justify-center mb-4">
                      <feature.icon className="w-6 h-6 text-[#0e4493]" />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-1.5">{feature.title}</h3>
                    <p className="text-sm text-gray-500 leading-relaxed">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 sm:py-24 bg-[#0e4493]">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Flying Soon? Book Your Airport Cab.
          </h2>
          <p className="text-white/70 mb-8 max-w-lg mx-auto text-lg">
            Download Snapgo and save 50% on your next airport transfer.
          </p>
          <Button size="lg" className="bg-white text-[#0e4493] hover:bg-gray-50 rounded-xl h-14 px-8 font-semibold" asChild>
            <Link href="/#download">
              <Download className="w-5 h-5 mr-2" />
              Download App
            </Link>
          </Button>
        </div>
      </section>
    </SiteLayout>
  )
}
