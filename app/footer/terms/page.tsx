import { Navbar } from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import {
  Scale,
  ShieldCheck,
  FileText,
  AlertCircle,
  Users,
  RefreshCw,
  Gavel,
} from 'lucide-react'

const EFFECTIVE_DATE = '2026. 05. 13'
const CONTACT_EMAIL = 'chaalsdn0217@naver.com'

export default function TermsPage() {
  return (
    <main className="bg-surface-900 text-surface-50 flex min-h-screen flex-col">
      <Navbar />

      <section className="grow px-4 py-20">
        <div className="mx-auto max-w-4xl">
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
              시행일: {EFFECTIVE_DATE}
            </p>
          </div>

          <div className="bg-surface-800/20 border-surface-700/50 text-surface-300 space-y-10 rounded-3xl border p-8 leading-relaxed shadow-xl md:p-12">
            {/* 제1조 */}
            <section>
              <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold text-white">
                <FileText className="text-brand-400 h-5 w-5" /> 제1조 (목적)
              </h2>
              <p>
                본 약관은 'Prompter'(이하 "회사")가 제공하는 인공지능 프롬프트
                거래 및 관련 서비스(이하 "서비스")를 이용함에 있어 회사와
                이용자의 권리, 의무 및 책임사항을 규정함을 목적으로 합니다.
              </p>
            </section>

            {/* 제2조 */}
            <section>
              <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold text-white">
                <FileText className="text-brand-400 h-5 w-5" /> 제2조 (정의)
              </h2>
              <ul className="list-disc space-y-2 pl-5 text-sm">
                <li>
                  <strong className="text-surface-200">"서비스"</strong>란
                  회사가 제공하는 인공지능 프롬프트 거래 플랫폼 및 부속 서비스
                  일체를 의미합니다.
                </li>
                <li>
                  <strong className="text-surface-200">"프롬프트"</strong>란
                  인공지능 모델로부터 특정 결과를 도출하기 위해 작성된 명령어
                  세트로, 전자상거래법상 '디지털 콘텐츠'에 해당합니다.
                </li>
                <li>
                  <strong className="text-surface-200">"이용자"</strong>란 본
                  약관에 따라 서비스를 이용하는 모든 회원 및 비회원을 말합니다.
                </li>
                <li>
                  <strong className="text-surface-200">"판매자"</strong>란
                  서비스를 통해 프롬프트를 등록·판매하는 회원을 말합니다.
                </li>
                <li>
                  <strong className="text-surface-200">"구매자"</strong>란
                  서비스를 통해 프롬프트를 구매하는 회원을 말합니다.
                </li>
              </ul>
            </section>

            {/* 제3조 */}
            <section>
              <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold text-white">
                <RefreshCw className="text-brand-400 h-5 w-5" /> 제3조 (약관의
                게시 및 개정)
              </h2>
              <ul className="list-disc space-y-2 pl-5 text-sm">
                <li>회사는 본 약관을 서비스 초기 화면 하단에 게시합니다.</li>
                <li>
                  회사는 「약관의 규제에 관한 법률」 및 관련 법령을 위배하지
                  않는 범위 내에서 약관을 개정할 수 있습니다.
                </li>
                <li>
                  약관을 개정할 경우, 회사는 적용일 및 개정 사유를 명시하여
                  시행일로부터 최소 7일 전(이용자에게 불리하거나 중요한 변경의
                  경우 30일 전)에 서비스 내 공지합니다.
                </li>
                <li>
                  이용자가 개정 약관의 적용일 이후에도 서비스를 계속 이용할
                  경우, 개정 약관에 동의한 것으로 간주합니다.
                </li>
              </ul>
            </section>

            {/* 제4조 */}
            <section>
              <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold text-white">
                <Users className="text-brand-400 h-5 w-5" /> 제4조 (회원 가입 및
                탈퇴)
              </h2>
              <ul className="list-disc space-y-2 pl-5 text-sm">
                <li>
                  이용자는 소셜 계정(Google, Kakao 등 OAuth 수단)을 통해
                  회원으로 가입할 수 있으며, 가입 시 본 약관에 동의한 것으로
                  간주합니다.
                </li>
                <li>
                  회원은 언제든지 서비스 내 계정 설정을 통해 탈퇴를 신청할 수
                  있습니다.
                </li>
                <li>
                  탈퇴 시 미정산 수익이 있는 경우, 해당 정산이 완료된 이후 탈퇴
                  처리가 완료됩니다.
                </li>
                <li>
                  회사는 다음 각 호에 해당하는 경우 회원 자격을 제한하거나
                  박탈할 수 있습니다: ①타인의 정보 도용, ②서비스 운영 방해, ③본
                  약관 위반, ④기타 불법·부정한 행위.
                </li>
              </ul>
            </section>

            {/* 제5조 */}
            <section>
              <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold text-white">
                <FileText className="text-brand-400 h-5 w-5" /> 제5조 (서비스의
                제공 및 변경)
              </h2>
              <ul className="list-disc space-y-2 pl-5 text-sm">
                <li>
                  회사는 이용자 간 프롬프트 거래를 위한 플랫폼을 제공하며,
                  연중무휴 24시간 서비스 제공을 원칙으로 합니다.
                </li>
                <li>
                  회사는 서비스 내용을 변경할 수 있으며, 중요한 변경 사항은
                  사전에 공지합니다.
                </li>
                <li>
                  시스템 점검, 서버 장애, 천재지변 등 불가피한 사유로 서비스가
                  일시 중단될 수 있으며, 이 경우 사전 또는 사후에 이를
                  공지합니다.
                </li>
                <li>
                  회사는 경영상 또는 기술상의 필요에 의해 서비스를 종료할 수
                  있으며, 이 경우 30일 전에 서비스 내에 공지합니다.
                </li>
              </ul>
            </section>

            {/* 제5조의2 */}
            <section>
              <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold text-white">
                <ShieldCheck className="text-brand-400 h-5 w-5" /> 제5조의2
                (유료 콘텐츠 인증)
              </h2>
              <ul className="list-disc space-y-2 pl-5 text-sm">
                <li>
                  판매자가 유료(가격 1원 이상) 프롬프트를 등록하면 해당 게시물은
                  자동으로 "인증 대기" 상태로 전환되며, 관리자 승인 전까지 구매
                  버튼이 비활성화됩니다.
                </li>
                <li>
                  회사는 등록된 유료 콘텐츠가 서비스 정책 및 관련 법령에
                  부합하는지 검토하며, 영업일 기준 3일 이내에 승인 또는 반려
                  결정을 내립니다.
                </li>
                <li>
                  반려 결정 시 회사는 판매자의 등록 이메일로 반려 사유를
                  통보하고 해당 게시물을 삭제합니다. 판매자는 사유를 수정한 후
                  재등록할 수 있습니다.
                </li>
                <li>
                  무료(가격 0원) 프롬프트는 별도 검수 절차 없이 등록 즉시
                  공개됩니다. 단, 금지 행위에 해당하는 경우 언제든지 삭제 조치될
                  수 있습니다.
                </li>
              </ul>
            </section>

            {/* 제6조 */}
            <section className="bg-brand-500/5 border-brand-500/20 rounded-2xl border p-6">
              <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold text-white">
                <AlertCircle className="text-brand-400 h-5 w-5" /> 제6조
                (청약철회 및 환불 제한)
              </h2>
              <p className="text-surface-200 mb-3 font-medium">
                본 서비스의 디지털 콘텐츠에는 다음 환불 규정이 적용됩니다.
              </p>
              <ul className="list-disc space-y-2 pl-5 text-sm">
                <li>
                  구매자가 프롬프트 내용을 열람하거나 복사한 경우, 「전자상거래
                  등에서의 소비자보호에 관한 법률」 제17조 제2항 제5호에 따라
                  청약철회(환불)가 불가능합니다.
                </li>
                <li>
                  구매 후 내용을 전혀 열람하지 않은 상태에서 7일 이내에 환불을
                  요청하는 경우, 회사는 내부 검토 후 환불 여부를 결정합니다.
                </li>
                <li>
                  판매 페이지의 설명과 실제 콘텐츠가 현저히 상이하거나 콘텐츠에
                  결함이 있는 경우, 증빙 제출 후 검토를 통해 환불이 가능합니다.
                  (검증된 게시물 한정)
                </li>
                <li>
                  AI 모델의 버전 업데이트로 인한 결과물 품질 저하는 환불 사유에
                  해당하지 않습니다.
                </li>
              </ul>
            </section>

            {/* 제7조 */}
            <section>
              <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold text-white">
                <ShieldCheck className="text-brand-400 h-5 w-5" /> 제7조
                (지식재산권 및 사용 범위)
              </h2>
              <ul className="list-disc space-y-2 pl-5 text-sm">
                <li>
                  판매된 프롬프트의 저작권은 원저작자(판매자)에게 있습니다.
                </li>
                <li>
                  구매자는 구매한 프롬프트를 AI 서비스에 입력하여 결과물을
                  생성하는 용도로{' '}
                  <strong className="text-surface-200">
                    비독점적·비양도적 사용권
                  </strong>
                  을 부여받습니다.
                </li>
                <li>
                  구매한 프롬프트 자체를 제3자에게 재판매, 무단 배포, 공유하는
                  행위는 엄격히 금지되며, 위반 시 저작권법에 따른 민·형사상
                  책임을 질 수 있습니다.
                </li>
                <li>
                  서비스 내 회사 로고, UI, 텍스트 등 콘텐츠의 저작권은 회사에
                  귀속됩니다.
                </li>
              </ul>
            </section>

            {/* 제8조 */}
            <section>
              <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold text-white">
                <FileText className="text-brand-400 h-5 w-5" /> 제8조 (면책조항
                및 손해배상)
              </h2>
              <ul className="list-disc space-y-2 pl-5 text-sm">
                <li>
                  회사는 이용자 간 거래를 중개하는 플랫폼으로서, 판매자가 등록한
                  검증받지 않은 프롬프트의 내용·성능·완결성을 보장하지 않습니다.
                </li>
                <li>
                  검증된 프롬프트라도, AI 모델의 업데이트 또는 정책 변화로 인한
                  프롬프트 결과 변동에 대해 회사는 책임을 지지 않습니다.
                </li>
                <li>
                  회사의 고의 또는 중과실로 이용자에게 손해가 발생한 경우,
                  회사는 관련 법령이 정하는 범위 내에서 손해를 배상합니다.
                </li>
                <li>
                  이용자가 본 약관을 위반하여 회사에 손해를 끼친 경우, 해당
                  이용자는 회사에 발생한 모든 손해를 배상해야 합니다.
                </li>
              </ul>
            </section>

            {/* 제9조 */}
            <section>
              <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold text-white">
                <Gavel className="text-brand-400 h-5 w-5" /> 제9조 (분쟁 해결 및
                준거법)
              </h2>
              <ul className="list-disc space-y-2 pl-5 text-sm">
                <li>
                  서비스 이용과 관련한 분쟁이 발생한 경우, 회사와 이용자는 상호
                  협의하여 해결하는 것을 원칙으로 합니다.
                </li>
                <li>
                  협의로 해결되지 않는 경우, 「소비자기본법」에 따른 소비자분쟁
                  해결 기준에 따릅니다.
                </li>
                <li>
                  본 약관 및 서비스 이용과 관련된 분쟁에 관한 소송은
                  <strong className="text-surface-200"> 대한민국 법률</strong>을
                  준거법으로 하며, 관할 법원은 민사소송법상 관할 법원으로
                  합니다.
                </li>
              </ul>
            </section>
          </div>

          <div className="text-surface-400 mt-12 text-center text-sm">
            <p>본 약관에 관한 문의는 아래 고객센터로 연락 주시기 바랍니다.</p>
            <p className="text-surface-200 mt-2">{CONTACT_EMAIL}</p>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
