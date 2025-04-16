"use client"

import { Download, Eye, Pencil, CreditCard } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface PayrollTableProps {
  data: any[]
  onView: (payroll: any) => void
  onExport: (payroll: any) => void
  onMarkAsPaid: (payroll: any) => void
  onAdjust: (payroll: any) => void
}

export function PayrollTable({ data, onView, onExport, onMarkAsPaid, onAdjust }: PayrollTableProps) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[200px]">Staff Name</TableHead>
            <TableHead>Role</TableHead>
            <TableHead className="text-right">Total Hours</TableHead>
            <TableHead className="text-right">Hourly Rate (£)</TableHead>
            <TableHead className="text-right">Gross Pay (£)</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="h-24 text-center">
                No payroll data found
              </TableCell>
            </TableRow>
          ) : (
            data.map((payroll) => (
              <TableRow key={payroll.id}>
                <TableCell className="font-medium">{payroll.staffName}</TableCell>
                <TableCell>{payroll.role}</TableCell>
                <TableCell className="text-right">{payroll.totalHours}</TableCell>
                <TableCell className="text-right">{payroll.hourlyRate.toFixed(2)}</TableCell>
                <TableCell className="text-right font-medium">{payroll.grossPay.toFixed(2)}</TableCell>
                <TableCell>
                  <Badge
                    variant={payroll.status === "Paid" ? "success" : "outline"}
                    className={payroll.status === "Paid" ? "bg-green-500/15 text-green-600 hover:bg-green-500/20" : ""}
                  >
                    {payroll.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    <Button variant="ghost" size="icon" onClick={() => onView(payroll)} title="View Details">
                      <Eye className="h-4 w-4" />
                      <span className="sr-only">View</span>
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => onExport(payroll)} title="Export">
                      <Download className="h-4 w-4" />
                      <span className="sr-only">Export</span>
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => onAdjust(payroll)} title="Manual Adjustment">
                      <Pencil className="h-4 w-4" />
                      <span className="sr-only">Adjust</span>
                    </Button>
                    {payroll.status === "Pending" && (
                      <Button variant="ghost" size="icon" onClick={() => onMarkAsPaid(payroll)} title="Mark as Paid">
                        <CreditCard className="h-4 w-4" />
                        <span className="sr-only">Mark as Paid</span>
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}
