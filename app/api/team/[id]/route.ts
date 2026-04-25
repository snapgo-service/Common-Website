import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/api-auth'
import {
  isFirebaseConfigured,
  getAdminFirestore,
  getCollectionPath,
} from '@/lib/firebase-server'
import { DEFAULT_TEAM, TeamMemberData } from '@/lib/content'
import { createTeamMemberSchema, validateBody } from '@/lib/validations'

// GET - Fetch a single team member from Firestore
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    if (!isFirebaseConfigured()) {
      // Check defaults
      const member = DEFAULT_TEAM.find(m => m.id === id)
      if (!member) {
        return NextResponse.json(
          { error: 'Team member not found' },
          { status: 404 }
        )
      }
      return NextResponse.json(member)
    }

    const db = getAdminFirestore()
    const collectionPath = getCollectionPath('team')
    const docRef = db.collection(collectionPath).doc(id)
    const docSnap = await docRef.get()

    if (!docSnap.exists) {
      return NextResponse.json(
        { error: 'Team member not found' },
        { status: 404 }
      )
    }

    const teamMember: TeamMemberData = {
      id: docSnap.id,
      ...docSnap.data() as Omit<TeamMemberData, 'id'>,
    }

    return NextResponse.json(teamMember)
  } catch (error) {
    console.error('Error fetching team member:', error)
    return NextResponse.json(
      { error: 'Failed to fetch team member' },
      { status: 500 }
    )
  }
}

// PUT - Update a team member in Firestore
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // Require admin authentication
  const authError = await requireAuth()
  if (authError) return authError

  try {
    const { id } = await params

    if (!isFirebaseConfigured()) {
      return NextResponse.json(
        { error: 'Firebase not configured' },
        { status: 503 }
      )
    }

    const body = await req.json()
    const validation = validateBody(createTeamMemberSchema.partial(), body)
    if (!validation.success) {
      return NextResponse.json({ error: validation.error }, { status: 400 })
    }
    const { name, bio, details, imageUrl, portraitUrl, email, linkedin, twitter, order, role, category } = validation.data
    const isActive = body.isActive

    const db = getAdminFirestore()
    const collectionPath = getCollectionPath('team')
    const docRef = db.collection(collectionPath).doc(id)
    const docSnap = await docRef.get()

    if (!docSnap.exists) {
      return NextResponse.json(
        { error: 'Team member not found' },
        { status: 404 }
      )
    }

    const existingMember = docSnap.data() as Omit<TeamMemberData, 'id'>

    const updatedData: Partial<Omit<TeamMemberData, 'id'>> = {
      name: name ?? existingMember.name,
      role: role ?? existingMember.role,
      category: category ?? existingMember.category,
      bio: bio !== undefined ? bio : existingMember.bio,
      details: details !== undefined ? details : existingMember.details,
      imageUrl: imageUrl !== undefined ? imageUrl : existingMember.imageUrl,
      portraitUrl: portraitUrl !== undefined ? portraitUrl : existingMember.portraitUrl,
      email: email !== undefined ? email : existingMember.email,
      linkedin: linkedin !== undefined ? linkedin : existingMember.linkedin,
      twitter: twitter !== undefined ? twitter : existingMember.twitter,
      order: order ?? existingMember.order,
      isActive: isActive ?? existingMember.isActive,
    }

    await docRef.set(updatedData, { merge: true })

    const teamMember: TeamMemberData = {
      id,
      ...existingMember,
      ...updatedData,
    }

    return NextResponse.json(teamMember)
  } catch (error) {
    console.error('Error updating team member:', error)
    return NextResponse.json(
      { error: 'Failed to update team member' },
      { status: 500 }
    )
  }
}

// DELETE - Delete a team member from Firestore
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // Require admin authentication
  const authError = await requireAuth()
  if (authError) return authError

  try {
    const { id } = await params

    if (!isFirebaseConfigured()) {
      return NextResponse.json(
        { error: 'Firebase not configured' },
        { status: 503 }
      )
    }

    const db = getAdminFirestore()
    const collectionPath = getCollectionPath('team')
    const docRef = db.collection(collectionPath).doc(id)
    const docSnap = await docRef.get()

    if (!docSnap.exists) {
      return NextResponse.json(
        { error: 'Team member not found' },
        { status: 404 }
      )
    }

    await docRef.delete()

    return NextResponse.json({ message: 'Team member deleted successfully' })
  } catch (error) {
    console.error('Error deleting team member:', error)
    return NextResponse.json(
      { error: 'Failed to delete team member' },
      { status: 500 }
    )
  }
}
