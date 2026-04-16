import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/",
        destination: "/hyebin-jaehwan",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
