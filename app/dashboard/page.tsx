"use client"

// This page adapts its content based on user role
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { KpiCards } from "@/components/dashboard/kpi-cards"
import { ProjectsChart } from "@/components/dashboard/projects-chart"
import { RecentActivity } from "@/components/dashboard/recent-activity"
import { UserWelcome } from "@/components/dashboard/user-welcome"
import { ClientDashboard } from "@/components/client/client-dashboard"
import { StaffDashboard } from "@/components/staff/staff-dashboard"
import { useUser } from "@/contexts/user-context"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export default function DashboardPage() {
  const { user } = useUser()

  // If the user is a client, show the client-specific dashboard
  if (user?.role === "client") {
    return (
      <DashboardShell>
        <DashboardHeader>
          <UserWelcome />
        </DashboardHeader>
        <ClientDashboard clientId={user.clientId || ""} />
      </DashboardShell>
    )
  }

  // If the user is staff, show the staff-specific dashboard
  if (user?.role === "staff") {
    return (
      <DashboardShell>
        <DashboardHeader>
          <UserWelcome />
        </DashboardHeader>
        <StaffDashboard staffId={user.id || ""} />
      </DashboardShell>
    )
  }

  // Otherwise, show the standard dashboard for admin
  return (
    <DashboardShell>
      <DashboardHeader>
        <UserWelcome />
      </DashboardHeader>
      <div className="grid gap-6">
        <KpiCards />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
          <ProjectsChart className="col-span-4" />
          <RecentActivity className="col-span-3" />
        </div>

        {/* Quick action buttons */}
        <div className="flex flex-wrap gap-2 justify-end">
          <Link href="/dashboard/tasks">
            <Button variant="outline" className="rounded-2xl">
              View Tasks Board
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
          <Link href="/dashboard/schedule">
            <Button variant="outline" className="rounded-2xl">
              View Schedule
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
          <Link href="/dashboard/projects">
            <Button variant="outline" className="rounded-2xl">
              View All Projects
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
          <Link href="/dashboard/projects?new=true">
            <Button className="rounded-2xl">
              Create New Project
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </DashboardShell>
  )
}
