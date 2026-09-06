/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      {
        source: "/dashboard",
        destination: "/services",
        permanent: false,
      },
    ];
  },
  async rewrites() {
    return [
      {
        source: "/api-backend/:path*",
        destination: "http://127.0.0.1:8000/:path*",
      },
      {
        source: "/requests",
        destination: "http://127.0.0.1:8000/requests",
      },
      {
        source: "/requests/:path*",
        destination: "http://127.0.0.1:8000/requests/:path*",
      },
      {
        source: "/admin/:path*",
        destination: "http://127.0.0.1:8000/admin/:path*",
      },
      {
        source: "/vapi/:path*",
        destination: "http://127.0.0.1:8000/vapi/:path*",
      },
      {
        source: "/health",
        destination: "http://127.0.0.1:8000/health",
      },
    ];
  },
};

export default nextConfig;
