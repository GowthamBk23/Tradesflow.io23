"use client"

// This page adapts its content based on user role
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { InvoicesHeader } from "@/components/invoices/invoices-header"
import { InvoicesFilters } from "@/components/invoices/invoices-filters"
import { InvoicesTable } from "@/components/invoices/invoices-table"
import { ClientInvoices } from "@/components/client/client-invoices"
import { useUser } from "@/contexts/user-context"

export default function InvoicesPage() {
  const { user } = useUser()

  // If the user is a client, show the client-specific invoices
  if (user?.role === "client") {
    return (
      <DashboardShell>
        <DashboardHeader>
          <InvoicesHeader isClientView={true} />
        </DashboardHeader>
        <ClientInvoices clientId={user.clientId || ""} />
      </DashboardShell>
    )
  }

  // Otherwise, show the standard invoices for admin/staff
  return (
    <DashboardShell>
      <DashboardHeader>
        <InvoicesHeader />
      </DashboardHeader>
      <div className="space-y-6">
        <InvoicesFilters />
        <InvoicesTable />
      </div>
    </DashboardShell>
  )
}
