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
  MapPin,
  Car,
  IndianRupee,
  Percent,
  Wallet,
  CreditCard,
  Gavel,
  Eye,
  Download,
  Baby,
  Thermometer,
  Languages,
} from 'lucide-react'

const steps = [
  {
    step: 1,
    title: 'Set Your Route',
    description:
      'Enter pickup and destination — see estimated distance. Choose One Way or Round Trip (10% discount on round trips).',
    image: '/images/services/outstation-booking.png',
    alt: 'Snapgo Outstation Cabs — route, trip type, schedule, vehicle selection',
  },
  {
    step: 2,
    title: 'Choose Vehicle & Schedule',
    description:
      'Pick from Sedan (4-seater), Ertiga (6-seater), SUV, Innova, or Tempo Traveller. Set departure date, time, and passengers.',
    image: '/images/services/outstation-confirm.png',
    alt: 'Snapgo Outstation — fare breakdown with distance, rate per km, and estimated total',
  },
  {
    step: 3,
    title: 'Review & Name Your Price',
    description:
      'See the transparent fare breakdown — distance, per-km rate, total estimate. Pay the estimated fare, or place a bid with your own price. Our team reviews and responds.',
    image: '/images/services/outstation-bid.png',
    alt: 'Snapgo Outstation — Place a Bid, enter your price, team reviews',
  },
  {
    step: 4,
    title: 'Pay & Go',
    description:
      'Pay 25% advance to confirm, or full payment upfront. Use wallet balance + Razorpay. Remaining amount due before the trip.',
    image: '/images/services/outstation-payment.png',
    alt: 'Snapgo Outstation — 25% advance or full payment, wallet + Razorpay',
  },
]

const features = [
  { icon: Gavel, title: 'Name Your Price', description: 'Place a bid — our team reviews and responds with a fair deal' },
  { icon: Car, title: '5 Vehicle Types', description: 'Sedan, Ertiga, SUV, Innova, Tempo Traveller' },
  { icon: Eye, title: 'Transparent Pricing', description: 'See distance, per-km rate, and total breakdown' },
  { icon: Percent, title: '10% Off Round Trips', description: 'Built-in discount for return journeys' },
  { icon: Wallet, title: '25% Advance Booking', description: 'Pay just 25% to confirm, rest before trip' },
  { icon: CreditCard, title: 'Wallet + Razorpay', description: 'Use wallet balance and pay the rest via Razorpay' },
]

const comparison = [
  { others: 'Fixed pricing — no room to negotiate', snapgo: 'You name your price, we work it out together' },
  { others: 'Algorithm-based surge pricing', snapgo: 'Human-reviewed fair pricing, no surge' },
  { others: 'One size fits all', snapgo: '5 vehicle options from Sedan to Tempo Traveller' },
  { others: 'You pay full fare alone', snapgo: 'Share your ride and split the cost' },
  { others: 'No visibility into pricing logic', snapgo: 'Transparent per-km rate and fare breakdown' },
  { others: 'One-way only or expensive round trips', snapgo: '10% round trip discount built in' },
]

