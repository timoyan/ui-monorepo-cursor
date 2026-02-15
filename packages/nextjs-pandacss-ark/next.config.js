/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	async headers() {
		return [
			{
				source: "/api/msw/worker",
				headers: [{ key: "Service-Worker-Allowed", value: "/" }],
			},
		];
	},
};

module.exports = nextConfig;
