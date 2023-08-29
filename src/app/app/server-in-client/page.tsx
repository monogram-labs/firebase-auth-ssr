import { ClientComponent } from '@/components/ClientComponent'
import { ServerComponent } from '@/components/ServerComponent'

export const revalidate = 0

export default async function Page() {
	return (
		<ClientComponent>
			<ServerComponent />
		</ClientComponent>
	)
}
