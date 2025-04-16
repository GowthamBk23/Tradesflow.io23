import AdminLogsHeader from "@/components/admin-logs/admin-logs-header"
import AdminLogsFilters from "@/components/admin-logs/admin-logs-filters"
import AdminLogsTable from "@/components/admin-logs/admin-logs-table"

export default function AdminLogsPage() {
  return (
    <div className="flex flex-col gap-6 p-6 md:p-8">
      <AdminLogsHeader />
      <AdminLogsFilters />
      <AdminLogsTable />
    </div>
  )
}
