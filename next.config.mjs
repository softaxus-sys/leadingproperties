/** @type {import('next').NextConfig} */

// When listings come from the Vrodux API, property photos are served by that API,
// so its host has to be allowed for next/image. In JSON mode nothing remote is loaded.
const apiUrl = process.env.VRODUX_API_URL;
const remotePatterns = [];
if (apiUrl) {
  const u = new URL(apiUrl);
  remotePatterns.push({
    protocol: u.protocol.replace(":", ""),
    hostname: u.hostname,
    port: u.port,
    pathname: "/api/real-estate/website/images/**",
  });
}

const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // Serve images as-is: Vercel free tier caps Image Optimization at 5K transformations.
  images: { unoptimized: true, remotePatterns },
};

export default nextConfig;
