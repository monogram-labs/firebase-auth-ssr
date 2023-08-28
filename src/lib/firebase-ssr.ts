/**
 * The code below is based on firebase-frameworks.
 *
 * See: https://github.com/FirebaseExtended/firebase-framework-tools/blob/main/src/firebase-aware.ts
 */

import { credential } from 'firebase-admin'
import { initializeApp as initializeAdminApp, getApps } from 'firebase-admin/app'
import { getAuth as getAdminAuth } from 'firebase-admin/auth'
import { initializeApp, FirebaseApp } from 'firebase/app'
import { User, getAuth, signInWithCustomToken } from 'firebase/auth'

import { firebaseConfig } from './firebase'

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

export async function getAuthenticatedAppForUser(
	session?: string
): Promise<{ app: FirebaseApp | null; currentUser: User | null }> {
	const noSessionReturn = { app: null, currentUser: null }

	if (!session) {
		// if no session cookie was passed, try to get from next/headers for app router
		session = await getAppRouterSession().catch((e: any) => {
			// not in app router, can't get session cookie
			return undefined
		})

		if (!session) return noSessionReturn
	}

	const decodedIdToken = await adminAuth.verifySessionCookie(session)

	// handle revoked tokens
	const isRevoked = !(await adminAuth
		.verifySessionCookie(session, true)
		.catch((e: any) => console.error(e.message)))
	if (isRevoked) return noSessionReturn

	const app = initializeAuthenticatedApp(decodedIdToken.uid)
	const auth = getAuth(app)

	// authenticate with custom token
	if (auth.currentUser?.uid !== decodedIdToken.uid) {
		// TODO(jamesdaniels) get custom claims
		const customToken = await adminAuth
			.createCustomToken(decodedIdToken.uid)
			.catch((e: any) => console.error(e.message))

		if (!customToken) return noSessionReturn

		await signInWithCustomToken(auth, customToken)
	}

	return { app, currentUser: auth.currentUser }
}

async function getAppRouterSession() {
	// dynamically import to prevent import errors in pages router
	const { cookies } = await import('next/headers')

	const session = cookies().get('__session')?.value

	if (!session) {
		throw new Error('Could not find __session cookie')
	}

	return session
}

function initializeAuthenticatedApp(uid: string) {
	const random = Math.random().toString(36).split('.')[1]
	const appName = `authenticated-context:${uid}:${random}`

	const app = initializeApp(firebaseConfig, appName)

	return app
}
