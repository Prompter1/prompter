import { NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/src/lib/supabase-server'
import { requireAdminAPI } from '@/src/lib/admin-auth'

type Params = { params: Promise<{ id: string }> }

// PATCH /api/admin/settlement/:id/invoice  { submitted: boolean }
export async function PATCH(req: Request, { params }: Params) {
  const authResult = await requireAdminAPI()
  if (authResult instanceof NextResponse) return authResult

  const { id } = await params
  const settlementId = Number(id)
  if (!Number.isFinite(settlementId)) {
    return NextResponse.json({ error: '유효하지 않은 ID입니다.' }, { status: 400 })
  }

  const body = await req.json().catch(() => ({}))
  if (typeof body.submitted !== 'boolean') {
    return NextResponse.json({ error: 'submitted 필드(boolean)가 필요합니다.' }, { status: 400 })
  }

  const supabase = await createSupabaseServerClient()
  const { error } = await supabase
    .from('settlements')
    .update({ invoice_submitted: body.submitted })
    .eq('id', settlementId)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ ok: true, invoice_submitted: body.submitted })
}
