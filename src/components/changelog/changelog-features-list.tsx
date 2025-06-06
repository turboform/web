'use client'

import { motion } from 'framer-motion'
import {
  BrainCircuitIcon,
  BarChartIcon,
  DatabaseIcon,
  MessageCircleIcon,
  PaletteIcon,
  PenToolIcon,
  ShieldIcon,
  CheckIcon,
  ZapIcon,
  LayersIcon,
  ArrowRightIcon,
  ListFilterIcon,
} from 'lucide-react'

// Animation variants
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

// Feature release type
type FeatureRelease = {
  date: string
  title: string
  description: string
  icon: React.ReactNode
  badges?: string[]
}

export function ChangelogFeaturesList() {
  // Feature releases in chronological order (newest first)
  // Extracted from git commit history, focusing on major features only
  const featureReleases: FeatureRelease[] = [
    // Add new features at the TOP of this array for easy updates
    {
      date: 'June 2025',
      title: 'Automatic Embeddings for Form Responses',
      description:
        "Leveraging OpenAI's text-embedding-3-large model, we now automatically process and generate embeddings for form responses, enabling powerful semantic search capabilities.",
      icon: <BrainCircuitIcon className="h-6 w-6 text-white" />,
      badges: ['AI', 'Search'],
    },
    {
      date: 'April 2025',
      title: 'Cancel Subscription Functionality',
      description:
        'Added ability for users to manage and cancel their subscriptions directly from their account settings.',
      icon: <CheckIcon className="h-6 w-6 text-white" />,
      badges: ['Account'],
    },
    {
      date: 'March 2025',
      title: 'Form Analytics and Insights',
      description: 'Gain valuable insights into your form performance with detailed analytics and response tracking.',
      icon: <BarChartIcon className="h-6 w-6 text-white" />,
      badges: ['Analytics', 'Business'],
    },
    {
      date: 'March 2025',
      title: 'Beautiful Landing Page',
      description: "Completely redesigned landing page with improved UI/UX to better showcase Turboform's features.",
      icon: <PaletteIcon className="h-6 w-6 text-white" />,
      badges: ['Design', 'UI'],
    },
    {
      date: 'March 2025',
      title: 'Turnstile Integration',
      description: 'Added Cloudflare Turnstile for improved bot protection on forms without impacting user experience.',
      icon: <ShieldIcon className="h-6 w-6 text-white" />,
      badges: ['Security'],
    },
    {
      date: 'March 2025',
      title: 'Multi-Select Support',
      description: 'Forms now support multi-select fields, giving users more flexibility in data collection.',
      icon: <ListFilterIcon className="h-6 w-6 text-white" />,
      badges: ['Forms', 'UX'],
    },
    {
      date: 'March 2025',
      title: 'Short Form IDs and Form Expiration',
      description:
        'Added support for short form IDs for cleaner URLs and form expiration settings for time-sensitive forms.',
      icon: <ZapIcon className="h-6 w-6 text-white" />,
      badges: ['Forms', 'UX'],
    },
    {
      date: 'March 2025',
      title: 'Form Actions',
      description:
        'New action system allows forms to trigger specific actions when submitted, enabling powerful automation workflows.',
      icon: <ArrowRightIcon className="h-6 w-6 text-white" />,
      badges: ['Automation', 'Workflow'],
    },
    {
      date: 'March 2025',
      title: 'Anonymous Sign-ins',
      description:
        'Support for anonymous sign-ins allows users to fill forms without creating an account while still tracking their responses.',
      icon: <ShieldIcon className="h-6 w-6 text-white" />,
      badges: ['Security', 'UX'],
    },
    {
      date: 'March 2025',
      title: 'Form Generation Endpoint',
      description: 'New API endpoint for programmatic form generation, enabling developers to create forms on the fly.',
      icon: <PenToolIcon className="h-6 w-6 text-white" />,
      badges: ['API', 'Developers'],
    },
    {
      date: 'March 2025',
      title: 'Select Field Support and API Routes',
      description: 'Added support for select dropdown fields and comprehensive API routes for form management.',
      icon: <LayersIcon className="h-6 w-6 text-white" />,
      badges: ['Forms', 'API'],
    },
    {
      date: 'March 2025',
      title: 'Form Editing Capabilities',
      description: 'Enhanced form editing interface with live preview and intuitive controls.',
      icon: <PenToolIcon className="h-6 w-6 text-white" />,
      badges: ['Forms', 'UI'],
    },
    {
      date: 'March 2025',
      title: 'Supabase Integration',
      description: 'Integrated Supabase for robust authentication, database, and storage capabilities.',
      icon: <DatabaseIcon className="h-6 w-6 text-white" />,
      badges: ['Infrastructure', 'Backend'],
    },
  ]

  return (
    <motion.div
      className="mx-auto"
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
    >
      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-12 top-0 bottom-0 w-0.5 bg-gradient-to-b from-secondary/40 via-primary/40 to-secondary/0 z-0 hidden md:block"></div>

        <div className="space-y-12">
          {featureReleases.map((feature, index) => (
            <motion.div
              key={index}
              className={`relative flex flex-col md:flex-row gap-8 md:pb-8`}
              variants={itemVariants}
            >
              {/* Date and icon */}
              <div className="md:w-1/4 flex flex-row md:flex-col md:items-end items-center">
                <div className="mr-4 md:mr-0 md:mb-4 text-muted-foreground font-medium">{feature.date}</div>
                <div className="relative">
                  <div
                    className={`z-10 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-primary to-yellow-400 shadow-md shadow-secondary/10`}
                  >
                    {feature.icon}
                  </div>
                  {/* Connecting line for desktop */}
                  <div className="absolute top-1/2 -translate-y-1/2 left-full h-px w-8 bg-primary/10/40 hidden md:block"></div>
                </div>
              </div>

              {/* Feature content */}
              <div
                className={`md:w-3/4 bg-gradient-to-br from-yellow-50 to-primary/10 rounded-xl p-6 border border-primary/20 shadow-sm`}
              >
                <h3 className="text-xl font-bold text-gray-800">{feature.title}</h3>
                <p className="mt-2 text-muted-foreground">{feature.description}</p>

                {/* Feature badges */}
                {feature.badges && feature.badges.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {feature.badges.map((badge, badgeIndex) => (
                      <span
                        key={badgeIndex}
                        className="px-3 py-1 text-sm font-medium text-gray-800 bg-primary rounded-full inline-flex items-center gap-2 shadow-md"
                      >
                        {badge}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          ))}

          {/* Initial launch */}
          <motion.div className="relative flex flex-col md:flex-row gap-8" variants={itemVariants}>
            <div className="md:w-1/4 flex flex-row md:flex-col md:items-end items-center">
              <div className="mr-4 md:mr-0 md:mb-4 text-muted-foreground font-medium">March 2025</div>
              <div className="relative">
                <div
                  className={`z-10 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-primary to-yellow-400 shadow-md shadow-secondary/10`}
                >
                  <span className="text-xl font-bold text-white">1.0</span>
                </div>
                <div className="absolute top-1/2 -translate-y-1/2 left-full h-px w-8 bg-primary/10/40 hidden md:block"></div>
              </div>
            </div>

            <div
              className={`md:w-3/4 bg-gradient-to-br from-yellow-50 to-primary/10 rounded-xl p-6 border border-primary/20 shadow-sm`}
            >
              <h3 className="text-xl font-bold text-gray-800">Initial Launch</h3>
              <p className="mt-2 text-muted-foreground">
                Turboform launched with its core form creation and management capabilities, built on Next.js and
                Supabase.
              </p>

              <div className="mt-4 flex flex-wrap gap-2">
                <span className="px-3 py-1 text-sm font-medium text-gray-800 bg-primary rounded-full inline-flex items-center gap-2 shadow-md">
                  Launch
                </span>
                <span className="px-3 py-1 text-sm font-medium text-gray-800 bg-primary rounded-full inline-flex items-center gap-2 shadow-md">
                  Milestone
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  )
}
