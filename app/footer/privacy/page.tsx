import { Navbar } from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { Lock, Eye, Database, Share2, ShieldCheck } from 'lucide-react'

export default function PrivacyPage() {
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
                <Lock className="text-brand-400 h-6 w-6" />
              </div>
              <h1 className="text-3xl font-bold">개인정보처리방침</h1>
            </div>
            <p className="text-surface-400">
              Prompter는 사용자의 개인정보를 소중히 여기며, 안전하게 보호하기
              위해 최선을 다하고 있습니다.
            </p>
            <p className="text-surface-500 mt-2 text-xs">
              최종 수정일: {lastUpdated}
            </p>
          </div>

          {/* 본문 콘텐츠 */}
          <div className="bg-surface-800/20 border-surface-700/50 text-surface-300 space-y-10 rounded-3xl border p-8 leading-relaxed shadow-xl md:p-12">
            {/* 1. 수집 항목 */}
            <section>
              <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold text-white">
                <Eye className="text-brand-400 h-5 w-5" /> 1. 수집하는 개인정보
                항목
              </h2>
              <p className="mb-2">
                회사는 서비스 제공을 위해 아래와 같은 최소한의 개인정보를
                수집합니다.
              </p>
              <ul className="list-disc space-y-1 pl-5 text-sm">
                <li>회원가입 시: 이메일 주소, 소셜 계정 정보(OAuth 제공 시)</li>
                <li>
                  결제 시: 결제 수단 정보, 거래 기록 (결제는 PG사를 통해
                  안전하게 처리됩니다)
                </li>
                <li>
                  서비스 이용 과정: IP 주소, 쿠키, 서비스 이용 기록, 접속 로그
                </li>
              </ul>
            </section>

            {/* 2. 이용 목적 */}
            <section>
              <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold text-white">
                <Database className="text-brand-400 h-5 w-5" /> 2. 개인정보의
                이용 목적
              </h2>
              <ul className="list-disc space-y-1 pl-5 text-sm">
                <li>서비스 제공 및 계약 이행 (프롬프트 구매 및 관리)</li>
                <li>회원 관리 (본인 확인, 고객 문의 응대)</li>
                <li>결제 서비스 제공 및 포인트(크레딧) 정산</li>
                <li>신규 서비스 개발 및 마케팅(수신 동의 시)</li>
              </ul>
            </section>

            {/* 3. 제3자 제공 및 위탁 (중요: 토스/수파베이스 관련) */}
            <section className="bg-brand-500/5 border-brand-500/20 rounded-2xl border p-6">
              <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold text-white">
                <Share2 className="text-brand-400 h-5 w-5" /> 3. 개인정보의 제공
                및 위탁
              </h2>
              <p className="mb-4 text-sm">
                회사는 원활한 서비스 제공을 위해 아래와 같이 외부 전문 업체에
                운영을 위탁하고 있습니다.
              </p>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="bg-surface-800/50 border-surface-700/50 rounded-xl border p-4">
                  <p className="text-brand-400 mb-1 font-bold">
                    토스페이먼츠(주)
                  </p>
                  <p className="text-surface-400 text-xs">
                    위탁 업무: 결제 처리 및 본인 인증
                  </p>
                </div>
                <div className="bg-surface-800/50 border-surface-700/50 rounded-xl border p-4">
                  <p className="text-brand-400 mb-1 font-bold">
                    Supabase (Inc.)
                  </p>
                  <p className="text-surface-400 text-xs">
                    위탁 업무: 데이터 저장 및 회원 인증 시스템 관리
                  </p>
                </div>
              </div>
            </section>

            {/* 4. 보유 및 파기 */}
            <section>
              <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold text-white">
                <ShieldCheck className="text-brand-400 h-5 w-5" /> 4. 개인정보의
                보유 및 파기
              </h2>
              <p className="text-sm">
                회사는 회원 탈퇴 시 수집된 개인정보를 지체 없이 파기합니다. 단,
                관계 법령(전자상거래법 등)에 따라 보존할 필요가 있는 경우 아래와
                같이 일정 기간 보관합니다.
              </p>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm">
                <li>계약 또는 청약철회 등에 관한 기록: 5년</li>
                <li>대금결제 및 재화 등의 공급에 관한 기록: 5년</li>
                <li>소비자의 불만 또는 분쟁처리에 관한 기록: 3년</li>
              </ul>
            </section>

            {/* 5. 사용자의 권리 */}
            <section>
              <h2 className="mb-4 text-xl font-semibold text-white">
                5. 정보주체의 권리 및 의무
              </h2>
              <p className="text-surface-400 text-sm">
                사용자는 언제든지 자신의 개인정보를 조회하거나 수정할 수 있으며,
                회원 탈퇴를 통해 개인정보 이용에 대한 동의를 철회할 수 있습니다.
                관련 문의는 고객센터를 통해 처리 가능합니다.
              </p>
            </section>
          </div>

          {/* 하단 안내 */}
          <div className="text-surface-400 mt-12 text-center text-sm">
            <p className="mt-2">본 방침은 {lastUpdated}부터 적용됩니다.</p>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
