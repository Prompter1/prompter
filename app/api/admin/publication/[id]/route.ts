import { NextResponse } from 'next/server'
import { requireAdminAPI } from '@/src/lib/admin-auth'
import { createSupabaseAdminClient } from '@/src/lib/supabase-admin'

type RouteContext = { params: Promise<{ id: string }> }

export async function POST(req: Request, context: RouteContext) {
  const { id } = await context.params
  const postId = Number.parseInt(id, 10)

  if (!Number.isFinite(postId) || postId < 1) {
    return NextResponse.json({ error: '잘못된 게시물 ID' }, { status: 400 })
  }

  const authResult = await requireAdminAPI()
  if (authResult instanceof NextResponse) return authResult

  let body: { action?: string; reason?: string }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json(
      { error: 'JSON 본문이 필요합니다.' },
      { status: 400 }
    )
  }

  const action = body.action
  if (action !== 'approve' && action !== 'reject') {
    return NextResponse.json(
      { error: 'action은 approve 또는 reject 여야 합니다.' },
      { status: 400 }
    )
  }

  const adminClient = createSupabaseAdminClient()

  const { data: post, error: fetchErr } = await adminClient
    .from('prompt_posts')
    .select(
      'id, title, price, author_id, publication_status'
    )
    .eq('id', postId)
    .maybeSingle()

  if (fetchErr || !post) {
    return NextResponse.json(
      { error: '게시물을 찾을 수 없습니다.' },
      { status: 404 }
    )
  }

  if (post.publication_status !== 'pending') {
    return NextResponse.json(
      { error: '이미 처리된 게시물입니다.' },
      { status: 409 }
    )
  }

  if (action === 'approve') {
    const { error } = await adminClient
      .from('prompt_posts')
      .update({ publication_status: 'approved' })
      .eq('id', postId)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ ok: true, status: 'approved' })
  }

  // ── reject: 이메일 전송 후 게시물 삭제 ──────────────────────────────────
  const reason = typeof body.reason === 'string' ? body.reason.trim() : ''
  if (!reason) {
    return NextResponse.json(
      { error: '반려 사유를 입력해주세요.' },
      { status: 400 }
    )
  }

  // 작성자 이메일 조회
  const { data: member } = await adminClient
    .from('members')
    .select('email, nickname')
    .eq('id', post.author_id)
    .maybeSingle()

  // 이메일 발송
  const authorEmail = member?.email
  if (authorEmail && process.env.RESEND_API_KEY) {
    try {
      const { Resend } = await import('resend')
      const resend = new Resend(process.env.RESEND_API_KEY)
      await resend.emails.send({
        from: process.env.RESEND_FROM_EMAIL ?? 'onboarding@resend.dev',
        to: [authorEmail],
        subject: '[Prompter] 프롬프트 게시물 반려 안내',
        html: buildRejectionEmail({
          nickname: member?.nickname ?? '판매자',
          title: post.title,
          reason,
        }),
      })
    } catch (emailErr) {
      console.error('rejection email send failed:', emailErr)
    }
  }

  // 관련 데이터 삭제
  await adminClient
    .from('prompt_steps')
    .delete()
    .eq('prompt_post_id', postId)

  await adminClient
    .from('verification_requests')
    .delete()
    .eq('prompt_post_id', postId)

  const { error: deleteErr } = await adminClient
    .from('prompt_posts')
    .delete()
    .eq('id', postId)

  if (deleteErr) {
    return NextResponse.json({ error: deleteErr.message }, { status: 500 })
  }

  return NextResponse.json({ ok: true, status: 'rejected' })
}

function buildRejectionEmail({
  nickname,
  title,
  reason,
}: {
  nickname: string
  title: string
  reason: string
}): string {
  return `
<!DOCTYPE html>
<html lang="ko">
<head><meta charset="UTF-8" /><title>게시물 반려 안내</title></head>
<body style="margin:0;padding:0;background:#0a0c14;font-family:'Apple SD Gothic Neo',sans-serif;">
  <div style="max-width:540px;margin:40px auto;background:#111420;border-radius:16px;overflow:hidden;border:1px solid rgba(255,255,255,0.08);">
    <div style="background:linear-gradient(135deg,#6c3de0,#4f46e5);padding:28px 32px;">
      <h1 style="margin:0;color:#fff;font-size:20px;font-weight:700;">Prompter</h1>
    </div>
    <div style="padding:32px;">
      <p style="color:#c8c8d0;margin:0 0 8px;">안녕하세요, <strong style="color:#fff;">${nickname}</strong>님.</p>
      <p style="color:#c8c8d0;margin:0 0 24px;">등록하신 프롬프트 게시물이 아래의 사유로 반려되었습니다.</p>

      <div style="background:#1a1d2e;border-radius:12px;padding:20px;margin-bottom:24px;">
        <p style="color:#8b8b9a;font-size:12px;margin:0 0 6px;text-transform:uppercase;letter-spacing:0.05em;">게시물 제목</p>
        <p style="color:#fff;font-size:15px;font-weight:600;margin:0;">${title}</p>
      </div>

      <div style="background:#1a1d2e;border-radius:12px;padding:20px;margin-bottom:28px;">
        <p style="color:#8b8b9a;font-size:12px;margin:0 0 6px;text-transform:uppercase;letter-spacing:0.05em;">반려 사유</p>
        <p style="color:#e0c87a;font-size:14px;line-height:1.6;margin:0;white-space:pre-wrap;">${reason}</p>
      </div>

      <p style="color:#8b8b9a;font-size:13px;line-height:1.6;margin:0 0 20px;">사유를 수정하신 후 다시 게시물을 등록하실 수 있습니다. 추가 문의는 고객센터로 연락해 주세요.</p>
      <a href="https://prompter.kr/footer/contact" style="display:inline-block;background:#6c3de0;color:#fff;text-decoration:none;border-radius:10px;padding:12px 24px;font-size:14px;font-weight:600;">고객센터 문의</a>
    </div>
    <div style="padding:20px 32px;border-top:1px solid rgba(255,255,255,0.06);">
      <p style="color:#4a4a5a;font-size:11px;margin:0;">© 2025 Prompter. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
  `.trim()
}
