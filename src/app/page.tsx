import { cookies } from 'next/headers'
import { getFirestore, collection, getDocs } from 'firebase/firestore'

import { getAuthenticatedAppForUser } from '@/lib/firebase-ssr'

export const revalidate = 0

export default async function Home() {
	const { app, currentUser } = await getAuthenticatedAppForUser()

	if (!currentUser || !app) return <>Could not find __session cookie</>

	let docs: any

	try {
		const db = getFirestore(app)
		const querySnapshot = await getDocs(collection(db, 'test-collection'))

		querySnapshot.forEach((doc) => {
			docs = doc.data()
		})

		if (!docs) {
			docs = 'Request authorized, no existing docs'
		}
	} catch (e: any) {
		docs = e.toString()
	}

	const session = cookies().get('__session')?.value || ''

	return (
		<main className="h-screen container m-auto flex gap-8 flex-col">
			<h1>From server:</h1>

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
		</main>
	)
}
