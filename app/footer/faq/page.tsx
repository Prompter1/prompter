'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Navbar } from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import {
  ChevronDown,
  ChevronUp,
  Clock,
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
  Globe,
  Megaphone,
  RefreshCw,
  ClipboardCheck,
  XCircle,
} from 'lucide-react'

interface FAQItem {
  category: string
  question: string
  answer: string
  icon: React.ReactNode
}

const FAQ_DATA: FAQItem[] = [
  // ── 결제 ──────────────────────────────────────────────────────────────
  {
    category: '결제',
    question: '결제는 어떻게 하나요?',
    answer:
      '프롬프트 상세 페이지에서 구매 버튼을 누르면 결제 로직이 실행됩니다. 결제 수단은 신용/체크카드가 지원될 예정이며, 현재 PG사 연동 작업이 진행 중입니다.',
    icon: <CreditCard className="text-brand-400 h-5 w-5" />,
  },

  // ── 구매·이용 ─────────────────────────────────────────────────────────
  {
    category: '구매·이용',
    question: '구매한 프롬프트는 어디서 확인하나요?',
    answer:
      '결제 즉시 "마이페이지 > 구매 내역"에서 확인하실 수 있습니다. 구매한 프롬프트는 복사하기 기능을 통해 즉시 AI 서비스(ChatGPT, Claude 등)에 붙여넣어 사용 가능합니다.',
    icon: <Zap className="text-brand-400 h-5 w-5" />,
  },
  {
    category: '구매·이용',
    question: '구매한 프롬프트의 서비스 이용 기간은 얼마나 되나요?',
    answer:
      '플랫폼 내 열람·복사 기능은 구매일로부터 12개월간 제공됩니다. 단, 마이페이지 구매 내역의 [다운로드] 버튼을 통해 텍스트 파일(.txt)로 저장하면 기간 제한 없이 영구적으로 이용하실 수 있습니다. 중요한 프롬프트는 다운로드하여 보관하시기 바랍니다.',
    icon: <Clock className="text-brand-400 h-5 w-5" />,
  },

  // ── 취소·환불 ─────────────────────────────────────────────────────────
  {
    category: '취소·환불',
    question: '구매한 프롬프트를 환불받을 수 있나요?',
    answer:
      '프롬프트는 디지털 콘텐츠 특성상 내용을 열람·복사한 이후에는 원칙적으로 환불이 불가능합니다. 단, 열람 전 7일 이내 요청, 판매 설명과 실제 내용이 현저히 다른 경우, 중복 결제 등 예외 사유는 고객센터로 문의하시면 검토 후 처리해 드립니다.',
    icon: <ShieldCheck className="text-brand-400 h-5 w-5" />,
  },

  // ── 판매자 ────────────────────────────────────────────────────────────
  {
    category: '판매자',
    question: '인증과 검증의 차이가 뭔가요?',
    answer:
      '인증은 유료 프롬프트를 게시하였을 때 플랫폼이 실시하는 저작권 및 유해 콘텐츠 문제 심사 과정이고, 검증은 프롬프트의 품질과 신뢰성을 평가하여 구매자에게 보증하는 마크입니다. 인증은 유료 게시물 등록 시 필수적으로 거쳐야 하는 절차이며, 검증은 인증을 통과한 게시물 중에서 추가로 심사를 통해 부여됩니다. 검증된 프롬프트는 홈 화면 인기 섹션 및 탐색 페이지에서 상위 노출 우선순위가 부여되고, 상세 페이지에 "Verified" 뱃지가 표시되어 구매자에게 신뢰 신호를 제공합니다.',
    icon: <MessageCircle className="text-brand-400 h-5 w-5" />,
  },
  {
    category: '판매자',
    question: '저도 프롬프트를 판매할 수 있나요?',
    answer:
      '네, 가능합니다! 상단 메뉴의 "판매 신청"을 통해 판매자 권한을 획득하신 후, 본인만의 노하우가 담긴 프롬프트를 등록하여 수익을 창출하실 수 있습니다. 유료 게시물은 등록 후 관리자 인증을 거쳐 판매가 활성화됩니다.',
    icon: <MessageCircle className="text-brand-400 h-5 w-5" />,
  },
  {
    category: '판매자',
    question: '유료 게시물을 등록하면 바로 판매되나요?',
    answer:
      '아니요. 가격이 설정된 유료 프롬프트는 등록 즉시 "인증 대기" 상태로 전환되며, 구매 버튼이 비활성화됩니다. 관리자가 콘텐츠를 검토한 뒤 인증을 승인하면 판매가 활성화됩니다. 무료 프롬프트는 별도 인증 없이 즉시 공개됩니다.',
    icon: <ClipboardCheck className="text-brand-400 h-5 w-5" />,
  },
  {
    category: '판매자',
    question: '게시물이 반려되면 어떻게 되나요?',
    answer:
      '관리자가 게시물을 반려하면 해당 게시물은 즉시 삭제되고, 등록 시 사용한 이메일로 반려 사유가 발송됩니다. 사유를 확인한 뒤 내용을 수정하여 새로 등록하시면 됩니다.',
    icon: <XCircle className="text-brand-400 h-5 w-5" />,
  },
  {
    category: '판매자',
    question: '검증됨(Verified) 마크를 받으면 어떤 혜택이 있나요?',
    answer:
      '검증됨 마크가 부여된 프롬프트는 세 가지 주요 혜택을 받습니다. 첫째, 홈 화면 인기 프롬프트 섹션 및 탐색 페이지의 인기순 정렬에서 검증 여부가 1순위 기준으로 적용되어 미검증 프롬프트보다 항상 앞에 노출됩니다. 둘째, 검색 결과 및 카테고리 목록에서 상위 노출 우선순위가 부여되어 더 많은 구매자에게 노출됩니다. 셋째, 프롬프트 상세 페이지에 "Verified" 뱃지가 표시되어 구매자에게 품질과 신뢰성을 보장하는 신호 역할을 합니다. 검증은 업로드 시 증빙 자료(AI 활용 스크린샷·영상)를 첨부하고 관리자 심사를 통과하면 획득할 수 있습니다.',
    icon: <ShieldCheck className="text-brand-400 h-5 w-5" />,
  },
  {
    category: '판매자',
    question: '수익 정산은 어떻게 되나요?',
    answer:
      '매월 1일~말일 판매 확정분을 익월 10일에 지급합니다. 수수료는 판매자 유형에 따라 다릅니다. ① 개인 판매자: 수수료 20%(VAT 포함) 공제 후 원천징수 3.3% 추가 공제, 월 매출 50만원 초과 시 사업자 등록 요청. ② 사업자 판매자: 수수료 15%(VAT 별도)만 공제, 원천징수 없음. ③ 프로모션 사업자(선착순 100명): 수수료 5%(VAT 별도). 사업자 판매자의 정산은 5단계로 진행됩니다 — (1) 매월 1일 자동 집계 → (2) 판매자가 마이페이지에서 세금계산서 발행 → (3) 관리자 확인 → (4) 정산 승인 → (5) 익월 10일 지급. 세금계산서 미제출 시 정산이 보류됩니다.',
    icon: <Banknote className="text-brand-400 h-5 w-5" />,
  },

  // ── 기술지원 ──────────────────────────────────────────────────────────
  {
    category: '기술지원',
    question: '프롬프트가 제대로 작동하지 않아요.',
    answer:
      '각 프롬프트는 권장 AI 모델 버전(예: GPT-4o, Claude 3.5 등)이 있습니다. 상품 설명에 기재된 권장 설정값을 먼저 확인해 주세요. 그래도 문제가 있다면 고객센터(chaalsdn0217@naver.com)로 문의 주세요.',
    icon: <HelpCircle className="text-brand-400 h-5 w-5" />,
  },

  // ── 저작권 ────────────────────────────────────────────────────────────
  {
    category: '저작권',
    question: '업로드한 프롬프트의 저작권은 누구에게 있나요?',
    answer:
      '저작권은 원칙적으로 플랫폼 내에서 창작자(업로더)에게 귀속됩니다. 플랫폼은 서비스 운영 및 홍보를 위한 범위 내에서 비독점적 사용 권한만 부여받으며, 그 외의 목적으로는 활용하지 않습니다.',
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

  // ── 이용 정책 ─────────────────────────────────────────────────────────
  {
    category: '이용 정책',
    question: '범죄·위험 목적 콘텐츠를 업로드하면 어떻게 되나요?',
    answer:
      '사기, 해킹, 개인정보 침해, 성범죄, 폭력, 마약 등 범죄에 활용되거나 타인에게 위해를 가할 수 있는 콘텐츠의 업로드는 엄격히 금지됩니다. 이러한 게시물을 플랫폼의 인증을 피하여 올릴 경우, 모든 민·형사상 법적 책임은 전적으로 업로더 본인에게 있으며, 플랫폼은 어떠한 책임도 부담하지 않습니다. 해당 콘텐츠는 발견 즉시 삭제되며, 관련 법령에 따라 수사기관에 관련 정보가 제공될 수 있습니다.',
    icon: <Scale className="text-brand-400 h-5 w-5" />,
  },
  {
    category: '이용 정책',
    question: '프롬프트 노출 순서는 어떻게 결정되나요?',
    answer:
      '홈 화면 인기 프롬프트 및 탐색 페이지의 인기순 정렬은 매일 자정에 자동으로 갱신됩니다. 정렬 기준은 1순위 검증 여부, 2순위 누적 판매 수, 3순위 누적 조회 수 순서로 적용됩니다. 검증됨 프롬프트는 미검증 프롬프트보다 항상 앞에 위치하며, 같은 검증 상태 내에서는 판매 수가 많을수록, 조회 수가 많을수록 상위에 노출됩니다.',
    icon: <RefreshCw className="text-brand-400 h-5 w-5" />,
  },
]

const CATEGORIES = [
  '전체',
  ...Array.from(new Set(FAQ_DATA.map((f) => f.category))),
]

export default function FAQPage() {
  const [selectedCategory, setSelectedCategory] = useState('전체')
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const filtered =
    selectedCategory === '전체'
      ? FAQ_DATA
      : FAQ_DATA.filter((f) => f.category === selectedCategory)

  function handleCategoryChange(cat: string) {
    setSelectedCategory(cat)
    setOpenIndex(null)
  }

  return (
    <main className="bg-surface-900 text-surface-50 flex min-h-screen flex-col">
      <Navbar />

      <section className="grow px-4 py-20">
        <div className="mx-auto max-w-3xl">
          {/* 헤더 */}
          <div className="mb-10 text-center">
            <h1 className="mb-4 text-3xl font-bold">자주 묻는 질문</h1>
            <p className="text-surface-400">
              Prompter 이용에 대해 궁금한 점을 빠르게 확인해 보세요.
            </p>
          </div>

          {/* 카테고리 탭 */}
          <div className="mb-8 flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => {
              const isActive = selectedCategory === cat
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => handleCategoryChange(cat)}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-brand-500 shadow-brand-500/20 text-white shadow-lg'
                      : 'bg-surface-800/50 text-surface-400 hover:bg-surface-700/60 hover:text-surface-200 border-surface-700/50 border'
                  }`}
                >
                  {cat}
                  {cat !== '전체' && (
                    <span
                      className={`ml-1.5 text-xs ${isActive ? 'text-white/70' : 'text-surface-600'}`}
                    >
                      {FAQ_DATA.filter((f) => f.category === cat).length}
                    </span>
                  )}
                </button>
              )
            })}
          </div>

          {/* FAQ 목록 */}
          <div className="space-y-3">
            {filtered.map((faq, index) => {
              const isOpen = openIndex === index
              return (
                <div
                  key={faq.question}
                  className={`border-surface-700/50 overflow-hidden rounded-2xl border transition-all duration-200 ${
                    isOpen
                      ? 'bg-surface-800/80 border-brand-500/50'
                      : 'bg-surface-800/30 hover:bg-surface-800/50'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => setOpenIndex(isOpen ? null : index)}
                    className="flex w-full items-center justify-between p-5 text-left"
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`rounded-lg p-2 transition-colors ${
                          isOpen ? 'bg-brand-500/20' : 'bg-surface-700/30'
                        }`}
                      >
                        {faq.icon}
                      </div>
                      <div>
                        {selectedCategory === '전체' && (
                          <span className="text-brand-400 mb-0.5 block text-xs font-semibold tracking-wider uppercase">
                            {faq.category}
                          </span>
                        )}
                        <h3 className="text-base leading-snug font-medium">
                          {faq.question}
                        </h3>
                      </div>
                    </div>
                    <span className="ml-4 shrink-0">
                      {isOpen ? (
                        <ChevronUp className="text-surface-400 h-4 w-4" />
                      ) : (
                        <ChevronDown className="text-surface-400 h-4 w-4" />
                      )}
                    </span>
                  </button>

                  <div
                    className={`overflow-hidden px-5 transition-all duration-300 ease-in-out ${
                      isOpen ? 'max-h-80 pb-5 opacity-100' : 'max-h-0 opacity-0'
                    }`}
                  >
                    <div className="text-surface-400 border-surface-700/50 border-t pt-4 pl-14 text-sm leading-relaxed">
                      {faq.answer}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* 문의 */}
          <div className="mt-14 text-center">
            <p className="text-surface-400 mb-6 text-sm">
              원하시는 답변을 찾지 못하셨나요?
            </p>
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
