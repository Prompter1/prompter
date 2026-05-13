'use client'

import { useState } from 'react'
import { Navbar } from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { Mail, MessageSquare, Send, AlertCircle } from 'lucide-react'

export default function ContactPage() {
  const [content, setContent] = useState('')
  const [email, setEmail] = useState('') // 답변을 받을 이메일 (선택/필수)
  const [title, setTitle] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // 💡 힌트: 향후 여기에 supabase.from('contacts').insert(...) 로직이 들어갈 자리입니다.
    if (!title.trim() || !content.trim()) {
      alert('제목과 문의 내용을 입력해 주세요.')
      return
    }

    console.log('제출된 데이터:', { title, email, content })
    alert('문의가 접수되었습니다. (현재는 UI 테스트 모드입니다)')

    // 입력창 초기화
    setTitle('')
    setEmail('')
    setContent('')
  }

  return (
    <main className="bg-surface-900 text-surface-50 flex min-h-screen flex-col">
      <Navbar />

      <section className="flex-grow px-4 py-20">
        <div className="mx-auto max-w-2xl">
          {/* 헤더 */}
          <div className="mb-12 text-center">
            <div className="bg-brand-500/10 mb-4 inline-flex rounded-2xl p-3">
              <Mail className="text-brand-400 h-6 w-6" />
            </div>
            <h1 className="mb-3 text-3xl font-bold">고객 문의하기</h1>
            <p className="text-surface-400 text-sm">
              서비스 이용 중 불편한 점이나 제안하고 싶은 아이디어가 있다면
              자유롭게 남겨주세요.
            </p>
          </div>

          {/* 문의 폼 */}
          <form
            onSubmit={handleSubmit}
            className="bg-surface-800/20 border-surface-700/50 space-y-6 rounded-3xl border p-6 shadow-xl md:p-8"
          >
            {/* 제목 입력란 */}
            <div>
              <label
                htmlFor="title"
                className="text-surface-300 mb-2 block text-sm font-medium"
              >
                문의 제목
              </label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="제목을 입력해 주세요."
                className="bg-surface-900/50 border-surface-700/60 placeholder-surface-500 focus:border-brand-500 w-full rounded-xl border px-4 py-3 text-sm text-white transition-colors focus:outline-none"
                required
              />
            </div>

            {/* 이메일 입력란 */}
            <div>
              <label
                htmlFor="email"
                className="text-surface-300 mb-2 block text-sm font-medium"
              >
                답변 받을 이메일{' '}
                <span className="text-surface-500 text-xs">(선택)</span>
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="chaalsdn0217@naver.com"
                className="bg-surface-900/50 border-surface-700/60 placeholder-surface-600 focus:border-brand-500 w-full rounded-xl border px-4 py-3 text-sm text-white transition-colors focus:outline-none"
              />
            </div>

            {/* 텍스트 내용 입력창 (Textarea) */}
            <div>
              <label
                htmlFor="content"
                className="text-surface-300 mb-2 block text-sm font-medium"
              >
                문의 내용
              </label>
              <div className="relative">
                <textarea
                  id="content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="여기에 문의하실 내용을 자세히 적어주세요. 복제 및 양도가 불가능한 디지털 상품의 특성을 고려하여 명확한 문맥을 남겨주시면 빠른 처리가 가능합니다."
                  rows={6}
                  maxLength={2000}
                  className="bg-surface-900/50 border-surface-700/60 placeholder-surface-500 focus:border-brand-500 w-full resize-none rounded-xl border p-4 text-sm leading-relaxed text-white transition-colors focus:outline-none"
                  required
                />
                <span className="text-surface-500 absolute right-3 bottom-3 text-xs">
                  {content.length} / 2000
                </span>
              </div>
            </div>

            {/* 안내 문구 */}
            <div className="bg-surface-900/40 border-surface-700/30 text-surface-400 flex gap-2.5 rounded-xl border p-4 text-xs">
              <AlertCircle className="text-brand-400 mt-0.5 h-4 w-4 shrink-0" />
              <p className="leading-relaxed">
                제출해주신 문의는 영업일 기준 24시간 이내에 순차적으로 답변해
                드립니다. 개인 정보 보안을 위해 비밀번호 등의 중요 정보는
                기재하지 마십시오.
              </p>
            </div>

            {/* 제출 버튼 */}
            <button
              type="submit"
              className="bg-brand-500 hover:bg-brand-400 shadow-brand-500/10 flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl px-6 py-4 font-bold text-white shadow-lg transition-colors"
            >
              <Send className="h-4 w-4" />
              문의사항 제출하기
            </button>
          </form>
        </div>
      </section>

      <Footer />
    </main>
  )
}
