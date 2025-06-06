import { ArrowRightIcon, Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function Testimonial() {
  return (
    <section className="py-24 sm:py-32 relative overflow-hidden bg-gradient-to-b from-background via-secondary/5 to-background">
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        <div className="flex flex-col items-center text-center mb-16">
          <span className="px-3 py-1 text-sm font-medium text-gray-800 bg-primary rounded-full mb-4 flex items-center gap-2 shadow-md">
            <Zap className="h-4 w-4" />
            Lightning Fast
          </span>

          <h2 className="mt-2 text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground mb-4">
            Lightning Fast Results
            <div className="h-1 w-20 bg-gradient-to-r from-primary to-secondary rounded-full mx-auto mt-3"></div>
          </h2>
          <p className="mt-6 text-lg leading-8 text-muted-foreground max-w-2xl">
            No more waiting around. TurboForm generates, saves, and shares your forms instantly so you can get back to
            what matters.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6 max-w-xl w-full">
            {/* Decorative blobs for visual interest */}
            <div className="absolute -top-20 -right-32 w-64 h-64 bg-primary/10 rounded-full blur-3xl opacity-40"></div>
            <div className="absolute -bottom-24 -left-32 w-64 h-64 bg-secondary/10 rounded-full blur-3xl opacity-40"></div>
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
