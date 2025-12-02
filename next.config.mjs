/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable React strict mode for better development experience
  reactStrictMode: true,

  // Configure image optimization
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "img.clerk.com",
      },
      {
        protocol: "https",
        hostname: "images.clerk.dev",
      },
    ],
  },

  // Experimental features
  experimental: {
    // Enable server actions
    serverActions: {
      allowedOrigins: ["localhost:3000"],
    },
  },

  // TypeScript and ESLint configuration
  typescript: {
    // Don't fail build on TS errors in development
    // Remove this in production
    ignoreBuildErrors: false,
  },

  eslint: {
    // Run ESLint during builds
    ignoreDuringBuilds: false,
  },
};

export default nextConfig;
