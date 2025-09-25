import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */

  images: {
    domains: [
      "lh3.googleusercontent.com",
      "i.ytimg.com",
      "example.com",
      "msn.com",
      "www.pinterest.com",
    ],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "i.pinimg.com", // domain utama gambar Pinterest
      },
      {
        protocol: "https",
        hostname: "pin.it", // kalau ada redirect pendek
      },
    ],
  },
};

export default nextConfig;
