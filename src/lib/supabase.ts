import { createClient } from '@supabase/supabase-js'

// Vercel 환경 변수에서 URL과 Key를 가져옵니다.
// .env.local 파일에 설정한 변수명과 일치해야 합니다.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

if (!supabaseUrl || !supabaseAnonKey) {
  console.error(
    'Supabase URL 또는 Anon Key가 설정되지 않았습니다. .env.local 파일을 확인해주세요.'
  )
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
