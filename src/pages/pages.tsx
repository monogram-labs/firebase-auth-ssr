import { getAuthenticatedAppForUser } from '@/lib/firebase-ssr'
import { collection, getDocs, getFirestore } from 'firebase/firestore'
import { GetServerSidePropsContext } from 'next'
import dynamic from 'next/dynamic'

const EnvVariablesComponent = dynamic(() => import('../components/EnvVariables'), { ssr: false })

export async function getServerSideProps({ req }: GetServerSidePropsContext) {
	// passing the cookie from the request is required in the pages router
	const { app, currentUser } = await getAuthenticatedAppForUser(req.cookies.__session)

	if (!app || !currentUser) {
		return {
			props: {
				session: null
			}
		}
	}

	let docs: any

	try {
		const db = getFirestore(app)
		const querySnapshot = await getDocs(collection(db, 'test-collection'))

		if (querySnapshot.empty) docs = 'Request authorized, no existing docs'
		else docs = querySnapshot.docs.map((doc) => doc.data())
	} catch (e: any) {
		docs = e.toString()
	}

	return {
		props: {
			docs,
			session: req.cookies.__session,

			currentUser:
				// workaround for undefined values from toJSON()
				JSON.parse(JSON.stringify(currentUser?.toJSON())),

			app:
				// workaround for undefined values from toJSON()
				JSON.parse(JSON.stringify(app))
		}
	}
}

export default function PagesTest({ session, app, currentUser, docs }: any) {
	if (!session) {
		return <>Could not find __session cookie or session is revoked</>
	}

	return (
		<main className="h-screen container m-auto flex gap-8 flex-col">
			<h1>In pages router, from server:</h1>

			<p>
				<b>session:</b> <br />
				{session}
			</p>

			<p>
				<b>app.name:</b> <br />
				{app._name}
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
		</main>
	)
}
