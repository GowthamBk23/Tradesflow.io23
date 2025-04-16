import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { ScheduleHeader } from "@/components/schedule/schedule-header"
import { ScheduleFilters } from "@/components/schedule/schedule-filters"
import { ScheduleGrid } from "@/components/schedule/schedule-grid"
import { AIScheduleButton } from "@/components/schedule/ai-schedule-button"

export default function SchedulePage() {
  return (
    <DashboardShell>
      <DashboardHeader>
        <ScheduleHeader />
      </DashboardHeader>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <ScheduleFilters />
          <AIScheduleButton />
        </div>
        <ScheduleGrid />
      </div>
    </DashboardShell>
  )
}
