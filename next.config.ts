import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  eslint: {
    ignoreDuringBuilds: true,
  },
  outputFileTracingIncludes: {
    "/api/**/*": ["./src/generated/prisma/**/*"],
    "/**/*": ["./src/generated/prisma/**/*"],
  },
};

export default nextConfig;
