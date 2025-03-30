"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Check, Star } from "lucide-react";
import { SignInDialog } from "@/components/auth/sign-in-dialog";
import { useAuth } from "@/components/auth/auth-provider";
import { cn } from "@/lib/utils";
import Link from "next/link";

const pricingPlans = [
  {
    name: "Tinker",
    description: "Perfect for individuals getting started with forms and surveys.",
    monthlyPrice: 0,
    yearlyPrice: 0,
    features: [
      "Create unlimited forms",
      "Collect up to 100 responses per month",
      "Basic analytics & reporting",
      "AI-assisted form creation (limited)",
      "Embed & share anywhere"
    ],
    buttonText: "Get Started Free",
    isPopular: false,
    color: "bg-muted/40 hover:bg-muted/60",
    textColor: "text-foreground",
    buttonVariant: "outline" as const
  },
  {
    name: "Flow",
    description: "For growing teams and professionals who need more responses and AI insights.",
    monthlyPrice: 29,
    yearlyPrice: 290,
    features: [
      "Up to 5,000 responses per month",
      "Advanced AI-driven data analysis",
      "Custom branding & themes",
      "Integrations with Slack, Zapier, and more",
      "Export data to CSV & Google Sheets"
    ],
    buttonText: "Upgrade to Flow",
    isPopular: true,
    color: "bg-primary/10 hover:bg-primary/20",
    textColor: "text-foreground",
    buttonVariant: "default" as const
  },
  {
    name: "Optimize",
    description: "For power users and businesses that demand deep insights and automation.",
    monthlyPrice: 79,
    yearlyPrice: 790,
    features: [
      "Unlimited responses",
      "AI-powered response predictions & trends",
      "Advanced workflow automation",
      "White-labeling & custom domains",
      "Priority support & team collaboration tools"
    ],
    buttonText: "Upgrade to Optimize",
    isPopular: false,
    color: "bg-muted/40 hover:bg-muted/60",
    textColor: "text-foreground",
    buttonVariant: "outline" as const
  },
  {
    name: "Enterprise",
    description: "Custom solutions for large-scale data collection and enterprise needs.",
    monthlyPrice: null,
    yearlyPrice: null,
    features: [
      "Tailored response limits & dedicated infrastructure",
      "Enterprise-grade security & compliance",
      "Custom AI models for data analysis",
      "Dedicated account manager",
      "API access & premium integrations"
    ],
    buttonText: "Contact Sales",
    isPopular: false,
    color: "bg-muted/40 hover:bg-muted/60",
    textColor: "text-foreground",
    buttonVariant: "outline" as const
  }
];

