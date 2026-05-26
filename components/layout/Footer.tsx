import Link from 'next/link'
import { Sparkles } from 'lucide-react'

const footerLinks = {
  product: [
    { href: '/footer/about', label: '회사 소개' },
    { href: '/prompt', label: '탐색' },
    { href: '/ranking', label: '랭킹' },
  ],
  support: [
    { href: '/footer/info', label: '사업자 정보' },
    { href: '/footer/faq', label: 'FAQ' },
    { href: '/footer/contact', label: '문의하기' },
  ],
  legal: [
    { href: '/footer/terms', label: '이용약관' },
    { href: '/footer/privacy', label: '개인정보처리방침' },
    { href: '/footer/refund', label: '환불정책' },
    { href: '/footer/seller-policy', label: '판매자 정책' },
    { href: '/footer/delivery', label: '디지털 상품 제공 방식' },
  ],
}

export default function Footer() {
  return (
    <footer className="border-border/40 bg-surface-900/80 relative border-t backdrop-blur-xl">
      {/* Subtle top gradient line */}
      <div className="via-brand-500/30 absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent to-transparent" />

      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-5 md:gap-12">
          {/* Brand column */}
          <div className="col-span-2">
            <Link href="/" className="group inline-flex items-center gap-2.5">
              <span className="text-foreground text-lg font-bold tracking-tight">
                PROMPTER
              </span>
            </Link>
            <p className="text-muted-foreground mt-5 max-w-xs text-sm leading-relaxed">
              검증된 AI 프롬프트를 거래하고 공유하는 마켓플레이스. 당신의
              프롬프트를 가장 가치 있는 자산으로
            </p>
            <div className="border-border/30 mt-5 max-w-xs rounded-xl border bg-white/3 px-4 py-3">
              <p className="text-muted-foreground text-xs leading-relaxed">
                모든 거래에 대한 책임과 배송, 환불, 민원 등의 처리는
                프롬프터에서 진행합니다.
              </p>
              <p className="text-muted-foreground mt-1.5 text-xs">
                민원담당자 : 차민우{' '}
                <a
                  href="mailto:chaalsdn0217@naver.com"
                  className="hover:text-foreground underline underline-offset-2 transition-colors"
                >
                  (chaalsdn0217@naver.com)
                </a>
              </p>
            </div>
          </div>

          {/* Product links */}
          <div>
            <h3 className="text-foreground mb-4 text-sm font-semibold tracking-wide">
              제품
            </h3>
            <ul className="space-y-3">
              {footerLinks.product.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-muted-foreground hover:text-foreground text-sm transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support links */}
          <div>
            <h3 className="text-foreground mb-4 text-sm font-semibold tracking-wide">
              지원
            </h3>
            <ul className="space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-muted-foreground hover:text-foreground text-sm transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal links */}
          <div>
            <h3 className="text-foreground mb-4 text-sm font-semibold tracking-wide">
              정책
            </h3>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-muted-foreground hover:text-foreground text-sm transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom section */}
        <div className="border-border/40 mt-14 flex flex-col items-center justify-between gap-4 border-t pt-8 sm:flex-row">
          <p className="text-muted-foreground text-sm">
            © 2026 Prompter. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
