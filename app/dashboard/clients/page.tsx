import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { ClientsHeader } from "@/components/clients/clients-header"
import { ClientsFilters } from "@/components/clients/clients-filters"
import { ClientsTable } from "@/components/clients/clients-table"

export default function ClientsPage() {
  return (
    <DashboardShell>
      <DashboardHeader>
        <ClientsHeader />
      </DashboardHeader>
      <div className="space-y-6">
        <ClientsFilters />
        <ClientsTable />
      </div>
    </DashboardShell>
  )
}
