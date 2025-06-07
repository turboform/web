import { motion } from 'framer-motion'
import { BicepsFlexed, ChartBarIcon, ClipboardIcon, FileTextIcon } from 'lucide-react'

// Animation variants for containers
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
}

// Animation variants for individual items
const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
}

interface UseCaseCardProps {
  icon: React.ReactNode
  title: string
  description: string
}

function UseCaseCard({ icon, title, description }: UseCaseCardProps) {
  return (
    <motion.div
      className="flex flex-col items-center bg-card rounded-xl p-6 border border-border shadow-sm text-center group hover:shadow-lg hover:border-secondary/20 transition-all duration-500 hover:-translate-y-1 relative overflow-hidden"
      variants={itemVariants}
      whileHover={{ scale: 1.02 }}
    >
      {/* Background gradient effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-secondary/5 to-secondary/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

      {/* Content */}
      <motion.div
        className="bg-gradient-to-br from-secondary/20 to-secondary/10 p-4 rounded-full mb-4 group-hover:from-secondary/30 group-hover:to-secondary/20 transition-all duration-300"
        whileHover={{ scale: 1.1, rotate: 5 }}
      >
        <span className="text-2xl">{icon}</span>
      </motion.div>
      <span className="font-semibold text-lg mb-2 relative z-10 bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text group-hover:text-transparent transition-all duration-300">
        {title}
      </span>
      <span className="text-base text-muted-foreground relative z-10">{description}</span>

      {/* Corner accent */}
      <div className="absolute top-0 right-0 w-12 h-12 bg-gradient-to-bl from-secondary/10 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
    </motion.div>
  )
}

export function UseCases() {
  const useCases = [
    {
      icon: <FileTextIcon className="h-6 w-6" />,
      title: 'Lead Capture',
      description: 'Create beautiful forms to collect leads and grow your audience—no code required.',
    },
    {
      icon: <ClipboardIcon className="h-6 w-6" />,
      title: 'Event Registration',
      description: 'Streamline event sign-ups with customizable registration forms that look professional.',
    },
    {
      icon: <ChartBarIcon className="h-6 w-6" />,
      title: 'Customer Surveys',
      description: 'Gather valuable feedback and insights to improve your products and services.',
    },
  ]

  return (
    <section className="py-24 sm:py-32 relative overflow-hidden bg-gradient-to-b from-background via-secondary/5 to-background border-y border-border">
      {/* Background accents */}
      <div className="absolute inset-0 bg-gradient-to-tr from-secondary/3 to-transparent opacity-30"></div>
      <div className="absolute -left-32 -bottom-32 w-64 h-64 bg-secondary/5 rounded-full blur-3xl"></div>
      <div className="absolute -right-32 -top-32 w-64 h-64 bg-secondary/5 rounded-full blur-3xl"></div>

      <div className="relative mx-auto max-w-6xl px-6 lg:px-8">
        <motion.div
          className="flex flex-col items-center text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.5 }}
        >
          <span className="px-3 py-1 text-sm font-medium text-gray-800 bg-primary rounded-full mb-4 flex items-center gap-2 shadow-md">
            <BicepsFlexed className="h-4 w-4" />
            Power & Flexibility
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold mb-4 tracking-tight text-foreground relative">
            Popular Use Cases
            <div className="h-1 w-20 bg-gradient-to-r from-primary to-secondary rounded-full mx-auto mt-3"></div>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl">
            TurboForm is flexible enough for teams, creators, and businesses of all sizes. Here are just a few ways our
            users get value every day.
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mx-auto"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
        >
          {useCases.map((useCase, index) => (
            <UseCaseCard key={index} icon={useCase.icon} title={useCase.title} description={useCase.description} />
          ))}
        </motion.div>
      </div>
    </section>
  )
}
