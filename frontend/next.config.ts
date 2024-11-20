import type { NextConfig } from "next";

const path = require("path");

const nextConfig: NextConfig = {
  images: {
    unoptimized: true
  },
  sassOptions: {
    includePaths: [
      path.join(__dirname, "node_modules", "@uswds", "uswds", "packages"),
    ],
  }
};

export default nextConfig;
