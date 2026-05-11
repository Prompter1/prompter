import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  reactStrictMode: false,

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },

      // 로컬/기존 supabase
      {
        protocol: 'https',
        hostname: 'hsajeiozrjtgeosytoss.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },

      // 서버용 supabase
      {
        protocol: 'https',
        hostname: 'mkfscsovdmvpsctankpt.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
}

export default nextConfig
