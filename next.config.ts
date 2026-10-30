import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  // Prevent Turbopack from trying to bundle server-only deps from @coinbase/cdp-sdk
  // (pulled in transitively via @base-org/account → @wagmi/connectors → @reown/appkit-adapter-wagmi).
  // These packages contain dynamic imports (@x402/core/client, @x402/schemes, etc.)
  // that only resolve in a Node.js environment.
  serverExternalPackages: ["@coinbase/cdp-sdk", "@base-org/account"],
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
