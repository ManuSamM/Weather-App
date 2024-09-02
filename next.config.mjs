/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.weatherapi.com",
        port: "",
        pathname: "/weather/**", // The pattern to match image paths
      },
    ],
  },
};

export default nextConfig;
