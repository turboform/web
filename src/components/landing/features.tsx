import { BrainCircuitIcon, ClockIcon, DatabaseIcon, ShareIcon, MessageCircleIcon, SparklesIcon } from 'lucide-react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import Image from 'next/image'

// Animation variants for staggered animations
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
}

export function Features() {
  return (
    <div className="py-24 sm:py-32 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-secondary/3 via-secondary/5 to-secondary/3 -z-10"></div>
      <div className="absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-secondary/3 to-transparent -z-10"></div>
      <div className="absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l from-secondary/3 to-transparent -z-10"></div>
      <div className="absolute h-px w-full bg-gradient-to-r from-transparent via-border to-transparent top-0"></div>
      <div className="absolute h-px w-full bg-gradient-to-r from-transparent via-border to-transparent bottom-0"></div>

      <div className="mx-auto max-w-6xl px-6 lg:px-8 relative">
        {/* Decorative elements */}
        <div className="absolute -top-16 -right-16 w-64 h-64 bg-primary/3 rounded-full blur-3xl opacity-40"></div>
        <div className="absolute -bottom-32 -left-16 w-64 h-64 bg-secondary/5 rounded-full blur-3xl opacity-40"></div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-2xl flex flex-col items-center text-center mb-12"
        >
          <span className="px-3 py-1 text-sm font-medium text-gray-800 bg-primary rounded-full mb-4 flex items-center gap-2 shadow-md">
            <SparklesIcon className="h-4 w-4 animate-pulse" />
            Forms Made Easy
          </span>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl relative">
            A form builder that works{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary to-primary">for you</span>
          </h2>
          <div className="h-1 w-20 bg-gradient-to-r from-secondary to-primary rounded-full mx-auto mt-6"></div>
          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            TurboForm helps you create beautiful, functional forms in seconds. No more wrestling with complex builders
            or writing code.
          </p>
        </motion.div>

        <motion.div
          className="mx-auto max-w-5xl"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-3 lg:gap-y-16">
            <motion.div className="relative pl-16 group" variants={itemVariants}>
              <dt className="text-lg font-semibold leading-7 text-foreground flex items-center">
                <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-secondary to-secondary/80 shadow-md group-hover:shadow-secondary/20 transition-all duration-300 group-hover:scale-110">
                  <BrainCircuitIcon className="h-6 w-6 text-white" aria-hidden="true" />
                </div>
                <span className="bg-gradient-to-r from-foreground to-foreground bg-[length:0%_2px] group-hover:bg-[length:100%_2px] bg-left-bottom bg-no-repeat transition-all duration-500">
                  AI-Powered Form Creation
                </span>
              </dt>
              <dd className="mt-2 text-base leading-7 text-muted-foreground">
                Just describe what you need, and our AI will generate a complete form in seconds, ready to share.
              </dd>
            </motion.div>

            <motion.div className="relative pl-16 group" variants={itemVariants}>
              <dt className="text-lg font-semibold leading-7 text-foreground flex items-center">
                <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-secondary to-secondary/80 shadow-md group-hover:shadow-secondary/20 transition-all duration-300 group-hover:scale-110">
                  <ClockIcon className="h-6 w-6 text-white" aria-hidden="true" />
                </div>
                <span className="bg-gradient-to-r from-foreground to-foreground bg-[length:0%_2px] group-hover:bg-[length:100%_2px] bg-left-bottom bg-no-repeat transition-all duration-500">
                  Save Hours of Work
                </span>
              </dt>
              <dd className="mt-2 text-base leading-7 text-muted-foreground">
                <motion.span
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                  viewport={{ once: true }}
                >
                  Create complex, professional forms in under a minute that would take hours with traditional builders.
                </motion.span>
              </dd>
            </motion.div>

            <motion.div className="relative pl-16 group" variants={itemVariants}>
              <dt className="text-lg font-semibold leading-7 text-foreground flex items-center">
                <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-secondary to-secondary/80 shadow-md group-hover:shadow-secondary/20 transition-all duration-300 group-hover:scale-110">
                  <DatabaseIcon className="h-6 w-6 text-white" aria-hidden="true" />
                </div>
                <span className="bg-gradient-to-r from-foreground to-foreground bg-[length:0%_2px] group-hover:bg-[length:100%_2px] bg-left-bottom bg-no-repeat transition-all duration-500">
                  Unlimited Responses
                </span>
              </dt>
              <dd className="mt-2 text-base leading-7 text-muted-foreground">
                <motion.span
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                  viewport={{ once: true }}
                >
                  Collect as many form submissions as you need without ever hitting a limit or paying more.
                </motion.span>
              </dd>
            </motion.div>

            <motion.div
              className="relative pl-16 lg:col-span-3 flex flex-col items-start group"
              variants={itemVariants}
              transition={{ duration: 0.8 }}
            >
              <dt className="text-lg font-semibold leading-7 text-foreground flex items-center">
                <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-secondary shadow-lg group-hover:shadow-secondary/30 transition-all duration-300 group-hover:scale-110">
                  <MessageCircleIcon className="h-6 w-6 text-white" aria-hidden="true" />
                </div>
                <span className="bg-gradient-to-r from-foreground to-foreground bg-[length:0%_2px] group-hover:bg-[length:100%_2px] bg-left-bottom bg-no-repeat transition-all duration-500 text-xl">
                  Smart Chat Interface
                </span>
              </dt>
              <dd className="mt-4 text-base leading-7 text-muted-foreground w-full">
                <div className="flex flex-col md:flex-row gap-8 items-start">
                  <div className="md:w-1/2">
                    <p className="text-lg">
                      Engage with respondents through an intelligent chat UI powered by semantic search across all your
                      form responses.
                    </p>
                    <ul className="mt-6 space-y-3 text-sm">
                      {[
                        'Natural language queries with semantic understanding',
                        'Instant answers from all your form responses',
                        "Powered by OpenAI's text-embedding-3-large model",
                      ].map((item, index) => (
                        <motion.li
                          key={index}
                          initial={{ opacity: 0, x: -10 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.2 + 0.5, duration: 0.5 }}
                          viewport={{ once: true }}
                          className="flex items-start gap-2"
                        >
                          <div className="h-5 w-5 rounded-full bg-gradient-to-br from-secondary/30 to-primary/20 flex items-center justify-center mt-0.5">
                            <div className="h-2 w-2 rounded-full bg-secondary"></div>
                          </div>
                          <span>{item}</span>
                        </motion.li>
                      ))}
                    </ul>
                  </div>
                  <motion.div
                    className="md:w-1/2 bg-gradient-to-br from-background to-muted/70 border border-border/70 rounded-xl p-1 aspect-video w-full overflow-hidden relative shadow-xl group-hover:shadow-secondary/10 transition-all duration-500"
                    whileHover={{ scale: 1.02 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                  >
                    {/* Add gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 to-secondary/5 opacity-50 z-10"></div>
                    <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-bl from-white/10 via-transparent to-transparent z-10"></div>

                    <div className="absolute inset-0 flex items-center justify-center text-muted-foreground text-sm backdrop-blur-[1px]">
                      <div className="flex flex-col items-center gap-2">
                        <MessageCircleIcon className="h-10 w-10 text-secondary/60 animate-pulse" />
                        <span>Chat UI Screenshot</span>
                      </div>
                    </div>
                    <Image
                      src="/screenshots/chat.png"
                      alt="TurboForm Chat UI"
                      fill
                      className="object-cover rounded-lg"
                    />
                  </motion.div>
                </div>
              </dd>
            </motion.div>
          </dl>
        </motion.div>
      </div>
    </div>
  )
}
