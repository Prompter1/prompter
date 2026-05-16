'use client'

import { ShieldAlert, Info } from 'lucide-react'
import { cn } from '@/src/lib/utils'

interface AdultContentToggleProps {
  checked: boolean
  onChange: (val: boolean) => void
  disabled?: boolean
}

/**
 * 업로드 폼에서 성인 컨텐츠 여부를 선택하는 토글 컴포넌트.
 * UploadForm.tsx 의 카테고리 섹션 아래에 삽입하세요.
 *
 * 사용 예:
 *   const [isAdult, setIsAdult] = useState(false)
 *   <AdultContentToggle checked={isAdult} onChange={setIsAdult} />
 *
 * API 전송 시 is_adult: isAdult 를 body에 포함하세요.
 */
export function AdultContentToggle({
  checked,
  onChange,
  disabled,
}: Readonly<AdultContentToggleProps>) {
  return (
    <div
      className={cn(
        'rounded-2xl border p-5 transition-all',
        checked
          ? 'border-red-500/40 bg-red-500/5'
          : 'border-surface-700/50 bg-surface-800/30'
      )}
    >
      <div className="flex items-start gap-4">
        <div
          className={cn(
            'mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl',
            checked ? 'bg-red-500/20' : 'bg-surface-700/50'
          )}
        >
          <ShieldAlert
            className={cn(
              'h-5 w-5',
              checked ? 'text-red-400' : 'text-surface-400'
            )}
          />
        </div>

        <div className="flex-1">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-white">
                성인 컨텐츠 (19+)
              </p>
              <p className="text-surface-400 mt-0.5 text-xs">
                성인용 이미지·영상·프롬프트를 포함하는 경우 체크하세요.
              </p>
            </div>

            {/* 토글 스위치 */}
            <button
              type="button"
              role="switch"
              aria-checked={checked}
              disabled={disabled}
              onClick={() => onChange(!checked)}
              className={cn(
                'relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors focus:outline-none',
                checked ? 'bg-red-500' : 'bg-surface-600',
                disabled && 'cursor-not-allowed opacity-50'
              )}
            >
              <span
                className={cn(
                  'inline-block h-4 w-4 rounded-full bg-white shadow transition-transform',
                  checked ? 'translate-x-6' : 'translate-x-1'
                )}
              />
            </button>
          </div>

          {checked && (
            <div className="mt-3 flex items-start gap-2 rounded-xl border border-amber-500/20 bg-amber-500/10 p-3">
              <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-400" />
              <p className="text-xs leading-relaxed text-amber-200">
                성인 컨텐츠로 표시된 게시물의 결과물 미디어는 미인증 사용자에게
                블러 처리되며, 만 19세 이상 인증 후 열람 가능합니다. 허위
                표시·미표시 시 계정이 제재될 수 있습니다.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
