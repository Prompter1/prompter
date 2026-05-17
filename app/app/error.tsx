'use client'

import { FullPageError } from '@/components/error/ErrorBoundary'

export default function GlobalError({
  reset,
}: Readonly<{
  error: Error & { digest?: string }
  reset: () => void
}>) {
  return (
    <html lang="ko">
      <body>
        <FullPageError reset={reset} />
      </body>
    </html>
  )
}
