import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  async rewrites() {
    const backendUrl =
      process.env.BACKEND_URL ||
      (process.env.NODE_ENV === 'production'
        ? 'http://quiz-server:80'
        : 'http://localhost:8081');

    return [
      {
        source: '/api/:path*',
        destination: `${backendUrl}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
