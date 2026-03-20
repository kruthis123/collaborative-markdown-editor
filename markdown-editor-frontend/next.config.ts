import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack: (config) => {
    // Ignore Monaco's dynamic imports to prevent build errors
    config.module.rules.push({
      test: /\.m?js$/,
      type: "javascript/auto",
      resolve: {
        fullySpecified: false,
      },
    });

    // Ignore dynamic import errors from Monaco
    config.ignoreWarnings = [
      { module: /node_modules\/monaco-editor/ },
    ];

    return config;
  },
};

export default nextConfig;
