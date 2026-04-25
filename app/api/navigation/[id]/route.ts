import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/api-auth'
import { getServerDb, getServerAppId, doc, getDoc } from '@/lib/firebase-server'

interface RouteParams {
  params: Promise<{ id: string }>
}

export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id } = await params
    const db = getServerDb()
    if (!db) {
      return NextResponse.json({ error: 'Firebase not configured' }, { status: 503 })
    }

    const appId = getServerAppId()
    const docRef = doc(db, 'artifacts', appId, 'public', 'data', 'navigation', id)
    const docSnap = await getDoc(docRef)

    if (!docSnap.exists()) {
      return NextResponse.json({ error: 'Navigation item not found' }, { status: 404 })
    }

    return NextResponse.json({ id: docSnap.id, ...docSnap.data() })
  } catch (error) {
    console.error('Error fetching navigation item:', error)
    return NextResponse.json({ error: 'Failed to fetch navigation item' }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const authError = await requireAuth()
    if (authError) return authError

    const { id } = await params
    const body = await request.json()
    const { label, href, icon, visible, external, order, location, section } = body

    const db = getServerDb()
    if (!db) {
      return NextResponse.json({ error: 'Firebase not configured' }, { status: 503 })
    }

    const { setDoc } = await import('firebase/firestore')
    const appId = getServerAppId()
    const docRef = doc(db, 'artifacts', appId, 'public', 'data', 'navigation', id)

    const updateData = {
      label,
      href,
      icon,
      visible,
      external,
      order,
      location,
      section,
      updatedAt: new Date().toISOString(),
    }

    await setDoc(docRef, updateData, { merge: true })

    return NextResponse.json({ id, ...updateData })
  } catch (error) {
    console.error('Error updating navigation item:', error)
    return NextResponse.json({ error: 'Failed to update navigation item' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const authError = await requireAuth()
    if (authError) return authError

    const { id } = await params
    const db = getServerDb()
    if (!db) {
      return NextResponse.json({ error: 'Firebase not configured' }, { status: 503 })
    }

    const { deleteDoc } = await import('firebase/firestore')
    const appId = getServerAppId()
    const docRef = doc(db, 'artifacts', appId, 'public', 'data', 'navigation', id)

    await deleteDoc(docRef)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting navigation item:', error)
    return NextResponse.json({ error: 'Failed to delete navigation item' }, { status: 500 })
  }
}
