import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  serverActions: true,
  typescript: {
    ignoreBuildErrors: true,
  },
  // 禁用 Next.js 热重载，由 nodemon 处理重编译
  reactStrictMode: false,
  eslint: {
    // 构建时忽略ESLint错误
    ignoreDuringBuilds: true,
  },
  // Cloudflare Workers specific configuration
  serverExternalPackages: []
};

export default nextConfig;
