'use client'

import { useReducer } from 'react'

export function ClientComponent({ children }: { children: React.ReactNode }) {
	const [count, increment] = useReducer((count) => count + 1, 0)

	return (
		<section>
			<button onClick={increment}>another client component, count is {count}</button>
			{children}
		</section>
	)
}
