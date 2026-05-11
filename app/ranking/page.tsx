import { redirect } from 'next/navigation'

export default function RankingRedirectPage() {
  redirect('/prompt?sort=popular')
}
