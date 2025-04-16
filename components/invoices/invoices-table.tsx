"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Eye, Send, Download, MoreHorizontal, Copy, CheckCircle, CreditCard, Building, Banknote } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ViewInvoiceDrawer } from "./view-invoice-drawer"
import { useIsMobile } from "@/hooks/use-mobile"
import { useToast } from "@/hooks/use-toast"

// Mock data for invoices
const initialInvoicesData = [
  {
    id: "INV-2023-001",
    clientId: "client-1",
    clientName: "Oakwood Properties",
    dateIssued: "2023-03-15",
    dueDate: "2023-04-15",
    amount: 25000,
    status: "paid",
    stripePaid: true,
    paymentDate: "2023-04-10",
    items: [
      { description: "Kitchen renovation - Labor", quantity: 1, rate: 15000, amount: 15000 },
      { description: "Kitchen renovation - Materials", quantity: 1, rate: 10000, amount: 10000 },
    ],
    notes: "Thank you for your business!",
    vatNumber: "GB123456789",
  },
  {
    id: "INV-2023-002",
    clientId: "client-2",
    clientName: "Metro Commercial Ltd",
    dateIssued: "2023-03-20",
    dueDate: "2023-04-20",
    amount: 75000,
    status: "paid",
    stripePaid: true,
    paymentDate: "2023-04-15",
    items: [
      { description: "Office renovation - Phase 1", quantity: 1, rate: 45000, amount: 45000 },
      { description: "Office renovation - Materials", quantity: 1, rate: 30000, amount: 30000 },
    ],
    notes: "Phase 1 of 3 for office renovation project.",
    vatNumber: "GB123456789",
  },
  {
    id: "INV-2023-003",
    clientId: "client-3",
    clientName: "Greenfield Developments",
    dateIssued: "2023-04-05",
    dueDate: "2023-05-05",
    amount: 120000,
    status: "paid",
    stripePaid: true,
    paymentDate: "2023-05-01",
    items: [
      { description: "Eco Homes Project - Labor", quantity: 1, rate: 70000, amount: 70000 },
      { description: "Eco Homes Project - Materials", quantity: 1, rate: 50000, amount: 50000 },
    ],
    notes: "First payment for Eco Homes development project.",
    vatNumber: "GB123456789",
  },
  {
    id: "INV-2023-004",
    clientId: "client-4",
    clientName: "City Hospital Trust",
    dateIssued: "2023-05-10",
    dueDate: "2023-06-10",
    amount: 250000,
    status: "paid",
    stripePaid: true,
    paymentDate: "2023-06-05",
    items: [
      { description: "Hospital Wing Renovation - Phase 1", quantity: 1, rate: 150000, amount: 150000 },
      { description: "Hospital Wing Renovation - Materials", quantity: 1, rate: 100000, amount: 100000 },
    ],
    notes: "First payment for hospital wing renovation.",
    vatNumber: "GB123456789",
  },
  {
    id: "INV-2023-005",
    clientId: "client-6",
    clientName: "Northside School District",
    dateIssued: "2023-06-15",
    dueDate: "2023-07-15",
    amount: 45000,
    status: "unpaid",
    stripePaid: false,
    items: [
      { description: "Sports Field Upgrade - Labor", quantity: 1, rate: 25000, amount: 25000 },
      { description: "Sports Field Upgrade - Materials", quantity: 1, rate: 20000, amount: 20000 },
    ],
    notes: "Payment for sports field upgrade project.",
    vatNumber: "GB123456789",
  },
  {
    id: "INV-2023-006",
    clientId: "client-7",
    clientName: "TechHub Innovations",
    dateIssued: "2023-06-20",
    dueDate: "2023-07-20",
    amount: 60000,
    status: "paid",
    stripePaid: false,
    paymentMethod: "bank",
    paymentDate: "2023-07-15",
    items: [
      { description: "Office Space Design - Labor", quantity: 1, rate: 40000, amount: 40000 },
      { description: "Office Space Design - Materials", quantity: 1, rate: 20000, amount: 20000 },
    ],
    notes: "Payment for office space design and renovation.",
    vatNumber: "GB123456789",
  },
  {
    id: "INV-2023-007",
    clientId: "client-8",
    clientName: "Thompson Residence",
    dateIssued: "2023-06-25",
    dueDate: "2023-07-25",
    amount: 12500,
    status: "paid",
    stripePaid: false,
    paymentMethod: "cash",
    paymentDate: "2023-07-20",
    items: [
      { description: "Kitchen Renovation - Labor", quantity: 1, rate: 7500, amount: 7500 },
      { description: "Kitchen Renovation - Materials", quantity: 1, rate: 5000, amount: 5000 },
    ],
    notes: "Payment for kitchen renovation project.",
    vatNumber: "GB123456789",
  },
  {
    id: "INV-2023-008",
    clientId: "client-9",
    clientName: "Wilson Family Home",
    dateIssued: "2023-06-28",
    dueDate: "2023-07-28",
    amount: 9000,
    status: "paid",
    stripePaid: true,
    paymentDate: "2023-07-25",
    items: [
      { description: "Bathroom Remodel - Labor", quantity: 1, rate: 5000, amount: 5000 },
      { description: "Bathroom Remodel - Materials", quantity: 1, rate: 4000, amount: 4000 },
    ],
    notes: "Payment for bathroom remodel project.",
    vatNumber: "GB123456789",
  },
  {
    id: "INV-2023-009",
    clientId: "client-1",
    clientName: "Oakwood Properties",
    dateIssued: "2023-07-05",
    dueDate: "2023-08-05",
    amount: 35000,
    status: "unpaid",
    stripePaid: false,
    items: [
      { description: "Office Renovation - Labor", quantity: 1, rate: 20000, amount: 20000 },
      { description: "Office Renovation - Materials", quantity: 1, rate: 15000, amount: 15000 },
    ],
    notes: "Payment for office renovation project.",
    vatNumber: "GB123456789",
  },
  {
    id: "INV-2023-010",
    clientId: "client-3",
    clientName: "Greenfield Developments",
    dateIssued: "2023-05-22",
    dueDate: "2023-06-22",
    amount: 35000,
    status: "paid",
    stripePaid: true,
    paymentDate: "2023-06-20",
    items: [
      { description: "Solar Panel Installation - Labor", quantity: 1, rate: 20000, amount: 20000 },
      { description: "Solar Panel Installation - Materials", quantity: 1, rate: 15000, amount: 15000 },
    ],
    notes: "Payment for solar panel installation project.",
    vatNumber: "GB123456789",
  },
  {
    id: "INV-2023-011",
    clientId: "client-2",
    clientName: "Metro Commercial Ltd",
    dateIssued: "2023-07-10",
    dueDate: "2023-08-10",
    amount: 85000,
    status: "draft",
    stripePaid: false,
    items: [
      { description: "Office Expansion - Labor", quantity: 1, rate: 50000, amount: 50000 },
      { description: "Office Expansion - Materials", quantity: 1, rate: 35000, amount: 35000 },
    ],
    notes: "Draft invoice for office expansion project.",
    vatNumber: "GB123456789",
  },
  {
    id: "INV-2023-012",
    clientId: "client-4",
    clientName: "City Hospital Trust",
    dateIssued: "2023-06-01",
    dueDate: "2023-07-01",
    amount: 180000,
    status: "overdue",
    stripePaid: false,
    items: [
      { description: "Hospital Wing Renovation - Phase 2", quantity: 1, rate: 100000, amount: 100000 },
      { description: "Hospital Wing Renovation - Materials", quantity: 1, rate: 80000, amount: 80000 },
    ],
    notes: "Second payment for hospital wing renovation.",
    vatNumber: "GB123456789",
  },
]

