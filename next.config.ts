import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone", // Optimizes for Docker deployments
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: [
      // Add domains for remote images here
      "localhost",
      process.env.DOMAIN || "localhost",
      `www.${process.env.DOMAIN || "localhost"}`,
    ],
  },
  // Important: For production with Traefik
  basePath: "",
  assetPrefix:
    process.env.NODE_ENV === "production"
      ? `https://${process.env.DOMAIN || "localhost"}`
      : "",
};

export default nextConfig;
