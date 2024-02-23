/** @type {import('next').NextConfig} */
// https://oldschool.runescape.wiki/
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'oldschool.runescape.wiki',
      },
    ],
  },
};

export default nextConfig;
