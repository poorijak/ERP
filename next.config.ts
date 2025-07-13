import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    useCache: true,
    serverActions: {
      bodySizeLimit: "5mb",
      allowedOrigins: ["http://localhost:3000"],
    },
  },
  reactStrictMode: false,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "ik.imagekit.io",
      },
      {
        protocol: "https",
        hostname: "promptpay.io",
      },
    ],
  },
};

export default nextConfig;
