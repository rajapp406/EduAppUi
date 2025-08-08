/** @type {import('next').NextConfig} */
const path = require('path');

const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  // Enable TypeScript type checking during build
  typescript: {
    ignoreBuildErrors: false,
  },
  // Configure webpack to handle absolute imports
  webpack: (config) => {
    // Add path aliases
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.resolve(__dirname, 'src'),
    };
    return config;
  },
  // Environment variables
  env: {
    // Add any environment variables needed on the client side
  },
  // Enable static exports if needed
  output: 'standalone',
  // Configure module path aliases
  sassOptions: {
    includePaths: [path.join(__dirname, 'styles')],
  },
};

module.exports = nextConfig;
