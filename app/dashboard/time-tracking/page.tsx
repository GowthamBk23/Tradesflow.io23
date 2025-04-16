"use client"

import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { TimeTrackingHeader } from "@/components/time-tracking/time-tracking-header"
import { TimeTrackingTabs } from "@/components/time-tracking/time-tracking-tabs"
import { StaffTimeTracking } from "@/components/staff/staff-time-tracking"
import { PermissionGuard } from "@/components/auth/permission-guard"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useUser } from "@/contexts/user-context"

export default function TimeTrackingPage() {
  const { user } = useUser()
  const isStaffView = user?.role === "staff"

  return (
    <DashboardShell>
      <DashboardHeader>
        <TimeTrackingHeader isStaffView={isStaffView} />
      </DashboardHeader>
      <PermissionGuard
        permission="log:time"
        fallback={
          <Card>
            <CardHeader>
              <CardTitle>Access Denied</CardTitle>
              <CardDescription>You don't have permission to access time tracking features.</CardDescription>
            </CardHeader>
          </Card>
        }
      >
        {isStaffView ? <StaffTimeTracking staffId={user?.id || ""} /> : <TimeTrackingTabs />}
      </PermissionGuard>
    </DashboardShell>
  )
}
