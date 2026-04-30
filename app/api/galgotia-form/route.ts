import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import admin from 'firebase-admin'
import { checkRateLimit } from '@/lib/rate-limit'
import { getAdminCollectionPath, getAdminDb } from '@/lib/firebase-admin'

const COLLECTION_NAME = 'galgotiaSubmissions'

const DAILY_TRAVEL_OPTIONS = ['Yes', 'No'] as const
const PICKUP_TIME_OPTIONS = ['8:00 AM', '8:30 AM', '9:00 AM'] as const
const RETURN_TIME_OPTIONS = ['4:00 PM', '5:00 PM', '6:00 PM'] as const
const CURRENT_TRAVEL_OPTIONS = ['Auto', 'Cab (Ola/Uber)', 'Personal vehicle', 'Friends / Carpool'] as const
const INTERESTED_OPTIONS = ['Yes', 'Maybe', 'No'] as const

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const PHONE_REGEX = /^[+\d][\d\s\-+()]{6,19}$/

type Submission = {
  email: string
  fullName: string
  phone: string
  dailyTravel: string
  pickupTime: string
  pickupTimeOther?: string
  returnTime: string
  returnTimeOther?: string
  currentTravel: string
  interested: string
}

function validate(body: Partial<Submission>): { ok: true; data: Submission } | { ok: false; error: string } {
  if (!body || typeof body !== 'object') return { ok: false, error: 'Invalid payload' }

  const email = String(body.email ?? '').trim()
  if (!email || !EMAIL_REGEX.test(email) || email.length > 254) {
    return { ok: false, error: 'Please enter a valid email address.' }
  }

  const fullName = String(body.fullName ?? '').trim()
  if (fullName.length < 2 || fullName.length > 100) {
    return { ok: false, error: 'Full name must be 2-100 characters.' }
  }

  const phone = String(body.phone ?? '').trim()
  if (!PHONE_REGEX.test(phone)) {
    return { ok: false, error: 'Please enter a valid phone number.' }
  }

  const dailyTravel = String(body.dailyTravel ?? '').trim()
  if (!DAILY_TRAVEL_OPTIONS.includes(dailyTravel as typeof DAILY_TRAVEL_OPTIONS[number])) {
    return { ok: false, error: 'Please tell us if you travel daily on this route.' }
  }

  const pickupTime = String(body.pickupTime ?? '').trim()
  const pickupIsOther = pickupTime === 'Other'
  if (
    !pickupIsOther &&
    !PICKUP_TIME_OPTIONS.includes(pickupTime as typeof PICKUP_TIME_OPTIONS[number])
  ) {
    return { ok: false, error: 'Please pick a morning pickup time.' }
  }
  const pickupTimeOther = pickupIsOther ? String(body.pickupTimeOther ?? '').trim() : ''
  if (pickupIsOther && (pickupTimeOther.length < 1 || pickupTimeOther.length > 100)) {
    return { ok: false, error: 'Please specify your preferred morning pickup time.' }
  }

  const returnTime = String(body.returnTime ?? '').trim()
  const returnIsOther = returnTime === 'Other'
  if (
    !returnIsOther &&
    !RETURN_TIME_OPTIONS.includes(returnTime as typeof RETURN_TIME_OPTIONS[number])
  ) {
    return { ok: false, error: 'Please pick an evening return time.' }
  }
  const returnTimeOther = returnIsOther ? String(body.returnTimeOther ?? '').trim() : ''
  if (returnIsOther && (returnTimeOther.length < 1 || returnTimeOther.length > 100)) {
    return { ok: false, error: 'Please specify your preferred evening return time.' }
  }

  const currentTravel = String(body.currentTravel ?? '').trim()
  if (!CURRENT_TRAVEL_OPTIONS.includes(currentTravel as typeof CURRENT_TRAVEL_OPTIONS[number])) {
    return { ok: false, error: 'Please tell us how you currently travel.' }
  }

  const interested = String(body.interested ?? '').trim()
  if (!INTERESTED_OPTIONS.includes(interested as typeof INTERESTED_OPTIONS[number])) {
    return { ok: false, error: 'Please tell us if you would be interested in a shared cab.' }
  }

  return {
    ok: true,
    data: {
      email,
      fullName,
      phone,
      dailyTravel,
      pickupTime,
      pickupTimeOther,
      returnTime,
      returnTimeOther,
      currentTravel,
      interested,
    },
  }
}

function getClientIp(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for')
  if (forwarded) return forwarded.split(',')[0].trim()
  return request.headers.get('x-real-ip') || 'unknown'
}

function hashIp(ip: string): string {
  const salt = process.env.NEXT_PUBLIC_APP_ID || 'snapgo'
  return crypto
    .createHash('sha256')
    .update(`${salt}::galgotia::${ip}`)
    .digest('hex')
    .slice(0, 32)
}

export async function POST(request: NextRequest) {
  const rateLimited = checkRateLimit(request, 'galgotia-form', {
    maxRequests: 5,
    windowMs: 10 * 60 * 1000,
  })
  if (rateLimited) return rateLimited

  let body: Partial<Submission>
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const result = validate(body)
  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 400 })
  }

  const db = getAdminDb()
  if (!db) {
    console.error('[galgotia-form] Firebase Admin SDK is not initialised — cannot store submission.')
    return NextResponse.json(
      { error: 'Submissions are temporarily unavailable. Please try again shortly.' },
      { status: 503 },
    )
  }

  try {
    const userAgent = request.headers.get('user-agent')?.slice(0, 200) ?? ''
    const ipHash = hashIp(getClientIp(request))

    await db.collection(getAdminCollectionPath(COLLECTION_NAME)).add({
      ...result.data,
      submittedAt: admin.firestore.FieldValue.serverTimestamp(),
      userAgent,
      ipHash,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[galgotia-form] Firestore write failed:', error)
    return NextResponse.json(
      { error: 'We could not record your response right now. Please try again in a moment.' },
      { status: 500 },
    )
  }
}
