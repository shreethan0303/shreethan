import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/projects/robotics",
        destination: "/projects/frc-robot",
        permanent: true,
      },
      ...["mechanisms", "research", "tennis-software"].map((slug) => ({
        source: `/projects/${slug}`,
        destination: "/projects",
        permanent: true,
      })),
    ];
  },
};

export default nextConfig;
