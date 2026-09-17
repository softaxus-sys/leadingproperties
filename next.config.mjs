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
    pathname: "/api/real-estate/public/**",
  });
}

const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: { remotePatterns },
};

export default nextConfig;
