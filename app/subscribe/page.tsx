"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Check } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"

// Pricing plan data
const plans = [
  {
    name: "Starter",
    description: "Perfect for small teams just getting started",
    monthlyPrice: 299,
    annualPrice: 2990,
    usersIncluded: 10,
    popular: false,
    storage: "10GB",
  },
  {
    name: "Growth",
    description: "Ideal for growing construction businesses",
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

export default function SubscribePage() {
  const [selectedPlan, setSelectedPlan] = useState("Growth")
  const [isAnnual, setIsAnnual] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const handleContinue = async () => {
    setIsLoading(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    toast({
      title: "Subscription started",
      description: `Your ${selectedPlan} plan has been activated with a 6-day free trial.`,
    })

    router.push("/dashboard")
    setIsLoading(false)
  }

  return (
    <div className="min-h-screen bg-accent/10">
      <div className="container max-w-6xl mx-auto px-4 py-12">
        <div className="mb-8">
          <Link
            href="/auth"
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Sign Up</span>
          </Link>
        </div>

        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold mb-2">Choose Your Plan</h1>
          <p className="text-muted-foreground">Select the plan that works best for your construction business</p>

          {/* Billing toggle */}
          <div className="mt-6 inline-flex items-center bg-background/50 p-1 rounded-full border border-border/40">
            <button
              onClick={() => setIsAnnual(false)}
              className={cn(
                "px-4 py-2 rounded-full text-sm font-medium transition-all",
                !isAnnual ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground",
              )}
            >
              Monthly
            </button>
            <button
              onClick={() => setIsAnnual(true)}
              className={cn(
                "px-4 py-2 rounded-full text-sm font-medium transition-all",
                isAnnual ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground",
              )}
            >
              Annual <span className="text-xs opacity-80">(Save 16%)</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={cn(
                "bg-card border rounded-2xl overflow-hidden shadow-lg transition-all hover:shadow-xl cursor-pointer",
                selectedPlan === plan.name
                  ? "border-primary ring-2 ring-primary/20"
                  : "border-border/40 hover:border-primary/50",
                plan.popular ? "relative md:scale-105" : "",
              )}
              onClick={() => setSelectedPlan(plan.name)}
            >
              {plan.popular && (
                <div className="absolute top-0 left-0 right-0 bg-primary text-primary-foreground text-center py-1 text-sm font-medium">
                  Most Popular
                </div>
              )}

              <div className={cn("p-8", plan.popular ? "pt-10" : "")}>
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-2xl font-bold">{plan.name}</h3>
                    <p className="text-muted-foreground mt-1">{plan.description}</p>
                  </div>
                  {selectedPlan === plan.name && (
                    <div className="bg-primary text-primary-foreground rounded-full p-1">
                      <Check className="h-5 w-5" />
                    </div>
                  )}
                </div>

                <div className="mb-6">
                  <div className="flex items-baseline">
                    <span className="text-4xl font-bold">£{isAnnual ? plan.annualPrice : plan.monthlyPrice}</span>
                    <span className="text-muted-foreground ml-2">{isAnnual ? "/year" : "/month"}</span>
                  </div>
                  {isAnnual && <p className="text-sm text-emerald-600 font-medium mt-1">Includes 2 months free</p>}
                  <p className="text-sm text-muted-foreground mt-2">Includes {plan.usersIncluded} users</p>
                </div>

                <div className="space-y-3 mb-6">
                  {features.map((feature, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
                      <span className="text-sm">
                        {feature === "File storage" ? `${feature} (${plan.storage})` : feature}
                      </span>
                    </div>
                  ))}
                </div>

                {isAnnual && (
                  <p className="text-xs text-center mt-3 text-emerald-600">
                    Includes 6-day free trial with annual plan
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mb-8">
          {isAnnual ? (
            <p className="text-sm text-muted-foreground">
              6-day free trial available with annual plans. Cancel before trial ends to avoid charges.
            </p>
          ) : (
            <p className="text-sm text-muted-foreground">Switch to annual billing to get a 6-day free trial.</p>
          )}
          <p className="text-sm text-muted-foreground mt-2">Additional users: +£10/user/month</p>
        </div>

        <div className="flex justify-center">
          <Button size="lg" className="px-8 rounded-xl" onClick={handleContinue} disabled={isLoading || !isAnnual}>
            {isLoading ? "Processing..." : "Continue with Annual Plan"}
          </Button>
        </div>
      </div>
    </div>
  )
}
