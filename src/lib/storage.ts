import { supabase } from '@/src/lib/supabase'

export const BUCKET_NAME = 'prompt-media'

export type UploadProgressCallback = (progress: number) => void

export async function uploadMediaFile(
  file: File,
  userId: string,
  onProgress?: UploadProgressCallback
): Promise<{ url: string; path: string }> {
  const ext = file.name.split('.').pop()
  const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
  const filePath = `${userId}/${fileName}`

  if (onProgress) {
    await simulateProgress(onProgress)
  }

  const { error } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false,
    })

  if (error) throw new Error(error.message)

  const {
    data: { publicUrl },
  } = supabase.storage.from(BUCKET_NAME).getPublicUrl(filePath)

  if (onProgress) onProgress(100)

  return { url: publicUrl, path: filePath }
}

export async function deleteMediaFile(path: string): Promise<void> {
  const { error } = await supabase.storage.from(BUCKET_NAME).remove([path])
  if (error) throw new Error(error.message)
}

export function isAllowedMediaType(file: File): boolean {
  const allowed = [
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
    'video/mp4',
    'video/webm',
  ]
  return allowed.includes(file.type)
}

export function isFileSizeValid(file: File, maxMB = 350): boolean {
  return file.size <= maxMB * 1024 * 1024
}

async function simulateProgress(onProgress: UploadProgressCallback) {
  return new Promise<void>((resolve) => {
    let progress = 0
    const interval = setInterval(() => {
      progress += Math.random() * 15
      if (progress >= 80) {
        onProgress(80)
        clearInterval(interval)
        resolve()
      } else {
        onProgress(Math.round(progress))
      }
    }, 200)
  })
}
