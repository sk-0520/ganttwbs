/* eslint-disable import/order */
/* eslint-disable @typescript-eslint/no-var-requires */
const path = require("path");

const { i18n } = require("./next-i18next.config");

const withBundleAnalyzer = require("@next/bundle-analyzer")({
	enabled: process.env.ANALYZE === "true",
});

/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	i18n: i18n,
	sassOptions: {
		includePaths: [path.join(__dirname, "styles")],
	},
	async headers() {
		return [
			{
				source: "/*",
				headers: [
					{
						key: "APP-VERSION",
						value: process.env.VERCEL_GIT_COMMIT_SHA
					}
				]
			}
		];
	},
};

module.exports = withBundleAnalyzer(nextConfig);
