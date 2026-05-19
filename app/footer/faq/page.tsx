'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Navbar } from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import {
  ChevronDown,
  ChevronUp,
  MessageCircle,
  CreditCard,
  Zap,
  ShieldCheck,
  HelpCircle,
  Mail,
  Banknote,
} from 'lucide-react'

interface FAQItem {
  category: string
  question: string
  answer: string
  icon: React.ReactNode
}

const FAQ_DATA: FAQItem[] = [
  {
    category: '결제',
    question: '결제는 어떻게 하나요?',
    answer:
      '프롬프트 상세 페이지에서 구매 버튼을 누르면 토스페이먼츠 결제창이 열립니다. 신용카드, 계좌이체, 간편결제(카카오페이, 네이버페이 등) 등 다양한 결제 수단을 지원합니다.',
    icon: <CreditCard className="text-brand-400 h-5 w-5" />,
  },
  {
    category: '구매·이용',
    question: '구매한 프롬프트는 어디서 확인하나요?',
    answer:
      '결제 즉시 "마이페이지 > 구매 내역"에서 확인하실 수 있습니다. 구매한 프롬프트는 복사하기 기능을 통해 즉시 AI 서비스(ChatGPT, Claude 등)에 붙여넣어 사용 가능합니다.',
    icon: <Zap className="text-brand-400 h-5 w-5" />,
  },
  {
    category: '취소·환불',
    question: '구매한 프롬프트를 환불받을 수 있나요?',
    answer:
      '프롬프트는 디지털 콘텐츠 특성상 내용을 열람·복사한 이후에는 원칙적으로 환불이 불가능합니다. 단, 열람 전 7일 이내 요청, 판매 설명과 실제 내용이 현저히 다른 경우, 중복 결제 등 예외 사유는 고객센터로 문의하시면 검토 후 처리해 드립니다.',
    icon: <ShieldCheck className="text-brand-400 h-5 w-5" />,
  },
  {
    category: '판매자',
    question: '저도 프롬프트를 판매할 수 있나요?',
    answer:
      '네, 가능합니다! 상단 메뉴의 "판매 신청"을 통해 판매자 권한을 획득하신 후, 본인만의 노하우가 담긴 프롬프트를 등록하여 수익을 창출하실 수 있습니다. 등록된 프롬프트는 관리자 검수를 거쳐 공개됩니다.',
    icon: <MessageCircle className="text-brand-400 h-5 w-5" />,
  },
  {
    category: '판매자',
    question: '수익 정산은 어떻게 되나요?',
    answer:
      '매월 1일~말일 판매 확정분을 익월 10일에 지급합니다. 플랫폼 수수료 15% 공제 후, 개인 판매자는 원천징수 3.3%가 추가 공제됩니다. 월 매출 50만원 초과 시 사업자 등록이 필요하며, 사업자 판매자는 원천징수 없이 수수료 공제 후 전액 지급됩니다.',
    icon: <Banknote className="text-brand-400 h-5 w-5" />,
  },
  {
    category: '기술지원',
    question: '프롬프트가 제대로 작동하지 않아요.',
    answer:
      '각 프롬프트는 권장 AI 모델 버전(예: GPT-4o, Claude 3.5 등)이 있습니다. 상품 설명에 기재된 권장 설정값을 먼저 확인해 주세요. 그래도 문제가 있다면 고객센터(chaalsdn0217@naver.com)로 문의 주세요.',
    icon: <HelpCircle className="text-brand-400 h-5 w-5" />,
  },
]

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <main className="bg-surface-900 text-surface-50 flex min-h-screen flex-col">
      <Navbar />

      <section className="grow px-4 py-20">
        <div className="mx-auto max-w-3xl">
          <div className="mb-12 text-center">
            <h1 className="mb-4 text-3xl font-bold">자주 묻는 질문</h1>
            <p className="text-surface-400">
              Prompter 이용에 대해 궁금한 점을 빠르게 확인해 보세요.
            </p>
          </div>

          <div className="space-y-4">
            {FAQ_DATA.map((faq, index) => {
              const isOpen = openIndex === index
              return (
                <div
                  key={faq.question}
                  className={`border-surface-700/50 overflow-hidden rounded-2xl border transition-all duration-300 ${
                    isOpen
                      ? 'bg-surface-800/80 border-brand-500/50'
                      : 'bg-surface-800/30'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => setOpenIndex(isOpen ? null : index)}
                    className="flex w-full items-center justify-between p-6 text-left"
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`rounded-lg p-2 ${isOpen ? 'bg-brand-500/20' : 'bg-surface-700/30'}`}
                      >
                        {faq.icon}
                      </div>
                      <div>
                        <span className="text-brand-400 text-xs font-semibold tracking-wider uppercase">
                          {faq.category}
                        </span>
                        <h3 className="mt-1 text-lg font-medium">{faq.question}</h3>
                      </div>
                    </div>
                    {isOpen ? (
                      <ChevronUp className="text-surface-400 h-5 w-5 shrink-0" />
                    ) : (
                      <ChevronDown className="text-surface-400 h-5 w-5 shrink-0" />
                    )}
                  </button>

                  <div
                    className={`overflow-hidden px-6 transition-all duration-300 ease-in-out ${
                      isOpen ? 'max-h-48 pb-6 opacity-100' : 'max-h-0 opacity-0'
                    }`}
                  >
                    <div className="text-surface-400 border-surface-700/50 border-t pt-4 pl-14 leading-relaxed text-sm">
                      {faq.answer}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          <div className="mt-16 text-center">
            <p className="text-surface-400 mb-6">원하시는 답변을 찾지 못하셨나요?</p>
            <Link
              href="/footer/contact"
              className="bg-brand-500 hover:bg-brand-400 inline-flex items-center gap-2 rounded-full px-8 py-3 font-semibold text-white transition-colors"
            >
              <Mail className="h-4 w-4" />
              문의하기
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
