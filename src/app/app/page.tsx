import { cookies } from 'next/headers'
import { getFirestore, collection, getDocs } from 'firebase/firestore'

import { getAuthenticatedAppForUser } from '@/lib/firebase-ssr'
import dynamic from 'next/dynamic'
import Link from 'next/link'

export const revalidate = 0

const EnvVariablesComponent = dynamic(() => import('../../components/EnvVariables'), { ssr: false })

export default async function Home() {
	const { app, currentUser } = await getAuthenticatedAppForUser()

	if (!currentUser || !app) return <>Could not find __session cookie or session is revoked</>

	let docs: any

	try {
		const db = getFirestore(app)
		const querySnapshot = await getDocs(collection(db, 'test-collection'))

		if (querySnapshot.empty) docs = 'Request authorized, no existing docs'
		else docs = querySnapshot.docs.map((doc) => doc.data())
	} catch (e: any) {
		docs = e.toString()
	}

	const session = cookies().get('__session')?.value || ''

	return (
		<>
			<h1>In app router, from server:</h1>

			<Link href="/app/server-in-client" className="underline">
				Go to server components in client components demo
			</Link>

			<p>
				<b>session:</b> <br />
				{session}
			</p>
			<p>
				<b>app.name:</b> <br />
				{app.name}
			</p>
			<p>
				<b>current user:</b> <br />
				{currentUser?.email}
			</p>
			<p>
				<b>docs:</b> <br />
				{JSON.stringify(docs)}
			</p>

			<EnvVariablesComponent />
		</>
	)
}
