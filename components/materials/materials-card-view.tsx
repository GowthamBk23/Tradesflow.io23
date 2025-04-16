"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Eye, CheckCircle, XCircle, Package, MapPin, User, Calendar } from "lucide-react"
import ViewRequestModal from "./view-request-modal"
import ApprovalDialog from "./approval-dialog"
import DenyDialog from "./deny-dialog"
import { useToast } from "@/hooks/use-toast"

// Mock data for materials requests (same as in table view)
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

export default function MaterialsCardView() {
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
      <div className="grid gap-4">
        {requests.map((request) => (
          <Card key={request.id} className="overflow-hidden">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">{request.id}</CardTitle>
                {getStatusBadge(request.status)}
              </div>
            </CardHeader>
            <CardContent className="pb-2">
              <div className="grid gap-2">
                <div className="flex items-start gap-2">
                  <User className="mt-0.5 h-4 w-4 text-muted-foreground" />
                  <div>
                    <div className="text-sm font-medium">{request.requestedBy}</div>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <MapPin className="mt-0.5 h-4 w-4 text-muted-foreground" />
                  <div>
                    <div className="text-sm">{request.siteLocation}</div>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <Calendar className="mt-0.5 h-4 w-4 text-muted-foreground" />
                  <div>
                    <div className="text-sm">{request.dateRequested}</div>
                  </div>
                </div>

                <div className="mt-1 rounded-md bg-muted p-2">
                  <div className="text-xs font-medium text-muted-foreground">Materials:</div>
                  {request.materials.map((material, index) => (
                    <div key={index} className="text-sm">
                      {material} - {request.quantity.split(", ")[index]}
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between border-t bg-muted/50 px-6 py-3">
              <Button variant="ghost" size="sm" onClick={() => setViewRequest(request.id)} className="h-8 px-2">
                <Eye className="mr-1 h-4 w-4" />
                View
              </Button>

              {request.status === "Pending" && (
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setApproveRequest(request.id)}
                    className="h-8 px-2 text-green-500 hover:text-green-600"
                  >
                    <CheckCircle className="mr-1 h-4 w-4" />
                    Approve
                  </Button>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setDenyRequest(request.id)}
                    className="h-8 px-2 text-red-500 hover:text-red-600"
                  >
                    <XCircle className="mr-1 h-4 w-4" />
                    Deny
                  </Button>
                </div>
              )}

              {request.status === "Approved" && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 px-2 text-blue-500 hover:text-blue-600"
                  onClick={() => handleMarkAsFulfilled(request.id)}
                >
                  <Package className="mr-1 h-4 w-4" />
                  Fulfill
                </Button>
              )}
            </CardFooter>
          </Card>
        ))}
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
