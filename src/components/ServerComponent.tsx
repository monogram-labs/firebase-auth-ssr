import EnvVariables from './EnvVariables'

export async function ServerComponent() {
	const text = await getText()
	return (
		<aside>
			<h2>{text}</h2>
			<EnvVariables />
		</aside>
	)
}

function getText() {
	return new Promise<string>((resolve) => {
		setTimeout(() => {
			resolve('Server component in client component')
		}, 100)
	})
}
