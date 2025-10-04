/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  images: {
    domains: [
      "lh3.googleusercontent.com",
      "drive.google.com",
      "images.unsplash.com",
      "cdn.discordapp.com"
    ],
  },
  experimental: {
    serverActions: undefined, // ← ⚠ ここはbooleanではなくundefined
  },
  // ✅ 静的エクスポートを完全無効化
  trailingSlash: false,
};

export default nextConfig;
