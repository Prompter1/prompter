import { Navbar } from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { Award, Percent, ShieldAlert, CheckCircle } from 'lucide-react'

export default function SellerPolicyPage() {
  const lastUpdated = '2026. 05. 13'

  return (
    <main className="bg-surface-900 text-surface-50 flex min-h-screen flex-col">
      <Navbar />

      <section className="grow px-4 py-20">
        <div className="mx-auto max-w-4xl">
          {/* 헤더 */}
          <div className="mb-12">
            <div className="mb-4 flex items-center gap-3">
              <div className="bg-brand-500/20 rounded-lg p-2">
                <Award className="text-brand-400 h-6 w-6" />
              </div>
              <h1 className="text-3xl font-bold">판매자 가이드라인 및 정책</h1>
            </div>
            <p className="text-surface-400">
              Prompter에서 크리에이터로 활동하며 수익을 창출하기 위한 핵심
              규정입니다.
            </p>
            <p className="text-surface-500 mt-2 text-xs">
              최종 수정일: {lastUpdated}
            </p>
          </div>

          <div className="text-surface-300 space-y-8 text-sm leading-relaxed">
            {/* 1. 판매자 자격 및 등록 */}
            <div className="bg-surface-800/20 border-surface-700/50 rounded-3xl border p-8">
              <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold text-white">
                <CheckCircle className="text-brand-400 h-5 w-5" /> 1. 판매자
                자격 및 상품 등록
              </h2>
              <ul className="list-disc space-y-2 pl-5">
                <li>
                  Prompter의 회원이라면 누구나 판매자 신청을 통해 크리에이터로
                  활동할 수 있습니다.
                </li>
                <li>
                  등록하는 모든 프롬프트는 본인이 직접 창작하거나 정당한 권리를
                  보유한 것이어야 하며, 타인의 프롬프트를 무단 도용하여 등록할
                  경우 즉시 판매 중지 및 계정 차단 조치가 취해집니다.
                </li>
                <li>
                  상품 설명에는 해당 프롬프트가 구동되는 **권장 AI 모델(예:
                  GPT-4o, Claude 3.5 등)과 최적의 설정값**을 명확히 기재해야
                  합니다.
                </li>
              </ul>
            </div>

            {/* 2. 정산 및 수수료 (가장 중요한 부분) */}
            <div className="bg-brand-500/5 border-brand-500/20 rounded-3xl border p-8">
              <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold text-white">
                <Percent className="text-brand-400 h-5 w-5" /> 2. 수익 정산 및
                중개 수수료
              </h2>
              <p className="mb-3">
                Prompter는 투명하고 합리적인 정산 시스템을 지향합니다.
              </p>
              <div className="bg-surface-900/60 border-surface-700/50 mb-4 rounded-2xl border p-5">
                <div className="border-surface-700/50 mb-3 flex items-center justify-between border-b pb-3">
                  <span className="text-surface-200 font-medium">
                    기본 플랫폼 중개 수수료
                  </span>
                  <span className="text-brand-400 text-lg font-bold">
                    결제 금액의 10%
                  </span>
                </div>
                <p className="text-surface-400 text-xs">
                  * 수수료에는 결제 대행사(PG) 수수료, 서버 인프라 유지비,
                  플랫폼 운영비가 모두 포함되어 있습니다.
                </p>
              </div>
              <ul className="list-disc space-y-1 pl-5">
                <li>
                  <strong>정산 주기:</strong> 매월 1일부터 말일까지의 구매
                  확정된 수익을 정산하여 익월 10일에 지정하신 계좌로 일괄
                  지급됩니다.
                </li>
                <li>
                  정산 시 법정 세금(개인의 경우 사업소득세 3.3% 등)이 원천징수된
                  후 지급될 수 있습니다.
                </li>
              </ul>
            </div>

            {/* 3. 금지 행위 및 제재 */}
            <div className="bg-surface-800/20 border-surface-700/50 rounded-3xl border p-8">
              <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold text-white">
                <ShieldAlert className="h-5 w-5 text-red-400" /> 3. 금지 행위 및
                커뮤니티 보호
              </h2>
              <p className="mb-2">
                안전한 생태계를 위해 아래 행위는 엄격히 금지되며, 위반 시 정산
                대금 지급 보류 및 법적 책임이 따를 수 있습니다.
              </p>
              <ul className="list-disc space-y-2 pl-5 text-red-200/80">
                <li>
                  욕설, 비방, 음란성, 범죄 유도 목적 등 사회 미풍양속을 해치는
                  프롬프트 등록
                </li>
                <li>
                  구매자를 외부 직거래로 유도하는 행위 (연락처, 개인 결제 링크
                  기재 등)
                </li>
                <li>
                  동일하거나 유사한 프롬프트를 가격만 바꾸어 중복 등록하는 도배
                  행위
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
