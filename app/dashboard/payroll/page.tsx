"use client"

import { useState } from "react"
import { PayrollHeader } from "@/components/payroll/payroll-header"
import { PayrollFilters } from "@/components/payroll/payroll-filters"
import { PayrollTable } from "@/components/payroll/payroll-table"
import { PayrollCardView } from "@/components/payroll/payroll-card-view"
import { ViewPayrollDrawer } from "@/components/payroll/view-payroll-drawer"
import { ManualAdjustmentModal } from "@/components/payroll/manual-adjustment-modal"
import { MarkAsPaidDialog } from "@/components/payroll/mark-as-paid-dialog"
import { useMobile } from "@/hooks/use-mobile"

// Mock data for payroll
const mockPayrollData = [
  {
    id: "PAY001",
    staffName: "John Doe",
    role: "Electrician",
    totalHours: 40,
    hourlyRate: 25,
    grossPay: 1000,
    status: "Pending",
    shifts: [
      { date: "2023-04-01", site: "Downtown Project", hours: 8, pay: 200 },
      { date: "2023-04-02", site: "Downtown Project", hours: 8, pay: 200 },
      { date: "2023-04-03", site: "Riverside Building", hours: 8, pay: 200 },
      { date: "2023-04-04", site: "Riverside Building", hours: 8, pay: 200 },
      { date: "2023-04-05", site: "Downtown Project", hours: 8, pay: 200 },
    ],
  },
  {
    id: "PAY002",
    staffName: "Jane Smith",
    role: "Plumber",
    totalHours: 38,
    hourlyRate: 22,
    grossPay: 836,
    status: "Paid",
    shifts: [
      { date: "2023-04-01", site: "Hillside Residence", hours: 7, pay: 154 },
      { date: "2023-04-02", site: "Hillside Residence", hours: 8, pay: 176 },
      { date: "2023-04-03", site: "Downtown Project", hours: 8, pay: 176 },
      { date: "2023-04-04", site: "Downtown Project", hours: 7, pay: 154 },
      { date: "2023-04-05", site: "Hillside Residence", hours: 8, pay: 176 },
    ],
  },
  {
    id: "PAY003",
    staffName: "Mike Johnson",
    role: "Carpenter",
    totalHours: 42,
    hourlyRate: 20,
    grossPay: 840,
    status: "Pending",
    shifts: [
      { date: "2023-04-01", site: "Riverside Building", hours: 8, pay: 160 },
      { date: "2023-04-02", site: "Riverside Building", hours: 9, pay: 180 },
      { date: "2023-04-03", site: "Riverside Building", hours: 8, pay: 160 },
      { date: "2023-04-04", site: "Downtown Project", hours: 9, pay: 180 },
      { date: "2023-04-05", site: "Downtown Project", hours: 8, pay: 160 },
    ],
  },
  {
    id: "PAY004",
    staffName: "Sarah Williams",
    role: "Painter",
    totalHours: 35,
    hourlyRate: 18,
    grossPay: 630,
    status: "Pending",
    shifts: [
      { date: "2023-04-01", site: "Hillside Residence", hours: 7, pay: 126 },
      { date: "2023-04-02", site: "Hillside Residence", hours: 7, pay: 126 },
      { date: "2023-04-03", site: "Riverside Building", hours: 7, pay: 126 },
      { date: "2023-04-04", site: "Riverside Building", hours: 7, pay: 126 },
      { date: "2023-04-05", site: "Hillside Residence", hours: 7, pay: 126 },
    ],
  },
  {
    id: "PAY005",
    staffName: "David Brown",
    role: "HVAC Technician",
    totalHours: 40,
    hourlyRate: 28,
    grossPay: 1120,
    status: "Paid",
    shifts: [
      { date: "2023-04-01", site: "Downtown Project", hours: 8, pay: 224 },
      { date: "2023-04-02", site: "Downtown Project", hours: 8, pay: 224 },
      { date: "2023-04-03", site: "Hillside Residence", hours: 8, pay: 224 },
      { date: "2023-04-04", site: "Hillside Residence", hours: 8, pay: 224 },
      { date: "2023-04-05", site: "Downtown Project", hours: 8, pay: 224 },
    ],
  },
]

