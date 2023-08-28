import { cookies } from 'next/headers'

import { ClientComponent } from '@/components/ClientComponent'
import { ServerComponent } from '@/components/ServerComponent'

export const revalidate = 0

export default async function Home() {
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
		</>
	)
}
