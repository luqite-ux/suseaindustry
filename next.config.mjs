/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    const adminUrl = process.env.NEXT_PUBLIC_ADMIN_URL?.trim().replace(/[\r\n]/g, '').replace(/\/$/, '')
    if (!adminUrl) return []
    return { afterFiles: [
      { source: '/admin', destination: `${adminUrl}/admin` },
      { source: '/admin/:path*', destination: `${adminUrl}/admin/:path*` },
      { source: '/api/admin/:path*', destination: `${adminUrl}/api/admin/:path*` },
    ] }
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 2678400,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'pub-c7a22068052144a5805830c30d280128.r2.dev',
      },
    ],
  },
}

export default nextConfig
