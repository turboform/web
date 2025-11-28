'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Check, Loader2, Star, SparklesIcon, ArrowRightIcon } from 'lucide-react'
import { SignInDialog } from '@/components/auth/sign-in-dialog'
import { useAuth } from '@/components/auth/auth-provider'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import { getStripe } from '@/lib/stripe/client'
import { toast } from 'sonner'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import { Badge } from '@/components/ui/badge'
import { motion } from 'framer-motion'

// Animation variants for staggered animations
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
    },
  },
}

const pricingPlans = [
  {
    name: 'Free',
    description: 'Try out TurboForm with basic features.',
    monthlyPrice: 0,
    yearlyPrice: 0,
    features: [
      'Create up to 5 forms',
      'Collect up to 100 responses',
      'Basic analytics & reporting',
      'AI-assisted form creation',
      'Export data to CSV',
      'Embed & share anywhere',
    ],
    buttonText: 'Get Started Free',
    isPopular: false,
    color: 'bg-muted/40 hover:bg-muted/60',
    textColor: 'text-foreground',
    buttonVariant: 'outline' as const,
  },
  {
    name: 'Tinker',
    description: 'Perfect for individuals getting started with forms and surveys.',
    monthlyPrice: 9,
    yearlyPrice: 90,
    hasDiscount: true,
    monthlyPriceId: process.env.NEXT_PUBLIC_TINKER_MONTHLY_PRICE_ID,
    yearlyPriceId: process.env.NEXT_PUBLIC_TINKER_YEARLY_PRICE_ID,
    features: ['Everything in Free', 'Create unlimited forms', 'Collect unlimited responses', 'Priority email support'],
    buttonText: 'Upgrade to Tinker',
    isPopular: false,
    color: 'bg-muted/40 hover:bg-muted/60',
    textColor: 'text-foreground',
    buttonVariant: 'outline' as const,
  },
  {
    name: 'Flow',
    description: 'For growing teams and professionals who need more responses and AI insights.',
    monthlyPrice: 29,
    yearlyPrice: 290,
    hasDiscount: true,
    monthlyPriceId: process.env.NEXT_PUBLIC_FLOW_MONTHLY_PRICE_ID,
    yearlyPriceId: process.env.NEXT_PUBLIC_FLOW_YEARLY_PRICE_ID,
    features: [
      'Everything in Tinker',
      'Custom branding & themes',
      'Integrations with Slack, Zapier, and more',
      'Advanced AI-driven data analysis *',
    ],
    buttonText: 'Upgrade to Flow',
    isPopular: true,
    color: 'bg-primary/10 hover:bg-primary/20',
    textColor: 'text-foreground',
    buttonVariant: 'default' as const,
  },
  {
    name: 'Optimize',
    description: 'For power users and businesses that demand deep insights and automation.',
    monthlyPrice: 79,
    yearlyPrice: 790,
    hasDiscount: true,
    monthlyPriceId: process.env.NEXT_PUBLIC_OPTIMIZE_MONTHLY_PRICE_ID,
    yearlyPriceId: process.env.NEXT_PUBLIC_OPTIMIZE_YEARLY_PRICE_ID,
    features: [
      'Everything in Flow',
      'Advanced workflow automation',
      'Custom domain *',
      'AI-powered response predictions & trends *',
      'Team support for up to 20 team members *',
      'Priority support *',
    ],
    buttonText: 'Upgrade to Optimize',
    isPopular: false,
    color: 'bg-muted/40 hover:bg-muted/60',
    textColor: 'text-foreground',
    buttonVariant: 'outline' as const,
  },
  {
    name: 'Enterprise',
    description: 'Custom solutions for large-scale data collection and enterprise needs.',
    monthlyPrice: null,
    yearlyPrice: null,
    features: [
      'Everything in Optimize',
      'Tailored response limits & dedicated infrastructure',
      'Enterprise-grade security & compliance',
      'Custom AI models for data analysis',
      'Dedicated account manager',
      'API access & premium integrations',
    ],
    buttonText: 'Contact Sales',
    isPopular: false,
    color: 'bg-muted/40 hover:bg-muted/60',
    textColor: 'text-foreground',
    buttonVariant: 'outline' as const,
  },
]

