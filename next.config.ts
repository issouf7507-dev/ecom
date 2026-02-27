import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  async redirects() {
    return [
      { source: "/amennagement", destination: "/salon-de-beaute", permanent: true },
    ];
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "placehold.co", pathname: "/**" },
      { protocol: "https", hostname: "dummyjson.com", pathname: "/**" },
      { protocol: "https", hostname: "cdn.dummyjson.com", pathname: "/**" },
      { protocol: "https", hostname: "image01.realme.net", pathname: "/**" },
      { protocol: "https", hostname: "files.edgestore.dev", pathname: "/**" },
    ],
  },
};

export default nextConfig;
