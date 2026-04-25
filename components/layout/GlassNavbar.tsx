'use client'

import { useState, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'framer-motion'
import { Menu, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger, SheetClose, SheetTitle } from '@/components/ui/sheet'
import { MAIN_NAV, SITE_CONFIG, isNavGroup, type NavEntry, type NavGroup } from '@/lib/constants'
import { cn } from '@/lib/utils'

function DesktopGroup({
  group,
  pathname,
}: {
  group: NavGroup
  pathname: string
}) {
  const [open, setOpen] = useState(false)
  const isActive = group.items.some(
    (item) => pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href))
  )

  return (
    <div
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        className={cn(
          'flex items-center gap-1 px-4 py-2 text-sm font-medium transition-colors',
          isActive ? 'text-[#0e4493]' : 'text-gray-700 hover:text-[#0e4493]'
        )}
      >
        {group.label}
        <ChevronDown
          className={cn('w-3.5 h-3.5 transition-transform duration-200', open && 'rotate-180')}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full left-0 pt-2 w-72"
          >
            <div className="bg-white rounded-2xl border border-gray-100 shadow-lg p-2">
              {group.items.map((item) => {
                const itemActive =
                  pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href))
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      'block px-3 py-2.5 rounded-lg transition-colors',
                      itemActive ? 'bg-[#0e4493]/5' : 'hover:bg-gray-50'
                    )}
                  >
                    <div
                      className={cn(
                        'text-sm font-medium',
                        itemActive ? 'text-[#0e4493]' : 'text-gray-900'
                      )}
                    >
                      {item.label}
                    </div>
                    {item.description && (
                      <div className="text-xs text-gray-500 mt-0.5">{item.description}</div>
                    )}
                  </Link>
                )
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function MobileEntry({ entry, pathname }: { entry: NavEntry; pathname: string }) {
  const [expanded, setExpanded] = useState(false)

  if (!isNavGroup(entry)) {
    const isActive = pathname === entry.href || (entry.href !== '/' && pathname.startsWith(entry.href))
    return (
      <SheetClose asChild>
        <Link
          href={entry.href}
          className={cn(
            'flex items-center px-4 py-3 mx-2 rounded-xl text-base font-medium transition-colors border-l-4',
            isActive
              ? 'text-[#0e4493] border-[#0e4493] bg-[#0e4493]/5'
              : 'text-gray-900 border-transparent hover:bg-gray-50 hover:text-[#0e4493]'
          )}
        >
          {entry.label}
        </Link>
      </SheetClose>
    )
  }

  const groupActive = entry.items.some(
    (item) => pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href))
  )

  return (
    <div className="mx-2">
      <button
        onClick={() => setExpanded(!expanded)}
        className={cn(
          'w-full flex items-center justify-between px-4 py-3 rounded-xl text-base font-medium transition-colors border-l-4',
          groupActive
            ? 'text-[#0e4493] border-[#0e4493] bg-[#0e4493]/5'
            : 'text-gray-900 border-transparent hover:bg-gray-50'
        )}
      >
        {entry.label}
        <ChevronDown
          className={cn('w-4 h-4 transition-transform', expanded && 'rotate-180')}
        />
      </button>
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="pl-4 py-1 space-y-0.5">
              {entry.items.map((item) => {
                const itemActive =
                  pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href))
                return (
                  <SheetClose asChild key={item.href}>
                    <Link
                      href={item.href}
                      className={cn(
                        'block px-4 py-2.5 rounded-lg text-sm transition-colors',
                        itemActive
                          ? 'text-[#0e4493] bg-[#0e4493]/5 font-medium'
                          : 'text-gray-700 hover:bg-gray-50 hover:text-[#0e4493]'
                      )}
                    >
                      {item.label}
                    </Link>
                  </SheetClose>
                )
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export function GlassNavbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [hidden, setHidden] = useState(false)
  const [isFloating, setIsFloating] = useState(false)
  const pathname = usePathname()
  const { scrollY } = useScroll()
  const lastScrollY = useRef(0)

  useMotionValueEvent(scrollY, 'change', (latest) => {
    const previous = lastScrollY.current

    if (latest > 100) {
      if (latest > previous && latest - previous > 5) {
        setHidden(true)
      }
      if (latest < previous && previous - latest > 5) {
        setHidden(false)
      }
    } else {
      setHidden(false)
    }

    setIsFloating(latest > 50)

    lastScrollY.current = latest
  })

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{
        y: hidden ? -100 : 0,
        opacity: hidden ? 0 : 1,
      }}
      transition={{
        duration: 0.3,
        ease: [0.25, 0.1, 0.25, 1],
      }}
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        isFloating ? 'py-2' : 'py-0'
      )}
    >
      <nav
        className={cn(
          'transition-all duration-500',
          isFloating
            ? 'glass-nav-floating mx-4 md:mx-8 lg:mx-12'
            : 'bg-white/95 backdrop-blur-md border-b border-gray-100'
        )}
      >
        <div className="container mx-auto px-4 xs:px-6 sm:px-8 md:px-12 lg:px-16 xl:px-20 2xl:px-24">
          <div className="flex items-center justify-between h-16 md:h-18">
            <div className="w-10 lg:hidden" />

            {/* Logo */}
            <Link
              href="/"
              className="flex items-center group absolute left-1/2 -translate-x-1/2 lg:relative lg:left-0 lg:translate-x-0"
            >
              <motion.div
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="relative w-28 h-10 md:w-36 md:h-12 translate-y-[5px]"
              >
                <Image
                  src="/images/logo/Snapgo%20Logo%20Blue.png"
                  alt={SITE_CONFIG.name}
                  fill
                  className="object-contain"
                  priority
                />
              </motion.div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-1">
              {MAIN_NAV.map((entry) => {
                if (isNavGroup(entry)) {
                  return <DesktopGroup key={entry.label} group={entry} pathname={pathname} />
                }
                const isActive =
                  pathname === entry.href || (entry.href !== '/' && pathname.startsWith(entry.href))
                return (
                  <Link
                    key={entry.href}
                    href={entry.href}
                    className={cn(
                      'px-4 py-2 text-sm font-medium transition-colors',
                      isActive ? 'text-[#0e4493]' : 'text-gray-700 hover:text-[#0e4493]'
                    )}
                  >
                    {entry.label}
                  </Link>
                )
              })}
            </div>

            {/* Desktop CTA */}
            <div className="hidden lg:flex items-center gap-4">
              <Button
                className="bg-[#0e4493] hover:bg-[#0a3577] text-white rounded-full px-6"
                asChild
              >
                <Link href="/#download">Download App</Link>
              </Button>
            </div>

            {/* Mobile Menu */}
            <div className="flex lg:hidden">
              <Sheet open={isOpen} onOpenChange={setIsOpen}>
                <SheetTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-gray-700 hover:bg-gray-100"
                  >
                    <Menu className="h-5 w-5" />
                    <span className="sr-only">Open menu</span>
                  </Button>
                </SheetTrigger>
                <SheetContent
                  side="right"
                  className="w-full sm:w-80 bg-white/95 backdrop-blur-xl border-l border-gray-200 overflow-y-auto"
                >
                  <SheetTitle className="sr-only">Navigation Menu</SheetTitle>

                  <div className="flex flex-col h-full">
                    <div className="flex items-center justify-center py-8 border-b border-gray-100">
                      <div className="relative w-32 h-12">
                        <Image
                          src="/images/logo/Snapgo%20Logo%20Blue.png"
                          alt={SITE_CONFIG.name}
                          fill
                          className="object-contain"
                        />
                      </div>
                    </div>

                    <nav className="flex flex-col gap-1 py-6 flex-1">
                      {MAIN_NAV.map((entry, index) => (
                        <motion.div
                          key={isNavGroup(entry) ? entry.label : entry.href}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                        >
                          <MobileEntry entry={entry} pathname={pathname} />
                        </motion.div>
                      ))}
                    </nav>

                    <div className="p-4 border-t border-gray-100">
                      <Button
                        className="w-full bg-[#0e4493] hover:bg-[#0a3577] text-white rounded-full"
                        size="lg"
                        asChild
                      >
                        <Link href="/#download">Download App</Link>
                      </Button>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </nav>
    </motion.header>
  )
}
