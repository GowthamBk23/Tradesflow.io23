"use client"

import { Download, Eye, Pencil, CreditCard } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

interface PayrollCardViewProps {
  data: any[]
  onView: (payroll: any) => void
  onExport: (payroll: any) => void
  onMarkAsPaid: (payroll: any) => void
  onAdjust: (payroll: any) => void
}

export function PayrollCardView({ data, onView, onExport, onMarkAsPaid, onAdjust }: PayrollCardViewProps) {
  if (data.length === 0) {
    return (
      <div className="flex h-40 items-center justify-center rounded-md border">
        <p className="text-muted-foreground">No payroll data found</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {data.map((payroll) => (
        <Card key={payroll.id} className="overflow-hidden">
          <CardContent className="p-0">
            <div className="flex items-center justify-between bg-muted/40 p-4">
              <div>
                <h3 className="font-medium">{payroll.staffName}</h3>
                <p className="text-sm text-muted-foreground">{payroll.role}</p>
              </div>
              <Badge
                variant={payroll.status === "Paid" ? "success" : "outline"}
                className={payroll.status === "Paid" ? "bg-green-500/15 text-green-600 hover:bg-green-500/20" : ""}
              >
                {payroll.status}
              </Badge>
            </div>

            <div className="grid grid-cols-2 gap-4 p-4">
              <div>
                <p className="text-sm text-muted-foreground">Total Hours</p>
                <p className="font-medium">{payroll.totalHours}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Hourly Rate</p>
                <p className="font-medium">£{payroll.hourlyRate.toFixed(2)}</p>
              </div>
              <div className="col-span-2">
                <p className="text-sm text-muted-foreground">Gross Pay</p>
                <p className="text-xl font-bold">£{payroll.grossPay.toFixed(2)}</p>
              </div>
            </div>

            <Separator />

            <div className="flex items-center justify-between p-4">
              <p className="text-sm text-muted-foreground">ID: {payroll.id}</p>
              <div className="flex gap-1">
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => onView(payroll)}>
                  <Eye className="h-4 w-4" />
                  <span className="sr-only">View</span>
                </Button>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => onExport(payroll)}>
                  <Download className="h-4 w-4" />
                  <span className="sr-only">Export</span>
                </Button>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => onAdjust(payroll)}>
                  <Pencil className="h-4 w-4" />
                  <span className="sr-only">Adjust</span>
                </Button>
                {payroll.status === "Pending" && (
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => onMarkAsPaid(payroll)}>
                    <CreditCard className="h-4 w-4" />
                    <span className="sr-only">Mark as Paid</span>
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
