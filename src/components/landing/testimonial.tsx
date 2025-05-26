import { ArrowRightIcon, ClockIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function Testimonial() {
  return (
    <section className="py-16 sm:py-24 bg-gradient-to-br from-muted/50 to-background">
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        <div className="mx-auto max-w-xl text-center">
          <div className="inline-flex items-center justify-center p-2 bg-primary/10 rounded-full mb-3">
            <ClockIcon className="h-6 w-6 text-secondary" />
          </div>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">Lightning Fast Results</h2>
          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            No more waiting around. TurboForm generates, saves, and shares your forms instantly so you can get back to
            what matters.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6 max-w-3xl">
            <Button
              size="lg"
              className="rounded-md px-6 py-6 text-base font-semibold shadow-md w-full"
              onClick={() => document.getElementById('form-generator')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Try it now <ArrowRightIcon className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
