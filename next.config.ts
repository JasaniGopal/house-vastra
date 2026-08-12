import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  sassOptions: {
    silenceDeprecations: ["import"],
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "look-on-rent-images-934646501835.s3.ap-south-1.amazonaws.com",
      }
    ],
  },
};

export default nextConfig;
