/** @type {import('next').NextConfig} */
const nextConfig = {
	redirects: async () => {
		return [
			{
				source: '/',
				destination: '/app',
				permanent: true
			}
		]
	}
}

module.exports = nextConfig
