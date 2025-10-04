/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone", // ✅ SSGではなくSSRを使う
  experimental: {
    serverActions: undefined, // ⚠ booleanではなく削除またはundefined
  },
  images: {
    domains: [
      "lh3.googleusercontent.com",
      "drive.google.com",
      "images.unsplash.com",
      "cdn.discordapp.com",
    ],
  },
  // ✅ デフォルトで静的生成を無効にする
  generateStaticParams: false,
};

export default nextConfig;
