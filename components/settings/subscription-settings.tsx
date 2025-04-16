"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
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
  },
  {
    name: "Growth",
    description: "Ideal for growing construction businesses",
    monthlyPrice: 479,
    annualPrice: 4790,
    usersIncluded: 20,
    popular: true,
  },
  {
    name: "Pro",
    description: "For established businesses with larger teams",
    monthlyPrice: 699,
    annualPrice: 6990,
    usersIncluded: 40,
    popular: false,
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

export default function SubscriptionSettings() {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [billingCycle, setBillingCycle] = useState("annual")
  const [currentPlan, setCurrentPlan] = useState("Growth")
  const [userCount, setUserCount] = useState(20)

  const selectedPlan = plans.find((plan) => plan.name === currentPlan) || plans[1]
  const baseCost = billingCycle === "monthly" ? selectedPlan.monthlyPrice : selectedPlan.annualPrice
  const additionalUserCost = 10
  const additionalUsers = Math.max(0, userCount - selectedPlan.usersIncluded)
  const additionalUserTotal = additionalUsers * additionalUserCost * (billingCycle === "annual" ? 12 : 1)
  const total = baseCost + additionalUserTotal

  const handleUpdateBilling = async () => {
    setIsLoading(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    toast({
      title: "Redirecting to Stripe",
      description: "You will be redirected to Stripe to update your billing information.",
    })

    // In a real app, you would redirect to Stripe
    window.open("https://stripe.com", "_blank")

    setIsLoading(false)
  }

  const handleChangePlan = async (planName: string) => {
    setIsLoading(true)
    setCurrentPlan(planName)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    toast({
      title: "Plan updated",
      description: `Your subscription has been updated to the ${planName} plan.`,
    })

    setIsLoading(false)
  }

  const handleCancelSubscription = async () => {
    setIsLoading(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    toast({
      title: "Subscription cancelled",
      description: "Your subscription has been cancelled. You will have access until the end of your billing period.",
      variant: "destructive",
    })

    setIsLoading(false)
  }

  const handleUserCountChange = (increment: boolean) => {
    setUserCount((prev) => {
      const newCount = increment ? prev + 1 : prev - 1
      return Math.max(selectedPlan.usersIncluded, newCount) // Minimum users based on plan
    })
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Subscription Management</h3>
        <p className="text-sm text-muted-foreground">
          Manage your subscription plan, billing cycle, and payment information.
        </p>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div className="flex flex-col gap-1">
                <h3 className="text-lg font-semibold">Current Plan</h3>
                <p className="text-2xl font-bold">{currentPlan}</p>
                <p className="text-sm text-muted-foreground">{selectedPlan.description}</p>
              </div>
              <div className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100 text-xs font-medium px-2.5 py-0.5 rounded">
                Active
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="billingCycle">Billing Cycle</Label>
                <div className="text-sm text-muted-foreground">
                  {billingCycle === "monthly" ? "Monthly billing" : "Annual billing (save 16%)"}
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`text-sm ${billingCycle === "monthly" ? "font-medium" : "text-muted-foreground"}`}>
                  Monthly
                </span>
                <Switch
                  id="billingCycle"
                  checked={billingCycle === "annual"}
                  onCheckedChange={(checked) => setBillingCycle(checked ? "annual" : "monthly")}
                />
                <span className={`text-sm ${billingCycle === "annual" ? "font-medium" : "text-muted-foreground"}`}>
                  Annual
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="userCount">User Count</Label>
                <div className="text-sm text-muted-foreground">
                  Minimum {selectedPlan.usersIncluded} users included with your plan
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleUserCountChange(false)}
                  disabled={userCount <= selectedPlan.usersIncluded}
                >
                  <span className="text-lg">-</span>
                </Button>
                <span className="w-8 text-center">{userCount}</span>
                <Button variant="outline" size="icon" onClick={() => handleUserCountChange(true)}>
                  <span className="text-lg">+</span>
                </Button>
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t">
              <h4 className="font-medium">Subscription Details</h4>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">
                    {currentPlan} plan ({billingCycle === "monthly" ? "monthly" : "annual"})
                  </span>
                  <span className="text-sm font-medium">£{baseCost.toFixed(2)}</span>
                </div>
                {additionalUsers > 0 && (
                  <div className="flex justify-between">
                    <span className="text-sm">
                      Additional users ({additionalUsers} × £{additionalUserCost.toFixed(2)}/month)
                    </span>
                    <span className="text-sm font-medium">£{additionalUserTotal.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between pt-2 border-t">
                  <span className="font-medium">Total</span>
                  <span className="font-medium">£{total.toFixed(2)}</span>
                </div>
              </div>

              <div className="text-sm">
                <p>
                  Next billing date: <span className="font-medium">May 15, 2023</span>
                </p>
                <p className="text-muted-foreground mt-1">
                  Your subscription will automatically renew on the next billing date.
                </p>
              </div>
            </div>

            <div className="pt-4 border-t">
              <h4 className="font-medium mb-4">Change Plan</h4>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {plans.map((plan) => (
                  <Card
                    key={plan.name}
                    className={cn(
                      "cursor-pointer transition-all hover:border-primary",
                      currentPlan === plan.name ? "border-primary bg-primary/5" : "border-border/40",
                    )}
                    onClick={() => handleChangePlan(plan.name)}
                  >
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h5 className="font-semibold">{plan.name}</h5>
                          <p className="text-xs text-muted-foreground">{plan.usersIncluded} users</p>
                        </div>
                        {currentPlan === plan.name && (
                          <div className="bg-primary/20 text-primary text-xs px-2 py-0.5 rounded-full">Current</div>
                        )}
                      </div>
                      <div className="text-sm font-medium">
                        £{billingCycle === "monthly" ? plan.monthlyPrice : plan.annualPrice}
                        <span className="text-xs text-muted-foreground">
                          /{billingCycle === "monthly" ? "mo" : "yr"}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button onClick={handleUpdateBilling} disabled={isLoading} className="flex-1">
                Manage via Stripe
              </Button>

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" className="flex-1">
                    Cancel Subscription
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. Your subscription will be cancelled, but you will still have access
                      until the end of your current billing period.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleCancelSubscription}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      Yes, cancel subscription
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
