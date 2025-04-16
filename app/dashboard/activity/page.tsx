import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function ActivityLogPage() {
  // Mock data for activity log
  const activityLog = [
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
    {
      id: 5,
      type: "client",
      title: "New Client Added",
      description: "New client 'Oakwood Properties' added to the system",
      time: "3 days ago",
      user: {
        name: "Alex Turner",
        avatar: "/placeholder.svg?height=32&width=32",
        initials: "AT",
      },
    },
    {
      id: 6,
      type: "staff",
      title: "Staff Member Added",
      description: "New staff member 'Robert Wilson' added to the team",
      time: "4 days ago",
      user: {
        name: "Emma Davis",
        avatar: "/placeholder.svg?height=32&width=32",
        initials: "ED",
      },
    },
    {
      id: 7,
      type: "payment",
      title: "Payment Received",
      description: "Payment of $2,500 received for invoice #INV-2023-003",
      time: "5 days ago",
      user: {
        name: "Financial System",
        avatar: "/placeholder.svg?height=32&width=32",
        initials: "FS",
      },
    },
    {
      id: 8,
      type: "schedule",
      title: "Schedule Updated",
      description: "Team schedule updated for next week",
      time: "1 week ago",
      user: {
        name: "Project Manager",
        avatar: "/placeholder.svg?height=32&width=32",
        initials: "PM",
      },
    },
  ]

  return (
    <DashboardShell>
      <DashboardHeader>
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight">Activity Log</h1>
          <Link href="/dashboard">
            <Button variant="outline" className="rounded-xl">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Button>
          </Link>
        </div>
      </DashboardHeader>
      <div className="grid gap-6">
        <Card className="border-border/40 bg-card/50 backdrop-blur-sm rounded-2xl">
          <CardHeader className="pb-2">
            <CardTitle>All Activity</CardTitle>
            <CardDescription>Complete history of all system activity</CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[600px] pr-4">
              <div className="space-y-4">
                {activityLog.map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-start gap-4 rounded-xl p-3 transition-colors hover:bg-accent"
                  >
                    <Avatar className="h-10 w-10 rounded-xl">
                      <AvatarImage src={activity.user.avatar} alt={activity.user.name} />
                      <AvatarFallback className="rounded-xl">{activity.user.initials}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium">{activity.title}</p>
                        <span className="text-xs text-muted-foreground">{activity.time}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">{activity.description}</p>
                      <p className="text-xs text-muted-foreground">By: {activity.user.name}</p>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </DashboardShell>
  )
}
