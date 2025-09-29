import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  basePath: '/virginmediao2-storyblok-sdk',
  experimental: {
    staticGenerationRetryCount: 3,
    useCache: true,
    cacheComponents: true,
  },
};

export default nextConfig;
