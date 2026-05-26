import { NextRequest } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { createSupabaseServerClient } from '@/src/lib/supabase-server'

const adminSupabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { persistSession: false } }
)

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ postId: string }> }
) {
  const supabase = await createSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return new Response('Unauthorized', { status: 401 })

  const { postId } = await params
  const postIdNum = Number(postId)
  if (isNaN(postIdNum)) return new Response('Bad Request', { status: 400 })

  // 구매 여부 확인
  const { data: tx } = await adminSupabase
    .from('transactions')
    .select('created_at')
    .eq('prompt_post_id', postIdNum)
    .eq('buyer_id', user.id)
    .maybeSingle()

  if (!tx) return new Response('Not purchased', { status: 403 })

  const [{ data: post }, { data: steps }] = await Promise.all([
    adminSupabase
      .from('prompt_posts')
      .select('title')
      .eq('id', postIdNum)
      .single(),
    adminSupabase
      .from('prompt_steps')
      .select('step_order, ai_type, ai_version, input_prompt, output_text')
      .eq('prompt_post_id', postIdNum)
      .order('step_order'),
  ])

  if (!post) return new Response('Not found', { status: 404 })

  const purchasedAt = new Date(tx.created_at)
  const expiresAt = new Date(purchasedAt)
  expiresAt.setFullYear(expiresAt.getFullYear() + 1)

  const fmt = (d: Date) =>
    d.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })

  const divider = '='.repeat(50)
  const lines: string[] = [
    `프롬프트: ${post.title}`,
    `구매일: ${fmt(purchasedAt)}`,
    `플랫폼 이용 만료: ${fmt(expiresAt)} (구매일로부터 12개월)`,
    `다운로드 파일은 만료 후에도 영구 이용 가능합니다.`,
    '',
    divider,
    '',
  ]

  for (const step of steps ?? []) {
    const aiLabel = [step.ai_type, step.ai_version].filter(Boolean).join(' ')
    lines.push(`▶ Step ${step.step_order}${aiLabel ? `  |  ${aiLabel}` : ''}`)
    lines.push('')
    lines.push('[입력 프롬프트]')
    lines.push(step.input_prompt ?? '')
    if (step.output_text) {
      lines.push('')
      lines.push('[출력 결과]')
      lines.push(step.output_text)
    }
    lines.push('')
    lines.push(divider)
    lines.push('')
  }

  const filename = encodeURIComponent(`${post.title}.txt`)

  return new Response(lines.join('\n'), {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Content-Disposition': `attachment; filename*=UTF-8''${filename}`,
    },
  })
}
