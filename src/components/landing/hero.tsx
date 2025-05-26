import { ArrowRightIcon } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export function Hero() {
  return (
    <div className="relative isolate overflow-hidden">
      <div className="absolute inset-x-0 top-40 -z-10 transform-gpu overflow-hidden blur-3xl" aria-hidden="true">
        <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-primary to-secondary opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"></div>
      </div>

      <div className="mx-auto max-w-6xl px-6 py-24 sm:py-32 lg:px-8 lg:py-40">
        <div className="mx-auto max-w-4xl lg:mx-0">
          <div className="mb-8">
            <Badge className="bg-secondary text-secondary-foreground hover:bg-secondary/90 rounded-lg px-4 py-2 text-base font-semibold tracking-wide shadow-sm">
              TurboForm - Build Forms Faster
            </Badge>
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-6xl mb-6">
            Beautiful Forms <span className="text-secondary font-extrabold">Before Your Coffee Cools</span>
          </h1>
          <p className="mt-6 text-lg leading-8 text-muted-foreground max-w-2xl">
            Stop wrestling with clunky form builders. Turn any idea into a polished, share-ready form in seconds with
            our AI-powered platform.
          </p>
          <div className="mt-10 flex items-center gap-x-6">
            <Button
              size="lg"
              className="rounded-md px-6 py-6 text-base font-semibold shadow-md"
              onClick={() => document.getElementById('form-generator')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Get Started Free <ArrowRightIcon className="ml-2 h-4 w-4" />
            </Button>
            <Button size="lg" variant="outline" className="rounded-md px-6 py-6 text-base font-semibold" asChild>
              <Link href="/pricing">See Pricing</Link>
            </Button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-6 pb-24">
        <div className="mx-auto mt-16 flow-root max-w-5xl sm:mt-16">
          <div className="-m-2 rounded-xl bg-card p-2 ring-1 ring-inset ring-border lg:-m-4 lg:rounded-2xl lg:p-4">
            <div className="rounded-md bg-card shadow-md ring-1 ring-border">
              <div className="aspect-[16/9] w-full rounded-t-md overflow-hidden">
                <img
                  src="/screenshots/dashboard.png"
                  alt="TurboForm Dashboard"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="absolute inset-x-0 bottom-0 -z-10 transform-gpu overflow-hidden blur-3xl" aria-hidden="true">
        <div className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-secondary to-accent opacity-20 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]"></div>
      </div>
    </div>
  )
}
