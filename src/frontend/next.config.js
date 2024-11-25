const path = require("path");

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  images: {
    domains: [process.env.NEXT_IMAGE_DOMAIN],
    unoptimized: true,
  },
  sassOptions: {
    includePaths: [
      path.join(__dirname, "node_modules", "@uswds", "uswds", "packages"),
    ],
  },
};

module.exports = nextConfig;
