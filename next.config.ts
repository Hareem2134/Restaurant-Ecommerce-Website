import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['cdn.sanity.io'],
    remotePatterns: [
      { protocol: "https", hostname: "cdn.sanity.io" },
      { protocol: "https", hostname: "placehold.co" },
    ],
  },

  // Add i18n configuration for multiple languages
  i18n: {
    locales: ['en', 'ur', 'ar', 'fr', 'de'], // List of supported languages
    defaultLocale: 'en', // Default language
  },

  eslint: {
    ignoreDuringBuilds: true,
  },

  
};

export default nextConfig;
