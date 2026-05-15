import { Navbar } from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { Scale, ShieldCheck, FileText, AlertCircle } from 'lucide-react'

export default function TermsPage() {
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
                <Scale className="text-brand-400 h-6 w-6" />
              </div>
              <h1 className="text-3xl font-bold">이용약관</h1>
            </div>
            <p className="text-surface-400">
              Prompter 서비스 이용을 위해 필요한 권리와 의무 관계를
              안내드립니다.
            </p>
            <p className="text-surface-500 mt-2 text-xs">
              최종 수정일: {lastUpdated}
            </p>
          </div>

          {/* 약관 본문 */}
          <div className="bg-surface-800/20 border-surface-700/50 text-surface-300 space-y-10 rounded-3xl border p-8 leading-relaxed shadow-xl md:p-12">
            {/* 제 1조 */}
            <section>
              <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold text-white">
                <FileText className="text-brand-400 h-5 w-5" /> 제 1조 (목적)
              </h2>
              <p>
                본 약관은 'Prompter'(이하 "회사")가 제공하는 인공지능 프롬프트
                거래 및 관련 서비스(이하 "서비스")를 이용함에 있어 회사와
                이용자의 권리, 의무 및 책임사항을 규정함을 목적으로 합니다.
              </p>
            </section>

            {/* 제 2조 */}
            <section>
              <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold text-white">
                <ShieldCheck className="text-brand-400 h-5 w-5" /> 제 2조
                (서비스의 내용 및 디지털 콘텐츠)
              </h2>
              <p>
                1. 회사는 이용자 간에 프롬프트를 거래할 수 있는 플랫폼을
                제공합니다.
                <br />
                2. "프롬프트"란 인공지능 모델로부터 특정 결과를 도출하기 위해
                작성된 명령어 세트를 의미하며, 이는 전자상거래법상 '디지털
                콘텐츠'에 해당합니다.
              </p>
            </section>

            {/* 제 3조 (핵심: 환불 규정) */}
            <section className="bg-brand-500/5 border-brand-500/20 rounded-2xl border p-6">
              <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold text-white">
                <AlertCircle className="text-brand-400 h-5 w-5" /> 제 3조
                (청약철회 및 환불 제한)
              </h2>
              <div className="space-y-2">
                <p className="text-surface-200 font-medium">
                  ※ 본 서비스에서 거래되는 상품은 디지털 콘텐츠의 특성상 다음과
                  같은 규정이 적용됩니다.
                </p>
                <p>
                  1. 이용자가 구매한 프롬프트의 내용을 **열람하거나 복사한
                  경우**, 전자상거래법 제17조 제2항 제5호(소비자의 사용 또는
                  일부 소비로 가치가 현저히 감소한 경우)에 의거하여
                  **청약철회(환불)가 불가능합니다.**
                </p>
                <p>
                  2. 단, 구매 후 콘텐츠를 전혀 열람하지 않은 상태에서 7일 이내에
                  요청 시에는 내부 검토 후 환불이 가능할 수 있습니다.
                </p>
              </div>
            </section>

            {/* 제 4조 (저작권) */}
            <section>
              <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold text-white">
                <FileText className="text-brand-400 h-5 w-5" /> 제 4조
                (지식재산권 및 사용 범위)
              </h2>
              <p>
                1. 판매된 프롬프트의 저작권은 원저작자(판매자)에게 있습니다.
                <br />
                2. 구매자는 구매한 프롬프트를 인공지능 서비스에 입력하여
                결과물을 생성하는 목적으로 **비독점적 사용권**을 부여받습니다.
                <br />
                3. 구매한 프롬프트 자체를 **타인에게 재판매, 무단 배포, 공유하는
                행위는 엄격히 금지**되며, 이를 위반할 경우 저작권법에 따른
                책임을 물을 수 있습니다.
              </p>
            </section>

            {/* 제 5조 (책임 제한) */}
            <section>
              <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold text-white">
                <FileText className="text-brand-400 h-5 w-5" /> 제 5조
                (면책조항)
              </h2>
              <p>
                1. 회사는 이용자 간의 거래를 중개하는 플랫폼으로서, 판매자가
                등록한 프롬프트의 내용이나 성능의 완결성을 보장하지 않습니다.
                <br />
                2. 인공지능 모델의 업데이트나 정책 변화로 인해 구매한 프롬프트의
                결과가 변동될 수 있으며, 이로 인한 손실에 대해 회사는 책임을
                지지 않습니다.
              </p>
            </section>
          </div>

          {/* 하단 문의 안내 */}
          <div className="text-surface-400 mt-12 text-center text-sm">
            <p>
              본 약관에 대해 궁금한 점이 있으시면 고객센터로 문의해 주시기
              바랍니다.
            </p>
            <p className="text-surface-200 mt-2">
              문의처: chaalsdn0217@naver.com
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
