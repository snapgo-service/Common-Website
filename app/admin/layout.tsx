'use client'

import { useState, useRef } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import NextImage from 'next/image'
import { motion, useScroll, useMotionValueEvent } from 'framer-motion'
import { SITE_CONFIG } from '@/lib/constants'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  LayoutDashboard,
  FileText,
  LogOut,
  Home,
  Hash,
  Instagram,
  Inbox,
  User,
  Menu,
  X,
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Toaster } from '@/components/ui/toaster'

const navLinks = [
  { href: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/admin/blogs', icon: FileText, label: 'Blogs' },
  { href: '/admin/numbers', icon: Hash, label: 'Numbers' },
  { href: '/admin/instagram', icon: Instagram, label: 'Instagram' },
  { href: '/admin/submissions/galgotia', icon: Inbox, label: 'Galgotia Signups' },
]

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const router = useRouter()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [hidden, setHidden] = useState(false)
  const [isFloating, setIsFloating] = useState(false)
  const { scrollY } = useScroll()
  const lastScrollY = useRef(0)

  const isLoginPage = pathname?.includes('/admin/login')

  // Hide on scroll down, show on scroll up (matching website GlassNavbar)
  useMotionValueEvent(scrollY, 'change', (latest) => {
    const previous = lastScrollY.current
    if (latest > 100) {
      if (latest > previous && latest - previous > 5) setHidden(true)
      if (latest < previous && previous - latest > 5) setHidden(false)
    } else {
      setHidden(false)
    }
    setIsFloating(latest > 50)
    lastScrollY.current = latest
  })

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/logout', { method: 'POST' })
      router.push('/admin/login')
      router.refresh()
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  if (isLoginPage) {
    return <>{children}</>
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Floating Glassmorphism Navbar */}
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{
          y: hidden ? -100 : 0,
          opacity: hidden ? 0 : 1,
        }}
        transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
          isFloating ? 'py-2' : 'py-0'
        )}
      >
        <div
          className={cn(
            'transition-all duration-500',
            isFloating
              ? 'glass-nav-floating mx-4 md:mx-8 lg:mx-12'
              : 'bg-white/95 backdrop-blur-md border-b border-gray-100'
          )}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              {/* Logo */}
              <Link href="/admin" className="flex items-center gap-3 group">
                <motion.div
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="relative w-28 h-10 translate-y-[3px]"
                >
                  <NextImage
                    src="/images/logo/Snapgo%20Logo%20Blue.png"
                    alt={SITE_CONFIG.name}
                    fill
                    className="object-contain"
                    priority
                  />
                </motion.div>
              </Link>

              {/* Desktop Navigation */}
              <div className="hidden md:flex items-center gap-1">
                {navLinks.map((link) => {
                  const Icon = link.icon
                  const isActive =
                    pathname === link.href ||
                    (link.href !== '/admin' && pathname?.startsWith(link.href))

                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={cn(
                        'relative flex items-center gap-2 px-4 py-2 text-sm font-medium transition-all duration-200',
                        isActive
                          ? 'text-primary'
                          : 'text-gray-700 hover:text-primary'
                      )}
                    >
                      <motion.span
                        whileHover={{ y: -1 }}
                        transition={{ duration: 0.2 }}
                        className="relative inline-flex items-center gap-2"
                      >
                        <Icon className="w-4 h-4" />
                        {link.label}
                        {isActive && (
                          <motion.div
                            layoutId="admin-nav-underline"
                            className="absolute -bottom-1.5 left-0 w-full h-0.5 bg-gradient-to-r from-primary to-teal rounded-full"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.2 }}
                          />
                        )}
                      </motion.span>
                    </Link>
                  )
                })}
              </div>

              {/* Right Side Actions */}
              <div className="flex items-center gap-2">
                {/* User Menu */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="rounded-lg text-gray-700 hover:bg-gray-100"
                    >
                      <User className="w-5 h-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48 bg-white/95 backdrop-blur-xl border border-gray-200">
                    <DropdownMenuLabel className="text-gray-900">
                      Admin Account
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/" className="flex items-center gap-2 cursor-pointer">
                        <Home className="w-4 h-4" />
                        <span>Back to Site</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={handleLogout}
                      className="text-red-600 cursor-pointer focus:text-red-600"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      <span>Logout</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* Mobile Menu Toggle */}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="md:hidden rounded-lg text-gray-700 hover:bg-gray-100"
                >
                  {mobileMenuOpen ? (
                    <X className="w-6 h-6" />
                  ) : (
                    <Menu className="w-6 h-6" />
                  )}
                </Button>
              </div>
            </div>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="md:hidden border-t border-gray-100">
              <div className="px-4 py-4 space-y-1">
                {navLinks.map((link) => {
                  const Icon = link.icon
                  const isActive =
                    pathname === link.href ||
                    (link.href !== '/admin' && pathname?.startsWith(link.href))

                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={cn(
                        'flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium transition-all duration-200 border-l-4',
                        isActive
                          ? 'text-primary border-primary bg-primary/5'
                          : 'text-gray-900 border-transparent hover:bg-gray-50 hover:text-primary'
                      )}
                    >
                      <Icon className="w-5 h-5" />
                      <span>{link.label}</span>
                    </Link>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      </motion.nav>

      {/* Main Content */}
      <main className="pt-20 px-4 sm:px-6 lg:px-8 pb-12">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>

      <Toaster />
    </div>
  )
}
