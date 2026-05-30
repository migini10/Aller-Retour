/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@aller-retour/database', '@aller-retour/types'],
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
