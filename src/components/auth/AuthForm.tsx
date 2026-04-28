'use client'

import { useState } from 'react'
import { supabase } from '../../lib/supabase' // 기존에 만든 supabase 설정 파일
import { useRouter } from 'next/navigation'

export default function AuthForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  // 회원가입 로직
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${location.origin}/auth/callback`,
      },
    })
    if (error) alert(error.message)
    else alert('가입 확인 이메일을 확인해주세요!')
    setLoading(false)
  }

  // 로그인 로직
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    if (error) alert(error.message)
    else router.push('/') // 로그인 성공 시 메인으로
    setLoading(false)
  }

  return (
    <div className="border-border bg-card mx-auto max-w-md space-y-6 rounded-xl border p-8 shadow-lg">
      <h2 className="text-foreground text-2xl font-bold">시작하기</h2>
      <form className="space-y-4">
        <input
          type="email"
          placeholder="이메일"
          className="border-input bg-background w-full rounded-md border px-4 py-2"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="비밀번호"
          className="border-input bg-background w-full rounded-md border px-4 py-2"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <div className="flex gap-2">
          <button
            onClick={handleLogin}
            disabled={loading}
            className="bg-primary text-primary-foreground flex-1 rounded-md py-2 font-medium hover:opacity-90"
          >
            로그인
          </button>
          <button
            onClick={handleSignUp}
            disabled={loading}
            className="border-primary text-primary flex-1 rounded-md border py-2 font-medium"
          >
            회원가입
          </button>
        </div>
      </form>
    </div>
  )
}
