import { BrainCircuitIcon, ClockIcon, DatabaseIcon, ShareIcon } from 'lucide-react'

export function Features() {
  return (
    <div className="py-24 sm:py-32 bg-secondary/5 border-y border-border">
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:text-center">
          <h2 className="text-xl font-semibold leading-7 text-secondary">Forms Made Easy</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            A form builder that works for you
          </p>
          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            TurboForm helps you create beautiful, functional forms in seconds. No more wrestling with complex builders
            or writing code.
          </p>
        </div>

        <div className="mx-auto mt-16 max-w-5xl sm:mt-20">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-2 lg:gap-y-16">
            <div className="relative pl-16">
              <dt className="text-lg font-semibold leading-7 text-foreground">
                <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-secondary">
                  <BrainCircuitIcon className="h-6 w-6 text-white" aria-hidden="true" />
                </div>
                AI-Powered Form Creation
              </dt>
              <dd className="mt-2 text-base leading-7 text-muted-foreground">
                Just describe what you need, and our AI will generate a complete form in seconds, ready to share.
              </dd>
            </div>

            <div className="relative pl-16">
              <dt className="text-lg font-semibold leading-7 text-foreground">
                <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-secondary">
                  <ShareIcon className="h-6 w-6 text-white" aria-hidden="true" />
                </div>
                One-Click Sharing
              </dt>
              <dd className="mt-2 text-base leading-7 text-muted-foreground">
                Forms stuck in your dashboard help no one. Share a memorable link and start collecting answers right
                away.
              </dd>
            </div>

            <div className="relative pl-16">
              <dt className="text-lg font-semibold leading-7 text-foreground">
                <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-secondary">
                  <DatabaseIcon className="h-6 w-6 text-white" aria-hidden="true" />
                </div>
                Unlimited Responses
              </dt>
              <dd className="mt-2 text-base leading-7 text-muted-foreground">
                Collect as many form submissions as you need without ever hitting a limit or paying more.
              </dd>
            </div>

            <div className="relative pl-16">
              <dt className="text-lg font-semibold leading-7 text-foreground">
                <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-secondary">
                  <ClockIcon className="h-6 w-6 text-white" aria-hidden="true" />
                </div>
                Save Hours of Work
              </dt>
              <dd className="mt-2 text-base leading-7 text-muted-foreground">
                Create complex, professional forms in under a minute that would take hours with traditional builders.
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  )
}
