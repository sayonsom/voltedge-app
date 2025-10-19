// Next.js config to proxy backend requests during development to avoid CORS
/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/backend/:path*',
        destination: 'http://localhost:8001/:path*',
      },
    ];
  },
};

module.exports = nextConfig;
