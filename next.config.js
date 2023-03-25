/* eslint-disable @typescript-eslint/no-var-requires */
const path = require("path");

const { i18n } = require("./next-i18next.config");

/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	sassOptions: {
		includePaths: [path.join(__dirname, "styles")],
	},
	i18n: i18n
};

module.exports = nextConfig;
