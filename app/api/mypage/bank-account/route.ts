import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/src/lib/supabase-server'

export async function PUT(req: NextRequest) {
  const supabase = await createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: '로그인이 필요합니다.' }, { status: 401 })

  const ALLOWED_BANKS = new Set([
    '국민은행', '신한은행', '우리은행', '하나은행', 'IBK기업은행',
    'NH농협은행', '카카오뱅크', '토스뱅크', '케이뱅크', '씨티은행',
    'SC제일은행', '광주은행', '전북은행', '경남은행', '부산은행',
    '대구은행', '수협은행', '우체국', '저축은행', '기타',
  ])

  const body = await req.json()
  const bankName = String(body.bankName ?? '').trim()
  const accountNumber = String(body.accountNumber ?? '').trim()
  const accountHolder = String(body.accountHolder ?? '').trim()

  if (!bankName || !accountNumber || !accountHolder) {
    return NextResponse.json({ error: '필수 값이 누락되었습니다.' }, { status: 400 })
  }

  if (!ALLOWED_BANKS.has(bankName)) {
    return NextResponse.json({ error: '유효하지 않은 은행명입니다.' }, { status: 400 })
  }

  if (!/^[0-9-]{4,30}$/.test(accountNumber)) {
    return NextResponse.json({ error: '계좌번호는 숫자와 하이픈만 허용됩니다. (4~30자)' }, { status: 400 })
  }

  if (accountHolder.length > 20) {
    return NextResponse.json({ error: '예금주명은 20자를 초과할 수 없습니다.' }, { status: 400 })
  }

  const { error } = await supabase
    .from('members')
    .update({ bank_name: bankName, account_number: accountNumber, account_holder: accountHolder })
    .eq('id', user.id)

  if (error) return NextResponse.json({ error: '서버 오류가 발생했습니다.' }, { status: 500 })
  return NextResponse.json({ ok: true })
}
