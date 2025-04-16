"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"

export default function NotificationSettings() {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [notifications, setNotifications] = useState({
    taskAssignments: true,
    scheduleChanges: true,
    chatMessages: true,
    invoiceUpdates: false,
    contractUpdates: true,
    materialRequests: false,
  })

  const handleToggle = (key: keyof typeof notifications) => {
    setNotifications((prev) => ({
      ...prev,
      [key]: !prev[key],
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const enabledNotifications = Object.entries(notifications)
      .filter(([_, enabled]) => enabled)
      .map(([key]) => key)
      .join(", ")

    toast({
      title: "Notification preferences saved",
      description: `You will now receive notifications for: ${enabledNotifications || "None"}`,
    })

    setIsLoading(false)
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Notification Preferences</h3>
        <p className="text-sm text-muted-foreground">
          Choose what notifications you receive and how they are delivered.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="taskAssignments">Task Assignments</Label>
              <p className="text-sm text-muted-foreground">
                Receive notifications when you are assigned to a new task.
              </p>
            </div>
            <Switch
              id="taskAssignments"
              checked={notifications.taskAssignments}
              onCheckedChange={() => handleToggle("taskAssignments")}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="scheduleChanges">Schedule Changes</Label>
              <p className="text-sm text-muted-foreground">Receive notifications when your schedule is updated.</p>
            </div>
            <Switch
              id="scheduleChanges"
              checked={notifications.scheduleChanges}
              onCheckedChange={() => handleToggle("scheduleChanges")}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="chatMessages">Chat Messages</Label>
              <p className="text-sm text-muted-foreground">Receive notifications for new chat messages.</p>
            </div>
            <Switch
              id="chatMessages"
              checked={notifications.chatMessages}
              onCheckedChange={() => handleToggle("chatMessages")}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="invoiceUpdates">Invoice Updates</Label>
              <p className="text-sm text-muted-foreground">
                Receive notifications when invoices are created or updated.
              </p>
            </div>
            <Switch
              id="invoiceUpdates"
              checked={notifications.invoiceUpdates}
              onCheckedChange={() => handleToggle("invoiceUpdates")}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="contractUpdates">Contract Updates</Label>
              <p className="text-sm text-muted-foreground">
                Receive notifications when contracts are created or updated.
              </p>
            </div>
            <Switch
              id="contractUpdates"
              checked={notifications.contractUpdates}
              onCheckedChange={() => handleToggle("contractUpdates")}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="materialRequests">Material Requests</Label>
              <p className="text-sm text-muted-foreground">
                Receive notifications for material requests and approvals.
              </p>
            </div>
            <Switch
              id="materialRequests"
              checked={notifications.materialRequests}
              onCheckedChange={() => handleToggle("materialRequests")}
            />
          </div>
        </div>

        <div className="flex justify-end">
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Saving..." : "Save Preferences"}
          </Button>
        </div>
      </form>
    </div>
  )
}
