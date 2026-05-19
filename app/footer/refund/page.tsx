import { Navbar } from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import {
  Undo2,
  CreditCard,
  AlertTriangle,
  CheckCircle2,
  HelpCircle,
  XCircle,
} from 'lucide-react'

const EFFECTIVE_DATE = '2026. 05. 13'
const CONTACT_EMAIL = 'chaalsdn0217@naver.com'

export default function RefundPage() {
  return (
    <main className="bg-surface-900 text-surface-50 flex min-h-screen flex-col">
      <Navbar />

      <section className="grow px-4 py-20">
        <div className="mx-auto max-w-4xl">
          <div className="mb-12">
            <div className="mb-4 flex items-center gap-3">
              <div className="bg-brand-500/20 rounded-lg p-2">
                <Undo2 className="text-brand-400 h-6 w-6" />
              </div>
              <h1 className="text-3xl font-bold">환불 정책</h1>
            </div>
            <p className="text-surface-400">
              Prompter의 결제 및 디지털 콘텐츠 환불에 관한 규정을 안내드립니다.
            </p>
            <p className="text-surface-500 mt-2 text-xs">
              시행일: {EFFECTIVE_DATE}
            </p>
          </div>

          <div className="space-y-8">

            {/* 1. 프롬프트 구매 환불 */}
            <div className="bg-brand-500/5 border-brand-500/30 relative overflow-hidden rounded-3xl border p-8">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <AlertTriangle className="text-brand-400 h-24 w-24" />
              </div>

              <h2 className="mb-6 flex items-center gap-2 text-xl font-semibold text-white">
                <AlertTriangle className="text-brand-400 h-5 w-5" /> 1. 프롬프트 콘텐츠 구매 환불
              </h2>
              <div className="text-surface-300 space-y-4 text-sm leading-relaxed">
                <p className="font-medium text-white">
                  프롬프트는 「전자상거래 등에서의 소비자보호에 관한 법률」
                  제17조 제2항 제5호에 따른 디지털 콘텐츠로 분류됩니다.
                  이에 따라 다음 환불 제한 규정이 적용됩니다.
                </p>

                <div className="bg-surface-900/50 border-brand-500/20 space-y-4 rounded-2xl border p-6">
                  <div className="flex items-start gap-3">
                    <XCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-400" />
                    <div>
                      <p className="font-bold text-red-400 mb-1">환불 불가</p>
                      <p>
                        구매 완료 후 프롬프트 내용을 열람하거나 복사한 경우,
                        상품의 가치가 소비자에게 전달된 것으로 간주하여
                        어떠한 경우에도 환불이 불가능합니다.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="text-brand-400 mt-0.5 h-5 w-5 shrink-0" />
                    <div>
                      <p className="text-brand-400 font-bold mb-1">환불 가능 예외</p>
                      <ul className="space-y-1 text-sm">
                        <li>
                          • 구매 후 내용을 <strong className="text-surface-200">전혀 열람하지 않은 상태</strong>에서
                          7일 이내 요청 시 내부 검토 후 처리
                        </li>
                        <li>
                          • 판매 페이지의 설명과 실제 콘텐츠가{' '}
                          <strong className="text-surface-200">현저히 상이</strong>하거나
                          콘텐츠 자체에 결함이 있는 경우 (증빙 제출 필요)
                        </li>
                        <li>
                          • 동일 상품이 중복 결제된 경우 (결제 기록 확인 후 처리)
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                <p className="text-surface-500 text-xs italic">
                  * AI 모델의 버전 업데이트로 인한 결과물 차이는 환불 사유에
                  해당하지 않습니다. 구매 전 상품 설명의 권장 모델을 반드시
                  확인해 주세요.
                </p>
              </div>
            </div>

            {/* 2. 결제 취소 */}
            <div className="bg-surface-800/20 border-surface-700/50 rounded-3xl border p-8">
              <h2 className="mb-6 flex items-center gap-2 text-xl font-semibold text-white">
                <CreditCard className="text-brand-400 h-5 w-5" /> 2. 결제 취소 및 오류 처리
              </h2>
              <div className="text-surface-300 space-y-4 text-sm leading-relaxed">
                <ul className="list-disc space-y-3 pl-5">
                  <li>
                    <strong className="text-surface-200">결제 직후 취소:</strong>{' '}
                    결제 완료 후 프롬프트 내용 열람 전이라면 당일 취소 신청 시
                    전액 환불이 가능합니다. 취소는 고객센터로 즉시 연락 주세요.
                  </li>
                  <li>
                    <strong className="text-surface-200">결제 오류:</strong>{' '}
                    결제는 완료되었으나 구매 내역에 상품이 표시되지 않는 경우,
                    결제 내역 스크린샷과 함께 고객센터로 접수하면 24시간 이내
                    처리됩니다.
                  </li>
                  <li>
                    <strong className="text-surface-200">중복 결제:</strong>{' '}
                    동일 상품이 중복 결제된 경우 고객센터 접수 후 확인을 거쳐
                    중복분을 환불합니다.
                  </li>
                  <li>
                    환불 처리 기간은 결제 수단에 따라 영업일 기준
                    3~10일이 소요될 수 있습니다.
                  </li>
                </ul>
              </div>
            </div>

            {/* 3. 환불 신청 방법 */}
            <div className="bg-surface-800/20 border-surface-700/50 rounded-3xl border p-8">
              <h2 className="mb-6 flex items-center gap-2 text-xl font-semibold text-white">
                <HelpCircle className="text-brand-400 h-5 w-5" /> 3. 환불 신청 방법
              </h2>
              <div className="text-surface-300 space-y-4 text-sm">
                <p>
                  환불 신청은 아래 정보를 포함하여 이메일로 접수하시면
                  영업일 기준 1~3일 이내에 처리됩니다.
                </p>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="bg-surface-800/50 border-surface-700/50 rounded-xl border p-4">
                    <p className="text-surface-500 mb-1 text-xs">접수 이메일</p>
                    <p className="font-medium">{CONTACT_EMAIL}</p>
                  </div>
                  <div className="bg-surface-800/50 border-surface-700/50 rounded-xl border p-4">
                    <p className="text-surface-500 mb-1 text-xs">필수 기재 정보</p>
                    <ul className="text-xs font-medium space-y-1">
                      <li>• 계정 이메일</li>
                      <li>• 구매한 프롬프트명 또는 주문번호</li>
                      <li>• 환불 사유 및 증빙 자료</li>
                    </ul>
                  </div>
                </div>
                <p className="text-surface-500 text-xs">
                  * 「전자상거래법」 제20조에 따라 청약철회 의사 표시 후
                  3영업일 이내에 대금 환급이 이루어집니다. 환급 지연 시
                  지연이자가 가산될 수 있습니다.
                </p>
              </div>
            </div>

          </div>

          <p className="text-surface-500 mt-12 text-center text-xs">
            Prompter는 공정거래위원회 표준약관 및 전자상거래법을 준수합니다.
          </p>
        </div>
      </section>

      <Footer />
    </main>
  )
}
