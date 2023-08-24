import { User, onAuthStateChanged } from 'firebase/auth'
import { useEffect, useState } from 'react'

import { auth } from './firebase'
import { useRouter } from 'next/navigation'

export function useUser() {
	const [user, setUser] = useState<User | null | undefined>()
	const router = useRouter()

	useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, (authUser) => {
			setUser(authUser)
			router.refresh()
		})

		return () => unsubscribe()
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	return user
}
