'use client'

import { useReducer } from 'react'

export function ClientComponent({ children }: { children: JSX.Element }) {
	const [count, increment] = useReducer((count) => count + 1, 0)

	return (
		<>
			<section>
				<button onClick={increment}>a client component, count is {count}</button>
			</section>

			{children}
		</>
	)
}
