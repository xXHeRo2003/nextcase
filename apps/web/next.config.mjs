/** @type {import('next').NextConfig} */
const nextConfig = {
  allowedDevOrigins: ["192.168.0.237"],
  turbopack: {
    root: "../../",
  },
};

export default nextConfig;
