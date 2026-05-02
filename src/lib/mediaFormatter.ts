import imageCompression from 'browser-image-compression'

/** 영상 최대 녹화 시간 (초) */
const MAX_VIDEO_DURATION_SEC = 5
/** 이미지 압축 목표 크기 (MB) */
export const TARGET_IMAGE_SIZE_MB = 5
/** 이미지 최대 너비/높이 (px) */
const TARGET_IMAGE_MAX_PX = 2560

export interface FormatResult {
  file: File
  compressionRatio: number
  wasCompressed: boolean
}

function bytesToMB(bytes: number): number {
  return bytes / (1024 * 1024)
}

// ── 이미지 포매터 ─────────────────────────────────────────────────────────────
export async function formatImage(
  file: File,
  onProgress?: (progress: number) => void
): Promise<FormatResult> {
  const originalSize = file.size
  const originalMB = bytesToMB(originalSize)

  console.log(
    `[ImageFormatter] 시작: ${file.name} (${formatFileSize(originalSize)})`
  )

  /**
   * [로직 변경]
   * 1. 파일 용량이 목표치(TARGET_IMAGE_SIZE_MB)보다 크거나
   * 2. 용량이 1MB를 넘는데 WebP 형식이 아닐 경우 압축/변환 진행
   */
  const shouldCompress =
    originalMB > TARGET_IMAGE_SIZE_MB ||
    (!file.type.includes('webp') && originalMB > 1)

  if (!shouldCompress) {
    console.log(
      `[ImageFormatter] 압축 불필요 (목표 크기 이하): 그대로 반환합니다.`
    )
    onProgress?.(100)
    return { file, compressionRatio: 1, wasCompressed: false }
  }

  try {
    console.log(
      `[ImageFormatter] 목표 크기(${TARGET_IMAGE_SIZE_MB}MB) 초과. 압축을 시작합니다...`
    )
    const compressed = await imageCompression(file, {
      maxSizeMB: TARGET_IMAGE_SIZE_MB,
      maxWidthOrHeight: TARGET_IMAGE_MAX_PX,
      useWebWorker: true,
      fileType: 'image/webp',
      onProgress: (p) => {
        console.log(`[ImageFormatter] 압축 진행률: ${p}%`)
        onProgress?.(p)
      },
    })

    // 압축 결과가 원본보다 큰 특이 케이스 처리
    if (compressed.size >= originalSize) {
      console.warn(
        `[ImageFormatter] 압축 결과가 오히려 더 큼. 원본을 유지합니다.`
      )
      onProgress?.(100)
      return { file, compressionRatio: 1, wasCompressed: false }
    }

    const baseName = file.name.replace(/\.[^.]+$/, '')
    const resultFile = new File([compressed], `${baseName}.webp`, {
      type: 'image/webp',
    })

    const ratio = (resultFile.size / originalSize) * 100
    console.log(
      `[ImageFormatter] 완료: ${formatFileSize(originalSize)} -> ${formatFileSize(resultFile.size)} (${ratio.toFixed(1)}%)`
    )

    onProgress?.(100)
    return {
      file: resultFile,
      compressionRatio: resultFile.size / originalSize,
      wasCompressed: true,
    }
  } catch (err) {
    console.error(`[ImageFormatter] 압축 프로세스 실패:`, err)
    onProgress?.(100)
    return { file, compressionRatio: 1, wasCompressed: false }
  }
}

