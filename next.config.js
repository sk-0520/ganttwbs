/* eslint-disable import/order */
/* eslint-disable @typescript-eslint/no-var-requires */
const path = require("node:path");

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
	eslint: {
		ignoreDuringBuilds: true,
	},
	compiler: {
		removeConsole:
			process.env.NODE_ENV === "production"
				? { exclude: ["info", "warn", "error"] }
				: false,
	},
};

module.exports = withBundleAnalyzer(nextConfig);
