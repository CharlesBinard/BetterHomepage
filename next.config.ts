import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone", // Optimizes for Docker deployments
  reactStrictMode: true,
  images: {
    domains: [
      "localhost",
      process.env.DOMAIN || "localhost",
      `www.${process.env.DOMAIN || "localhost"}`,
    ],
  },
  // Remove the assetPrefix or set it to empty string
  basePath: "",
  // Only use assetPrefix if you're serving assets from a CDN
  // assetPrefix: "",
};

export default nextConfig;
