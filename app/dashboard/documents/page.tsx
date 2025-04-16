"use client"

import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { DocumentsHeader } from "@/components/documents/documents-header"
import { DocumentsFilters } from "@/components/documents/documents-filters"
import { DocumentsView } from "@/components/documents/documents-view"
import { StaffDocumentsView } from "@/components/staff/staff-documents-view"
import { useUser } from "@/contexts/user-context"

export default function DocumentsPage() {
  const { user } = useUser()
  const isStaffView = user?.role === "staff"

  return (
    <DashboardShell>
      <DashboardHeader>
        <DocumentsHeader isStaffView={isStaffView} />
      </DashboardHeader>
      <DocumentsFilters isStaffView={isStaffView} />
      {isStaffView ? <StaffDocumentsView staffId={user?.id || ""} /> : <DocumentsView />}
    </DashboardShell>
  )
}
