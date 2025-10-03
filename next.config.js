/** @type {import('next').NextConfig} */
const nextConfig = {
  // ❌ これがあると next-auth が動かないので削除
  // output: "export",
  reactStrictMode: true,
  experimental: {
    serverActions: true,
  },
};

module.exports = nextConfig;
