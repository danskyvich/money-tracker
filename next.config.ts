import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  reactStrictMode: true,
  experimental: {},
  allowedDevOrigins: ['192.168.8.171'],
}

export default nextConfig;