"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Eye, CheckCircle, XCircle, Package } from "lucide-react"
import ViewRequestModal from "./view-request-modal"
import ApprovalDialog from "./approval-dialog"
import DenyDialog from "./deny-dialog"
import { useToast } from "@/hooks/use-toast"

// Mock data for materials requests
const materialRequests = [
  {
    id: "REQ-001",
    requestedBy: "John Doe",
    siteLocation: "Site A - Downtown Project",
    materials: ["Concrete Mix", "Rebar 10mm"],
    quantity: "20 bags, 30 units",
    dateRequested: "Apr 3, 2025",
    status: "Pending",
  },
  {
    id: "REQ-002",
    requestedBy: "Jane Smith",
    siteLocation: "Site B - Riverside Apartments",
    materials: ["Lumber 2x4", "Drywall Sheets"],
    quantity: "50 pieces, 25 sheets",
    dateRequested: "Apr 2, 2025",
    status: "Approved",
  },
  {
    id: "REQ-003",
    requestedBy: "Mike Johnson",
    siteLocation: "Site C - Commercial Plaza",
    materials: ["Electrical Conduit", "Junction Boxes"],
    quantity: "100m, 15 units",
    dateRequested: "Apr 1, 2025",
    status: "Denied",
  },
  {
    id: "REQ-004",
    requestedBy: "Sarah Williams",
    siteLocation: "Site A - Downtown Project",
    materials: ["Paint - White Eggshell", "Brushes"],
    quantity: "10 gallons, 5 sets",
    dateRequested: "Mar 31, 2025",
    status: "Fulfilled",
  },
  {
    id: "REQ-005",
    requestedBy: "David Brown",
    siteLocation: "Site B - Riverside Apartments",
    materials: ["Plumbing Fixtures", "PVC Pipes"],
    quantity: "8 sets, 20 pieces",
    dateRequested: "Mar 30, 2025",
    status: "Pending",
  },
]

export default function MaterialsTable() {
  const [viewRequest, setViewRequest] = useState<string | null>(null)
  const [approveRequest, setApproveRequest] = useState<string | null>(null)
  const [denyRequest, setDenyRequest] = useState<string | null>(null)
  const [requests, setRequests] = useState(materialRequests)
  const { toast } = useToast()

  // Function to get the badge variant based on status
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Pending":
        return (
          <Badge variant="outline" className="bg-yellow-500/10 text-yellow-500">
            Pending
          </Badge>
        )
      case "Approved":
        return (
          <Badge variant="outline" className="bg-green-500/10 text-green-500">
            Approved
          </Badge>
        )
      case "Denied":
        return (
          <Badge variant="outline" className="bg-red-500/10 text-red-500">
            Denied
          </Badge>
        )
      case "Fulfilled":
        return (
          <Badge variant="outline" className="bg-blue-500/10 text-blue-500">
            Fulfilled
          </Badge>
        )
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  const handleMarkAsFulfilled = (requestId: string) => {
    setRequests((prevRequests) =>
      prevRequests.map((request) => (request.id === requestId ? { ...request, status: "Fulfilled" } : request)),
    )

    toast({
      title: "Request Fulfilled",
      description: `Request ${requestId} has been marked as fulfilled.`,
    })
  }

  const handleApproveSuccess = (requestId: string) => {
    setRequests((prevRequests) =>
      prevRequests.map((request) => (request.id === requestId ? { ...request, status: "Approved" } : request)),
    )

    toast({
      title: "Request Approved",
      description: `Request ${requestId} has been approved successfully.`,
    })
  }

  const handleDenySuccess = (requestId: string) => {
    setRequests((prevRequests) =>
      prevRequests.map((request) => (request.id === requestId ? { ...request, status: "Denied" } : request)),
    )

    toast({
      title: "Request Denied",
      description: `Request ${requestId} has been denied.`,
    })
  }

  return (
    <>
      <div className="rounded-md border shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Request ID</TableHead>
              <TableHead>Requested By</TableHead>
              <TableHead>Site Location</TableHead>
              <TableHead>Materials</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Date Requested</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {requests.map((request) => (
              <TableRow key={request.id}>
                <TableCell className="font-medium">{request.id}</TableCell>
                <TableCell>{request.requestedBy}</TableCell>
                <TableCell>{request.siteLocation}</TableCell>
                <TableCell>
                  {request.materials.map((material, index) => (
                    <div key={index}>{material}</div>
                  ))}
                </TableCell>
                <TableCell>{request.quantity}</TableCell>
                <TableCell>{request.dateRequested}</TableCell>
                <TableCell>{getStatusBadge(request.status)}</TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button variant="ghost" size="icon" onClick={() => setViewRequest(request.id)} title="View Details">
                      <Eye className="h-4 w-4" />
                    </Button>

                    {request.status === "Pending" && (
                      <>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setApproveRequest(request.id)}
                          className="text-green-500 hover:text-green-600"
                          title="Approve Request"
                        >
                          <CheckCircle className="h-4 w-4" />
                        </Button>

                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setDenyRequest(request.id)}
                          className="text-red-500 hover:text-red-600"
                          title="Deny Request"
                        >
                          <XCircle className="h-4 w-4" />
                        </Button>
                      </>
                    )}

                    {request.status === "Approved" && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-blue-500 hover:text-blue-600"
                        title="Mark as Fulfilled"
                        onClick={() => handleMarkAsFulfilled(request.id)}
                      >
                        <Package className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {viewRequest && (
        <ViewRequestModal
          isOpen={!!viewRequest}
          onClose={() => setViewRequest(null)}
          requestId={viewRequest}
          onApprove={(id) => {
            handleApproveSuccess(id)
            setViewRequest(null)
          }}
          onDeny={(id) => {
            handleDenySuccess(id)
            setViewRequest(null)
          }}
          onFulfill={(id) => {
            handleMarkAsFulfilled(id)
            setViewRequest(null)
          }}
        />
      )}

      {approveRequest && (
        <ApprovalDialog
          isOpen={!!approveRequest}
          onClose={() => setApproveRequest(null)}
          requestId={approveRequest}
          onApprove={handleApproveSuccess}
        />
      )}

      {denyRequest && (
        <DenyDialog
          isOpen={!!denyRequest}
          onClose={() => setDenyRequest(null)}
          requestId={denyRequest}
          onDeny={handleDenySuccess}
        />
      )}
    </>
  )
}
