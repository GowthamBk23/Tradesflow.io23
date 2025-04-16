"use client"

import { useState } from "react"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Send, Download, CheckCircle, Copy, Printer, CreditCard } from "lucide-react"
import { PaymentMethodSelector } from "./payment-method-selector"
import { useToast } from "@/hooks/use-toast"

interface ViewInvoiceDrawerProps {
  isOpen: boolean
  onClose: () => void
  invoice: any
  onSend?: (invoice: any) => void
  onDownload: (invoice: any) => void
  onMarkAsPaid?: (invoice: any) => void
  isClientView?: boolean
}

export function ViewInvoiceDrawer({
  isOpen,
  onClose,
  invoice,
  onSend,
  onDownload,
  onMarkAsPaid,
  isClientView = false,
}: ViewInvoiceDrawerProps) {
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false)
  const { toast } = useToast()

  if (!invoice) return null

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })
  }

  // Format amount
  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP" }).format(amount)
  }

  // Get status badge
  const getStatusBadge = (status: string, stripePaid: boolean) => {
    let className = ""
    const label = status.charAt(0).toUpperCase() + status.slice(1)

    switch (status) {
      case "paid":
        className = "bg-green-500/10 text-green-500 border-green-500/20"
        break
      case "unpaid":
        className = "bg-amber-500/10 text-amber-500 border-amber-500/20"
        break
      case "overdue":
        className = "bg-rose-500/10 text-rose-500 border-rose-500/20"
        break
      case "draft":
        className = "bg-blue-500/10 text-blue-500 border-blue-500/20"
        break
      default:
        className = "bg-muted/50 text-muted-foreground"
    }

    return (
      <div className="flex items-center gap-1">
        <Badge variant="outline" className={`rounded-xl ${className}`}>
          {label}
        </Badge>
        {stripePaid && (
          <Badge variant="outline" className="rounded-xl bg-purple-500/10 text-purple-500 border-purple-500/20">
            <CheckCircle className="h-3 w-3 mr-1" />
            Stripe
          </Badge>
        )}
        {status === "paid" && invoice.paymentMethod && !stripePaid && (
          <Badge variant="outline" className="rounded-xl bg-blue-500/10 text-blue-500 border-blue-500/20">
            {invoice.paymentMethod === "bank" ? "Bank" : "Cash"}
          </Badge>
        )}
      </div>
    )
  }

  // Handle duplicate invoice
  const handleDuplicateInvoice = () => {
    toast({
      title: "Invoice Duplicated",
      description: `Invoice ${invoice.id} has been duplicated`,
    })
    onClose()
  }

  // Handle print invoice
  const handlePrintInvoice = () => {
    toast({
      title: "Printing Invoice",
      description: `Invoice ${invoice.id} has been sent to printer`,
    })
  }

  // Handle payment completion
  const handlePaymentComplete = (invoice: any, method: string) => {
    // In a real app, this would update the invoice in your database
    invoice.status = "paid"
    invoice.paymentMethod = method
    invoice.paymentDate = new Date().toISOString().split("T")[0]

    toast({
      title: "Payment Successful",
      description: `Invoice ${invoice.id} has been marked as paid via ${method === "bank" ? "bank transfer" : "cash"}`,
    })
  }

  return (
    <>
      <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
        <SheetContent className="sm:max-w-[600px] p-0 rounded-l-2xl overflow-y-auto">
          <SheetHeader className="p-6 pb-2">
            <div className="flex justify-between items-start">
              <div>
                <SheetTitle className="text-2xl">Invoice {invoice.id}</SheetTitle>
                <p className="text-muted-foreground mt-1">
                  Issued on {formatDate(invoice.dateIssued)} • Due on {formatDate(invoice.dueDate)}
                </p>
              </div>
              {getStatusBadge(invoice.status, invoice.stripePaid)}
            </div>
          </SheetHeader>

          <div className="p-6 space-y-6">
            {/* Action Buttons */}
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" className="rounded-xl" onClick={() => onDownload(invoice)}>
                <Download className="mr-2 h-4 w-4" />
                Download PDF
              </Button>

              {isClientView && (invoice.status === "unpaid" || invoice.status === "overdue") && (
                <Button className="rounded-xl" onClick={() => setIsPaymentModalOpen(true)}>
                  <CreditCard className="mr-2 h-4 w-4" />
                  Pay Now
                </Button>
              )}

              {!isClientView && (
                <>
                  {(invoice.status === "unpaid" || invoice.status === "overdue") && onSend && (
                    <Button variant="outline" className="rounded-xl" onClick={() => onSend(invoice)}>
                      <Send className="mr-2 h-4 w-4" />
                      Send Invoice
                    </Button>
                  )}

                  {(invoice.status === "unpaid" || invoice.status === "overdue") && onMarkAsPaid && (
                    <Button variant="outline" className="rounded-xl" onClick={() => onMarkAsPaid(invoice)}>
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Mark as Paid
                    </Button>
                  )}

                  <Button variant="outline" className="rounded-xl" onClick={handlePrintInvoice}>
                    <Printer className="mr-2 h-4 w-4" />
                    Print
                  </Button>

                  <Button variant="outline" className="rounded-xl" onClick={handleDuplicateInvoice}>
                    <Copy className="mr-2 h-4 w-4" />
                    Duplicate
                  </Button>
                </>
              )}
            </div>

            {/* Payment Information (for client view) */}
            {isClientView && invoice.status === "paid" && (
              <Card className="rounded-xl border-border/40 bg-green-500/5 backdrop-blur-sm">
                <CardContent className="p-4 flex items-center gap-3">
                  <div className="bg-green-500/10 p-2 rounded-full">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  </div>
                  <div>
                    <p className="font-medium text-green-500">Payment Complete</p>
                    <p className="text-sm text-muted-foreground">
                      {invoice.stripePaid
                        ? "Paid via Stripe on "
                        : invoice.paymentMethod
                          ? `Paid via ${invoice.paymentMethod === "bank" ? "bank transfer" : "cash"} on `
                          : "Paid on "}
                      {formatDate(invoice.paymentDate || invoice.dueDate)}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Invoice Details */}
            <Card className="rounded-xl border-border/40 bg-card/50 backdrop-blur-sm">
              <CardContent className="p-6 space-y-6">
                {/* Header */}
                <div className="flex justify-between">
                  <div>
                    <h3 className="text-xl font-bold">Trades Flow</h3>
                    <p className="text-sm text-muted-foreground mt-1">123 Construction Way</p>
                    <p className="text-sm text-muted-foreground">London, SW1A 1AA</p>
                    <p className="text-sm text-muted-foreground">United Kingdom</p>
                    <p className="text-sm mt-2">VAT: {invoice.vatNumber}</p>
                  </div>
                  <div className="text-right">
                    <h3 className="text-xl font-bold">Invoice</h3>
                    <p className="text-sm text-muted-foreground mt-1">#{invoice.id}</p>
                    <p className="text-sm text-muted-foreground mt-2">Issue Date: {formatDate(invoice.dateIssued)}</p>
                    <p className="text-sm text-muted-foreground">Due Date: {formatDate(invoice.dueDate)}</p>
                  </div>
                </div>

                <Separator />

                {/* Client Info */}
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-2">Bill To:</h4>
                  <p className="font-medium">{invoice.clientName}</p>
                  <p className="text-sm text-muted-foreground mt-1">Client ID: {invoice.clientId}</p>
                </div>

                <Separator />

                {/* Line Items */}
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-3">Items:</h4>
                  <div className="space-y-4">
                    <div className="grid grid-cols-12 text-sm font-medium text-muted-foreground">
                      <div className="col-span-6">Description</div>
                      <div className="col-span-2 text-right">Quantity</div>
                      <div className="col-span-2 text-right">Rate</div>
                      <div className="col-span-2 text-right">Amount</div>
                    </div>

                    {invoice.items.map((item: any, index: number) => (
                      <div key={index} className="grid grid-cols-12 text-sm">
                        <div className="col-span-6">{item.description}</div>
                        <div className="col-span-2 text-right">{item.quantity}</div>
                        <div className="col-span-2 text-right">{formatAmount(item.rate)}</div>
                        <div className="col-span-2 text-right">{formatAmount(item.amount)}</div>
                      </div>
                    ))}

                    <Separator />

                    <div className="grid grid-cols-12 text-sm">
                      <div className="col-span-10 text-right font-medium">Subtotal:</div>
                      <div className="col-span-2 text-right">{formatAmount(invoice.amount)}</div>
                    </div>

                    <div className="grid grid-cols-12 text-sm">
                      <div className="col-span-10 text-right font-medium">VAT (20%):</div>
                      <div className="col-span-2 text-right">{formatAmount(invoice.amount * 0.2)}</div>
                    </div>

                    <div className="grid grid-cols-12 text-base font-bold">
                      <div className="col-span-10 text-right">Total:</div>
                      <div className="col-span-2 text-right">{formatAmount(invoice.amount * 1.2)}</div>
                    </div>
                  </div>
                </div>

                {/* Notes */}
                {invoice.notes && (
                  <>
                    <Separator />
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground mb-2">Notes:</h4>
                      <p className="text-sm">{invoice.notes}</p>
                    </div>
                  </>
                )}

                {/* Payment Info */}
                <Separator />
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-2">Payment Information:</h4>
                  <p className="text-sm">Bank: Trades Flow Bank</p>
                  <p className="text-sm">Account: 12345678</p>
                  <p className="text-sm">Sort Code: 12-34-56</p>
                  <p className="text-sm">Reference: {invoice.id}</p>
                </div>

                {/* Thank You */}
                <div className="text-center pt-4">
                  <p className="text-sm font-medium">Thank you for your business!</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </SheetContent>
      </Sheet>

      {/* Payment Method Selector */}
      <PaymentMethodSelector
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        invoice={invoice}
        onPaymentComplete={handlePaymentComplete}
      />
    </>
  )
}
