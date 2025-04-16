import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { ReportsHeader } from "@/components/reports/reports-header"
import { ReportsFilters } from "@/components/reports/reports-filters"
import { KpiSummary } from "@/components/reports/kpi-summary"
import { VisualCharts } from "@/components/reports/visual-charts"
import { DownloadableReports } from "@/components/reports/downloadable-reports"

export default function ReportsPage() {
  return (
    <DashboardShell>
      <DashboardHeader>
        <ReportsHeader />
      </DashboardHeader>
      <div className="space-y-6">
        <ReportsFilters />
        <KpiSummary />
        <VisualCharts />
        <DownloadableReports />
      </div>
    </DashboardShell>
  )
}
