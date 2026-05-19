export function periodSuffix(i: number) {
  if (i === 0) return ' (이번 달)'
  if (i === 1) return ' (직전 달)'
  return ''
}

export function buildPeriodOptions() {
  const options: { label: string; year: number; month: number }[] = []
  const now = new Date()
  for (let i = 0; i < 12; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    options.push({
      label: `${d.getFullYear()}년 ${d.getMonth() + 1}월`,
      year: d.getFullYear(),
      month: d.getMonth() + 1,
    })
  }
  return options
}
