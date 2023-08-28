import { cookies } from 'next/headers'
import { getFirestore, collection, getDocs } from 'firebase/firestore'

import { getAuthenticatedAppForUser } from '@/lib/firebase-ssr'
import dynamic from 'next/dynamic'
import { ClientComponent } from '@/components/ClientComponent'
import { ServerComponent } from '@/components/ServerComponent'

export const revalidate = 0

const EnvVariablesComponent = dynamic(() => import('../../../components/EnvVariables'), {
	ssr: false
})

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
			<ClientComponent>
				<ServerComponent />
			</ClientComponent>

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
