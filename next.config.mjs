/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,

  images: {
    remotePatterns: [],
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 31536000,
  },

  experimental: {
    serverActions: { bodySizeLimit: '50mb' },
    optimizePackageImports: ['react-markdown', 'remark-gfm'],
  },

  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? { exclude: ['error', 'warn'] } : false,
  },

  headers: async () => [
    {
      source: '/:path*',
      headers: [{ key: 'X-DNS-Prefetch-Control', value: 'on' }],
    },
    {
      source: '/api/:path*',
      headers: [{ key: 'Cache-Control', value: 'no-store, must-revalidate' }],
    },
  ],
};

export default nextConfig;
