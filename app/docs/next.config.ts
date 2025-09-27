import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
	output: "export",
	trailingSlash: true,
	images: {
		unoptimized: true,
	},
	experimental: {
		staticGenerationRetryCount: 3,
	},
	turbopack: {
		root: path.resolve(__dirname, "../../"),
	},
};

export default nextConfig;
