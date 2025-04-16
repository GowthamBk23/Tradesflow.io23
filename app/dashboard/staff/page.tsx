import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { StaffHeader } from "@/components/staff/staff-header"
import { StaffFilters } from "@/components/staff/staff-filters"
import { StaffTable } from "@/components/staff/staff-table"
import { ImportExportButtons } from "@/components/staff/import-export-buttons"

export default function StaffPage() {
  return (
    <DashboardShell>
      <DashboardHeader>
        <StaffHeader />
      </DashboardHeader>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <StaffFilters />
          <ImportExportButtons />
        </div>
        <StaffTable />
      </div>
    </DashboardShell>
  )
}
