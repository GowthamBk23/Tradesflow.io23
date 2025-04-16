import { Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"

interface ViewPayrollDrawerProps {
  payroll: any
  open: boolean
  onClose: () => void
}

export function ViewPayrollDrawer({ payroll, open, onClose }: ViewPayrollDrawerProps) {
  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent className="sm:max-w-md">
        <SheetHeader className="space-y-1">
          <SheetTitle>Payroll Details</SheetTitle>
          <SheetDescription>Viewing payroll for {payroll.staffName}</SheetDescription>
        </SheetHeader>

        <Separator className="my-4" />

        <ScrollArea className="h-[calc(100vh-180px)] pr-4">
          <div className="space-y-6">
            {/* Staff Information */}
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-muted-foreground">Staff Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Name</p>
                  <p className="font-medium">{payroll.staffName}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Role</p>
                  <p className="font-medium">{payroll.role}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">ID</p>
                  <p className="font-medium">{payroll.id}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <Badge
                    variant={payroll.status === "Paid" ? "success" : "outline"}
                    className={payroll.status === "Paid" ? "bg-green-500/15 text-green-600 hover:bg-green-500/20" : ""}
                  >
                    {payroll.status}
                  </Badge>
                </div>
              </div>
            </div>

            <Separator />

            {/* Pay Summary */}
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-muted-foreground">Pay Summary</h3>
              <div className="grid grid-cols-2 gap-4">
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
            </div>

            <Separator />

            {/* Shift Breakdown */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-muted-foreground">Shift Breakdown</h3>

              {payroll.shifts.map((shift: any, index: number) => (
                <div key={index} className="rounded-lg border p-3">
                  <div className="flex items-center justify-between">
                    <p className="font-medium">
                      {new Date(shift.date).toLocaleDateString("en-GB", {
                        weekday: "short",
                        day: "numeric",
                        month: "short",
                      })}
                    </p>
                    <p className="text-sm font-medium">£{shift.pay.toFixed(2)}</p>
                  </div>
                  <div className="mt-1 flex items-center justify-between text-sm text-muted-foreground">
                    <p>{shift.site}</p>
                    <p>{shift.hours} hours</p>
                  </div>
                </div>
              ))}
            </div>

            <Separator />

            {/* Download Section */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-muted-foreground">Documents</h3>
              <Button className="w-full" variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Download Payslip
              </Button>
            </div>

            {/* Notes Section */}
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-muted-foreground">Notes</h3>
              <p className="text-sm text-muted-foreground">No additional notes for this pay period.</p>
            </div>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  )
}
