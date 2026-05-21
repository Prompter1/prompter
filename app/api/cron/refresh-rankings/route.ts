import { NextResponse } from 'next/server'
import { createSupabaseAdminClient } from '@/src/lib/supabase-admin'

export async function GET(req: Request) {
  const cronSecret = process.env.CRON_SECRET
  if (cronSecret && req.headers.get('authorization') !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const admin = createSupabaseAdminClient()

  const { data: posts, error: fetchErr } = await admin
    .from('prompt_posts')
    .select('id')
    .order('is_verified', { ascending: false })
    .order('sales_count', { ascending: false })
    .order('view_count', { ascending: false })
    .limit(12)

  if (fetchErr || !posts) {
    return NextResponse.json({ error: fetchErr?.message ?? 'fetch failed' }, { status: 500 })
  }

  const { error: delErr } = await admin
    .from('prompt_rankings')
    .delete()
    .gte('rank', 1)

  if (delErr) {
    return NextResponse.json({ error: delErr.message }, { status: 500 })
  }

  const rows = posts.map((p, i) => ({
    rank: i + 1,
    prompt_post_id: p.id,
    refreshed_at: new Date().toISOString(),
  }))

  const { error: insertErr } = await admin.from('prompt_rankings').insert(rows)

  if (insertErr) {
    return NextResponse.json({ error: insertErr.message }, { status: 500 })
  }

  return NextResponse.json({ ok: true, count: rows.length, refreshed_at: rows[0]?.refreshed_at })
}
