import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  reactStrictMode: false,
  experimental: {},
  allowedDevOrigins: ['192.168.8.171'],
}

export default nextConfig;