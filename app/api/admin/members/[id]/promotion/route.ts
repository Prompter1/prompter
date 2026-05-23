import { NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/src/lib/supabase-server'
import { requireAdminAPI } from '@/src/lib/admin-auth'

type Params = { params: Promise<{ id: string }> }

// PATCH /api/admin/members/:id/promotion  { is_promotion: boolean }
export async function PATCH(req: Request, { params }: Params) {
  const authResult = await requireAdminAPI()
  if (authResult instanceof NextResponse) return authResult

  const { id } = await params

  const body = await req.json().catch(() => ({}))
  if (typeof body.is_promotion !== 'boolean') {
    return NextResponse.json({ error: 'is_promotion 필드(boolean)가 필요합니다.' }, { status: 400 })
  }

  const supabase = await createSupabaseServerClient()
  const { error } = await supabase
    .from('members')
    .update({ is_promotion: body.is_promotion })
    .eq('id', id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ ok: true, is_promotion: body.is_promotion })
}
