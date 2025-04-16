"use client"

// This page adapts its content based on user role
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { ContractsHeader } from "@/components/contracts/contracts-header"
import { ContractsFilters } from "@/components/contracts/contracts-filters"
import { ContractsTable } from "@/components/contracts/contracts-table"
import { ClientContracts } from "@/components/client/client-contracts"
import { useUser } from "@/contexts/user-context"

export default function ContractsPage() {
  const { user } = useUser()

  // If the user is a client, show the client-specific contracts
  if (user?.role === "client") {
    return (
      <DashboardShell>
        <DashboardHeader>
          <ContractsHeader isClientView={true} />
        </DashboardHeader>
        <ClientContracts clientId={user.clientId || ""} />
      </DashboardShell>
    )
  }

  // Otherwise, show the standard contracts for admin/staff
  return (
    <DashboardShell>
      <DashboardHeader>
        <ContractsHeader />
      </DashboardHeader>
      <div className="space-y-6">
        <ContractsFilters />
        <ContractsTable />
      </div>
    </DashboardShell>
  )
}
