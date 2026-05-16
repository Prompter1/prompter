'use client'

import { useState, useEffect } from 'react'

/** ai_name → version_name[] 맵 */
export type AiVersionMap = Record<string, string[]>

let cachedMap: AiVersionMap | null = null

export function useAiVersionMap() {
  const [map, setMap] = useState<AiVersionMap>(cachedMap ?? {})
  const [loading, setLoading] = useState(!cachedMap)

  useEffect(() => {
    if (cachedMap) return
    fetch('/api/ai-versions')
      .then((r) => r.json())
      .then((data) => {
        cachedMap = data.map ?? {}
        setMap(cachedMap!)
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  return { map, loading }
}

/**
 * 특정 AI 이름의 버전 목록을 반환합니다.
 * aiName이 없으면 빈 배열을 반환합니다.
 */
export function useAiVersions(aiName: string) {
  const { map, loading } = useAiVersionMap()
  return {
    versions: aiName ? (map[aiName] ?? []) : [],
    loading,
  }
}

/**
 * 새 버전을 카탈로그에 등록합니다.
 * 업로드 폼에서 새 AI+버전 조합 저장 시 호출합니다.
 */
export async function registerAiVersion(
  aiName: string,
  versionName: string
): Promise<void> {
  if (!aiName.trim() || !versionName.trim()) return
  // 이미 캐시에 있으면 skip
  if (cachedMap?.[aiName]?.includes(versionName)) return

  await fetch('/api/ai-versions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ aiName, versionName }),
  })

  // 로컬 캐시 즉시 업데이트
  if (cachedMap) {
    if (!cachedMap[aiName]) cachedMap[aiName] = []
    if (!cachedMap[aiName].includes(versionName)) {
      cachedMap[aiName].push(versionName)
    }
  }
}
