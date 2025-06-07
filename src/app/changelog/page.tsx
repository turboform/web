import { Metadata } from 'next'
import { ChangelogPage } from '@/components/changelog/changelog-page'

export const metadata: Metadata = {
  title: 'Changelog | Turboform',
  description: "See the latest features and improvements we've added to Turboform",
}

export default function Changelog() {
  return <ChangelogPage />
}