export default function PayrollPage() {
  const isMobile = useMobile()
  const [selectedPayroll, setSelectedPayroll] = useState<any | null>(null)
  const [isViewDrawerOpen, setIsViewDrawerOpen] = useState(false)
  const [isAdjustmentModalOpen, setIsAdjustmentModalOpen] = useState(false)
  const [isMarkAsPaidDialogOpen, setIsMarkAsPaidDialogOpen] = useState(false)
  const [filteredData, setFilteredData] = useState(mockPayrollData)

  // Filter handlers
  const handleFilterChange = (filters: any) => {
    // In a real app, this would filter based on the selected criteria
    // For now, we'll just simulate filtering
    console.log("Filters applied:", filters)

    // Simple filtering logic for demonstration
    let filtered = mockPayrollData

    if (filters.staffMember) {
      filtered = filtered.filter((item) => item.staffName.toLowerCase().includes(filters.staffMember.toLowerCase()))
    }

    if (filters.jobSite && filters.jobSite !== "all") {
      filtered = filtered.filter((item) => item.shifts.some((shift) => shift.site === filters.jobSite))
    }

    if (filters.role && filters.role !== "all") {
      filtered = filtered.filter((item) => item.role === filters.role)
    }

    if (filters.status && filters.status !== "all") {
      filtered = filtered.filter((item) => item.status === filters.status)
    }

    setFilteredData(filtered)
  }

  // Action handlers
  const handleViewPayroll = (payroll: any) => {
    setSelectedPayroll(payroll)
    setIsViewDrawerOpen(true)
  }

  const handleAdjustPayroll = (payroll: any) => {
    setSelectedPayroll(payroll)
    setIsAdjustmentModalOpen(true)
  }

  const handleMarkAsPaid = (payroll: any) => {
    setSelectedPayroll(payroll)
    setIsMarkAsPaidDialogOpen(true)
  }

  const handleExportPayroll = (payroll: any) => {
    console.log("Exporting payroll:", payroll.id)
    // In a real app, this would trigger a download
  }

  const handleExportAll = () => {
    console.log("Exporting all payroll data")
    // In a real app, this would trigger a download of all payroll data
  }

  const handleDownloadAllPayslips = () => {
    console.log("Downloading all payslips")
    // In a real app, this would trigger a download of all payslips
  }

  return (
    <div className="flex flex-col space-y-6 p-6">
      <PayrollHeader onExportAll={handleExportAll} onDownloadAllPayslips={handleDownloadAllPayslips} />

      <PayrollFilters onFilterChange={handleFilterChange} />

      {isMobile ? (
        <PayrollCardView
          data={filteredData}
          onView={handleViewPayroll}
          onExport={handleExportPayroll}
          onMarkAsPaid={handleMarkAsPaid}
          onAdjust={handleAdjustPayroll}
        />
      ) : (
        <PayrollTable
          data={filteredData}
          onView={handleViewPayroll}
          onExport={handleExportPayroll}
          onMarkAsPaid={handleMarkAsPaid}
          onAdjust={handleAdjustPayroll}
        />
      )}

      {selectedPayroll && (
        <>
          <ViewPayrollDrawer
            payroll={selectedPayroll}
            open={isViewDrawerOpen}
            onClose={() => setIsViewDrawerOpen(false)}
          />

          <ManualAdjustmentModal
            payroll={selectedPayroll}
            open={isAdjustmentModalOpen}
            onClose={() => setIsAdjustmentModalOpen(false)}
          />

          <MarkAsPaidDialog
            payroll={selectedPayroll}
            open={isMarkAsPaidDialogOpen}
            onClose={() => setIsMarkAsPaidDialogOpen(false)}
          />
        </>
      )}
    </div>
  )
}
