'use client'

import { useState } from 'react'
import { Navbar } from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import {
  HelpCircle,
  ChevronDown,
  ChevronUp,
  MessageCircle,
  CreditCard,
  Zap,
  ShieldCheck,
} from 'lucide-react'

type FAQItem = {
  category: string
  question: string
  answer: string
  icon: React.ReactNode
}

const FAQ_DATA: FAQItem[] = [
  {
    category: '결제/충전',
    question: '크레딧 충전은 어떻게 하나요?',
    answer:
      '마이페이지의 충전하기 버튼을 통해 토스페이먼츠 결제창을 이용하여 충전할 수 있습니다. 신용카드, 계좌이체, 간편결제 등 다양한 수단을 지원합니다.',
    icon: <CreditCard className="text-brand-400 h-5 w-5" />,
  },
  {
    category: '구매/이용',
    question: '구매한 프롬프트는 어디서 확인하나요?',
    answer:
      '결제 즉시 "마이페이지 > 구매 내역"에서 확인하실 수 있습니다. 구매한 프롬프트는 복사하기 기능을 통해 즉시 AI 서비스(ChatGPT, Claude 등)에 붙여넣어 사용 가능합니다.',
    icon: <Zap className="text-brand-400 h-5 w-5" />,
  },
  {
    category: '취소/환불',
    question: '구매한 프롬프트를 환불받을 수 있나요?',
    answer:
      '프롬프트는 디지털 콘텐츠의 특성상 결제 완료 후 내용을 확인하면 복제가 가능한 상품입니다. 따라서 프롬프트 내용을 열람한 이후에는 원칙적으로 환불이 불가능하므로 신중한 구매 부탁드립니다.',
    icon: <ShieldCheck className="text-brand-400 h-5 w-5" />,
  },
  {
    category: '판매자',
    question: '저도 제가 만든 프롬프트를 팔 수 있나요?',
    answer:
      '네, 가능합니다! 상단 메뉴의 "판매 신청"을 통해 판매자 권한을 획득하신 후, 본인만의 노하우가 담긴 프롬프트를 등록하여 수익을 창출하실 수 있습니다.',
    icon: <MessageCircle className="text-brand-400 h-5 w-5" />,
  },
  {
    category: '기술지원',
    question: '프롬프트가 제대로 작동하지 않아요.',
    answer:
      '각 프롬프트는 권장되는 AI 모델 버전(예: GPT-4o, Claude 3.5 등)이 있습니다. 상품 설명에 기재된 설정값을 확인해 주시고, 그럼에도 문제가 있다면 판매자 문의 혹은 고객센터로 문의해 주세요.',
    icon: <HelpCircle className="text-brand-400 h-5 w-5" />,
  },
]

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <main className="bg-surface-900 text-surface-50 flex min-h-screen flex-col">
      <Navbar />

      <section className="grow px-4 py-20">
        <div className="mx-auto max-w-3xl">
          {/* 헤더 */}
          <div className="mb-12 text-center">
            <h1 className="mb-4 text-3xl font-bold">자주 묻는 질문</h1>
            <p className="text-surface-400">
              Prompter 이용에 대해 궁금한 점을 빠르게 확인해 보세요.
            </p>
          </div>

          {/* FAQ 리스트 */}
          <div className="space-y-4">
            {FAQ_DATA.map((faq, index) => {
              const isOpen = openIndex === index
              return (
                <div
                  key={index}
                  className={`border-surface-700/50 overflow-hidden rounded-2xl border transition-all duration-300 ${
                    isOpen
                      ? 'bg-surface-800/80 border-brand-500/50'
                      : 'bg-surface-800/30'
                  }`}
                >
                  <button
                    onClick={() => toggleAccordion(index)}
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
                        <h3 className="mt-1 text-lg font-medium">
                          {faq.question}
                        </h3>
                      </div>
                    </div>
                    {isOpen ? (
                      <ChevronUp className="text-surface-400 h-5 w-5" />
                    ) : (
                      <ChevronDown className="text-surface-400 h-5 w-5" />
                    )}
                  </button>

                  <div
                    className={`overflow-hidden px-6 transition-all duration-300 ease-in-out ${
                      isOpen ? 'max-h-40 pb-6 opacity-100' : 'max-h-0 opacity-0'
                    }`}
                  >
                    <div className="text-surface-400 border-surface-700/50 border-t pt-4 pl-14 leading-relaxed">
                      {faq.answer}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* 하단 안내 */}
          <div className="mt-16 text-center">
            <p className="text-surface-400 mb-6">
              원하시는 답변을 찾지 못하셨나요?
            </p>
            <a
              href="mailto:chaalsdn0217@naver.com"
              className="bg-brand-500 hover:bg-brand-400 inline-flex items-center gap-2 rounded-full px-8 py-3 font-semibold text-white transition-colors"
            >
              <MailIcon className="h-4 w-4" />
              1:1 이메일 문의하기
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}

function MailIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="20" height="16" x="2" y="4" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  )
}
