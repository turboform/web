import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion'

export function FAQ() {
  return (
    <section className="py-16">
      <div className="flex flex-col items-center text-center mb-8">
        <h2 className="text-3xl font-bold mb-2">Frequently Asked Questions</h2>
        <p className="text-lg text-muted-foreground max-w-2xl">
          Everything you need to know about TurboForm. Can't find your answer?{' '}
          <a href="mailto:support@turboform.com" className="underline font-semibold text-secondary whitespace-nowrap">
            Contact us
          </a>
          .
        </p>
      </div>
      <div className="max-w-2xl mx-auto">
        <Accordion type="single" collapsible className="w-full rounded-xl border border-border bg-card">
          <AccordionItem value="faq-1" className="px-6">
            <AccordionTrigger className="text-lg font-medium">Is TurboForm really free?</AccordionTrigger>
            <AccordionContent>
              Yes! You can create unlimited forms and collect unlimited responses on the free plan. Paid plans unlock
              advanced features.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="faq-2" className="px-6">
            <AccordionTrigger className="text-lg font-medium">Can I use my own domain?</AccordionTrigger>
            <AccordionContent>
              Not yet, but custom domains will soon be available on paid plans. You will be able to publish forms under
              your own brand.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="faq-3" className="px-6">
            <AccordionTrigger className="text-lg font-medium">How do integrations work?</AccordionTrigger>
            <AccordionContent>
              Connect TurboForm to Slack, Telegram, Zapier, and more to automate notifications and workflows. Setup is
              simple from your dashboard.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="faq-4" className="px-6">
            <AccordionTrigger className="text-lg font-medium">Is my data secure?</AccordionTrigger>
            <AccordionContent>
              Absolutely. All data is encrypted in transit. We never sell or share your data.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="faq-5" className="px-6">
            <AccordionTrigger className="text-lg font-medium">Can I customize the look of my forms?</AccordionTrigger>
            <AccordionContent>
              Yes! Upload your logo, pick your colors, and make your forms match your brand perfectly.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </section>
  )
}
