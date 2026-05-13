import { Navbar } from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import {
  Undo2,
  CreditCard,
  AlertTriangle,
  CheckCircle2,
  HelpCircle,
} from 'lucide-react'

export default function RefundPage() {
  const lastUpdated = '2026. 05. 13'

  return (
    <main className="bg-surface-900 text-surface-50 flex min-h-screen flex-col">
      <Navbar />

      <section className="flex-grow px-4 py-20">
        <div className="mx-auto max-w-4xl">
          {/* 헤더 */}
          <div className="mb-12">
            <div className="mb-4 flex items-center gap-3">
              <div className="bg-brand-500/20 rounded-lg p-2">
                <Undo2 className="text-brand-400 h-6 w-6" />
              </div>
              <h1 className="text-3xl font-bold">환불 정책</h1>
            </div>
            <p className="text-surface-400">
              Prompter의 크레딧 및 콘텐츠 환불에 관한 규정을 안내드립니다.
            </p>
            <p className="text-surface-500 mt-2 text-xs">
              최종 수정일: {lastUpdated}
            </p>
          </div>

          <div className="space-y-8">
            {/* 1. 크레딧 충전 환불 (비교적 자유로움) */}
            <div className="bg-surface-800/20 border-surface-700/50 rounded-3xl border p-8">
              <h2 className="mb-6 flex items-center gap-2 text-xl font-semibold text-white">
                <CreditCard className="text-brand-400 h-5 w-5" /> 1.
                크레딧(포인트) 충전 환불
              </h2>
              <div className="text-surface-300 space-y-4 text-sm leading-relaxed">
                <p>
                  충전한 크레딧은 구매일로부터 7일 이내에 사용하지 않은 경우
                  전액 환불이 가능합니다.
                </p>
                <ul className="list-disc space-y-2 pl-5">
                  <li>
                    <strong>전액 환불:</strong> 충전 후 크레딧을 전혀 사용하지
                    않고 7일 이내 요청 시 결제 수단 취소 방식으로 처리됩니다.
                  </li>
                  <li>
                    <strong>부분 환불:</strong> 충전한 크레딧 중 일부를 이미
                    사용한 경우, 남은 잔액에 대해 환불이 가능합니다. 단, 환불
                    시에는 결제 대행 수수료 및 운영 비용(잔액의 10% 또는 최소
                    1,000원)을 차감한 후 지급됩니다.
                  </li>
                  <li>
                    보너스로 지급된 크레딧은 환불 대상에서 제외되며, 유료
                    결제분부터 우선 소진됩니다.
                  </li>
                </ul>
              </div>
            </div>

            {/* 2. 프롬프트 구매 환불 (매우 신중해야 함) */}
            <div className="bg-brand-500/5 border-brand-500/30 relative overflow-hidden rounded-3xl border p-8">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <AlertTriangle className="text-brand-400 h-24 w-24" />
              </div>

              <h2 className="mb-6 flex items-center gap-2 text-xl font-semibold text-white">
                <AlertTriangle className="text-brand-400 h-5 w-5" /> 2. 프롬프트
                콘텐츠 구매 환불 (중요)
              </h2>
              <div className="text-surface-300 space-y-4 text-sm leading-relaxed">
                <p className="font-medium text-white">
                  프롬프트는 전자상거래법 제17조 제2항 제5호에 따른 '디지털
                  콘텐츠'로 분류됩니다. 이에 따라 다음과 같은 환불 제한 규정이
                  적용됩니다.
                </p>

                <div className="bg-surface-900/50 border-brand-500/20 space-y-4 rounded-2xl border p-6">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-red-400" />
                    <p>
                      <span className="font-bold text-red-400">환불 불가:</span>{' '}
                      구매 완료 후 프롬프트의 내용을 확인(클릭 또는 열람)하거나
                      복사한 경우, 상품의 가치가 소비자에게 전달된 것으로
                      간주하여 **어떠한 경우에도 환불이 불가능합니다.**
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="text-brand-400 mt-0.5 h-5 w-5 shrink-0" />
                    <p>
                      <span className="text-brand-400 font-bold">
                        환불 가능 예외:
                      </span>{' '}
                      구매한 파일이 손상되어 열람이 불가능하거나, 판매 페이지에
                      기재된 설명과 실제 내용이 현저히 다른 경우에 한해 고객센터
                      검토 후 환불을 진행해 드립니다.
                    </p>
                  </div>
                </div>

                <p className="text-surface-500 text-xs italic">
                  * AI 모델의 버전 업데이트로 인한 결과물 차이는 환불 사유에
                  해당하지 않습니다. 구매 전 권장 모델을 반드시 확인해 주세요.
                </p>
              </div>
            </div>

            {/* 3. 환불 절차 */}
            <div className="bg-surface-800/20 border-surface-700/50 rounded-3xl border p-8">
              <h2 className="mb-6 flex items-center gap-2 text-xl font-semibold text-white">
                <HelpCircle className="text-brand-400 h-5 w-5" /> 3. 환불 신청
                방법
              </h2>
              <div className="text-surface-300 space-y-4 text-sm">
                <p>
                  환불은 아래 정보를 포함하여 이메일로 접수해 주시면 영업일 기준
                  3~5일 이내에 처리됩니다.
                </p>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="bg-surface-800/50 border-surface-700/50 rounded-xl border p-4">
                    <p className="text-surface-500 mb-1 text-xs">접수 이메일</p>
                    <p className="font-medium">chaalsdn0217@naver.com</p>
                  </div>
                  <div className="bg-surface-800/50 border-surface-700/50 rounded-xl border p-4">
                    <p className="text-surface-500 mb-1 text-xs">
                      필수 기재 정보
                    </p>
                    <p className="text-xs font-medium">
                      계정 이메일, 주문번호, 환불 사유
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 하단 푸터성 안내 */}
          <p className="text-surface-500 mt-12 text-center text-xs">
            Prompter는 공정거래위원회 표준약관을 준수합니다. <br />
            디지털 콘텐츠의 신뢰도 높은 거래를 위해 최선을 다하겠습니다.
          </p>
        </div>
      </section>

      <Footer />
    </main>
  )
}
