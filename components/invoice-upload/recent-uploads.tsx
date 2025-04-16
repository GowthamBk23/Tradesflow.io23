"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Eye, Trash2, MoreHorizontal } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useToast } from "@/hooks/use-toast"
import { useIsMobile } from "@/hooks/use-mobile"

// Mock data for recent uploads
const initialUploads = [
  {
    id: "upload-1",
    fileName: "Invoice-2023-1234.pdf",
    amount: "£2,450.00",
    status: "complete",
    uploadedBy: "John Doe",
    uploadedDate: "2023-07-15",
  },
  {
    id: "upload-2",
    fileName: "SupplierReceipt-5678.pdf",
    amount: "£1,875.50",
    status: "pending",
    uploadedBy: "Sarah Smith",
    uploadedDate: "2023-07-14",
  },
  {
    id: "upload-3",
    fileName: "MaterialsInvoice-9012.jpg",
    amount: "£3,210.75",
    status: "complete",
    uploadedBy: "Mike Johnson",
    uploadedDate: "2023-07-12",
  },
  {
    id: "upload-4",
    fileName: "EquipmentRental-3456.pdf",
    amount: "£950.25",
    status: "pending",
    uploadedBy: "John Doe",
    uploadedDate: "2023-07-10",
  },
  {
    id: "upload-5",
    fileName: "ContractorPayment-7890.pdf",
    amount: "£4,125.00",
    status: "complete",
    uploadedBy: "Lisa Brown",
    uploadedDate: "2023-07-08",
  },
]

export function RecentUploads() {
  const [uploads, setUploads] = useState(initialUploads)
  const { toast } = useToast()
  const isMobile = useIsMobile()

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })
  }

  // Handle view upload
  const handleViewUpload = (upload: any) => {
    toast({
      title: "Viewing Upload",
      description: `Opening ${upload.fileName} for viewing`,
    })
  }

  // Handle delete upload
  const handleDeleteUpload = (upload: any) => {
    setUploads(uploads.filter((u) => u.id !== upload.id))
    toast({
      title: "Upload Deleted",
      description: `${upload.fileName} has been deleted`,
    })
  }

  // Get status badge
  const getStatusBadge = (status: string) => {
    let className = ""
    const label = status === "complete" ? "Complete" : "Pending Review"

    switch (status) {
      case "complete":
        className = "bg-green-500/10 text-green-500 border-green-500/20"
        break
      case "pending":
        className = "bg-amber-500/10 text-amber-500 border-amber-500/20"
        break
      default:
        className = "bg-muted/50 text-muted-foreground"
    }

    return (
      <Badge variant="outline" className={`rounded-xl ${className}`}>
        {label}
      </Badge>
    )
  }

  // Render desktop table view
  const renderTableView = () => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>File Name</TableHead>
          <TableHead>Amount</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Uploaded By</TableHead>
          <TableHead>Date</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {uploads.map((upload) => (
          <TableRow key={upload.id}>
            <TableCell className="font-medium">{upload.fileName}</TableCell>
            <TableCell>{upload.amount}</TableCell>
            <TableCell>{getStatusBadge(upload.status)}</TableCell>
            <TableCell>{upload.uploadedBy}</TableCell>
            <TableCell>{formatDate(upload.uploadedDate)}</TableCell>
            <TableCell className="text-right">
              <div className="flex justify-end gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-xl"
                  onClick={() => handleViewUpload(upload)}
                >
                  <Eye className="h-4 w-4" />
                  <span className="sr-only">View</span>
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-xl text-destructive hover:text-destructive hover:bg-destructive/10"
                  onClick={() => handleDeleteUpload(upload)}
                >
                  <Trash2 className="h-4 w-4" />
                  <span className="sr-only">Delete</span>
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )

  // Render mobile card view
  const renderCardView = () => (
    <div className="space-y-4">
      {uploads.map((upload) => (
        <Card key={upload.id} className="rounded-2xl border-border/40 bg-card/50 backdrop-blur-sm">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <CardTitle className="text-base">{upload.fileName}</CardTitle>
              {getStatusBadge(upload.status)}
            </div>
          </CardHeader>
          <CardContent className="pb-4">
            <div className="grid grid-cols-2 gap-y-2 text-sm">
              <div>
                <div className="text-muted-foreground">Amount</div>
                <div className="font-medium">{upload.amount}</div>
              </div>
              <div>
                <div className="text-muted-foreground">Uploaded By</div>
                <div>{upload.uploadedBy}</div>
              </div>
              <div className="col-span-2">
                <div className="text-muted-foreground">Date</div>
                <div>{formatDate(upload.uploadedDate)}</div>
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <Button variant="ghost" size="sm" className="rounded-xl" onClick={() => handleViewUpload(upload)}>
                <Eye className="h-4 w-4 mr-1" />
                View
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="rounded-xl w-9 px-0">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="rounded-xl">
                  <DropdownMenuItem
                    onClick={() => handleDeleteUpload(upload)}
                    className="text-destructive focus:text-destructive"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )

  return (
    <Card className="rounded-2xl border-border/40 bg-card/50 backdrop-blur-sm">
      <CardHeader>
        <CardTitle>Recent Uploads</CardTitle>
      </CardHeader>
      <CardContent>
        {uploads.length > 0 ? (
          isMobile ? (
            renderCardView()
          ) : (
            renderTableView()
          )
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <p>No uploads yet. Start by uploading an invoice or receipt.</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
