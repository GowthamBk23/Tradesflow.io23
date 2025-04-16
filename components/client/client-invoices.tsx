"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Eye, Download, Receipt, CheckCircle, XCircle, Clock, CreditCard } from "lucide-react"
import { ViewInvoiceDrawer } from "@/components/invoices/view-invoice-drawer"
import { PaymentMethodSelector } from "@/components/invoices/payment-method-selector"
import { useToast } from "@/hooks/use-toast"

// Mock data for client invoices
const getClientInvoices = (clientId: string) => {
  // TODO: Replace with actual API call to get client invoices
  return {
    pendingInvoices: [
      {
        id: "INV-2023-005",
        clientId: "client-1",
        clientName: "Oakwood Properties",
        dateIssued: "2023-06-15",
        dueDate: "2023-07-15",
        amount: 45000,
        status: "unpaid",
        stripePaid: false,
        projectName: "London Office",
        items: [
          { description: "Sports Field Upgrade - Labor", quantity: 1, rate: 25000, amount: 25000 },
          { description: "Sports Field Upgrade - Materials", quantity: 1, rate: 20000, amount: 20000 },
        ],
        notes: "Payment for sports field upgrade project.",
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
        projectName: "Manchester Residence",
        items: [
          { description: "Office Renovation - Labor", quantity: 1, rate: 20000, amount: 20000 },
          { description: "Office Renovation - Materials", quantity: 1, rate: 15000, amount: 15000 },
        ],
        notes: "Payment for office renovation project.",
        vatNumber: "GB123456789",
      },
    ],
    paidInvoices: [
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
        projectName: "London Office",
        items: [
          { description: "Kitchen renovation - Labor", quantity: 1, rate: 15000, amount: 15000 },
          { description: "Kitchen renovation - Materials", quantity: 1, rate: 10000, amount: 10000 },
        ],
        notes: "Thank you for your business!",
        vatNumber: "GB123456789",
      },
      {
        id: "INV-2023-002",
        clientId: "client-1",
        clientName: "Oakwood Properties",
        dateIssued: "2023-03-20",
        dueDate: "2023-04-20",
        amount: 75000,
        status: "paid",
        stripePaid: true,
        paymentDate: "2023-04-15",
        projectName: "Manchester Residence",
        items: [
          { description: "Office renovation - Phase 1", quantity: 1, rate: 45000, amount: 45000 },
          { description: "Office renovation - Materials", quantity: 1, rate: 30000, amount: 30000 },
        ],
        notes: "Phase 1 of 3 for office renovation project.",
        vatNumber: "GB123456789",
      },
    ],
    rejectedInvoices: [
      {
        id: "INV-2023-012",
        clientId: "client-1",
        clientName: "Oakwood Properties",
        dateIssued: "2023-06-01",
        dueDate: "2023-07-01",
        amount: 18000,
        status: "rejected",
        stripePaid: false,
        projectName: "Birmingham Commercial",
        items: [{ description: "Consultation Services", quantity: 1, rate: 18000, amount: 18000 }],
        notes: "Invoice rejected due to project cancellation.",
        vatNumber: "GB123456789",
        rejectionReason: "Project cancelled by mutual agreement",
      },
    ],
  }
}

interface ClientInvoicesProps {
  clientId: string
}

