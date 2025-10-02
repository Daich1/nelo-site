/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "*.githubusercontent.com" }
    ]
  },
  experimental: { serverActions: { allowedOrigins: ["*"] } }
};

module.exports = nextConfig;
