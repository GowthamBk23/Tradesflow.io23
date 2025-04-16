"use client"

import { CalendarDays, Download, FileSpreadsheet } from "lucide-react"
import { Button } from "@/components/ui/button"

interface PayrollHeaderProps {
  onExportAll: () => void
  onDownloadAllPayslips: () => void
}

export function PayrollHeader({ onExportAll, onDownloadAllPayslips }: PayrollHeaderProps) {
  return (
    <div className="flex flex-col space-y-2">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Payroll</h1>
          <p className="text-muted-foreground">Manage staff pay summaries based on logged hours and pay rates</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="hidden md:flex items-center gap-2"
            onClick={onDownloadAllPayslips}
          >
            <Download className="h-4 w-4" />
            <span>Download All Payslips</span>
          </Button>
          <Button variant="outline" size="sm" className="flex items-center gap-2" onClick={onExportAll}>
            <FileSpreadsheet className="h-4 w-4" />
            <span className="hidden md:inline">Export All as CSV</span>
            <span className="md:hidden">Export</span>
          </Button>
        </div>
      </div>
      <div className="flex items-center text-sm text-muted-foreground">
        <CalendarDays className="mr-1 h-4 w-4" />
        <span>Current pay period: April 1 - April 15, 2023</span>
      </div>
    </div>
  )
}
