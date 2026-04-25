import * as admin from 'firebase-admin'

let initFailed = false

function parseServiceAccount(raw: string): Record<string, unknown> {
  const parsed = JSON.parse(raw)
  // Common pitfall when pasting into env-var UIs (Vercel, Docker, etc.):
  // private_key gets double-escaped — literal "\\n" instead of "\n".
  // Auto-correct so PEM parsing doesn't reject an otherwise valid key.
  if (typeof parsed.private_key === 'string' && parsed.private_key.includes('\\n')) {
    parsed.private_key = parsed.private_key.replace(/\\n/g, '\n')
  }
  return parsed
}

function getApp(): admin.app.App | null {
  // Reuse existing app if already initialized (survives Next.js hot-reload)
  if (admin.apps.length > 0) {
    return admin.app()
  }

  // Don't keep retrying after a failed init — first call already logged the cause.
  if (initFailed) {
    return null
  }

  const serviceAccountKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY
  if (!serviceAccountKey) {
    console.warn(
      '[firebase-admin] FIREBASE_SERVICE_ACCOUNT_KEY not configured. ' +
      'Server-side operations (uploads, token verification) are disabled.'
    )
    initFailed = true
    return null
  }

  try {
    const serviceAccount = parseServiceAccount(serviceAccountKey)
    const storageBucket = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET

    try {
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
        storageBucket: storageBucket,
      })
      console.log('[firebase-admin] ✅ Initialized successfully with storage bucket:', storageBucket)
    } catch (initError: any) {
      // Handle race condition during hot-reload where app is already initialized
      if (initError?.code === 'app/duplicate-app') {
        return admin.app()
      }
      throw initError
    }
    return admin.app()
  } catch (error) {
    console.error(
      '[firebase-admin] ❌ Failed to initialize. Server-side ops disabled until fixed.\n' +
      '  Check FIREBASE_SERVICE_ACCOUNT_KEY env var:\n' +
      '  - Must be valid JSON (try: echo "$FIREBASE_SERVICE_ACCOUNT_KEY" | jq .)\n' +
      '  - private_key needs \\n escapes, not raw newlines (or escape them yourself)\n' +
      '  Original error:',
      error
    )
    initFailed = true
    return null
  }
}

export function getAdminAuth(): admin.auth.Auth | null {
  const app = getApp()
  return app ? app.auth() : null
}

/**
 * Returns true if the Firebase Admin SDK has the required env var configured.
 * Use this to distinguish "not configured" from "verification failed".
 */
export function isAdminConfigured(): boolean {
  return !!process.env.FIREBASE_SERVICE_ACCOUNT_KEY
}

/**
 * Returns a Firestore instance from the Admin SDK.
 * Bypasses all Firestore security rules - use only in server-side API routes.
 */
export function getAdminDb(): admin.firestore.Firestore | null {
  const app = getApp()
  return app ? app.firestore() : null
}

/**
 * Returns a Storage instance from the Admin SDK.
 * Use for server-side file uploads/deletes - bypasses storage security rules.
 */
export function getAdminStorage(): admin.storage.Storage | null {
  const app = getApp()
  return app ? app.storage() : null
}

/**
 * Get the full Firestore collection path with app ID prefix.
 */
export function getAdminCollectionPath(collectionName: string): string {
  const appId = process.env.NEXT_PUBLIC_APP_ID || 'default'
  return `artifacts/${appId}/public/data/${collectionName}`
}

export async function verifyIdToken(token: string): Promise<admin.auth.DecodedIdToken | null> {
  const auth = getAdminAuth()
  if (!auth) {
    return null
  }

  try {
    return await auth.verifyIdToken(token)
  } catch (error) {
    console.error('[firebase-admin] Token verification failed:', error)
    return null
  }
}
