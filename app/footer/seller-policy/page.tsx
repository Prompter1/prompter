import { Navbar } from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import {
  Award,
  Percent,
  ShieldAlert,
  CheckCircle,
  ClipboardCheck,
  Banknote,
  AlertTriangle,
} from 'lucide-react'

const EFFECTIVE_DATE = '2026. 05. 13'

export default function SellerPolicyPage() {
  return (
    <main className="bg-surface-900 text-surface-50 flex min-h-screen flex-col">
      <Navbar />

      <section className="grow px-4 py-20">
        <div className="mx-auto max-w-4xl">
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
              시행일: {EFFECTIVE_DATE}
            </p>
          </div>

          <div className="text-surface-300 space-y-8 text-sm leading-relaxed">

            {/* 1. 판매자 자격 및 등록 */}
            <div className="bg-surface-800/20 border-surface-700/50 rounded-3xl border p-8">
              <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold text-white">
                <CheckCircle className="text-brand-400 h-5 w-5" /> 1. 판매자 자격 및 상품 등록
              </h2>
              <ul className="list-disc space-y-3 pl-5">
                <li>
                  Prompter 회원이라면 누구나 판매자 신청을 통해 크리에이터로
                  활동할 수 있습니다.
                </li>
                <li>
                  등록하는 모든 프롬프트는 본인이 직접 창작하거나 정당한 권리를
                  보유한 것이어야 하며, 타인의 프롬프트를 무단으로 도용하여 등록할
                  경우 즉시 판매 중지 및 계정 차단 조치가 취해집니다.
                </li>
                <li>
                  상품 설명에는 해당 프롬프트가 최적으로 구동되는{' '}
                  <strong className="text-surface-200">
                    권장 AI 모델(예: GPT-4o, Claude 3.5 등)과 설정값
                  </strong>
                  을 명확히 기재해야 합니다.
                </li>
                <li>
                  <strong className="text-surface-200">유료 프롬프트</strong>는
                  등록 즉시 "인증 대기" 상태로 전환되며, 관리자 인증 전까지
                  구매 버튼이 비활성화됩니다. 무료 프롬프트는 별도 인증 없이
                  즉시 공개됩니다.
                </li>
              </ul>
            </div>

            {/* 2. 유료 게시물 인증 절차 */}
            <div className="bg-surface-800/20 border-surface-700/50 rounded-3xl border p-8">
              <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold text-white">
                <ClipboardCheck className="text-brand-400 h-5 w-5" /> 2. 유료 게시물 인증 절차
              </h2>
              <div className="mb-6 space-y-4">
                {/* 단계 표시 */}
                <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                  <div className="bg-surface-900/50 rounded-2xl p-4 text-center">
                    <div className="bg-brand-500/20 text-brand-400 mx-auto mb-2 flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold">
                      1
                    </div>
                    <p className="font-semibold text-white text-sm">게시물 등록</p>
                    <p className="text-surface-500 mt-1 text-xs">
                      가격 &gt; 0원 설정 시 자동으로 인증 대기 전환
                    </p>
                  </div>
                  <div className="bg-surface-900/50 rounded-2xl p-4 text-center">
                    <div className="bg-amber-500/20 text-amber-400 mx-auto mb-2 flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold">
                      2
                    </div>
                    <p className="font-semibold text-white text-sm">관리자 검토</p>
                    <p className="text-surface-500 mt-1 text-xs">
                      콘텐츠 적합성·저작권·정책 위반 여부 확인
                    </p>
                  </div>
                  <div className="bg-surface-900/50 rounded-2xl p-4 text-center">
                    <div className="bg-emerald-500/20 text-emerald-400 mx-auto mb-2 flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold">
                      3
                    </div>
                    <p className="font-semibold text-white text-sm">결과 통보</p>
                    <p className="text-surface-500 mt-1 text-xs">
                      승인 → 판매 활성화 / 반려 → 이메일 통보 후 삭제
                    </p>
                  </div>
                </div>
              </div>
              <ul className="list-disc space-y-3 pl-5">
                <li>
                  관리자는{' '}
                  <strong className="text-surface-200">영업일 기준 3일 이내</strong>
                  에 검수를 완료합니다.
                </li>
                <li>
                  <strong className="text-surface-200">승인</strong> 시 게시물이
                  즉시 공개되며 구매 버튼이 활성화됩니다.
                </li>
                <li>
                  <strong className="text-surface-200">반려</strong> 시 게시물은
                  즉시 삭제되고, 등록한 이메일로 반려 사유가 발송됩니다. 사유를
                  확인한 뒤 내용을 수정하여 새로 등록하시면 됩니다.
                </li>
                <li>
                  검수 기준: 적법한 저작권 보유, 서비스 목적에 부합하는 콘텐츠,
                  금지 행위 해당 여부, 정확한 상품 설명 여부 등.
                </li>
                <li>
                  기존에 승인된 유료 게시물을 수정하여 무료 → 유료로 가격을 변경한
                  경우에도 인증 대기 상태로 재전환됩니다.
                </li>
              </ul>
            </div>

            {/* 3. 검증됨(Verified) 뱃지 */}
            <div className="bg-surface-800/20 border-surface-700/50 rounded-3xl border p-8">
              <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold text-white">
                <CheckCircle className="text-brand-400 h-5 w-5" /> 3. 검증됨(Verified) 뱃지
              </h2>
              <p className="mb-3">
                인증과는 별도로, 프롬프트 활용 결과를 증빙하면 "검증됨" 뱃지를 획득할 수 있습니다.
              </p>
              <ul className="list-disc space-y-3 pl-5">
                <li>
                  업로드 시 AI 활용 스크린샷·영상 등 증빙 자료를 첨부하고 관리자
                  심사를 통과하면 뱃지가 부여됩니다.
                </li>
                <li>
                  검증됨 프롬프트는 홈 화면 인기 프롬프트 및 탐색 페이지 인기순
                  정렬에서 <strong className="text-surface-200">1순위 기준</strong>으로
                  적용되어 미검증 프롬프트보다 항상 상위에 노출됩니다.
                </li>
                <li>
                  상세 페이지에 "Verified" 뱃지가 표시되어 구매자에게 신뢰 신호를 제공합니다.
                </li>
              </ul>
            </div>

            {/* 4. 수익 정산 및 수수료 */}
            <div className="bg-brand-500/5 border-brand-500/20 rounded-3xl border p-8">
              <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold text-white">
                <Percent className="text-brand-400 h-5 w-5" /> 4. 수익 정산 및 중개 수수료
              </h2>
              <p className="mb-4">
                Prompter는 투명하고 합리적인 정산 시스템을 지향합니다.
              </p>

              <div className="bg-surface-900/60 border-surface-700/50 mb-5 rounded-2xl border p-5">
                <div className="border-surface-700/50 mb-3 flex items-center justify-between border-b pb-3">
                  <span className="text-surface-200 font-medium">플랫폼 중개 수수료</span>
                  <span className="text-brand-400 text-lg font-bold">결제 금액의 15%</span>
                </div>
                <p className="text-surface-400 text-xs">
                  * PG(결제 대행) 수수료, 서버 인프라 유지비, 플랫폼 운영비 포함
                </p>
              </div>

              <ul className="list-disc space-y-3 pl-5">
                <li>
                  <strong className="text-surface-200">정산 주기:</strong>{' '}
                  매월 1일~말일 판매 확정분을{' '}
                  <strong className="text-surface-200">익월 10일</strong>에 일괄
                  지급합니다.
                </li>
                <li>
                  <strong className="text-surface-200">개인 판매자 원천징수:</strong>{' '}
                  플랫폼 수수료(15%) 공제 후 잔액에 대해{' '}
                  <strong className="text-surface-200">소득세 3% + 지방소득세 0.3% = 3.3%</strong>
                  를 원천징수한 금액을 지급합니다. 플랫폼이 원천징수 의무자로서
                  세무 신고 및 지급명세서 제출을 이행합니다.
                </li>
                <li>
                  <strong className="text-surface-200">개인 판매자 월 한도:</strong>{' '}
                  개인 판매자의 월 매출이{' '}
                  <strong className="text-surface-200">50만원을 초과</strong>하면
                  정산이 보류되고 사업자 정보 등록이 요청됩니다.
                </li>
                <li>
                  <strong className="text-surface-200">사업자 판매자:</strong>{' '}
                  원천징수 없이 수수료 공제 후 전액 지급합니다. 정산 시
                  세금계산서 발행이 필요하며, 미발행 시 정산이 보류될 수
                  있습니다. 모든 세무 신고 의무는 판매자 본인에게 있습니다.
                </li>
                <li>
                  판매자 유형 변경(개인 → 사업자) 시 사업자 정보를 등록하고
                  관리자 승인을 받아야 합니다. 승인 전 발생한 매출은 승인 완료
                  후 다음 정산 주기에 합산됩니다.
                </li>
              </ul>
            </div>

            {/* 5. 사업자 정보 등록 */}
            <div className="bg-surface-800/20 border-surface-700/50 rounded-3xl border p-8">
              <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold text-white">
                <Banknote className="text-brand-400 h-5 w-5" /> 5. 사업자 정보 등록 및 승인
              </h2>
              <ul className="list-disc space-y-3 pl-5">
                <li>
                  사업자 판매자로 전환하려면 마이페이지 &gt; 수익 정산 페이지에서
                  사업자등록번호, 상호명, 대표자명, 사업장 주소, 세금계산서 수신
                  이메일을 등록해야 합니다.
                </li>
                <li>
                  관리자가 제출된 사업자 정보를 검토하며, 승인 완료 후 사업자
                  판매자 혜택(원천징수 면제, 한도 없음)이 적용됩니다.
                </li>
                <li>
                  사업자 정보를 수정할 경우 재검토 절차가 진행되며, 승인 완료
                  전까지는 이전 조건(개인 판매자 기준)이 유지됩니다.
                </li>
                <li>
                  허위 사업자 정보를 제출한 경우 계정 이용이 제한되며 법적
                  책임이 따를 수 있습니다.
                </li>
              </ul>
            </div>

            {/* 6. 금지 행위 및 제재 */}
            <div className="bg-surface-800/20 border-surface-700/50 rounded-3xl border p-8">
              <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold text-white">
                <ShieldAlert className="h-5 w-5 text-red-400" /> 6. 금지 행위 및 제재
              </h2>
              <p className="mb-3">
                안전한 거래 생태계를 위해 아래 행위는 엄격히 금지됩니다. 위반 시
                정산 보류, 계정 정지, 법적 책임이 따를 수 있습니다.
              </p>
              <ul className="list-disc space-y-2 pl-5 text-red-200/80">
                <li>욕설, 비방, 음란성, 범죄 유도 등 사회 미풍양속을 해치는 프롬프트 등록</li>
                <li>타인의 저작물을 무단으로 복제하거나 도용하여 등록하는 행위</li>
                <li>구매자를 외부 직거래로 유도하는 행위 (연락처, 개인 결제 링크 기재 등)</li>
                <li>동일하거나 유사한 프롬프트를 가격만 바꾸어 중복 등록하는 행위</li>
                <li>허위·과장된 설명으로 구매자를 기만하는 행위</li>
                <li>다른 이용자의 계정을 도용하거나 사칭하는 행위</li>
              </ul>
            </div>

            {/* 7. 제재 기준 */}
            <div className="bg-surface-800/20 border-surface-700/50 rounded-3xl border p-8">
              <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold text-white">
                <AlertTriangle className="text-brand-400 h-5 w-5" /> 7. 제재 기준
              </h2>
              <ul className="list-disc space-y-3 pl-5">
                <li>
                  <strong className="text-surface-200">1단계 (경고):</strong>{' '}
                  위반 행위 발견 시 경고 통보 및 해당 상품 비공개 처리
                </li>
                <li>
                  <strong className="text-surface-200">2단계 (정산 보류):</strong>{' '}
                  반복 또는 중대 위반 시 미지급 정산 대금 보류
                </li>
                <li>
                  <strong className="text-surface-200">3단계 (계정 정지/차단):</strong>{' '}
                  심각한 위반 시 영구적 서비스 이용 제한 및 법적 조치 가능
                </li>
                <li>
                  제재 처분에 이의가 있는 경우{' '}
                  <strong className="text-surface-200">chaalsdn0217@naver.com</strong>
                  으로 이의 신청을 접수할 수 있습니다.
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
