'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Check, Loader2, Star } from 'lucide-react'
import { SignInDialog } from '@/components/auth/sign-in-dialog'
import { useAuth } from '@/components/auth/auth-provider'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import { getStripe } from '@/lib/stripe/client'
import { toast } from 'sonner'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import { Badge } from '@/components/ui/badge'

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
    earlyBirdMonthlyPrice: 5,
    earlyBirdYearlyPrice: 50,
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
    earlyBirdMonthlyPrice: 15,
    earlyBirdYearlyPrice: 150,
    hasDiscount: true,
    monthlyPriceId: process.env.NEXT_PUBLIC_FLOW_MONTHLY_PRICE_ID,
    yearlyPriceId: process.env.NEXT_PUBLIC_FLOW_YEARLY_PRICE_ID,
    features: [
      'Everything in Tinker',
      'Custom branding & themes *',
      'Advanced AI-driven data analysis *',
      'Integrations with Slack, Zapier, and more *',
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
    earlyBirdMonthlyPrice: 39,
    earlyBirdYearlyPrice: 390,
    hasDiscount: true,
    monthlyPriceId: process.env.NEXT_PUBLIC_OPTIMIZE_MONTHLY_PRICE_ID,
    yearlyPriceId: process.env.NEXT_PUBLIC_OPTIMIZE_YEARLY_PRICE_ID,
    features: [
      'Everything in Flow',
      'Custom domain *',
      'Advanced workflow automation *',
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

      if (result.data?.sessionId) {
        await stripe.redirectToCheckout({ sessionId: result.data.sessionId })
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
    <div className="container mx-auto max-w-7xl py-16 px-4 sm:px-6 lg:px-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold tracking-tight mb-4">Pricing Plans</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-6">
          Choose the right plan for your form-building needs. All plans include our core features.
        </p>

        {/* Early Bird Banner */}
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 max-w-3xl mx-auto mb-10 flex flex-col items-center justify-center">
          <div className="text-amber-800 font-medium flex items-center gap-2 mb-2">
            <Star className="h-5 w-5 text-amber-500 fill-amber-500" />
            <span className="font-bold">EARLY BIRD PRICING</span>
            <Star className="h-5 w-5 text-amber-500 fill-amber-500" />
          </div>
          <p className="text-amber-700 text-center">
            Limited time offer! Get 50% off all plans. Prices will increase soon.
          </p>
        </div>

        {/* Billing Toggle */}
        <div className="flex items-center justify-center space-x-4 mb-12">
          <Button
            variant={billingPeriod === 'monthly' ? 'default' : 'outline'}
            onClick={() => setBillingPeriod('monthly')}
          >
            Monthly
          </Button>
          <div className="relative flex items-center">
            <div
              className="h-6 w-10 rounded-full bg-muted flex items-center p-1 cursor-pointer border border-primary"
              onClick={() => setBillingPeriod(billingPeriod === 'monthly' ? 'yearly' : 'monthly')}
            >
              <div
                className={cn(
                  'h-4 w-4 rounded-full bg-primary shadow-sm transition-transform',
                  billingPeriod === 'yearly' ? 'translate-x-4' : 'translate-x-0'
                )}
              ></div>
            </div>
          </div>
          <Button
            variant={billingPeriod === 'yearly' ? 'default' : 'outline'}
            onClick={() => setBillingPeriod('yearly')}
          >
            Yearly{' '}
            <span className="bg-green-100 text-green-800 text-[10px] font-semibold px-1.5 py-0.5 rounded-full">
              20% off
            </span>
          </Button>
        </div>
      </div>

      {/* Pricing grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
        {pricingPlans.slice(0, 4).map((plan, idx) => (
          <div
            key={idx}
            className={cn(
              'flex flex-col rounded-xl p-6 border shadow-sm relative overflow-hidden transition-all hover:shadow-lg',
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
              <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
              <p className="text-sm text-muted-foreground mb-4 h-12">{plan.description}</p>

              <div className="mb-4">
                {plan.monthlyPrice !== null ? (
                  <>
                    {plan.hasDiscount ? (
                      <span className="text-3xl font-bold">
                        ${billingPeriod === 'monthly' ? plan.earlyBirdMonthlyPrice : plan.earlyBirdYearlyPrice}
                        <span className="text-muted-foreground text-sm ml-1 line-through">
                          ${billingPeriod === 'monthly' ? plan.monthlyPrice : plan.yearlyPrice}
                        </span>
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
                        <div className="mt-1">
                          <span className="text-xs inline-block bg-green-100 text-green-800 rounded px-1.5 py-0.5">
                            Limited-time launch pricing!
                          </span>
                        </div>
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
                  <Check className="h-5 w-5 text-primary shrink-0 mr-2" />
                  <span className="text-sm">{feature}</span>
                </div>
              ))}
            </div>

            <div className="mt-auto">
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

              <div className="mt-4 text-right">
                {plan.hasDiscount ? (
                  <Badge className="text-xs bg-yellow-100 text-yellow-800 hover:bg-yellow-100 hover:text-yellow-800">
                    * Available soon
                  </Badge>
                ) : (
                  <Badge className={plan.color}></Badge>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Enterprise plan in full width */}
      <div className="mb-16">
        <div className="rounded-xl p-6 border shadow-sm relative overflow-hidden transition-all hover:shadow-lg max-w-4xl mx-auto grid md:grid-cols-[2fr_3fr] gap-6">
          <div>
            <h3 className="text-xl font-bold mb-2">{pricingPlans[4].name}</h3>
            <p className="text-sm text-muted-foreground mb-4">{pricingPlans[4].description}</p>

            <div className="mb-4">
              <span className="text-xl font-bold">Custom Pricing</span>
            </div>

            <Button asChild variant={pricingPlans[4].buttonVariant} className="w-full">
              <Link href="/contact">{pricingPlans[4].buttonText}</Link>
            </Button>
          </div>

          <div className="space-y-3">
            {pricingPlans[4].features.map((feature, idx) => (
              <div key={idx} className="flex items-start">
                <Check className="h-5 w-5 text-primary shrink-0 mr-2" />
                <span className="text-sm">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="max-w-3xl mx-auto mt-20">
        <h2 className="text-2xl font-bold text-center mb-8">Frequently Asked Questions</h2>

        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium mb-2">Can I switch plans later?</h3>
            <p className="text-muted-foreground">
              Yes, you can upgrade, downgrade, or cancel your plan at any time. Changes to your subscription will be
              applied immediately.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-2">What happens if I exceed my monthly response limit?</h3>
            <p className="text-muted-foreground">
              If you reach your monthly response limit, you&apos;ll be notified and have the option to upgrade to a
              higher plan. No data will be lost.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-2">Is there a free trial?</h3>
            <p className="text-muted-foreground">
              Yes! The Tinker plan is free forever with limited features. For paid plans, we offer a 14-day free trial
              so you can test all features before committing.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-2">
              Do you offer discounts for nonprofits or educational institutions?
            </h3>
            <p className="text-muted-foreground">
              Yes, we offer special pricing for nonprofit organizations and educational institutions. Please{' '}
              <Link href="/contact" className="text-primary hover:underline">
                contact our sales team
              </Link>{' '}
              for more information.
            </p>
          </div>
        </div>
      </div>

      {/* Contact Section */}
      <div className="bg-primary/5 rounded-lg p-8 mt-16 text-center">
        <h2 className="text-xl font-bold mb-2">Still have questions?</h2>
        <p className="text-muted-foreground mb-4">
          Our team is here to help with any questions you might have about our pricing plans.
        </p>
        <Button asChild>
          <Link href="/contact">Contact Us</Link>
        </Button>
      </div>

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
