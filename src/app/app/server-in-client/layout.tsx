'use client'

import { useReducer } from 'react'

export default function Layout({ children }: { children: React.ReactNode }) {
	const [count, increment] = useReducer((count) => count + 1, 0)

	return (
		<main>
			<button onClick={increment}>client layout wrapper, count is {count}</button>
			{children}
		</main>
	)
}
