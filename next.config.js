/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable static export for Capacitor native builds
  // Run `npm run build:native` to generate static files in /out
  output: process.env.CAPACITOR_BUILD === "true" ? "export" : undefined,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.shopify.com",
      },
    ],
    // Use unoptimized images for static export (Capacitor)
    unoptimized: process.env.CAPACITOR_BUILD === "true",
  },
};

module.exports = nextConfig;