// ── 영상 포매터 ─────────────────────────────────────────────────────────────
export async function formatVideo(
  file: File,
  onProgress?: (progress: number) => void
): Promise<FormatResult> {
  const originalSize = file.size
  console.log(
    `[VideoFormatter] 시작: ${file.name} (${formatFileSize(originalSize)})`
  )

  /**
   * 영상은 용량 기준 대신 '길이'를 기준으로 트리밍하여 용량을 조절합니다.
   * (MediaRecorder 방식은 용량 예측이 어렵기 때문)
   */
  return new Promise((resolve) => {
    const videoEl = document.createElement('video')
    const objectUrl = URL.createObjectURL(file)
    videoEl.src = objectUrl
    videoEl.muted = true
    videoEl.preload = 'metadata'

    videoEl.onloadedmetadata = () => {
      const duration = videoEl.duration
      console.log(`[VideoFormatter] 재생 시간: ${duration.toFixed(2)}s`)

      // 이미 5초 이하인 영상은 압축 없이 반환
      if (duration <= MAX_VIDEO_DURATION_SEC) {
        console.log(`[VideoFormatter] 5초 이하 영상이므로 처리를 생략합니다.`)
        URL.revokeObjectURL(objectUrl)
        onProgress?.(100)
        resolve({ file, compressionRatio: 1, wasCompressed: false })
        return
      }

      console.log(`[VideoFormatter] 5초 트리밍을 통한 용량 최적화 시작...`)
      const mimeType = getSupportedVideoMimeType()
      if (!mimeType) {
        console.error(`[VideoFormatter] 코덱 미지원으로 원본 반환.`)
        URL.revokeObjectURL(objectUrl)
        onProgress?.(100)
        resolve({ file, compressionRatio: 1, wasCompressed: false })
        return
      }

      const canvas = document.createElement('canvas')
      videoEl.onloadeddata = () => {
        canvas.width = videoEl.videoWidth
        canvas.height = videoEl.videoHeight
      }

      const stream = (canvas as any).captureStream(30)
      const recorder = new MediaRecorder(stream, { mimeType })
      const chunks: Blob[] = []

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.push(e.data)
      }
      recorder.onstop = () => {
        URL.revokeObjectURL(objectUrl)
        const blob = new Blob(chunks, { type: mimeType })
        const ext = mimeType.includes('mp4') ? 'mp4' : 'webm'
        const resultFile = new File(
          [blob],
          `${file.name.split('.')[0]}_trimmed.${ext}`,
          { type: mimeType }
        )

        console.log(
          `[VideoFormatter] 트리밍 완료: ${formatFileSize(originalSize)} -> ${formatFileSize(resultFile.size)}`
        )
        onProgress?.(100)
        resolve({
          file: resultFile,
          compressionRatio: resultFile.size / originalSize,
          wasCompressed: true,
        })
      }

      let elapsed = 0
      const FPS = 30
      const interval = setInterval(() => {
        const ctx = canvas.getContext('2d')
        if (ctx) ctx.drawImage(videoEl, 0, 0, canvas.width, canvas.height)
        elapsed += 1 / FPS
        onProgress?.(
          Math.min(Math.round((elapsed / MAX_VIDEO_DURATION_SEC) * 100), 99)
        )

        if (elapsed >= MAX_VIDEO_DURATION_SEC) {
          clearInterval(interval)
          recorder.stop()
          videoEl.pause()
        }
      }, 1000 / FPS)

      recorder.start()
      videoEl.currentTime = 0
      videoEl.play()
    }
  })
}

// ── 통합 포매터 ───────────────────────────────────────────────────────────────
export async function formatMediaFile(
  file: File,
  onProgress?: (progress: number) => void
): Promise<FormatResult> {
  console.log(
    `%c[MediaFormatter] ${file.name} 처리 분석 중...`,
    'color: #007bff; font-weight: bold'
  )

  if (file.type.startsWith('image/')) {
    return formatImage(file, onProgress)
  }
  if (file.type.startsWith('video/')) {
    return formatVideo(file, onProgress)
  }

  onProgress?.(100)
  return { file, compressionRatio: 1, wasCompressed: false }
}

function getSupportedVideoMimeType(): string | null {
  const candidates = [
    'video/mp4;codecs=avc1',
    'video/webm;codecs=vp9',
    'video/webm',
  ]
  return candidates.find((type) => MediaRecorder.isTypeSupported(type)) ?? null
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}
