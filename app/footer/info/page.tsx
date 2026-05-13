import { Navbar } from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { Building2, User, Mail, FileText, MapPin, Phone } from 'lucide-react'

export default function InfoPage() {
  const businessDetails = [
    {
      icon: <Building2 className="text-brand-400 h-5 w-5" />,
      label: '상호명',
      value: 'Prompter',
    },
    {
      icon: <FileText className="text-brand-400 h-5 w-5" />,
      label: '사업자등록번호',
      value: '530-13-02815',
    },
    {
      icon: <User className="text-brand-400 h-5 w-5" />,
      label: '대표자',
      value: '차민우',
    },
    {
      icon: <Mail className="text-brand-400 h-5 w-5" />,
      label: '이메일',
      value: 'chaalsdn0217@naver.com',
    },
    // 필요시 추가 정보 (예: 통신판매업신고번호 등)
  ]

  return (
    <main className="bg-surface-900 text-surface-50 flex min-h-screen flex-col">
      <Navbar />

      <section className="flex-grow px-4 py-20">
        <div className="mx-auto max-w-3xl">
          {/* 페이지 헤더 */}
          <div className="mb-12 text-center">
            <h1 className="mb-4 text-3xl font-bold">사업자 정보 확인</h1>
            <p className="text-surface-400">
              Prompter는 전자상거래법을 준수하며, 투명한 거래 환경을 지향합니다.
            </p>
          </div>

          {/* 정보 카드 리스트 */}
          <div className="bg-surface-800/50 border-surface-700/50 rounded-3xl border p-8 shadow-xl md:p-12">
            <div className="grid grid-cols-1 gap-8">
              {businessDetails.map((item, index) => (
                <div
                  key={index}
                  className="border-surface-700/50 flex items-start gap-4 border-b pb-6 last:border-0 last:pb-0"
                >
                  <div className="bg-brand-500/10 rounded-xl p-3">
                    {item.icon}
                  </div>
                  <div>
                    <p className="text-surface-400 mb-1 text-sm">
                      {item.label}
                    </p>
                    <p className="text-lg font-medium">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 추가 안내 (선택 사항) */}
          <div className="bg-surface-800/30 border-surface-700/30 mt-12 rounded-2xl border p-6">
            <h2 className="text-surface-300 mb-3 flex items-center gap-2 text-sm font-semibold">
              <span className="bg-brand-500 h-4 w-1 rounded-full" />
              고객센터 안내
            </h2>
            <p className="text-surface-400 text-sm leading-relaxed">
              서비스 이용 중 불편한 점이나 제휴 문의는 상기 이메일로 연락 주시기
              바랍니다.
              <br />
              운영 시간: 평일 10:00 ~ 18:00 (주말 및 공휴일 제외)
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
