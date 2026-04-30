/** @type {import('next').NextConfig} */
const nextConfig = {
  allowedDevOrigins: ["192.168.0.237"],
  turbopack: {
    root: process.cwd(),
  },
};

export default nextConfig;
