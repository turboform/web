import { FullscreenIcon, PaletteIcon } from 'lucide-react'

export function Customization() {
  return (
    <section className="py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:text-center mb-12">
          <h2 className="text-xl font-semibold leading-7 text-secondary">Personalization</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Make Every Form Uniquely Yours
          </p>
          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            Stand out and stay on brand. Upload your logo and choose your colors for a form experience that feels truly
            yours and reflects your brand identity.
          </p>
        </div>

        <div className="mx-auto grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-2 lg:gap-y-16 items-center">
          <div className="order-2 lg:order-1">
            <div className="flex flex-col gap-8">
              <div className="flex flex-col sm:flex-row items-center gap-6 rounded-xl p-6 bg-card border border-border shadow-sm">
                <div className="h-14 w-14 rounded-full bg-secondary/15 flex items-center justify-center mb-3 sm:mb-0 text-3xl">
                  <FullscreenIcon className="h-6 w-6 text-secondary" />
                </div>
                <div className="flex flex-col items-center sm:items-start">
                  <span className="font-semibold text-lg">Custom Logo</span>
                  <span className="text-base text-muted-foreground mt-1">
                    Show off your brand and make your forms instantly recognizable to your audience.
                  </span>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row items-center gap-6 rounded-xl p-6 bg-card border border-border shadow-sm">
                <div className="h-14 w-14 rounded-full bg-secondary/15 flex items-center justify-center mb-3 sm:mb-0 text-3xl">
                  <PaletteIcon className="h-6 w-6 text-secondary" />
                </div>
                <div className="flex flex-col items-center sm:items-start">
                  <span className="font-semibold text-lg">Color Customization</span>
                  <span className="text-base text-muted-foreground mt-1">
                    Match your form to your brand colors for a cohesive and professional experience.
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="order-1 lg:order-2 mx-auto w-full max-w-lg rounded-2xl bg-muted/60 p-4 ring-1 ring-border lg:rounded-3xl">
            <div className="rounded-xl bg-card shadow-md ring-1 ring-border">
              <div className="aspect-[12/9.5] w-full rounded-t-xl overflow-hidden">
                <img
                  src="/screenshots/form-customization.png"
                  alt="Form Customization UI"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
