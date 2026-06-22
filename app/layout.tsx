import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { AuthProvider } from '@/providers/auth-provider'
import { ToastProvider } from '@/components/ui/Toast'
import './globals.css'

const geistSans = Geist({
  subsets: ['latin'],
  variable: '--font-geist-sans',
})
const geistMono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-geist-mono',
})

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000').replace(/\/$/, '')

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'PROMPTER - AI 프롬프트 마켓플레이스',
    template: '%s | PROMPTER',
  },
  description:
    '검증된 AI 프롬프트를 거래하고 공유하는 플랫폼. ChatGPT, Midjourney, Stable Diffusion, Claude, DALL-E 등 다양한 AI 도구를 위한 프롬프트를 찾아보세요.',
  keywords: [
    'AI 프롬프트',
    '프롬프트 마켓',
    'ChatGPT 프롬프트',
    'Midjourney 프롬프트',
    'Stable Diffusion 프롬프트',
    'Claude 프롬프트',
    'DALL-E',
    'Gemini',
    'AI 이미지 생성',
    '프롬프트 구매',
    '프롬프트 판매',
    '인공지능',
    '생성 AI',
    'AI 마켓플레이스',
  ],
  authors: [{ name: 'PROMPTER' }],
  creator: 'PROMPTER',
  publisher: 'PROMPTER',
  openGraph: {
    type: 'website',
    locale: 'ko_KR',
    url: SITE_URL,
    siteName: 'PROMPTER',
    title: 'PROMPTER - AI 프롬프트 마켓플레이스',
    description:
      '검증된 AI 프롬프트를 거래하고 공유하는 플랫폼. ChatGPT, Midjourney, Stable Diffusion 등 다양한 AI 도구를 위한 프롬프트를 찾아보세요.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'PROMPTER - AI 프롬프트 마켓플레이스',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PROMPTER - AI 프롬프트 마켓플레이스',
    description: '검증된 AI 프롬프트를 거래하고 공유하는 플랫폼.',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#1a1625' },
  ],
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ko" className="dark bg-background">
      <body
        className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased`}
      >
        <AuthProvider>
          <ToastProvider>{children}</ToastProvider>
        </AuthProvider>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
