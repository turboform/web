'use client'

import { motion } from 'framer-motion'
import { ChevronRightIcon, RocketIcon, SparklesIcon, TagIcon } from 'lucide-react'
import Link from 'next/link'
import { ChangelogFeaturesList } from './changelog-features-list'
import { Button } from '@/components/ui/button'

export function ChangelogPage() {
  return (
    <div className="relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-secondary/3 via-secondary/5 to-secondary/3 -z-10"></div>
      <div className="absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-secondary/3 to-transparent -z-10"></div>
      <div className="absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l from-secondary/3 to-transparent -z-10"></div>

      {/* Hero section */}
      <section className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="absolute -top-16 -right-16 w-64 h-64 bg-secondary/3 rounded-full blur-3xl opacity-40"></div>
          <div className="absolute -bottom-32 -left-16 w-64 h-64 bg-secondary/5 rounded-full blur-3xl opacity-40"></div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mx-auto max-w-3xl text-center"
          >
            <div className="flex justify-center mb-4">
              <span className="px-3 py-1 text-sm font-medium text-gray-800 bg-primary rounded-full mb-4 inline-flex items-center gap-2 shadow-md">
                <RocketIcon className="h-4 w-4 mr-1" />
                Product Updates
              </span>
            </div>

            <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl">
              Turboform{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary to-yellow-400">
                Changelog
              </span>
            </h1>

            <div className="h-1 w-32 bg-gradient-to-r from-primary to-yellow-400 rounded-full mx-auto mt-6"></div>

            <p className="mt-6 text-lg leading-8 text-muted-foreground">
              See the evolution of Turboform, from its inception to the powerful form builder it is today. Follow our
              journey as we continue to innovate and improve.
            </p>

            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Button asChild size="lg" variant="default" className="group font-semibold">
                <Link href="/create-form">Create a Form</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="group font-semibold">
                <Link href="/pricing">
                  View pricing{' '}
                  <ChevronRightIcon className="h-4 w-4 ml-1 group-hover:ml-2 transition-all duration-200" />
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features timeline */}
      <section className="py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mx-auto max-w-2xl lg:text-center mb-16"
          >
            <span className="px-3 py-1 text-sm font-medium text-gray-800 bg-primary rounded-full mb-4 inline-flex items-center gap-2 shadow-md">
              <TagIcon className="h-4 w-4 mr-1" />
              Major Features
            </span>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">The Story So Far</h2>
            <div className="h-1 w-20 bg-gradient-to-r from-primary to-primary/50 rounded-full mx-auto mt-4"></div>
            <p className="mt-6 text-lg leading-8 text-muted-foreground">
              A chronological journey through the major features and improvements that have shaped Turboform.
            </p>
          </motion.div>

          <ChangelogFeaturesList />
        </div>
      </section>

      {/* Call to action */}
      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-3xl rounded-xl bg-white p-8 sm:p-10 shadow-lg border border-muted/30 relative overflow-hidden text-center flex flex-col items-center">
            <div className="relative">
              <div className="flex justify-center mb-6">
                <span className="px-3 py-1 text-sm font-medium text-gray-800 bg-primary rounded-full inline-flex items-center gap-2 shadow-md">
                  <SparklesIcon className="h-4 w-4" />
                  Get Started Today
                </span>
              </div>

              <h2 className="text-2xl font-bold tracking-tight text-center text-foreground sm:text-3xl">
                Ready to build your next form?
              </h2>

              <p className="mt-6 text-base leading-7 text-center text-muted-foreground">
                Join thousands of businesses that use Turboform to create beautiful, functional forms that convert. No
                credit card required to get started.
              </p>

              <div className="mt-8 flex items-center justify-center gap-x-6">
                <Button asChild size="lg" variant="default" className="group font-semibold">
                  <Link href="/create-form">Create Your First Form</Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="group">
                  <Link href="/pricing">
                    View pricing{' '}
                    <ChevronRightIcon className="h-4 w-4 ml-1 group-hover:ml-2 transition-all duration-200" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
