"use client"

interface TimeTrackingHeaderProps {
  isStaffView?: boolean
}

export function TimeTrackingHeader({ isStaffView = false }: TimeTrackingHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Time Tracking</h1>
        <p className="text-muted-foreground">
          {isStaffView ? "Track your work hours and view your schedule" : "Manage time tracking for your team"}
        </p>
      </div>
    </div>
  )
}
