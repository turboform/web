import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contact Us - Turboform',
  description: 'Get in touch with the Turboform team to learn more about our AI-powered form builder',
}

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <div className="flex flex-col min-h-screen">{children}</div>
}
