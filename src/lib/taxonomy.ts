import {
  Bot,
  BrainCircuit,
  Clapperboard,
  Code2,
  GraduationCap,
  ImageIcon,
  Megaphone,
  Music,
  Palette,
  PenLine,
  Sparkles,
  Video,
  WandSparkles,
} from 'lucide-react'

export const AI_TOOL_CATALOG = [
  {
    name: 'Midjourney',
    rank: 1,
    description: '이미지 생성',
    versions: ['v6.1', 'v6', 'Niji 6', 'v5.2'],
    icon: ImageIcon,
  },
  {
    name: 'ChatGPT',
    rank: 2,
    description: '텍스트·기획·코딩',
    versions: ['GPT-4.1', 'GPT-4o', 'o3', 'o4-mini'],
    icon: Bot,
  },
  {
    name: 'Runway',
    rank: 3,
    description: '영상 생성',
    versions: ['Gen-4', 'Gen-3 Alpha', 'Act-Two'],
    icon: Video,
  },
  {
    name: 'Claude',
    rank: 4,
    description: '문서·분석·코딩',
    versions: ['Claude 4 Opus', 'Claude 4 Sonnet', 'Claude 3.7 Sonnet'],
    icon: BrainCircuit,
  },
  {
    name: 'Stable Diffusion',
    rank: 5,
    description: '오픈소스 이미지',
    versions: ['SDXL', 'SD 3.5', 'Flux'],
    icon: Palette,
  },
  {
    name: 'Gemini',
    rank: 6,
    description: '멀티모달 AI',
    versions: ['2.5 Pro', '2.5 Flash', '1.5 Pro'],
    icon: Sparkles,
  },
  {
    name: 'Sora',
    rank: 7,
    description: '영상 생성',
    versions: ['Sora', 'Storyboard'],
    icon: Clapperboard,
  },
  {
    name: 'DALL-E',
    rank: 8,
    description: '이미지 생성',
    versions: ['DALL-E 3', 'GPT Image'],
    icon: WandSparkles,
  },
] as const

export const AI_TOOL_OPTIONS = AI_TOOL_CATALOG.map((tool) => tool.name)
const AI_TOOL_OPTION_SET = new Set<string>(AI_TOOL_OPTIONS)

export const AI_VERSION_OPTIONS = Array.from(
  new Set(AI_TOOL_CATALOG.flatMap((tool) => tool.versions))
)

export const CONTENT_CATEGORY_CATALOG = [
  { name: '예술', description: '아트워크와 스타일 실험', icon: Palette },
  { name: '그림', description: '일러스트·캐릭터·콘셉트', icon: ImageIcon },
  { name: '교육', description: '학습 자료와 강의 설계', icon: GraduationCap },
  { name: '영상', description: '숏폼·광고·스토리보드', icon: Video },
  { name: '마케팅', description: '광고 문구와 캠페인', icon: Megaphone },
  { name: '글쓰기', description: '브랜딩·에세이·카피', icon: PenLine },
  { name: '코딩', description: '개발 생산성', icon: Code2 },
  { name: '음악', description: '작사·작곡·사운드', icon: Music },
] as const

export const CONTENT_CATEGORY_OPTIONS = CONTENT_CATEGORY_CATALOG.map(
  (category) => category.name
)

export function getRankedAiTools(counts: Record<string, number>) {
  const known = AI_TOOL_CATALOG.map((tool) => ({
    ...tool,
    count: counts[tool.name] ?? 0,
  }))

  const custom = Object.entries(counts)
    .filter(([name]) => !AI_TOOL_OPTION_SET.has(name))
    .map(([name, count]) => ({
      name,
      rank: AI_TOOL_CATALOG.length + 1,
      description: '사용자 추가 AI',
      versions: [] as string[],
      icon: Sparkles,
      count,
    }))

  return [...known, ...custom].sort((a, b) => {
    if (b.count !== a.count) return b.count - a.count
    return a.rank - b.rank
  })
}
