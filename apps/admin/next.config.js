/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: [
    '@mealmind/types',
    '@mealmind/ui',
    '@mealmind/utils',
  ],
};

module.exports = nextConfig;
