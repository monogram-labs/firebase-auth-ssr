'use client'

import { useEffect, useState } from 'react'

export default function EnvVariables() {
	const [envVariables, setEnvVariables] = useState<any>()

	useEffect(() => {
		setEnvVariables({
			NEXT_PUBLIC_FIREBASE_API_KEY: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || null,
			NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || null,
			NEXT_PUBLIC_FIREBASE_PROJECT_ID: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || null,
			NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || null,
			NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID:
				process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || null,
			NEXT_PUBLIC_FIREBASE_APP_ID: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || null,
			_FIREBASE_ADMIN_CLIENT_EMAIL: process.env._FIREBASE_ADMIN_CLIENT_EMAIL || null,
			_FIREBASE_ADMIN_PRIVATE_KEY: process.env._FIREBASE_ADMIN_PRIVATE_KE || null
		})
	}, [])

	return (
		<div>
			<b>.env variables:</b>

			{envVariables ? <pre>{JSON.stringify(envVariables, null, 2)}</pre> : <span> Loading...</span>}
		</div>
	)
}
