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
  Scale,
  Lock,
  Trash2,
  PauseCircle,
  Globe,
  Megaphone,
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
  {
    category: '저작권',
    question: '업로드한 프롬프트의 저작권은 누구에게 있나요?',
    answer:
      '저작권은 원칙적으로 창작자(업로더)에게 귀속됩니다. 플랫폼은 서비스 운영 및 제공을 위한 범위 내에서 비독점적 사용 권한만 부여받으며, 그 외의 목적으로는 활용하지 않습니다.',
    icon: <Scale className="text-brand-400 h-5 w-5" />,
  },
  {
    category: '저작권',
    question: '독점 판매도 가능한가요?',
    answer:
      '현재는 비독점 등록이 기본입니다. 추후 독점 판매 기능이 추가될 예정입니다. 단, 기존에 등록된 프롬프트와 유사도가 높거나 중복성이 있다고 판단될 경우 플랫폼 정책에 따라 등록이 제한될 수 있습니다.',
    icon: <Lock className="text-brand-400 h-5 w-5" />,
  },
  {
    category: '저작권',
    question: '등록한 프롬프트를 삭제하거나 판매를 중단할 수 있나요?',
    answer:
      '삭제 및 판매 중단 모두 언제든지 가능합니다. 단, 이미 구매가 완료된 콘텐츠에 대해서는 회수 또는 접근 제한이 불가능합니다. 구매자는 이미 취득한 열람 권한을 계속 보유합니다.',
    icon: <Trash2 className="text-brand-400 h-5 w-5" />,
  },
  {
    category: '저작권',
    question: '구매자가 프롬프트를 복제하거나 재판매할 수 있나요?',
    answer:
      '플랫폼 내에서의 무단 복제 및 재판매는 금지됩니다. 다만 플랫폼 외부에서의 사용 및 재배포는 기술적으로 제한하기 어려우며, 외부 침해에 대한 권리 보호는 창작자 본인의 책임 하에 이루어집니다.',
    icon: <Globe className="text-brand-400 h-5 w-5" />,
  },
  {
    category: '저작권',
    question: '플랫폼이 제 프롬프트를 마케팅에 사용할 수 있나요?',
    answer:
      '플랫폼은 서비스 홍보 및 마케팅 목적에 한하여 업로드된 프롬프트의 일부(내용, 결과물, 썸네일 등)를 비독점적으로 활용할 수 있습니다. 단, 창작자의 권리를 침해하지 않는 범위 내에서만 사용되며, 상업적 재판매 목적으로는 사용되지 않습니다.',
    icon: <Megaphone className="text-brand-400 h-5 w-5" />,
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
                      isOpen ? 'max-h-64 pb-6 opacity-100' : 'max-h-0 opacity-0'
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
