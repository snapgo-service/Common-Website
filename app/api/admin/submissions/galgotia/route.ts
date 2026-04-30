import { NextResponse } from 'next/server'
import { requireAuth } from '@/lib/api-auth'
import { getAdminCollectionPath, getAdminDb } from '@/lib/firebase-admin'

const COLLECTION_NAME = 'galgotiaSubmissions'
const MAX_RESULTS = 500

type SerialisedSubmission = {
  id: string
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
  submittedAt: string | null
  userAgent?: string
  ipHash?: string
}

export async function GET() {
  const authError = await requireAuth()
  if (authError) return authError

  const db = getAdminDb()
  if (!db) {
    return NextResponse.json(
      { error: 'Firestore Admin SDK is not initialised on the server.' },
      { status: 503 },
    )
  }

  try {
    const snapshot = await db
      .collection(getAdminCollectionPath(COLLECTION_NAME))
      .orderBy('submittedAt', 'desc')
      .limit(MAX_RESULTS)
      .get()

    const submissions: SerialisedSubmission[] = snapshot.docs.map((doc) => {
      const data = doc.data() as Record<string, unknown>
      const submittedAt = data.submittedAt
      let submittedAtIso: string | null = null
      if (
        submittedAt &&
        typeof submittedAt === 'object' &&
        'toDate' in submittedAt &&
        typeof (submittedAt as { toDate: unknown }).toDate === 'function'
      ) {
        submittedAtIso = (submittedAt as { toDate: () => Date }).toDate().toISOString()
      }

      return {
        id: doc.id,
        email: String(data.email ?? ''),
        fullName: String(data.fullName ?? ''),
        phone: String(data.phone ?? ''),
        dailyTravel: String(data.dailyTravel ?? ''),
        pickupTime: String(data.pickupTime ?? ''),
        pickupTimeOther: data.pickupTimeOther ? String(data.pickupTimeOther) : '',
        returnTime: String(data.returnTime ?? ''),
        returnTimeOther: data.returnTimeOther ? String(data.returnTimeOther) : '',
        currentTravel: String(data.currentTravel ?? ''),
        interested: String(data.interested ?? ''),
        submittedAt: submittedAtIso,
        userAgent: data.userAgent ? String(data.userAgent) : '',
        ipHash: data.ipHash ? String(data.ipHash) : '',
      }
    })

    return NextResponse.json({ submissions })
  } catch (error) {
    console.error('[admin/galgotia] list failed:', error)
    return NextResponse.json(
      { error: 'Failed to load submissions.' },
      { status: 500 },
    )
  }
}
