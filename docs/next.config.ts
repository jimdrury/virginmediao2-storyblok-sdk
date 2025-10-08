import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  basePath: '/virginmediao2-storyblok-sdk',
  experimental: {
    useCache: true,
    cacheComponents: true,
    serverComponentsHmrCache: true,
  },
};

export default nextConfig;