export default function OutstationCabsClient() {
  const stepsRef = useRef<HTMLDivElement>(null)
  const stepsInView = useInView(stepsRef, { once: true, margin: '-100px' })
  const featuresRef = useRef<HTMLDivElement>(null)
  const featuresInView = useInView(featuresRef, { once: true, margin: '-100px' })
  const comparisonRef = useRef<HTMLDivElement>(null)
  const comparisonInView = useInView(comparisonRef, { once: true, margin: '-100px' })

  return (
    <SiteLayout>
      <PageHero
        badge="SnapTrip"
        title="Outstation Cabs —"
        titleHighlight="Name Your Price"
        description="Book a dedicated cab or share one. Choose your vehicle, set your price, and travel intercity on your terms."
        icon={<MapPin className="w-4 h-4 text-primary" />}
        trustBadges={[
          { label: '5 Vehicle Types', variant: 'primary' },
          { label: '10% Off Round Trips', variant: 'teal' },
          { label: 'Transparent Pricing', variant: 'primary' },
        ]}
        cta={{ label: 'Download App', href: '/#download', variant: 'gradient' }}
      />

      {/* How It Works */}
      <section ref={stepsRef} className="section-padding bg-gray-50">
        <div className="container mx-auto px-4 xs:px-6 sm:px-8 md:px-12 lg:px-16 xl:px-20 2xl:px-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={stepsInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.4 }}
            className="text-center mb-12"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3">
              How It <span className="text-primary">Works</span>
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Book your outstation cab in 4 simple steps
            </p>
          </motion.div>

          <div className="space-y-16 max-w-5xl mx-auto">
            {steps.map((item, index) => {
              const isEven = index % 2 === 0
              return (
                <motion.div
                  key={item.step}
                  initial={{ opacity: 0, y: 40 }}
                  animate={stepsInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: index * 0.12 }}
                  className={`flex flex-col ${isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'} items-center gap-8 lg:gap-12`}
                >
                  <div className="w-full lg:w-1/2 flex justify-center">
                    <div className="relative w-[220px] sm:w-[260px] md:w-[280px]">
                      <Image
                        src={item.image}
                        alt={item.alt}
                        width={280}
                        height={560}
                        className="w-full h-auto rounded-3xl shadow-2xl"
                      />
                    </div>
                  </div>
                  <div className="w-full lg:w-1/2 text-center lg:text-left">
                    <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-primary text-white font-bold text-lg mb-4">
                      {item.step}
                    </span>
                    <h3 className="text-xl sm:text-2xl font-bold mb-3">{item.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{item.description}</p>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section ref={comparisonRef} className="section-padding bg-white">
        <div className="container mx-auto px-4 xs:px-6 sm:px-8 md:px-12 lg:px-16 xl:px-20 2xl:px-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={comparisonInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.4 }}
            className="text-center mb-10"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3">
              Why Snapgo is <span className="text-primary">Better</span>
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={comparisonInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="max-w-4xl mx-auto overflow-x-auto"
          >
            <table className="w-full text-left border-collapse">
              <thead>
                <tr>
                  <th className="px-4 py-3 bg-red-50 text-red-700 font-semibold rounded-tl-xl text-sm">What Others Do</th>
                  <th className="px-4 py-3 bg-emerald-50 text-emerald-700 font-semibold rounded-tr-xl text-sm">What Snapgo Does</th>
                </tr>
              </thead>
              <tbody>
                {comparison.map((row, index) => (
                  <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                    <td className="px-4 py-3 text-sm text-muted-foreground border-r border-gray-100">{row.others}</td>
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">{row.snapgo}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section ref={featuresRef} className="section-padding bg-gray-50">
        <div className="container mx-auto px-4 xs:px-6 sm:px-8 md:px-12 lg:px-16 xl:px-20 2xl:px-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={featuresInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.4 }}
            className="text-center mb-12"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3">
              Key <span className="text-primary">Features</span>
            </h2>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 max-w-5xl mx-auto">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                animate={featuresInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.4, delay: index * 0.08 }}
              >
                <Card className="h-full border hover:shadow-lg transition-shadow">
                  <CardContent className="p-5">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                      <feature.icon className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="font-bold mb-1">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Special Requests Note */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={featuresInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.4, delay: 0.5 }}
            className="max-w-3xl mx-auto mt-10"
          >
            <Card className="border-primary/20 bg-primary/5">
              <CardContent className="p-5">
                <p className="font-semibold text-primary mb-2">Special Requests Supported</p>
                <div className="flex flex-wrap gap-3">
                  {[
                    { icon: Baby, label: 'Child Seat' },
                    { icon: Thermometer, label: 'AC Preference' },
                    { icon: Languages, label: 'Driver Language' },
                  ].map((item) => (
                    <span key={item.label} className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
                      <item.icon className="w-4 h-4 text-primary" />
                      {item.label}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding bg-gradient-to-br from-primary to-primary/80">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
            Plan Your Next Trip
          </h2>
          <p className="text-white/80 mb-8 max-w-lg mx-auto">
            Download Snapgo and book outstation cabs at your price.
          </p>
          <Button variant="outline" size="lg" className="bg-white text-primary hover:bg-white/90" asChild>
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
