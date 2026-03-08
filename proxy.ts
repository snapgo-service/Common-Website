import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Simple hash function using Web Crypto API (Edge runtime compatible)
async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(password)
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
}

// Constant-time string comparison (Edge runtime compatible)
// Prevents timing attacks by always comparing all bytes, even on length mismatch
function timingSafeEqual(a: string, b: string): boolean {
  const maxLen = Math.max(a.length, b.length)
  const paddedA = a.padEnd(maxLen, '\0')
  const paddedB = b.padEnd(maxLen, '\0')

  const encoder = new TextEncoder()
  const aBytes = encoder.encode(paddedA)
  const bBytes = encoder.encode(paddedB)

  let result = a.length ^ b.length // non-zero if lengths differ
  for (let i = 0; i < aBytes.length; i++) {
    result |= aBytes[i] ^ bBytes[i]
  }

  return result === 0
}

/**
 * Verify session from cookies (works for both traditional and Firebase login)
 * After Firebase login, the login page creates session cookies via /api/admin/firebase-session
 */
async function verifySession(request: NextRequest): Promise<boolean> {
  const sessionToken = request.cookies.get('admin_session')?.value
  const storedTokenHash = request.cookies.get('admin_token_hash')?.value

  if (!sessionToken || !storedTokenHash) {
    return false
  }

  const calculatedHash = await hashPassword(sessionToken)
  return timingSafeEqual(calculatedHash, storedTokenHash)
}

export async function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname

  // Normalize path - remove trailing slash for comparison
  const normalizedPath = path.endsWith('/') ? path.slice(0, -1) : path

  // Protect admin routes (except login page)
  if (normalizedPath.startsWith('/admin') && normalizedPath !== '/admin/login') {
    const isAuthenticated = await verifySession(request)

    if (!isAuthenticated) {
      // No valid session - redirect to login
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }
  }

  // If already logged in and trying to access login page, redirect to admin
  if (normalizedPath === '/admin/login') {
    const isAuthenticated = await verifySession(request)

    if (isAuthenticated) {
      return NextResponse.redirect(new URL('/admin', request.url))
    }
  }

  // Protect dashboard routes - require user_session cookie
  if (normalizedPath.startsWith('/dashboard')) {
    const userSession = request.cookies.get('user_session')?.value
    if (!userSession) {
      return NextResponse.redirect(new URL('/auth/login', request.url))
    }
  }

  // If user is already logged in and trying to access auth pages, redirect to home
  if (normalizedPath.startsWith('/auth')) {
    const userSession = request.cookies.get('user_session')?.value
    if (userSession) {
      return NextResponse.redirect(new URL('/', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*', '/dashboard/:path*', '/auth/:path*'],
}
