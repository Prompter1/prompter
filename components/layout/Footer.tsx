import Link from 'next/link'
import { Sparkles } from 'lucide-react'

const footerLinks = {
  product: [
    { href: '/explore', label: '탐색' },
    { href: '/ranking', label: '랭킹' },
    { href: '/pricing', label: '가격' },
  ],
  company: [
    { href: '/about', label: '회사 소개' },
    { href: '/blog', label: '블로그' },
    { href: '/careers', label: '채용' },
  ],
  support: [
    { href: '/help', label: '도움말' },
    { href: '/contact', label: '문의하기' },
    { href: '/faq', label: 'FAQ' },
  ],
  legal: [
    { href: '/terms', label: '이용약관' },
    { href: '/privacy', label: '개인정보처리방침' },
  ],
}

export default function Footer() {
  return (
    <footer className="border-border/40 bg-surface-900/80 relative border-t backdrop-blur-xl">
      {/* Subtle top gradient line */}
      <div className="via-brand-500/30 absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent to-transparent" />

      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-5 md:gap-12">
          {/* Brand column */}
          <div className="col-span-2">
            <Link href="/" className="group inline-flex items-center gap-2.5">
              <div className="from-brand-400 via-brand-500 to-brand-600 shadow-brand-500/20 group-hover:shadow-brand-500/40 relative flex h-9 w-9 items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br shadow-lg transition-all duration-300">
                <Sparkles className="h-4 w-4 text-white" />
                <div className="absolute inset-0 bg-gradient-to-t from-transparent to-white/20" />
              </div>
              <span className="text-foreground text-lg font-bold tracking-tight">
                PROMPTER
              </span>
            </Link>
            <p className="text-muted-foreground mt-5 max-w-xs text-sm leading-relaxed">
              검증된 AI 프롬프트를 거래하고 공유하는 마켓플레이스. 당신의 창작을
              더 빠르게.
            </p>
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

          {/* Company links */}
          <div>
            <h3 className="text-foreground mb-4 text-sm font-semibold tracking-wide">
              회사
            </h3>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
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
        </div>

        {/* Bottom section */}
        <div className="border-border/40 mt-14 flex flex-col items-center justify-between gap-4 border-t pt-8 sm:flex-row">
          <p className="text-muted-foreground text-sm">
            © 2026 Prompter. All rights reserved.
          </p>
          <div className="flex gap-6">
            {footerLinks.legal.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-muted-foreground hover:text-foreground text-sm transition-colors duration-200"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
