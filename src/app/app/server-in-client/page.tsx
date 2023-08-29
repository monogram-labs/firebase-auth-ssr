import { ClientComponent } from '@/components/ClientComponent'
import { ServerComponent } from '@/components/ServerComponent'

export const revalidate = 0

export default async function Page() {
	return (
		<>
			<h1>The client component is the parent of the server component</h1>

			<ClientComponent>
				<ServerComponent />
			</ClientComponent>
		</>
	)
}
