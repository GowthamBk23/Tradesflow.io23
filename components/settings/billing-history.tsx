"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Download } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function BillingHistory() {
  const { toast } = useToast()
  // Mock data for invoices
  const [invoices] = useState([
    { id: "INV-001", amount: "£200.00", date: "Apr 15, 2023", status: "paid" },
    { id: "INV-002", amount: "£200.00", date: "Mar 15, 2023", status: "paid" },
    { id: "INV-003", amount: "£200.00", date: "Feb 15, 2023", status: "paid" },
    { id: "INV-004", amount: "£200.00", date: "Jan 15, 2023", status: "paid" },
    { id: "INV-005", amount: "£200.00", date: "Dec 15, 2022", status: "paid" },
  ])

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "paid":
        return (
          <Badge
            variant="outline"
            className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100 hover:bg-green-100 dark:hover:bg-green-900"
          >
            Paid
          </Badge>
        )
      case "pending":
        return (
          <Badge
            variant="outline"
            className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100 hover:bg-yellow-100 dark:hover:bg-yellow-900"
          >
            Pending
          </Badge>
        )
      case "failed":
        return (
          <Badge
            variant="outline"
            className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100 hover:bg-red-100 dark:hover:bg-red-900"
          >
            Failed
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const handleDownload = (invoiceId: string) => {
    // In a real app, you would generate and download a PDF
    toast({
      title: "Invoice downloaded",
      description: `Invoice ${invoiceId} has been downloaded.`,
    })
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Billing History</h3>
        <p className="text-sm text-muted-foreground">View and download your past invoices.</p>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Invoice</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {invoices.map((invoice) => (
              <TableRow key={invoice.id}>
                <TableCell className="font-medium">{invoice.id}</TableCell>
                <TableCell>{invoice.amount}</TableCell>
                <TableCell>{invoice.date}</TableCell>
                <TableCell>{getStatusBadge(invoice.status)}</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm" onClick={() => handleDownload(invoice.id)}>
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
