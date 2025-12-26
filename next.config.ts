import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["puppeteer", "crawlee", "playwright", "cheerio"],
};

export default nextConfig;
