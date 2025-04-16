"use client"

import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import MaterialsHeader from "@/components/materials/materials-header"
import MaterialsFilters from "@/components/materials/materials-filters"
import MaterialsTable from "@/components/materials/materials-table"
import MaterialsCardView from "@/components/materials/materials-card-view"
import StaffMaterialsView from "@/components/staff/staff-materials-view"
import { useMobile } from "@/hooks/use-mobile"
import { useUser } from "@/contexts/user-context"

export default function MaterialsPage() {
  const isMobile = useMobile()
  const { user } = useUser()
  const isStaffView = user?.role === "staff"

  return (
    <DashboardShell>
      <MaterialsHeader isStaffView={isStaffView} />
      <MaterialsFilters isStaffView={isStaffView} />
      {isStaffView ? (
        <StaffMaterialsView staffId={user?.id || ""} isMobile={isMobile} />
      ) : isMobile ? (
        <MaterialsCardView />
      ) : (
        <MaterialsTable />
      )}
    </DashboardShell>
  )
}
