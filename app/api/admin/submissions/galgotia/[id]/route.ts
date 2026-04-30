import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/api-auth'
import { getAdminCollectionPath, getAdminDb } from '@/lib/firebase-admin'

const COLLECTION_NAME = 'galgotiaSubmissions'
const ID_REGEX = /^[A-Za-z0-9_-]{8,40}$/

interface RouteParams {
  params: Promise<{ id: string }>
}

export async function DELETE(_request: NextRequest, { params }: RouteParams) {
  const authError = await requireAuth()
  if (authError) return authError

  const { id } = await params
  if (!ID_REGEX.test(id)) {
    return NextResponse.json({ error: 'Invalid submission id.' }, { status: 400 })
  }

  const db = getAdminDb()
  if (!db) {
    return NextResponse.json(
      { error: 'Firestore Admin SDK is not initialised on the server.' },
      { status: 503 },
    )
  }

  try {
    const docRef = db.collection(getAdminCollectionPath(COLLECTION_NAME)).doc(id)
    const snap = await docRef.get()
    if (!snap.exists) {
      return NextResponse.json({ error: 'Submission not found.' }, { status: 404 })
    }
    await docRef.delete()
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[admin/galgotia] delete failed:', error)
    return NextResponse.json({ error: 'Failed to delete submission.' }, { status: 500 })
  }
}