export default function PricingPage() {
  const { user, isAnonymous } = useAuth();
  const [billingPeriod, setBillingPeriod] = useState<"monthly" | "yearly">("monthly");
  const [isSignInDialogOpen, setIsSignInDialogOpen] = useState(false);

  const handlePlanSelect = (plan: typeof pricingPlans[number]) => {
    // If user is not logged in or is anonymous, show sign in dialog
    if (!user || isAnonymous) {
      setIsSignInDialogOpen(true);
      return;
    }

    // Otherwise, we would handle the plan selection
    // This will be implemented in the next part of the integration
    console.log("Selected plan:", plan.name);
  };

  return (
    <div className="container mx-auto max-w-7xl py-16 px-4 sm:px-6 lg:px-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold tracking-tight mb-4">Pricing Plans</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-6">
          Choose the right plan for your form-building needs. All plans include our core features.
        </p>

        {/* Early Bird Banner */}
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 max-w-2xl mx-auto mb-10 flex items-center justify-center">
          <div className="text-amber-800 font-medium flex items-center gap-2">
            <Star className="h-5 w-5 text-amber-500 fill-amber-500" />
            <span>Early Bird Pricing! Limited time offer for our launch. Save up to 40% off regular prices.</span>
          </div>
        </div>

        {/* Billing Toggle */}
        <div className="flex items-center justify-center space-x-4 mb-12">
          <button
            className={cn(
              "text-sm font-medium px-3 py-2 rounded-md",
              billingPeriod === "monthly" ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground"
            )}
            onClick={() => setBillingPeriod("monthly")}
          >
            Monthly
          </button>
          <div className="relative flex items-center">
            <div className="h-6 w-10 rounded-full bg-muted flex items-center p-1 cursor-pointer"
              onClick={() => setBillingPeriod(billingPeriod === "monthly" ? "yearly" : "monthly")}>
              <div className={cn(
                "h-4 w-4 rounded-full bg-primary shadow-sm transition-transform",
                billingPeriod === "yearly" ? "translate-x-4" : "translate-x-0"
              )}></div>
            </div>
          </div>
          <button
            className={cn(
              "text-sm font-medium px-3 py-2 rounded-md flex items-center gap-1.5",
              billingPeriod === "yearly" ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground"
            )}
            onClick={() => setBillingPeriod("yearly")}
          >
            Yearly <span className="bg-green-100 text-green-800 text-[10px] font-semibold px-1.5 py-0.5 rounded-full">20% off</span>
          </button>
        </div>
      </div>

      {/* First 3 plans in a row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
        {pricingPlans.slice(0, 3).map((plan, index) => (
          <div
            key={plan.name}
            className={cn(
              "rounded-xl p-6 border shadow-sm relative overflow-hidden transition-all hover:shadow-lg",
              plan.isPopular ? "border-primary ring-1 ring-primary/20" : "border-border"
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
              <p className="text-sm text-muted-foreground mb-4 h-12">
                {plan.description}
              </p>

              <div className="mb-4">
                {plan.monthlyPrice !== null ? (
                  <>
                    <span className="text-3xl font-bold">
                      ${billingPeriod === "monthly" ? plan.monthlyPrice : plan.yearlyPrice}
                    </span>
                    {plan.monthlyPrice > 0 && (
                      <>
                        <span className="text-muted-foreground text-sm ml-1">
                          /{billingPeriod === "monthly" ? "month" : "year"}
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

            <Button
              variant={plan.buttonVariant}
              className={cn(
                "w-full",
                plan.isPopular ? "bg-primary hover:bg-primary/90" : ""
              )}
              onClick={() => handlePlanSelect(plan)}
            >
              {plan.buttonText}
            </Button>
          </div>
        ))}
      </div>

      {/* Enterprise plan in full width */}
      <div className="mb-16">
        <div
          className="rounded-xl p-6 border shadow-sm relative overflow-hidden transition-all hover:shadow-lg max-w-4xl mx-auto grid md:grid-cols-[2fr_3fr] gap-6"
        >
          <div>
            <h3 className="text-xl font-bold mb-2">{pricingPlans[3].name}</h3>
            <p className="text-sm text-muted-foreground mb-4">
              {pricingPlans[3].description}
            </p>

            <div className="mb-4">
              <span className="text-xl font-bold">Custom Pricing</span>
            </div>

            <Button
              variant={pricingPlans[3].buttonVariant}
              className="w-full"
              onClick={() => handlePlanSelect(pricingPlans[3])}
            >
              {pricingPlans[3].buttonText}
            </Button>
          </div>

          <div className="space-y-3">
            {pricingPlans[3].features.map((feature, idx) => (
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
              Yes, you can upgrade, downgrade, or cancel your plan at any time. Changes to your subscription will be applied immediately.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-2">What happens if I exceed my monthly response limit?</h3>
            <p className="text-muted-foreground">
              If you reach your monthly response limit, you&apos;ll be notified and have the option to upgrade to a higher plan. No data will be lost.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-2">Is there a free trial?</h3>
            <p className="text-muted-foreground">
              Yes! The Tinker plan is free forever with limited features. For paid plans, we offer a 14-day free trial so you can test all features before committing.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-2">Do you offer discounts for nonprofits or educational institutions?</h3>
            <p className="text-muted-foreground">
              Yes, we offer special pricing for nonprofit organizations and educational institutions. Please <Link href="/contact" className="text-primary hover:underline">contact our sales team</Link> for more information.
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
        onSignInSuccess={() => setIsSignInDialogOpen(false)}
      />
    </div>
  );
}
