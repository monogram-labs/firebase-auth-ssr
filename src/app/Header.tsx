'use client'

import { signOut } from 'firebase/auth'

import { useUser } from '@/lib/use-user'
import { auth } from '@/lib/firebase'

import { signInAuthorized, signInUnauthorized } from '@/lib/sign-in'

export default function Header({}) {
	const user = useUser()

	return (
		<header className="flex gap-5 justify-center">
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
		</header>
	)
}
