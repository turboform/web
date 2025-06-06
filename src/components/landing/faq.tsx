import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion'
import { motion } from 'framer-motion'
import { MessageCircleQuestionIcon } from 'lucide-react'
import Link from 'next/link'

export function FAQ() {
  return (
    <section className="py-24 sm:py-32 relative overflow-hidden bg-gradient-to-b from-background via-secondary/5 to-background">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-secondary/3 to-background -z-10"></div>
      <div className="absolute -right-32 bottom-0 w-64 h-64 bg-secondary/5 rounded-full blur-3xl"></div>
      <div className="absolute -left-32 top-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl"></div>

      <div className="mx-auto max-w-6xl px-6 lg:px-8 relative">
        {/* Decorative blobs for visual interest */}
        <div className="absolute -top-20 -right-32 w-64 h-64 bg-primary/10 rounded-full blur-3xl opacity-40"></div>
        <div className="absolute -bottom-24 -left-32 w-64 h-64 bg-secondary/10 rounded-full blur-3xl opacity-40"></div>
        <motion.div
          className="flex flex-col items-center text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.5 }}
        >
          <span className="px-3 py-1 text-sm font-medium text-gray-800 bg-primary rounded-full mb-4 flex items-center gap-2 shadow-md">
            <MessageCircleQuestionIcon className="h-4 w-4" />
            Get Answers
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold mb-4 tracking-tight text-foreground relative">
            Frequently Asked Questions
            <div className="h-1 w-20 bg-gradient-to-r from-primary to-secondary rounded-full mx-auto mt-3"></div>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Everything you need to know about TurboForm. Can't find your answer?{' '}
            <Link
              href="/contact"
              className="font-semibold text-secondary underline underline-offset-4 hover:text-secondary/80 whitespace-nowrap relative inline-block group"
            >
              Contact us
            </Link>
            .
          </p>
        </motion.div>

        <motion.div
          className="max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Accordion
            type="single"
            collapsible
            className="w-full rounded-2xl border border-border bg-background shadow-xl shadow-primary/5"
          >
            <AccordionItem value="faq-1" className="px-6 border-b border-border/50">
              <AccordionTrigger className="text-lg font-medium transition-colors py-5">
                <span className="flex items-center gap-2">Is TurboForm really free?</span>
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="pb-4"
                >
                  Yes! You can create up to 5 forms and collect unlimited responses on the free plan. Paid plans unlock
                  advanced features.
                </motion.div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="faq-2" className="px-6 border-b border-border/50">
              <AccordionTrigger className="text-lg font-medium transition-colors py-5">
                <span className="flex items-center gap-2">Can I use my own domain?</span>
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="pb-4"
                >
                  Not yet, but custom domains will soon be available on paid plans. You will be able to publish forms
                  under your own brand.
                </motion.div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="faq-3" className="px-6 border-b border-border/50">
              <AccordionTrigger className="text-lg font-medium transition-colors py-5">
                <span className="flex items-center gap-2">How do integrations work?</span>
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="pb-4"
                >
                  Connect TurboForm to Slack, Telegram, Zapier, and more to automate notifications and workflows. Setup
                  is simple from your dashboard.
                </motion.div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="faq-4" className="px-6 border-b border-border/50">
              <AccordionTrigger className="text-lg font-medium transition-colors py-5">
                <span className="flex items-center gap-2">Is my data secure?</span>
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="pb-4"
                >
                  Absolutely. All data is encrypted in transit. We never sell or share your data.
                </motion.div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="faq-5" className="px-6">
              <AccordionTrigger className="text-lg font-medium transition-colors py-5">
                <span className="flex items-center gap-2">Can I customize the look of my forms?</span>
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="pb-4"
                >
                  Yes! Upload your logo, pick your colors, and make your forms match your brand perfectly.
                </motion.div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </motion.div>
      </div>
    </section>
  )
}
