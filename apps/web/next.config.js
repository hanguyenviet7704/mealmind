/** @type {import('next').NextConfig} */

const apiInternalUrl = process.env.API_INTERNAL_URL || 'http://localhost:4000';

const nextConfig = {
  reactStrictMode: true,
  transpilePackages: [
    '@mealmind/types',
    '@mealmind/ui',
    '@mealmind/utils',
    '@mealmind/validation',
  ],
  async rewrites() {
    return [
      {
        source: '/api/v1/:path*',
        destination: `${apiInternalUrl}/api/v1/:path*`,
      },
    ];
  },
};

module.exports = nextConfig;

