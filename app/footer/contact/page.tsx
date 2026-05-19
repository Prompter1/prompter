'use client'

import { useState } from 'react'
import { Navbar } from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { Mail, Send, AlertCircle, CheckCircle2 } from 'lucide-react'

const CONTACT_EMAIL = 'chaalsdn0217@naver.com'

export default function ContactPage() {
  const [title, setTitle] = useState('')
  const [email, setEmail] = useState('')
  const [content, setContent] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    if (!title.trim() || !content.trim()) {
      setError('제목과 문의 내용을 모두 입력해 주세요.')
      return
    }

    const subject = encodeURIComponent(`[Prompter 문의] ${title.trim()}`)
    const body = encodeURIComponent(
      `답변 받을 이메일: ${email.trim() || '미기재'}\n\n${content.trim()}`
    )
    globalThis.location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`

    setSubmitted(true)
    setTitle('')
    setEmail('')
    setContent('')
  }

  return (
    <main className="bg-surface-900 text-surface-50 flex min-h-screen flex-col">
      <Navbar />

      <section className="grow px-4 py-20">
        <div className="mx-auto max-w-2xl">
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

          {submitted ? (
            <div className="bg-emerald-500/5 border-emerald-500/20 rounded-3xl border p-10 text-center">
              <CheckCircle2 className="mx-auto mb-4 h-10 w-10 text-emerald-400" />
              <p className="text-lg font-semibold text-white">이메일 앱이 열렸습니다</p>
              <p className="text-surface-400 mt-2 text-sm">
                이메일 앱에서 전송을 완료해 주세요.
                <br />
                직접 이메일을 작성하시려면{' '}
                <a
                  href={`mailto:${CONTACT_EMAIL}`}
                  className="text-brand-400 underline"
                >
                  {CONTACT_EMAIL}
                </a>
                로 보내주세요.
              </p>
              <button
                type="button"
                onClick={() => setSubmitted(false)}
                className="text-surface-400 hover:text-surface-200 mt-6 text-sm transition-colors"
              >
                다시 작성하기
              </button>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="bg-surface-800/20 border-surface-700/50 space-y-6 rounded-3xl border p-6 shadow-xl md:p-8"
            >
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

              <div>
                <label
                  htmlFor="reply-email"
                  className="text-surface-300 mb-2 block text-sm font-medium"
                >
                  답변 받을 이메일{' '}
                  <span className="text-surface-500 text-xs">(선택)</span>
                </label>
                <input
                  type="email"
                  id="reply-email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="example@email.com"
                  className="bg-surface-900/50 border-surface-700/60 placeholder-surface-600 focus:border-brand-500 w-full rounded-xl border px-4 py-3 text-sm text-white transition-colors focus:outline-none"
                />
              </div>

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
                    placeholder="문의하실 내용을 자세히 적어주세요."
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

              {error && (
                <div className="flex items-center gap-2 rounded-xl border border-red-500/20 bg-red-500/5 p-3 text-xs text-red-300">
                  <AlertCircle className="h-4 w-4 shrink-0 text-red-400" />
                  {error}
                </div>
              )}

              <div className="bg-surface-900/40 border-surface-700/30 text-surface-400 flex gap-2.5 rounded-xl border p-4 text-xs">
                <AlertCircle className="text-brand-400 mt-0.5 h-4 w-4 shrink-0" />
                <p className="leading-relaxed">
                  제출 시 이메일 앱이 열립니다. 영업일 기준 1~3일 이내에
                  답변드립니다. 비밀번호 등 보안 정보는 기재하지 마세요.
                </p>
              </div>

              <button
                type="submit"
                className="bg-brand-500 hover:bg-brand-400 shadow-brand-500/10 flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl px-6 py-4 font-bold text-white shadow-lg transition-colors"
              >
                <Send className="h-4 w-4" />
                문의사항 제출하기
              </button>
            </form>
          )}

          <p className="text-surface-600 mt-8 text-center text-xs">
            직접 이메일 문의:{' '}
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="text-surface-500 hover:text-surface-300 transition-colors"
            >
              {CONTACT_EMAIL}
            </a>
          </p>
        </div>
      </section>

      <Footer />
    </main>
  )
}
