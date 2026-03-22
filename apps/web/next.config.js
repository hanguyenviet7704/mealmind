/** @type {import('next').NextConfig} */

const apiInternalUrl =
  process.env.API_INTERNAL_URL && !process.env.API_INTERNAL_URL.includes('<')
    ? process.env.API_INTERNAL_URL
    : process.env.NODE_ENV === 'production'
      ? 'https://mealmindservice-api-production.up.railway.app'
      : 'http://localhost:4000';

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

