import { notFound } from 'next/navigation'
import Footer from '@/components/layout/Footer'
import { EditPageWrapper } from '@/components/upload/EditPageWrapper'
import { createSupabaseServerClient } from '@/src/lib/supabase-server'

type Props = Readonly<{
  params: Promise<{ id: string }>
}>

export default async function EditPromptPage({ params }: Props) {
  const { id } = await params
  const postId = Number.parseInt(id, 10)
  if (!Number.isFinite(postId) || postId < 1) notFound()

  const supabase = await createSupabaseServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) notFound()

  const { data: post, error } = await supabase
    .from('prompt_posts')
    .select(
      'id, title, content, price, ai_types, ai_versions, categories, result_media, author_id'
    )
    .eq('id', postId)
    .eq('author_id', user.id)
    .maybeSingle()

  if (error || !post) notFound()

  const { data: stepsRaw } = await supabase
    .from('prompt_steps')
    .select(
      'id, step_order, ai_type, ai_version, input_prompt, input_media, output_text, output_media'
    )
    .eq('prompt_post_id', postId)
    .order('step_order', { ascending: true })

  const steps = (stepsRaw ?? []).map((s: any) => ({
    aiType: s.ai_type ?? '',
    aiVersion: s.ai_version ?? '',
    inputPrompt: s.input_prompt ?? '',
    inputMedia: Array.isArray(s.input_media)
      ? s.input_media.filter((v: unknown) => typeof v === 'string')
      : [],
    outputText: s.output_text ?? '',
    outputMedia: Array.isArray(s.output_media)
      ? s.output_media.filter((v: unknown) => typeof v === 'string')
      : [],
  }))

  const initialData = {
    postId: post.id,
    title: post.title,
    price: post.price,
    ai_types: post.ai_types ?? [],
    ai_versions: post.ai_versions ?? [],
    categories: post.categories ?? [],
    steps,
  }

  return (
    <main className="bg-surface-900 text-surface-50 min-h-screen">
      <EditPageWrapper initialData={initialData} />
      <Footer />
    </main>
  )
}
