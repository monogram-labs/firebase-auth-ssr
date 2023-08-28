import { collection, getDocs, getFirestore } from 'firebase/firestore'
import EnvVariables from './EnvVariables'
import { getAuthenticatedAppForUser } from '@/lib/firebase-ssr'

export async function ServerComponent() {
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

	return (
		<>
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

			<EnvVariables />
		</>
	)
}
