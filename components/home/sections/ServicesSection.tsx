'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import Link from 'next/link'
import { Users, Plane, Calendar, Zap, ArrowRight } from 'lucide-react'
import type { ElementType } from 'react'

interface Service {
  name: string
  description: string
  icon: ElementType
  accent: string
  iconColor: string
  iconBg: string
  link: string
}

const services: Service[] = [
  {
    name: 'Snapgo Shared Rides',
    description: 'Share commercial cabs with verified riders heading your way. Save up to 75% on every trip.',
    icon: Users,
    accent: 'bg-[#0e4493]',
    iconColor: 'text-[#0e4493]',
    iconBg: 'bg-[#0e4493]/8',
    link: '/snapride',
  },
  {
    name: 'Snapgo Airport Cabs',
    description: 'Affordable airport pickups & drops to Delhi IGI T1, T2 & T3. Shared or private options.',
    icon: Plane,
    accent: 'bg-orange-500',
    iconColor: 'text-orange-600',
    iconBg: 'bg-orange-50',
    link: '/snapair',
  },
  {
    name: 'Schedule Ride',
    description: 'Plan your ride in advance. Get matched with co-travellers and lock in your savings early.',
    icon: Calendar,
    accent: 'bg-emerald-500',
    iconColor: 'text-emerald-600',
    iconBg: 'bg-emerald-50',
    link: '/schedule-ride',
  },
  {
    name: 'Realtime Ride',
    description: 'Need a ride now? Get instantly matched with nearby riders heading to the same destination.',
    icon: Zap,
    accent: 'bg-violet-500',
    iconColor: 'text-violet-600',
    iconBg: 'bg-violet-50',
    link: '/realtime-ride',
  },
]

export function ServicesSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section id="services" ref={ref} className="py-20 sm:py-24 bg-white">
      <div className="container mx-auto px-4 xs:px-6 sm:px-8 md:px-12 lg:px-16 xl:px-20 2xl:px-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.4 }}
          className="text-center mb-14"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-3">
            Our Services
          </h2>
          <p className="text-gray-500 max-w-xl mx-auto text-base sm:text-lg">
            Everything you need for smarter, affordable travel.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 gap-5 sm:gap-6 max-w-4xl mx-auto">
          {services.map((service, index) => (
            <Link key={service.name} href={service.link} className="block">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.4, delay: index * 0.08 }}
                className="group relative bg-white rounded-2xl border border-gray-100 p-7 h-full shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden"
              >
                {/* Left accent bar */}
                <div className={`absolute left-0 top-0 bottom-0 w-1 ${service.accent} rounded-l-2xl`} />

                <div className={`w-12 h-12 rounded-xl ${service.iconBg} flex items-center justify-center mb-5`}>
                  <service.icon className={`w-6 h-6 ${service.iconColor}`} />
                </div>

                <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-[#0e4493] transition-colors">
                  {service.name}
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed mb-5">
                  {service.description}
                </p>

                <span className="inline-flex items-center gap-1 text-sm font-medium text-[#0e4493] group-hover:gap-2 transition-all">
                  Learn more
                  <ArrowRight className="w-4 h-4" />
                </span>
              </motion.div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
