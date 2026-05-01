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
    <footer className="border-surface-700/50 bg-surface-900 border-t">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-5">
          <div className="col-span-2">
            <Link href="/" className="flex items-center gap-2">
              <div className="from-brand-400 to-brand-600 flex h-8 w-8 items-center justify-center rounded-lg bg-linear-to-br">
                <Sparkles className="h-4 w-4 text-white" />
              </div>
              <span className="font-bold">PROMPTER</span>
            </Link>
            <p className="text-surface-400 mt-4 max-w-xs text-sm">
              검증된 AI 프롬프트를 거래하고 공유하는 마켓플레이스. 당신의 창작을
              더 빠르게.
            </p>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold text-white">제품</h3>
            <ul className="space-y-3">
              {footerLinks.product.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-surface-400 text-sm transition-colors hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold text-white">회사</h3>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-surface-400 text-sm transition-colors hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold text-white">지원</h3>
            <ul className="space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-surface-400 text-sm transition-colors hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-surface-700/50 mt-12 flex flex-col items-center justify-between gap-4 border-t pt-8 sm:flex-row">
          <p className="text-surface-500 text-sm">
            © 2026 Prompter. All rights reserved.
          </p>
          <div className="flex gap-6">
            {footerLinks.legal.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-surface-500 hover:text-surface-300 text-sm transition-colors"
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
