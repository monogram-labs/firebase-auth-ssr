'use client'

import { signOut } from 'firebase/auth'

import { useUser } from '@/lib/use-user'
import { auth } from '@/lib/firebase'

import { signInAuthorized, signInUnauthorized } from '@/lib/sign-in'
import Link from 'next/link'

export default function Header() {
	const user = useUser()

	return (
		<header className="w-[500px] mx-auto space-y-2">
			<div className="flex gap-2 justify-center">
				{user === undefined ? (
					<>Loading user...</>
				) : user ? (
					<>
						<h3>{user.email}</h3>
						<button onClick={() => signOut(auth)}>sign out</button>
					</>
				) : (
					<>
						<button onClick={signInAuthorized}>sign in with authorized user</button>
						<button onClick={signInUnauthorized}>sign in with unauthorized user</button>
					</>
				)}
			</div>

			<div className="flex gap-2 justify-between">
				<Link href="/app">go to App router</Link>
				<Link href="/pages">go to Pages router</Link>
			</div>
		</header>
	)
}
