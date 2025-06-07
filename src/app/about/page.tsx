import Image from 'next/image'
import { Metadata } from 'next'
import { Separator } from '@/components/ui/separator'

export const metadata: Metadata = {
  title: 'About | TurboForm',
  description: 'Learn about the origins and mission of TurboForm.',
}

export default function AboutPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] py-16 px-4 bg-muted/30">
      {/* Logo */}
      <div className="mb-10 flex justify-center">
        <Image
          src="/images/logo.png"
          alt="TurboForm Logo"
          width={96}
          height={96}
          className="rounded-full drop-shadow-md"
          priority
        />
      </div>

      {/* Story */}
      <div className="max-w-3xl w-full bg-background rounded-xl shadow-sm p-8 md:p-12 mb-10 flex flex-col items-center">
        <h1 className="text-4xl font-bold mb-6 text-center">About TurboForm</h1>
        <div className="space-y-5 text-lg font-medium text-muted-foreground leading-relaxed text-left">
          <p>
            TurboForm started out of a simple frustration: gathering feedback and building forms should not be gatekept
            by expensive pricing or locked behind proprietary software. I believe that everyone, from solo makers to
            large teams, deserves the tools to collect insights and improve their products without barriers. My mission
            is to make feedback accessible, transparent, and fair for all.
          </p>
          <p>
            That’s why I built TurboForm as an open source alternative to Typeform, harnessing the power of AI to make
            form creation and analysis effortless. I am passionate about building great products and empowering others
            to do the same. With TurboForm, you can focus on what matters - creating value for your users - while I
            handle the complexity behind the scenes. Because building good products is what I live for.
          </p>
        </div>
        <div className="my-8 w-full">
          <Separator className="bg-muted-foreground/30" />
        </div>
        <div className="flex flex-col items-center">
          <Image
            src="https://krleqnhlvnyqtkqoyogw.supabase.co/storage/v1/object/public/public-assets/founder1.jpeg"
            alt="Founder profile"
            width={150}
            height={150}
            className="rounded-full border border-muted mb-3 object-cover"
          />
          <div className="font-semibold text-lg">Nico Botha</div>
          <div className="flex gap-4 mt-2">
            <a
              href="https://x.com/nwbotha"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="X profile"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <title>X</title>
                <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />
              </svg>
            </a>
            <a
              href="https://github.com/turboform"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground"
              aria-label="GitHub"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                color="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <title>GitHub</title>
                <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
                <path d="M9 18c-4.51 2-5-2-7-2" />
              </svg>
            </a>
            <a
              href="https://linkedin.com/in/nico-botha"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn profile"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <title>LinkedIn</title>
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                <rect x="2" y="9" width="4" height="12" />
                <circle cx="4" cy="4" r="2" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
