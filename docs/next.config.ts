import path from 'node:path';
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  basePath: '/virginmediao2-storyblok-sdk',
  experimental: {
    staticGenerationRetryCount: 3,
  },
  turbopack: {
    root: path.resolve(__dirname, '../../'),
  },
};

export default nextConfig;