export function InvoicesTable() {
  const [invoicesData, setInvoicesData] = useState(initialInvoicesData)
  const [viewingInvoice, setViewingInvoice] = useState<any>(null)
  const [isViewDrawerOpen, setIsViewDrawerOpen] = useState(false)
  const { toast } = useToast()

  const isMobile = useIsMobile()

  // Handle view invoice
  const handleViewInvoice = (invoice: any) => {
    setViewingInvoice(invoice)
    setIsViewDrawerOpen(true)
  }

  // Handle send invoice
  const handleSendInvoice = (invoice: any) => {
    toast({
      title: "Invoice Sent",
      description: `Invoice ${invoice.id} has been sent to ${invoice.clientName}`,
    })
  }

  // Handle download invoice
  const handleDownloadInvoice = (invoice: any) => {
    toast({
      title: "Invoice Downloaded",
      description: `Invoice ${invoice.id} has been downloaded as PDF`,
    })
  }

  // Handle duplicate invoice
  const handleDuplicateInvoice = (invoice: any) => {
    const newInvoice = {
      ...invoice,
      id: `INV-${new Date().getFullYear()}-${String(invoicesData.length + 1).padStart(3, "0")}`,
      dateIssued: new Date().toISOString().split("T")[0],
      dueDate: new Date(new Date().setDate(new Date().getDate() + 30)).toISOString().split("T")[0],
      status: "draft",
      stripePaid: false,
    }

    setInvoicesData([newInvoice, ...invoicesData])

    toast({
      title: "Invoice Duplicated",
      description: `Invoice ${invoice.id} has been duplicated as ${newInvoice.id}`,
    })
  }

  // Handle mark as paid
  const handleMarkAsPaid = (invoice: any) => {
    setInvoicesData(
      invoicesData.map((inv) =>
        inv.id === invoice.id
          ? {
              ...inv,
              status: "paid",
              stripePaid: false,
              paymentMethod: "manual",
              paymentDate: new Date().toISOString().split("T")[0],
            }
          : inv,
      ),
    )

    toast({
      title: "Invoice Marked as Paid",
      description: `Invoice ${invoice.id} has been marked as paid`,
    })
  }

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })
  }

  // Format amount
  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP" }).format(amount)
  }

  // Get payment method icon
  const getPaymentMethodIcon = (invoice: any) => {
    if (invoice.stripePaid) {
      return <CreditCard className="h-4 w-4 text-purple-500" />
    } else if (invoice.paymentMethod === "bank") {
      return <Building className="h-4 w-4 text-blue-500" />
    } else if (invoice.paymentMethod === "cash") {
      return <Banknote className="h-4 w-4 text-green-500" />
    } else if (invoice.paymentMethod === "manual") {
      return <CheckCircle className="h-4 w-4 text-green-500" />
    }
    return null
  }

  // Get payment method text
  const getPaymentMethodText = (invoice: any) => {
    if (invoice.stripePaid) {
      return "Stripe"
    } else if (invoice.paymentMethod === "bank") {
      return "Bank Transfer"
    } else if (invoice.paymentMethod === "cash") {
      return "Cash"
    } else if (invoice.paymentMethod === "manual") {
      return "Manually Marked"
    }
    return ""
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
      </div>
    )
  }

  // Render desktop table view
  const renderTableView = () => (
    <div className="rounded-2xl border border-border/40 bg-card/50 backdrop-blur-sm overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Invoice ID</TableHead>
            <TableHead>Client</TableHead>
            <TableHead>Date Issued</TableHead>
            <TableHead>Due Date</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Payment</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {invoicesData.map((invoice) => (
            <TableRow key={invoice.id}>
              <TableCell className="font-medium">{invoice.id}</TableCell>
              <TableCell>{invoice.clientName}</TableCell>
              <TableCell>{formatDate(invoice.dateIssued)}</TableCell>
              <TableCell>{formatDate(invoice.dueDate)}</TableCell>
              <TableCell>{formatAmount(invoice.amount)}</TableCell>
              <TableCell>{getStatusBadge(invoice.status, invoice.stripePaid)}</TableCell>
              <TableCell>
                {invoice.status === "paid" && (
                  <div className="flex items-center gap-2">
                    {getPaymentMethodIcon(invoice)}
                    <span className="text-sm">{getPaymentMethodText(invoice)}</span>
                  </div>
                )}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-xl"
                    onClick={() => handleViewInvoice(invoice)}
                  >
                    <Eye className="h-4 w-4" />
                    <span className="sr-only">View</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-xl"
                    onClick={() => handleSendInvoice(invoice)}
                    disabled={invoice.status === "draft" || invoice.status === "paid"}
                  >
                    <Send className="h-4 w-4" />
                    <span className="sr-only">Send</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-xl"
                    onClick={() => handleDownloadInvoice(invoice)}
                  >
                    <Download className="h-4 w-4" />
                    <span className="sr-only">Download</span>
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8 rounded-xl">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">More</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="rounded-xl">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => handleDuplicateInvoice(invoice)}>
                        <Copy className="h-4 w-4 mr-2" />
                        Duplicate
                      </DropdownMenuItem>
                      {invoice.status !== "paid" && (
                        <DropdownMenuItem onClick={() => handleMarkAsPaid(invoice)}>
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Mark as Paid
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )

  // Render mobile card view
  const renderCardView = () => (
    <div className="space-y-4">
      {invoicesData.map((invoice) => (
        <Card key={invoice.id} className="rounded-2xl border-border/40 bg-card/50 backdrop-blur-sm">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <CardTitle className="text-lg">{invoice.id}</CardTitle>
              {getStatusBadge(invoice.status, invoice.stripePaid)}
            </div>
          </CardHeader>
          <CardContent className="pb-2">
            <div className="grid gap-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Client:</span>
                <span className="font-medium">{invoice.clientName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Date Issued:</span>
                <span>{formatDate(invoice.dateIssued)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Due Date:</span>
                <span>{formatDate(invoice.dueDate)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Amount:</span>
                <span className="font-medium">{formatAmount(invoice.amount)}</span>
              </div>
              {invoice.status === "paid" && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Payment Method:</span>
                  <div className="flex items-center gap-2">
                    {getPaymentMethodIcon(invoice)}
                    <span>{getPaymentMethodText(invoice)}</span>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
          <CardFooter className="pt-2 flex justify-between">
            <Button variant="ghost" size="sm" className="rounded-xl" onClick={() => handleViewInvoice(invoice)}>
              <Eye className="h-4 w-4 mr-1" />
              View
            </Button>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                className="rounded-xl"
                onClick={() => handleSendInvoice(invoice)}
                disabled={invoice.status === "draft" || invoice.status === "paid"}
              >
                <Send className="h-4 w-4 mr-1" />
                Send
              </Button>
              <Button variant="ghost" size="sm" className="rounded-xl" onClick={() => handleDownloadInvoice(invoice)}>
                <Download className="h-4 w-4 mr-1" />
                Download
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="rounded-xl">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="rounded-xl">
                  <DropdownMenuItem onClick={() => handleDuplicateInvoice(invoice)}>
                    <Copy className="h-4 w-4 mr-2" />
                    Duplicate
                  </DropdownMenuItem>
                  {invoice.status !== "paid" && (
                    <DropdownMenuItem onClick={() => handleMarkAsPaid(invoice)}>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Mark as Paid
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardFooter>
        </Card>
      ))}
    </div>
  )

  return (
    <>
      {isMobile ? renderCardView() : renderTableView()}

      {/* View Invoice Drawer */}
      <ViewInvoiceDrawer
        isOpen={isViewDrawerOpen}
        onClose={() => {
          setIsViewDrawerOpen(false)
          setViewingInvoice(null)
        }}
        invoice={viewingInvoice}
        onSend={handleSendInvoice}
        onDownload={handleDownloadInvoice}
        onMarkAsPaid={handleMarkAsPaid}
      />
    </>
  )
}
