import type { NextConfig } from "next";

/**
 * Next.js configuration
 * - output: "export" for static builds (no Node server required)
 * - trailingSlash: true can sometimes help static hosts serve directories
 *   like /todos/ correctly without redirect support.
 * - distDir: set a custom build output directory (useful in some CI environments)
 */
const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  distDir: ".next",
  // Export map is an optional hint for static export tools
  experimental: {
    // This field is non-breaking; if unsupported, it is ignored.
    // @ts-expect-error - not typed in Next config yet in some versions
    exportMap: "./export-map.json"
  }
};

export default nextConfig;
