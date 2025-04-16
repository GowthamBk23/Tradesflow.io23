"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Check } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"

// Common features across all plans
const features = [
  "Unlimited projects",
  "Unlimited clients",
  "Project & task management",
  "AI scheduling",
  "Client portal",
  "Invoicing & contracts",
  "Real-time chat",
  "Clock-in/out with GPS",
  "File storage",
  "Priority support",
]

// Pricing plan data
const plans = [
  {
    name: "Starter",
    description: "Perfect for small trades teams just getting started",
    monthlyPrice: 299,
    annualPrice: 2990,
    usersIncluded: 10,
    popular: false,
    storage: "10GB",
  },
  {
    name: "Growth",
    description: "Ideal for growing trade businesses",
    monthlyPrice: 479,
    annualPrice: 4790,
    usersIncluded: 20,
    popular: true,
    storage: "50GB",
  },
  {
    name: "Pro",
    description: "For established businesses with larger teams",
    monthlyPrice: 699,
    annualPrice: 6990,
    usersIncluded: 40,
    popular: false,
    storage: "100GB",
  },
]

export default function PricingSection() {
  const [isAnnual, setIsAnnual] = useState(true) // Default to annual
  const { toast } = useToast()

  const handleStartTrial = (planName: string) => {
    toast({
      title: `Starting your ${planName} plan`,
      description: "Taking you to the registration page...",
      duration: 2000,
    })
  }

  return (
    <section id="pricing" className="py-20 md:py-32 bg-accent/30">
      <div className="container mx-auto px-4">
        <header className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Simple, Transparent Pricing</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Choose the plan that works best for your trade business
          </p>

          {/* Billing toggle */}
          <div className="mt-8 inline-flex items-center bg-background/50 p-1 rounded-full border border-border/40">
            <button
              onClick={() => setIsAnnual(false)}
              className={cn(
                "px-4 py-2 rounded-full text-sm font-medium transition-all",
                !isAnnual ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground",
              )}
              aria-pressed={!isAnnual}
            >
              Monthly
            </button>
            <button
              onClick={() => setIsAnnual(true)}
              className={cn(
                "px-4 py-2 rounded-full text-sm font-medium transition-all",
                isAnnual ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground",
              )}
              aria-pressed={isAnnual}
            >
              Annual <span className="text-xs opacity-80">(Save 16%)</span>
            </button>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan) => (
            <article
              key={plan.name}
              className={cn(
                "bg-card border border-border/40 rounded-2xl overflow-hidden shadow-lg transition-all hover:shadow-xl hover:translate-y-[-4px]",
                plan.popular ? "relative md:scale-105 border-primary/50" : "",
              )}
            >
              {plan.popular && (
                <div className="absolute top-0 left-0 right-0 bg-primary text-primary-foreground text-center py-1 text-sm font-medium">
                  Most Popular
                </div>
              )}

              <div className={cn("p-8", plan.popular ? "pt-10" : "")}>
                <h3 className="text-2xl font-bold">{plan.name}</h3>
                <p className="text-muted-foreground mt-1 h-12">{plan.description}</p>

                <div className="mt-6 mb-6">
                  <div className="flex items-baseline">
                    <span className="text-4xl font-bold">£{isAnnual ? plan.annualPrice : plan.monthlyPrice}</span>
                    <span className="text-muted-foreground ml-2">{isAnnual ? "/year" : "/month"}</span>
                  </div>
                  {isAnnual && <p className="text-sm text-emerald-600 font-medium mt-1">Includes 2 months free</p>}
                  <p className="text-sm text-muted-foreground mt-2">Includes {plan.usersIncluded} users</p>
                </div>

                <ul className="space-y-3 mb-8" aria-label={`${plan.name} plan features`}>
                  {features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" aria-hidden="true" />
                      <span className="text-sm">
                        {feature === "File storage" ? `${feature} (${plan.storage})` : feature}
                      </span>
                    </li>
                  ))}
                </ul>

                <Link href="/auth" onClick={() => handleStartTrial(plan.name)}>
                  <Button
                    size="lg"
                    className={cn("w-full rounded-xl", plan.popular ? "" : "bg-primary/90 hover:bg-primary")}
                  >
                    Get Started
                  </Button>
                </Link>

                {isAnnual && (
                  <p className="text-xs text-center mt-3 text-emerald-600">
                    Includes 6-day free trial with annual plan
                  </p>
                )}
              </div>
            </article>
          ))}
        </div>

        <footer className="text-center mt-8 text-sm text-muted-foreground">
          {isAnnual ? (
            <p>6-day free trial available with annual plans. Cancel before trial ends to avoid charges.</p>
          ) : (
            <p>Switch to annual billing to get a 6-day free trial.</p>
          )}
          <p className="mt-2 font-medium">Additional users: +£10/user/month</p>
        </footer>
      </div>
    </section>
  )
}
