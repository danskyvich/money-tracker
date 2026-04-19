import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  reactStrictMode: true,
  experimental: {},
};

module.exports = {
  async redirects() {
    return [
      {
        source: "/",
        destination: "/login/",
        permanent: true,
      }
    ]
  }
}

export default nextConfig;
