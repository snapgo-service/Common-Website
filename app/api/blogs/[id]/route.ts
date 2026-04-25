import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { requireAuth } from '@/lib/api-auth'
import { getAdminDb, getAdminCollectionPath } from '@/lib/firebase-admin'
import {
  getServerDb,
  getAuthenticatedServerDb,
  getCollectionPath,
  doc,
  getDoc,
} from '@/lib/firebase-server'
import { sanitizeSlug } from '@/lib/utils'
import { updateBlogSchema, validateBody } from '@/lib/validations'

interface RouteParams {
  params: Promise<{ id: string }>
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params

    // Try Admin SDK first (bypasses security rules, works on Vercel)
    const adminDb = getAdminDb()
    if (adminDb) {
      const blogsPath = getAdminCollectionPath('blogs')
      const docSnap = await adminDb.doc(`${blogsPath}/${id}`).get()
      if (!docSnap.exists) {
        return NextResponse.json({ error: 'Blog not found' }, { status: 404 })
      }
      const data = docSnap.data()
      // Convert Timestamps
      if (data) {
        for (const key of Object.keys(data)) {
          if (data[key]?.toDate) data[key] = data[key].toDate()
        }
      }
      return NextResponse.json({ id: docSnap.id, ...data })
    }

    // Fallback: client SDK
    const db = getServerDb()
    if (!db) {
      return NextResponse.json({ error: 'Firebase not configured' }, { status: 503 })
    }

    const blogsPath = getCollectionPath('blogs')
    const docRef = doc(db, blogsPath, id)
    const docSnap = await getDoc(docRef)

    if (!docSnap.exists()) {
      return NextResponse.json({ error: 'Blog not found' }, { status: 404 })
    }

    return NextResponse.json({ id: docSnap.id, ...docSnap.data() })
  } catch (error) {
    console.error('Error fetching blog:', error)
    return NextResponse.json({ error: 'Failed to fetch blog' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  const authError = await requireAuth()
  if (authError) return authError

  try {
    const { id } = await params
    const body = await request.json()
    const validation = validateBody(updateBlogSchema, body)
    if (!validation.success) {
      return NextResponse.json({ error: validation.error }, { status: 400 })
    }
    const validated = validation.data

    // Try Admin SDK first, fall back to authenticated client SDK
    const adminDb = getAdminDb()
    if (adminDb) {
      return await updateBlogWithAdminSDK(adminDb, id, validated)
    }
    return await updateBlogWithClientSDK(id, validated)
  } catch (error) {
    console.error('Error updating blog:', error)
    return NextResponse.json(
      { error: 'Failed to update blog' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  const authError = await requireAuth()
  if (authError) return authError

  try {
    const { id } = await params

    // Try Admin SDK first, fall back to authenticated client SDK
    const adminDb = getAdminDb()
    if (adminDb) {
      return await deleteBlogWithAdminSDK(adminDb, id)
    }
    return await deleteBlogWithClientSDK(id)
  } catch (error) {
    console.error('Error deleting blog:', error)
    return NextResponse.json(
      { error: 'Failed to delete blog' },
      { status: 500 }
    )
  }
}

// --- Admin SDK implementations ---

async function updateBlogWithAdminSDK(adminDb: FirebaseFirestore.Firestore, id: string, validated: Record<string, any>) {
  const admin = await import('firebase-admin')
  const adminModule = (admin as any).default || admin
  const blogsPath = getAdminCollectionPath('blogs')
  const docRef = adminDb.doc(`${blogsPath}/${id}`)

  const updateData: Record<string, unknown> = {
    title: validated.title,
    slug: sanitizeSlug(validated.slug),
    content: validated.content || '',
    metaDesc: validated.metaDesc || '',
    excerpt: validated.excerpt || '',
    keywords: validated.keywords || '',
    imageUrl: validated.imageUrl || '',
    published: validated.published,
    status: validated.status || (validated.published ? 'published' : 'draft'),
    category: validated.category || '',
    updatedAt: adminModule.firestore.FieldValue.serverTimestamp(),
  }

  if (validated.wordCount) updateData.wordCount = validated.wordCount
  if (validated.readingTime) updateData.readingTime = validated.readingTime
  if (validated.contentBlocks) updateData.contentBlocks = validated.contentBlocks
  if (validated.contentVersion) updateData.contentVersion = validated.contentVersion
  if (validated.author?.name) updateData.author = validated.author

  await docRef.set(updateData, { merge: true })
  revalidatePath('/blog')
  revalidatePath(`/blog/${updateData.slug}`)
  return NextResponse.json({ id, ...updateData })
}

async function deleteBlogWithAdminSDK(adminDb: FirebaseFirestore.Firestore, id: string) {
  const blogsPath = getAdminCollectionPath('blogs')
  const docRef = adminDb.doc(`${blogsPath}/${id}`)
  await docRef.delete()
  revalidatePath('/blog')
  revalidatePath('/blog/[slug]', 'page')
  return NextResponse.json({ success: true })
}

// --- Client SDK implementations (anonymous auth fallback) ---

async function updateBlogWithClientSDK(id: string, validated: Record<string, any>) {
  const db = await getAuthenticatedServerDb()
  if (!db) {
    return NextResponse.json(
      { error: 'Firebase not configured. Check your Firebase environment variables.' },
      { status: 503 }
    )
  }

  const { setDoc, doc: firestoreDoc, serverTimestamp } = await import('firebase/firestore')
  const blogsPath = getCollectionPath('blogs')
  const docRef = firestoreDoc(db, blogsPath, id)

  const updateData: Record<string, unknown> = {
    title: validated.title,
    slug: sanitizeSlug(validated.slug),
    content: validated.content || '',
    metaDesc: validated.metaDesc || '',
    excerpt: validated.excerpt || '',
    keywords: validated.keywords || '',
    imageUrl: validated.imageUrl || '',
    published: validated.published,
    status: validated.status || (validated.published ? 'published' : 'draft'),
    category: validated.category || '',
    updatedAt: serverTimestamp(),
  }

  if (validated.wordCount) updateData.wordCount = validated.wordCount
  if (validated.readingTime) updateData.readingTime = validated.readingTime
  if (validated.contentBlocks) updateData.contentBlocks = validated.contentBlocks
  if (validated.contentVersion) updateData.contentVersion = validated.contentVersion
  if (validated.author?.name) updateData.author = validated.author

  await setDoc(docRef, updateData, { merge: true })
  revalidatePath('/blog')
  revalidatePath(`/blog/${updateData.slug}`)
  return NextResponse.json({ id, ...updateData })
}

async function deleteBlogWithClientSDK(id: string) {
  const db = await getAuthenticatedServerDb()
  if (!db) {
    return NextResponse.json(
      { error: 'Firebase not configured. Check your Firebase environment variables.' },
      { status: 503 }
    )
  }

  const { deleteDoc, doc: firestoreDoc } = await import('firebase/firestore')
  const blogsPath = getCollectionPath('blogs')
  const docRef = firestoreDoc(db, blogsPath, id)

  await deleteDoc(docRef)
  revalidatePath('/blog')
  revalidatePath('/blog/[slug]', 'page')
  return NextResponse.json({ success: true })
}
