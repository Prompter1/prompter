import { Navbar } from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import {
  Lock,
  Eye,
  Database,
  Share2,
  ShieldCheck,
  UserCheck,
  Cookie,
  Bell,
} from 'lucide-react'

const EFFECTIVE_DATE = '2026. 05. 13'
const CONTACT_EMAIL = 'chaalsdn0217@naver.com'

export default function PrivacyPage() {
  return (
    <main className="bg-surface-900 text-surface-50 flex min-h-screen flex-col">
      <Navbar />

      <section className="grow px-4 py-20">
        <div className="mx-auto max-w-4xl">
          <div className="mb-12">
            <div className="mb-4 flex items-center gap-3">
              <div className="bg-brand-500/20 rounded-lg p-2">
                <Lock className="text-brand-400 h-6 w-6" />
              </div>
              <h1 className="text-3xl font-bold">개인정보처리방침</h1>
            </div>
            <p className="text-surface-400">
              Prompter는 「개인정보보호법」을 준수하며 이용자의 개인정보를
              소중히 보호합니다.
            </p>
            <p className="text-surface-500 mt-2 text-xs">
              시행일: {EFFECTIVE_DATE}
            </p>
          </div>

          <div className="bg-surface-800/20 border-surface-700/50 text-surface-300 space-y-10 rounded-3xl border p-8 leading-relaxed shadow-xl md:p-12">
            {/* 1. 수집 항목 */}
            <section>
              <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold text-white">
                <Eye className="text-brand-400 h-5 w-5" /> 1. 수집하는 개인정보
                항목
              </h2>
              <p className="mb-3 text-sm">
                회사는 서비스 제공을 위해 최소한의 개인정보만을 수집합니다.
              </p>
              <div className="space-y-3 text-sm">
                <div className="bg-surface-900/40 rounded-xl p-4">
                  <p className="text-surface-200 mb-1 font-semibold">
                    회원가입 시
                  </p>
                  <p>
                    이메일 주소, 소셜 계정 고유 식별자(OAuth 제공 정보), 닉네임
                  </p>
                </div>
                <div className="bg-surface-900/40 rounded-xl p-4">
                  <p className="text-surface-200 mb-1 font-semibold">결제 시</p>
                  <p>
                    결제 수단 정보(카드사명, 마스킹된 카드번호), 거래 기록. 결제
                    정보는 PG사를 통해 처리되며 회사는 원본 카드 정보를 저장하지
                    않습니다.
                  </p>
                </div>
                <div className="bg-surface-900/40 rounded-xl p-4">
                  <p className="text-surface-200 mb-1 font-semibold">
                    판매자 등록 시
                  </p>
                  <p>
                    사업자등록번호, 상호명, 대표자명, 사업장 주소, 세금계산서
                    수신 이메일
                  </p>
                </div>
                <div className="bg-surface-900/40 rounded-xl p-4">
                  <p className="text-surface-200 mb-1 font-semibold">
                    서비스 이용 중 자동 수집
                  </p>
                  <p>
                    IP 주소, 브라우저 종류 및 버전, 접속 일시, 서비스 이용 기록,
                    쿠키
                  </p>
                </div>
              </div>
            </section>

            {/* 2. 이용 목적 */}
            <section>
              <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold text-white">
                <Database className="text-brand-400 h-5 w-5" /> 2. 개인정보의
                이용 목적
              </h2>
              <ul className="list-disc space-y-2 pl-5 text-sm">
                <li>서비스 제공 및 계약 이행 (프롬프트 구매·판매·열람)</li>
                <li>회원 관리 (본인 확인, 부정 이용 방지, 고객 문의 응대)</li>
                <li>
                  결제 처리 및 정산 (판매자 수익 집계·지급, 원천징수 신고)
                </li>
                <li>
                  법적 의무 이행 (전자상거래법, 조세특례제한법 등 관련 기록
                  보관)
                </li>
                <li>
                  서비스 개선 및 통계 분석 (집계 형태의 익명화 데이터에 한함)
                </li>
                <li>마케팅 및 광고 (별도 수신 동의를 받은 경우에 한함)</li>
              </ul>
            </section>

            {/* 3. 제3자 제공 및 위탁 */}
            <section className="bg-brand-500/5 border-brand-500/20 rounded-2xl border p-6">
              <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold text-white">
                <Share2 className="text-brand-400 h-5 w-5" /> 3. 개인정보의 제공
                및 처리 위탁
              </h2>
              <p className="mb-4 text-sm">
                회사는 원활한 서비스 제공을 위해 아래와 같이 개인정보 처리를
                외부 전문 업체에 위탁하고 있습니다. 이용자의 별도 동의 없이
                개인정보를 제3자에게 제공하지 않습니다.
              </p>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="bg-surface-800/50 border-surface-700/50 rounded-xl border p-4">
                  <p className="text-brand-400 mb-1 font-bold">
                    토스페이먼츠(주)
                  </p>
                  <p className="text-surface-400 mb-1 text-xs">
                    위탁 업무: 결제 처리 및 PG 서비스
                  </p>
                  <p className="text-surface-500 text-xs">
                    보유 기간: 거래 완료 후 5년 (전자상거래법)
                  </p>
                </div>
                <div className="bg-surface-800/50 border-surface-700/50 rounded-xl border p-4">
                  <p className="text-brand-400 mb-1 font-bold">Supabase Inc.</p>
                  <p className="text-surface-400 mb-1 text-xs">
                    위탁 업무: 데이터베이스 저장 및 회원 인증
                  </p>
                  <p className="text-surface-500 text-xs">
                    보유 기간: 회원 탈퇴 후 즉시 파기
                  </p>
                </div>
              </div>
              <p className="text-surface-500 mt-4 text-xs">
                * 법령에 의한 경우(세무조사, 수사기관의 적법한 요청 등)에는 관련
                법령에 따라 제공할 수 있습니다.
              </p>
            </section>

            {/* 4. 보유 및 파기 */}
            <section>
              <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold text-white">
                <ShieldCheck className="text-brand-400 h-5 w-5" /> 4. 개인정보의
                보유 및 파기
              </h2>
              <p className="mb-3 text-sm">
                회사는 회원 탈퇴 시 개인정보를 지체 없이 파기합니다. 단, 관계
                법령에 따라 보존이 필요한 경우 아래 기간 동안 보관합니다.
              </p>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-surface-700/50 border-b text-left">
                      <th className="text-surface-400 py-2 pr-4 font-medium">
                        보존 항목
                      </th>
                      <th className="text-surface-400 py-2 pr-4 font-medium">
                        근거 법령
                      </th>
                      <th className="text-surface-400 py-2 font-medium">
                        보존 기간
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-surface-700/30 divide-y text-xs">
                    <tr>
                      <td className="py-2 pr-4">계약·청약철회 기록</td>
                      <td className="py-2 pr-4">전자상거래법</td>
                      <td className="py-2">5년</td>
                    </tr>
                    <tr>
                      <td className="py-2 pr-4">대금결제·공급 기록</td>
                      <td className="py-2 pr-4">전자상거래법</td>
                      <td className="py-2">5년</td>
                    </tr>
                    <tr>
                      <td className="py-2 pr-4">소비자 불만·분쟁 기록</td>
                      <td className="py-2 pr-4">전자상거래법</td>
                      <td className="py-2">3년</td>
                    </tr>
                    <tr>
                      <td className="py-2 pr-4">세금계산서 등 세무 기록</td>
                      <td className="py-2 pr-4">국세기본법</td>
                      <td className="py-2">5년</td>
                    </tr>
                    <tr>
                      <td className="py-2 pr-4">접속 로그 기록</td>
                      <td className="py-2 pr-4">통신비밀보호법</td>
                      <td className="py-2">3개월</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            {/* 5. 쿠키 */}
            <section>
              <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold text-white">
                <Cookie className="text-brand-400 h-5 w-5" /> 5. 쿠키(Cookie)
                운영
              </h2>
              <ul className="list-disc space-y-2 pl-5 text-sm">
                <li>
                  회사는 로그인 세션 유지, 서비스 이용 편의 제공 등을 위해
                  쿠키를 사용합니다. 쿠키는 브라우저 종료 시 삭제되는 세션
                  쿠키와 일정 기간 보관되는 영구 쿠키로 구분됩니다.
                </li>
                <li>
                  이용자는 브라우저 설정을 통해 쿠키 수신을 거부할 수 있습니다.
                  다만, 쿠키를 비활성화하면 로그인 등 일부 서비스 기능이 제한될
                  수 있습니다.
                </li>
                <li>
                  회사는 인증(Supabase Auth)을 위한 필수 쿠키 외에 마케팅 목적의
                  추적 쿠키는 별도 동의 없이 사용하지 않습니다.
                </li>
              </ul>
            </section>

            {/* 6. 정보주체의 권리 */}
            <section>
              <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold text-white">
                <UserCheck className="text-brand-400 h-5 w-5" /> 6. 정보주체의
                권리
              </h2>
              <p className="mb-3 text-sm">
                이용자는 언제든지 아래 권리를 행사할 수 있습니다.
              </p>
              <ul className="list-disc space-y-2 pl-5 text-sm">
                <li>
                  <strong className="text-surface-200">열람권:</strong> 자신의
                  개인정보 처리 현황을 확인할 수 있습니다.
                </li>
                <li>
                  <strong className="text-surface-200">정정·삭제권:</strong>{' '}
                  잘못된 정보의 정정 또는 삭제를 요청할 수 있습니다. (단, 법령상
                  보존 의무가 있는 정보는 즉시 삭제가 불가할 수 있습니다.)
                </li>
                <li>
                  <strong className="text-surface-200">처리 정지권:</strong>{' '}
                  개인정보 처리의 정지를 요청할 수 있습니다.
                </li>
                <li>
                  <strong className="text-surface-200">동의 철회권:</strong>{' '}
                  회원 탈퇴를 통해 수집·이용 동의를 철회할 수 있습니다.
                </li>
                <li>
                  권리 행사는 고객센터({CONTACT_EMAIL}) 또는 서비스 내 계정
                  설정을 통해 가능합니다. 요청 후 10일 이내에 처리됩니다.
                </li>
              </ul>
            </section>

            {/* 7. 개인정보 침해 대응 */}
            <section>
              <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold text-white">
                <Bell className="text-brand-400 h-5 w-5" /> 7. 개인정보 침해 시
                대응
              </h2>
              <ul className="list-disc space-y-2 pl-5 text-sm">
                <li>
                  개인정보 침해 사고 발생 시, 회사는 「개인정보보호법」 제34조에
                  따라 지체 없이 해당 이용자에게 피해 사실 및 조치 내용을
                  통지합니다.
                </li>
                <li>
                  72시간 이내 개인정보보호위원회에 침해 사실을 신고합니다.
                </li>
                <li>
                  개인정보 침해 관련 신고·상담은 아래 기관을 이용하실 수
                  있습니다.
                  <ul className="text-surface-400 mt-2 list-none space-y-1 pl-0 text-xs">
                    <li>• 개인정보보호위원회: privacy.go.kr / 국번없이 182</li>
                    <li>
                      • 한국인터넷진흥원 개인정보침해신고센터:
                      privacy.kisa.or.kr / 국번없이 118
                    </li>
                    <li>• 대검찰청 사이버수사과: 국번없이 1301</li>
                  </ul>
                </li>
              </ul>
            </section>

            {/* 8. 개인정보보호책임자 */}
            <section className="bg-surface-900/50 rounded-2xl p-6">
              <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold text-white">
                <ShieldCheck className="text-brand-400 h-5 w-5" /> 8.
                개인정보보호책임자
              </h2>
              <p className="mb-3 text-sm">
                회사는 개인정보 처리에 관한 업무를 총괄하는 개인정보보호책임자를
                다음과 같이 지정하고 있습니다.
              </p>
              <div className="space-y-1 text-sm">
                <p>
                  <strong className="text-surface-200">성명:</strong> 차민우
                </p>
                <p>
                  <strong className="text-surface-200">직책:</strong> 대표
                </p>
                <p>
                  <strong className="text-surface-200">이메일:</strong>{' '}
                  {CONTACT_EMAIL}
                </p>
                <p>
                  <strong className="text-surface-200">처리 기간:</strong> 문의
                  접수 후 10일 이내
                </p>
              </div>
            </section>
          </div>

          <div className="text-surface-400 mt-12 text-center text-sm">
            <p>본 방침은 {EFFECTIVE_DATE}부터 적용됩니다.</p>
            <p className="text-surface-500 mt-1 text-xs">
              방침 변경 시 변경 7일 전 서비스 내 공지합니다.
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
