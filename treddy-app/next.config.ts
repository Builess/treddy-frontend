// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  allowedDevOrigins: [
    '10.1.104.201'
  ],
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '4000', 
        pathname: '/images/**',
      },
    ],
  },
};

module.exports = nextConfig;
