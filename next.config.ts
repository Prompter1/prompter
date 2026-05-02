import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  reactStrictMode: false,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'hsajeiozrjtgeosytoss.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
}

export default nextConfig
