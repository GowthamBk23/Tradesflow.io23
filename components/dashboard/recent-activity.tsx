"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useToast } from "@/hooks/use-toast"
import { ArrowRight } from "lucide-react"
import Link from "next/link"

interface RecentActivityProps {
  className?: string
}

export function RecentActivity({ className }: RecentActivityProps) {
  const { toast } = useToast()

  const handleActivityClick = (activity: any) => {
    toast({
      title: `Viewing ${activity.type}`,
      description: `Navigating to ${activity.type} details...`,
    })

    // In a real app, this would navigate to the specific item
    // For now, we'll just show a toast
  }

  // Mock data for recent activity
  const recentActivity = [
    {
      id: 1,
      type: "task",
      title: "Task Completed",
      description: "John completed the electrical wiring task",
      time: "10 minutes ago",
      user: {
        name: "John Doe",
        avatar: "/placeholder.svg?height=32&width=32",
        initials: "JD",
      },
    },
    {
      id: 2,
      type: "invoice",
      title: "Invoice Paid",
      description: "Client paid invoice #INV-2023-004",
      time: "2 hours ago",
      user: {
        name: "Sarah Smith",
        avatar: "/placeholder.svg?height=32&width=32",
        initials: "SS",
      },
    },
    {
      id: 3,
      type: "project",
      title: "Project Updated",
      description: "Kitchen Renovation project status updated to 'In Progress'",
      time: "Yesterday",
      user: {
        name: "Mike Johnson",
        avatar: "/placeholder.svg?height=32&width=32",
        initials: "MJ",
      },
    },
    {
      id: 4,
      type: "document",
      title: "Document Uploaded",
      description: "New floor plan uploaded to Downtown Project",
      time: "2 days ago",
      user: {
        name: "Lisa Brown",
        avatar: "/placeholder.svg?height=32&width=32",
        initials: "LB",
      },
    },
  ]

  return (
    <Card className={`border-border/40 bg-card/50 backdrop-blur-sm rounded-2xl ${className}`}>
      <CardHeader className="pb-2">
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>Latest updates from your team and projects</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[280px] pr-4">
          <div className="space-y-4">
            {recentActivity.map((activity) => (
              <div
                key={activity.id}
                className="flex items-start gap-4 rounded-xl p-2 transition-colors hover:bg-accent cursor-pointer"
                onClick={() => handleActivityClick(activity)}
              >
                <Avatar className="h-8 w-8 rounded-xl">
                  <AvatarImage src={activity.user.avatar} alt={activity.user.name} />
                  <AvatarFallback className="rounded-xl">{activity.user.initials}</AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">{activity.title}</p>
                    <span className="text-xs text-muted-foreground">{activity.time}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">{activity.description}</p>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
        <div className="mt-4 flex justify-center">
          {/* Replace the button with a Link for more reliable navigation */}
          <Link href="/dashboard/activity" className="w-full">
            <Button
              variant="outline"
              className="w-full rounded-xl"
              onClick={() => {
                toast({
                  title: "View all activity",
                  description: "Navigating to activity log...",
                })
              }}
            >
              View All Activity
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