export function ClientInvoices({ clientId }: ClientInvoicesProps) {
  const [invoicesData, setInvoicesData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [viewingInvoice, setViewingInvoice] = useState<any>(null)
  const [isViewDrawerOpen, setIsViewDrawerOpen] = useState(false)
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    // Simulate API call
    const fetchData = async () => {
      setIsLoading(true)
      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 500))
      const data = getClientInvoices(clientId)
      setInvoicesData(data)
      setIsLoading(false)
    }

    fetchData()
  }, [clientId])

  // Handle view invoice
  const handleViewInvoice = (invoice: any) => {
    setViewingInvoice(invoice)
    setIsViewDrawerOpen(true)
  }

  // Handle download invoice
  const handleDownloadInvoice = (invoice: any) => {
    toast({
      title: "Invoice Downloaded",
      description: `Invoice ${invoice.id} has been downloaded as PDF`,
    })
  }

  // Handle pay invoice
  const handlePayInvoice = (invoice: any) => {
    setViewingInvoice(invoice)
    setIsPaymentModalOpen(true)
  }

  // Handle payment completion
  const handlePaymentComplete = (invoice: any, method: string) => {
    // In a real app, this would update the invoice in your database
    const updatedInvoice = {
      ...invoice,
      status: "paid",
      paymentMethod: method,
      paymentDate: new Date().toISOString().split("T")[0],
    }

    // Update local state
    setInvoicesData({
      ...invoicesData,
      pendingInvoices: invoicesData.pendingInvoices.filter((inv: any) => inv.id !== invoice.id),
      paidInvoices: [updatedInvoice, ...invoicesData.paidInvoices],
    })

    toast({
      title: "Payment Successful",
      description: `Invoice ${invoice.id} has been marked as paid via ${method === "bank" ? "bank transfer" : "cash"}`,
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

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Card className="animate-pulse">
          <CardContent className="h-40"></CardContent>
        </Card>
      </div>
    )
  }

  const renderInvoiceCard = (invoice: any) => (
    <Card key={invoice.id} className="overflow-hidden rounded-2xl border-border/40 bg-card/50 backdrop-blur-sm">
      <CardContent className="p-0">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b p-4">
          <div>
            <div className="flex items-center gap-2">
              <Receipt className="h-5 w-5 text-primary" />
              <p className="font-medium">{invoice.id}</p>
              {invoice.status === "paid" && (
                <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20 rounded-xl">
                  <CheckCircle className="mr-1 h-3 w-3" />
                  Paid
                </Badge>
              )}
              {invoice.status === "unpaid" && (
                <Badge variant="outline" className="bg-amber-500/10 text-amber-500 border-amber-500/20 rounded-xl">
                  <Clock className="mr-1 h-3 w-3" />
                  Pending
                </Badge>
              )}
              {invoice.status === "rejected" && (
                <Badge variant="outline" className="bg-rose-500/10 text-rose-500 border-rose-500/20 rounded-xl">
                  <XCircle className="mr-1 h-3 w-3" />
                  Rejected
                </Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground mt-1">{invoice.projectName}</p>
          </div>
          <div className="mt-2 md:mt-0 flex flex-col md:items-end">
            <p className="text-lg font-bold">{formatAmount(invoice.amount)}</p>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span>Issued: {formatDate(invoice.dateIssued)}</span>
              <span>•</span>
              <span>Due: {formatDate(invoice.dueDate)}</span>
            </div>
          </div>
        </div>
        <div className="flex flex-wrap items-center justify-between p-4">
          {invoice.status === "rejected" && (
            <p className="text-sm text-rose-500 mb-2 w-full">
              <XCircle className="inline-block mr-1 h-4 w-4" />
              Reason: {invoice.rejectionReason || "No reason provided"}
            </p>
          )}
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="rounded-xl" onClick={() => handleViewInvoice(invoice)}>
              <Eye className="mr-2 h-4 w-4" />
              View Details
            </Button>
            <Button variant="outline" size="sm" className="rounded-xl" onClick={() => handleDownloadInvoice(invoice)}>
              <Download className="mr-2 h-4 w-4" />
              Download
            </Button>
          </div>
          {(invoice.status === "unpaid" || invoice.status === "overdue") && (
            <Button size="sm" className="rounded-xl mt-2 sm:mt-0" onClick={() => handlePayInvoice(invoice)}>
              <CreditCard className="mr-2 h-4 w-4" />
              Pay Now
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="space-y-6">
      <Tabs defaultValue="pending" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="pending" className="relative">
            Pending
            {invoicesData.pendingInvoices.length > 0 && (
              <Badge className="ml-2 bg-primary text-primary-foreground">{invoicesData.pendingInvoices.length}</Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="paid">Paid</TabsTrigger>
          <TabsTrigger value="rejected">Rejected</TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="mt-6 space-y-4">
          {invoicesData.pendingInvoices.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center p-6">
                <Receipt className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-center text-muted-foreground">No pending invoices</p>
              </CardContent>
            </Card>
          ) : (
            invoicesData.pendingInvoices.map((invoice: any) => renderInvoiceCard(invoice))
          )}
        </TabsContent>

        <TabsContent value="paid" className="mt-6 space-y-4">
          {invoicesData.paidInvoices.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center p-6">
                <CheckCircle className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-center text-muted-foreground">No paid invoices</p>
              </CardContent>
            </Card>
          ) : (
            invoicesData.paidInvoices.map((invoice: any) => renderInvoiceCard(invoice))
          )}
        </TabsContent>

        <TabsContent value="rejected" className="mt-6 space-y-4">
          {invoicesData.rejectedInvoices.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center p-6">
                <XCircle className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-center text-muted-foreground">No rejected invoices</p>
              </CardContent>
            </Card>
          ) : (
            invoicesData.rejectedInvoices.map((invoice: any) => renderInvoiceCard(invoice))
          )}
        </TabsContent>
      </Tabs>

      {/* View Invoice Drawer */}
      <ViewInvoiceDrawer
        isOpen={isViewDrawerOpen}
        onClose={() => {
          setIsViewDrawerOpen(false)
          setViewingInvoice(null)
        }}
        invoice={viewingInvoice}
        onDownload={handleDownloadInvoice}
        isClientView={true}
      />

      {/* Payment Method Selector */}
      <PaymentMethodSelector
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        invoice={viewingInvoice}
        onPaymentComplete={handlePaymentComplete}
      />
    </div>
  )
}
