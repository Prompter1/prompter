import { Navbar } from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import {
  Truck,
  Copy,
  History,
  MonitorSmartphone,
  AlertCircle,
} from 'lucide-react'

export default function DeliveryPage() {
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
                <Truck className="text-brand-400 h-6 w-6" />
              </div>
              <h1 className="text-3xl font-bold">디지털 상품 제공 방식 안내</h1>
            </div>
            <p className="text-surface-400">
              Prompter의 모든 상품은 실물 배송이 없는 온라인 전용 디지털
              콘텐츠입니다.
            </p>
            <p className="text-surface-500 mt-2 text-xs">
              최종 수정일: {lastUpdated}
            </p>
          </div>

          <div className="text-surface-300 space-y-8 text-sm leading-relaxed">
            {/* 1. 제공 방식 요약 */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="bg-surface-800/30 border-surface-700/50 flex gap-4 rounded-2xl border p-6">
                <div className="bg-brand-500/10 h-fit rounded-xl p-3">
                  <MonitorSmartphone className="text-brand-400 h-5 w-5" />
                </div>
                <div>
                  <h3 className="mb-1 font-bold text-white">
                    실시간 즉시 전송
                  </h3>
                  <p className="text-surface-400 text-xs">
                    크레딧 결제가 완료되는 즉시 대기 시간 없이 시스템 상에서
                    상품 배송(다운로드 뷰어 오픈)이 완료됩니다.
                  </p>
                </div>
              </div>

              <div className="bg-surface-800/30 border-surface-700/50 flex gap-4 rounded-2xl border p-6">
                <div className="bg-brand-500/10 h-fit rounded-xl p-3">
                  <History className="text-brand-400 h-5 w-5" />
                </div>
                <div>
                  <h3 className="mb-1 font-bold text-white">
                    평생 무제한 열람
                  </h3>
                  <p className="text-surface-400 text-xs">
                    한 번 구매한 프롬프트는 플랫폼이 서비스되는 한 구매 내역에서
                    언제든지 다시 확인하고 이용하실 수 있습니다.
                  </p>
                </div>
              </div>
            </div>

            {/* 2. 구체적인 이용 프로세스 */}
            <div className="bg-surface-800/20 border-surface-700/50 rounded-3xl border p-8">
              <h2 className="mb-6 text-xl font-semibold text-white">
                📥 프롬프트 이용 프로세스
              </h2>
              <div className="before:bg-surface-700 relative space-y-6 before:absolute before:top-2 before:bottom-2 before:left-3.5 before:w-0.5">
                <div className="relative flex gap-4">
                  <div className="bg-brand-500 z-10 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white">
                    1
                  </div>
                  <div>
                    <h4 className="font-semibold text-white">
                      프롬프트 선택 후 충전된 크레딧으로 결제
                    </h4>
                    <p className="text-surface-400 mt-0.5 text-xs">
                      상세 페이지에서 구동 모델을 확인한 뒤 결제 버튼을
                      누릅니다.
                    </p>
                  </div>
                </div>

                <div className="relative flex gap-4">
                  <div className="bg-brand-500 z-10 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white">
                    2
                  </div>
                  <div>
                    <h4 className="font-semibold text-white">
                      마이페이지 ➔ 구매 내역으로 이동
                    </h4>
                    <p className="text-surface-400 mt-0.5 text-xs">
                      상단 프로필 메뉴를 클릭하여 구매 내역 탭으로 들어갑니다.
                    </p>
                  </div>
                </div>

                <div className="relative flex gap-4">
                  <div className="bg-brand-500 z-10 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white">
                    3
                  </div>
                  <div>
                    <h4 className="font-semibold text-white">
                      프롬프트 텍스트 복사 및 원클릭 복사 기능 활용
                    </h4>
                    <p className="text-surface-400 mt-0.5 text-xs">
                      오픈된 프롬프트 영역에서 [복사하기] 버튼을 눌러 클립보드에
                      저장합니다.
                    </p>
                  </div>
                </div>

                <div className="relative flex gap-4">
                  <div className="bg-brand-500 z-10 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white">
                    4
                  </div>
                  <div>
                    <h4 className="font-semibold text-white">
                      해당 AI 툴(ChatGPT 등)에 붙여넣어 실행
                    </h4>
                    <p className="text-surface-400 mt-0.5 text-xs">
                      복사한 명령어를 대상 AI 시스템에 입력하여 원하는 퀄리티의
                      결과물을 도출합니다.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* 3. 주의사항 */}
            <div className="bg-brand-500/5 border-brand-500/20 flex gap-4 rounded-3xl border p-8">
              <AlertCircle className="text-brand-400 mt-0.5 h-6 w-6 shrink-0" />
              <div>
                <h2 className="mb-2 text-lg font-semibold text-white">
                  유의사항 (배송 의무 면책)
                </h2>
                <p className="text-surface-400 text-xs leading-relaxed">
                  디지털 콘텐츠는 별도의 오프라인 실물 배송이 진행되지 않으므로,
                  송장 번호 추적이나 택배사 연락처가 제공되지 않습니다. 결제 후
                  마이페이지에서 상품이 보이지 않거나 시스템 오류가 발생한 경우,
                  네트워크 연결 상태를 확인하신 후 고객센터(
                  <span className="text-brand-400">chaalsdn0217@naver.com</span>
                  )로 접수해 주시면 실시간으로 조치해 드립니다.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
