/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'media.valorant-api.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
