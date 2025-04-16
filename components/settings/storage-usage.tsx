"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"
import Link from "next/link"

// Storage limits by plan (in GB)
const STORAGE_LIMITS = {
  Starter: 10,
  Growth: 50,
  Pro: 100,
}

export default function StorageUsage() {
  const { toast } = useToast()
  const [currentPlan, setCurrentPlan] = useState("Growth")
  const [usedStorage, setUsedStorage] = useState(0)
  const [isLoading, setIsLoading] = useState(true)

  // Simulate loading storage data
  useEffect(() => {
    const timer = setTimeout(() => {
      // Simulate random storage usage between 30% and 90% of the plan limit
      const planLimit = STORAGE_LIMITS[currentPlan as keyof typeof STORAGE_LIMITS]
      const randomUsage = Math.random() * 0.6 + 0.3 // Between 30% and 90%
      setUsedStorage(planLimit * randomUsage)
      setIsLoading(false)
    }, 800)

    return () => clearTimeout(timer)
  }, [currentPlan])

  const planLimit = STORAGE_LIMITS[currentPlan as keyof typeof STORAGE_LIMITS]
  const usagePercentage = (usedStorage / planLimit) * 100
  const isNearLimit = usagePercentage >= 80
  const remainingStorage = planLimit - usedStorage

  const handleUpgrade = () => {
    toast({
      title: "Redirecting to upgrade page",
      description: "You'll be able to select a plan with more storage.",
    })
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">📦 Storage Usage</h3>
        <p className="text-sm text-muted-foreground">Monitor your file storage usage and upgrade if needed.</p>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="space-y-6">
            {isLoading ? (
              <div className="h-2 bg-gray-200 rounded animate-pulse"></div>
            ) : (
              <>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Used: {usedStorage.toFixed(1)} GB</span>
                    <span>Total: {planLimit} GB</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={cn(
                        "h-full transition-all duration-500 ease-in-out",
                        isNearLimit ? "bg-orange-500" : "bg-green-500",
                      )}
                      style={{ width: `${Math.min(usagePercentage, 100)}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>{remainingStorage.toFixed(1)} GB remaining</span>
                    <span className="text-muted-foreground">Current Plan: {currentPlan}</span>
                  </div>
                </div>

                {isNearLimit ? (
                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 flex items-start space-x-3">
                    <AlertCircle className="h-5 w-5 text-orange-500 flex-shrink-0 mt-0.5" />
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-orange-800">⚠️ You're close to your storage limit</p>
                      <p className="text-sm text-orange-700">
                        Upgrade your plan to get more storage and avoid disruptions.
                      </p>
                      <Link href="/dashboard/settings?tab=subscription" className="block mt-2">
                        <Button onClick={handleUpgrade} className="bg-orange-500 hover:bg-orange-600 text-white">
                          Upgrade Plan
                        </Button>
                      </Link>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    File storage is based on your current plan. Contact support if you need more space.
                  </p>
                )}

                <div className="pt-4 border-t">
                  <h4 className="text-sm font-medium mb-2">Storage Limits by Plan</h4>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div className="space-y-1">
                      <div className="font-medium">Starter</div>
                      <div>{STORAGE_LIMITS.Starter} GB</div>
                    </div>
                    <div className="space-y-1">
                      <div className="font-medium">Growth</div>
                      <div>{STORAGE_LIMITS.Growth} GB</div>
                    </div>
                    <div className="space-y-1">
                      <div className="font-medium">Pro</div>
                      <div>{STORAGE_LIMITS.Pro} GB</div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
