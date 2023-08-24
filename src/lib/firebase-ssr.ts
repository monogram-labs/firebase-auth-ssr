/**
 * The code below is based on firebase-frameworks.
 *
 * See: https://github.com/FirebaseExtended/firebase-framework-tools/blob/main/src/firebase-aware.ts
 */

import { credential } from 'firebase-admin'
import { initializeApp as initializeAdminApp, getApps } from 'firebase-admin/app'
import { getAuth as getAdminAuth } from 'firebase-admin/auth'
import { initializeApp, deleteApp, FirebaseApp } from 'firebase/app'
import { User, getAuth, signInWithCustomToken } from 'firebase/auth'

import { LRUCache } from 'lru-cache'
import { cookies } from 'next/headers'

const ADMIN_APP_NAME = 'firebase-frameworks'
const adminApp =
	getApps().find((it) => it.name === ADMIN_APP_NAME) ||
	initializeAdminApp(
		{
			credential: credential.cert({
				clientEmail: process.env._FIREBASE_ADMIN_CLIENT_EMAIL,
				privateKey: process.env._FIREBASE_ADMIN_PRIVATE_KEY,
				projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID
			})
		},
		ADMIN_APP_NAME
	)
const adminAuth = getAdminAuth(adminApp)

const firebaseAppsLRU = new LRUCache<string, FirebaseApp>({
	max: 100,
	ttl: 1000 * 60 * 5,
	allowStale: true,
	updateAgeOnGet: true,
	dispose: (value) => {
		deleteApp(value)
	}
})

export async function getAuthenticatedAppForUser(
	session?: string
): Promise<{ app: FirebaseApp | null; currentUser: User | null }> {
	const noSessionReturn = { app: null, currentUser: null }

	if (!session) session = cookies().get('__session')?.value || ''

	if (!session) return noSessionReturn

	const decodedIdToken = await adminAuth
		.verifySessionCookie(session)
		.catch((e: any) => console.error(e.message))
	if (!decodedIdToken) return noSessionReturn
	const { uid } = decodedIdToken
	let app = firebaseAppsLRU.get(uid)
	if (!app) {
		const isRevoked = !(await adminAuth
			.verifySessionCookie(session, true)
			.catch((e: any) => console.error(e.message)))
		if (isRevoked) return noSessionReturn
		const random = Math.random().toString(36).split('.')[1]
		const appName = `authenticated-context:${uid}:${random}`
		// Force JS SDK autoinit with the undefined
		app = initializeApp(undefined as any, appName)
		firebaseAppsLRU.set(uid, app)
	}
	const auth = getAuth(app)
	if (auth.currentUser?.uid !== uid) {
		// TODO(jamesdaniels) get custom claims
		const customToken = await adminAuth
			.createCustomToken(uid)
			.catch((e: any) => console.error(e.message))

		if (!customToken) return noSessionReturn
		await signInWithCustomToken(auth, customToken)
	}

	return { app, currentUser: auth.currentUser }
}