export default function PricingPage() {
  const router = useRouter()
  const { session, user, isAnonymous } = useAuth()
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly')
  const [isSignInDialogOpen, setIsSignInDialogOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [loadingPlanId, setLoadingPlanId] = useState<string | null>(null)
  const [selectedPlan, setSelectedPlan] = useState<(typeof pricingPlans)[number] | null>(null)

  const handlePlanSelect = async (plan: (typeof pricingPlans)[number]) => {
    // If user is not logged in or is anonymous, show sign in dialog
    if (!user || isAnonymous) {
      setSelectedPlan(plan) // Store the selected plan for after sign-in
      setIsSignInDialogOpen(true)
      return
    }

    try {
      setLoadingPlanId(plan.name)
      setIsLoading(true)

      // Determine which price ID to use based on billing period
      const priceId = billingPeriod === 'monthly' ? plan.monthlyPriceId : plan.yearlyPriceId

      if (!priceId) {
        toast.error('This plan is not available for purchase yet')
        return
      }

      const stripe = await getStripe()
      if (!stripe) {
        toast.error('Failed to load payment processor')
        return
      }

      // Call our API endpoint to create a checkout session
      const result = await axios.post(
        '/api/stripe/session',
        { priceId },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${session?.access_token}`,
          },
        }
      )

      if (result.data.error) {
        toast.error(result.data.error.message || 'Failed to create checkout session')
        return
      }

      if (result.data?.url) {
        // Redirect to the Stripe Checkout URL
        window.location.href = result.data.url
      } else if (result.data?.sessionId) {
        // Fallback: construct URL from session ID (for backward compatibility)
        const checkoutUrl = `https://checkout.stripe.com/c/pay/${result.data.sessionId}`
        window.location.href = checkoutUrl
      } else {
        toast.error('Invalid response from server')
      }
    } catch (error) {
      console.error('Checkout error:', error)
      toast.error('Failed to start checkout process')
    } finally {
      setIsLoading(false)
      setLoadingPlanId(null)
    }
  }

  // Handle successful sign-in, continue with payment if a plan was selected
  const handleSignInSuccess = () => {
    setIsSignInDialogOpen(false)
    // If a plan was selected before signing in, continue with that plan
    if (selectedPlan) {
      const plan = selectedPlan
      setSelectedPlan(null)
      // Process the payment in the next tick to ensure the auth state is updated
      setTimeout(() => handlePlanSelect(plan), 0)
    }
  }

  return (
    <div className="container mx-auto max-w-7xl py-16 px-4 relative">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-primary/5 rounded-full blur-3xl opacity-60 -z-10"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-secondary/5 rounded-full blur-3xl opacity-60 -z-10"></div>

      <motion.div
        className="text-center relative"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <span className="px-3 py-1 text-sm font-medium text-gray-800 bg-primary rounded-full mb-4 inline-flex items-center gap-2 shadow-md">
          <SparklesIcon className="h-4 w-4" />
          Simple & Transparent Pricing
        </span>
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 leading-tight mt-4">
          Pricing Plans
          <div className="h-1 w-20 bg-gradient-to-r from-primary to-primary/50 rounded-full mx-auto mt-4"></div>
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8 font-medium">
          Choose the right plan for your form-building needs. All plans include our core features.
        </p>

        <motion.div
          className="flex items-center justify-center space-x-4 mb-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <Button
            variant={billingPeriod === 'monthly' ? 'default' : 'outline'}
            onClick={() => setBillingPeriod('monthly')}
            className="px-6"
          >
            Monthly
          </Button>
          <div className="relative flex items-center">
            <div
              className="h-6 w-12 rounded-full bg-muted flex items-center p-1 cursor-pointer border border-gray-400 shadow-inner"
              onClick={() => setBillingPeriod(billingPeriod === 'monthly' ? 'yearly' : 'monthly')}
            >
              <motion.div
                className="h-4 w-4 rounded-full bg-primary shadow-sm border border-gray-400"
                animate={{ x: billingPeriod === 'yearly' ? 24 : 0 }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              ></motion.div>
            </div>
          </div>
          <Button
            variant={billingPeriod === 'yearly' ? 'default' : 'outline'}
            onClick={() => setBillingPeriod('yearly')}
            className="px-6"
          >
            Yearly{' '}
            <span className="ml-2 bg-green-100 text-green-800 text-[10px] font-semibold px-2 py-0.5 rounded-full">
              20% off
            </span>
          </Button>
        </motion.div>
      </motion.div>
      {/* Pricing grid */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 mb-16"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-50px' }}
      >
        {pricingPlans.slice(0, 4).map((plan, idx) => (
          <motion.div
            key={idx}
            variants={itemVariants}
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
            className={cn(
              'flex flex-col rounded-xl p-6 border shadow-md relative overflow-hidden bg-card',
              plan.isPopular ? 'border-primary ring-1 ring-primary/20' : 'border-border',
              plan.color
            )}
          >
            {plan.isPopular && (
              <div className="absolute top-0 right-0">
                <div className="bg-primary text-primary-foreground text-xs font-medium px-3 py-1 rounded-bl-lg">
                  Most Popular
                </div>
              </div>
            )}

            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-2">{plan.name}</h3>
              <p className="text-base text-muted-foreground mb-4 h-20">{plan.description}</p>

              <div className="mb-4">
                {plan.monthlyPrice !== null ? (
                  <>
                    {plan.hasDiscount ? (
                      <span className="text-3xl font-bold">
                        ${billingPeriod === 'monthly' ? plan.monthlyPrice : plan.yearlyPrice}
                      </span>
                    ) : (
                      <span className="text-3xl font-bold">
                        ${billingPeriod === 'monthly' ? plan.monthlyPrice : plan.yearlyPrice}
                      </span>
                    )}
                    {plan.monthlyPrice > 0 && (
                      <>
                        <span className="text-muted-foreground text-sm ml-1">
                          /{billingPeriod === 'monthly' ? 'month' : 'year'}
                        </span>
                      </>
                    )}
                  </>
                ) : (
                  <span className="text-xl font-bold">Custom Pricing</span>
                )}
              </div>
            </div>

            <div className="space-y-3 mb-6">
              {plan.features.map((feature, idx) => (
                <div key={idx} className="flex items-start">
                  <Check className="h-5 w-5 text-green-600 dark:text-green-400 shrink-0 mr-2" />
                  <span className="text-sm text-muted-foreground leading-relaxed">{feature}</span>
                </div>
              ))}
            </div>

            <div className="mt-auto">
              {plan.buttonText !== 'Get Started Free' && (
                <Button
                  variant={plan.buttonVariant}
                  className={cn(
                    'w-full',
                    plan.isPopular ? 'bg-primary hover:bg-primary/90' : '',
                    isLoading && loadingPlanId === plan.name ? 'bg-primary/50 text-primary-foreground' : ''
                  )}
                  onClick={() => handlePlanSelect(plan)}
                  disabled={isLoading && loadingPlanId === plan.name}
                >
                  {isLoading && loadingPlanId === plan.name ? (
                    <div className="flex items-center justify-center">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span className="ml-2">Processing...</span>
                    </div>
                  ) : (
                    plan.buttonText
                  )}
                </Button>
              )}

              <div className="mt-4 text-right">
                {idx === 2 ||
                  (idx === 3 && (
                    <Badge className="text-xs bg-yellow-100 text-yellow-800 hover:bg-yellow-100 hover:text-yellow-800">
                      * Available soon
                    </Badge>
                  ))}
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Enterprise plan in full width */}
      <motion.div
        className="mb-16"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.7 }}
      >
        <div className="rounded-2xl p-8 border border-primary/20 shadow-lg relative overflow-hidden max-w-4xl mx-auto grid md:grid-cols-[2fr_3fr] gap-8 bg-gradient-to-br from-card to-card/95">
          {/* Decorative elements */}
          <div className="absolute -top-16 -right-16 w-64 h-64 bg-primary/5 rounded-full blur-3xl opacity-50 pointer-events-none"></div>
          <div className="absolute -bottom-32 -left-16 w-64 h-64 bg-secondary/5 rounded-full blur-3xl opacity-50 pointer-events-none"></div>

          <div className="relative z-10">
            <span className="px-3 py-1 text-sm font-medium text-gray-800 bg-primary rounded-full mb-4 inline-flex items-center gap-2 shadow-md">
              <SparklesIcon className="h-4 w-4" />
              Enterprise-grade
            </span>
            <h3 className="text-2xl font-bold mb-2 mt-4">{pricingPlans[4].name}</h3>
            <p className="text-muted-foreground mb-6">{pricingPlans[4].description}</p>

            <div className="mb-6">
              <span className="text-2xl font-bold">Custom Pricing</span>
            </div>

            <Button asChild variant="default" size="lg" className="w-full group">
              <Link href="/contact" className="flex items-center justify-center gap-2">
                {pricingPlans[4].buttonText}
                <ArrowRightIcon className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </div>

          <div className="space-y-4 relative z-10">
            {pricingPlans[4].features.map((feature, idx) => (
              <motion.div
                key={idx}
                className="flex items-start"
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
              >
                <div className="bg-green-100 p-1 rounded-full mr-3 mt-0.5">
                  <Check className="h-4 w-4 text-green-600 dark:text-green-400 shrink-0" />
                </div>
                <span className="text-foreground leading-relaxed">{feature}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* FAQ Section */}
      <motion.div
        className="max-w-3xl mx-auto mt-24 relative"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.6 }}
      >
        {/* Decorative elements */}
        <div className="absolute -top-16 left-0 w-64 h-64 bg-secondary/5 rounded-full blur-3xl opacity-50 -z-10"></div>
        <div className="absolute -bottom-16 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl opacity-50 -z-10"></div>

        <div className="text-center mb-10">
          <span className="px-3 py-1 text-sm font-medium text-gray-800 bg-primary rounded-full mb-4 inline-flex items-center gap-2 shadow-md mx-auto">
            <SparklesIcon className="h-4 w-4" />
            Common Questions
          </span>
          <h2 className="text-3xl font-bold mt-4">Frequently Asked Questions</h2>
          <div className="h-1 w-16 bg-gradient-to-r from-primary to-primary/50 rounded-full mx-auto mt-4 mb-6"></div>
        </div>

        <motion.div
          className="space-y-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
        >
          <motion.div
            variants={itemVariants}
            className="bg-card rounded-xl p-6 shadow-sm border border-border/80 hover:shadow-md transition-shadow"
          >
            <h3 className="text-lg font-semibold mb-2">Can I switch plans later?</h3>
            <p className="text-muted-foreground leading-relaxed">
              Yes, you can upgrade, downgrade, or cancel your plan at any time. Changes to your subscription will be
              applied immediately.
            </p>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="bg-card rounded-xl p-6 shadow-sm border border-border/80 hover:shadow-md transition-shadow"
          >
            <h3 className="text-lg font-semibold mb-2">What happens if I exceed my monthly response limit?</h3>
            <p className="text-muted-foreground leading-relaxed">
              If you reach your monthly response limit, you&apos;ll be notified and have the option to upgrade to a
              higher plan. No data will be lost.
            </p>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="bg-card rounded-xl p-6 shadow-sm border border-border/80 hover:shadow-md transition-shadow"
          >
            <h3 className="text-lg font-semibold mb-2">Is there a free trial?</h3>
            <p className="text-muted-foreground leading-relaxed">
              Yes! The Free plan is available forever with basic features. For paid plans, we offer a 14-day free trial
              so you can test all features before committing.
            </p>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="bg-card rounded-xl p-6 shadow-sm border border-border/80 hover:shadow-md transition-shadow"
          >
            <h3 className="text-lg font-semibold mb-2">
              Do you offer discounts for nonprofits or educational institutions?
            </h3>
            <p className="text-muted-foreground leading-relaxed">
              Yes, we offer special pricing for nonprofit organizations and educational institutions. Please{' '}
              <Link href="/contact" className="text-secondary font-medium underline transition-all">
                reach out
              </Link>{' '}
              for more information.
            </p>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Contact Section */}
      <motion.div
        className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl p-10 mt-24 text-center shadow-md border border-primary/10 max-w-4xl mx-auto"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.6 }}
        whileHover={{ y: -5, transition: { duration: 0.2 } }}
      >
        <h2 className="text-2xl md:text-3xl font-bold mb-3">Still have questions?</h2>
        <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
          Our team is here to help with any questions you might have about our pricing plans or features.
        </p>
        <Button asChild size="lg" variant="default" className="group">
          <Link href="/contact" className="flex items-center gap-2">
            Contact Us
            <ArrowRightIcon className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </Button>
      </motion.div>

      {/* Sign In Dialog */}
      <SignInDialog
        isOpen={isSignInDialogOpen}
        onClose={() => setIsSignInDialogOpen(false)}
        onSignInSuccess={handleSignInSuccess}
        onSignUpSuccess={() => {
          setIsSignInDialogOpen(false)
          router.push('/signup-success')
        }}
      />
    </div>
  )
}
