import type { NextConfig } from 'next';

const createNextIntlPlugin = require('next-intl/plugin');
const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      // Proxy video requests in development to bypass CORS
      {
        source: '/api/video-proxy/:path*',
        destination: 'https://tiktak.s3.tebi.io/:path*',
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'tiktak.s3.tebi.io',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 's3.tebi.io',
        port: '',
        pathname: '/**',
      },
    ],
    ...(process.env.BUILD_MOBILE === 'true' && {
      unoptimized: true,
    }),
  },
  ...(process.env.BUILD_MOBILE === 'true' && {
    output: 'export',
    distDir: 'out',
    // Remove API routes from build
    pageExtensions: ['tsx', 'ts', 'jsx', 'js'].filter(ext =>
      !ext.includes('api')
    ),
  }),
  experimental: {
    authInterrupts: true,
  },
};

export default withNextIntl(nextConfig);
