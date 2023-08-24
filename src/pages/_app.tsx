import { AppProps } from 'next/app'
import Header from '../app/Header'

import '../app/globals.css'

export default function App({ Component, pageProps }: AppProps) {
	return (
		<>
			<Header />
			<Component {...pageProps} />
		</>
	)
}
