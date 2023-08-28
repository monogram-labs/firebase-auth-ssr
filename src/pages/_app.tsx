import { AppProps } from 'next/app'
import Header from '../components/Header'

import '../app/globals.css'

export default function App({ Component, pageProps }: AppProps) {
	return (
		<>
			<Header />
			<main>
				<Component {...pageProps} />
			</main>
		</>
	)
}
