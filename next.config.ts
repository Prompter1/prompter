import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // true로 변경 — 개발 중 부작용 조기 탐지
  reactStrictMode: true,

  // 프로덕션 빌드에서 console.log 자동 제거 (error/warn은 유지)
  compiler: {
    removeConsole:
      process.env.NODE_ENV === 'production'
        ? { exclude: ['error', 'warn'] }
        : false,
  },

  images: {
    // WebP/AVIF 자동 변환으로 이미지 용량 최적화
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'hsajeiozrjtgeosytoss.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
      {
        protocol: 'https',
        hostname: 'mkfscsovdmvpsctankpt.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
}

export default nextConfig
