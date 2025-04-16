"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle, Package, MapPin, User, Calendar } from "lucide-react"

interface ViewRequestModalProps {
  isOpen: boolean
  onClose: () => void
  requestId: string
  onApprove: (id: string) => void
  onDeny: (id: string) => void
  onFulfill: (id: string) => void
  isStaffView?: boolean
}

// Mock data for material requests
const getMaterialRequest = (requestId: string) => {
  // This would be replaced with an API call in a real application
  const mockRequests = {
    "REQ-001": {
      id: "REQ-001",
      requestedBy: "John Doe",
      siteLocation: "Site A - Downtown Project",
      materials: ["Concrete Mix", "Rebar 10mm"],
      quantity: ["20 bags", "30 units"],
      dateRequested: "Apr 3, 2025",
      status: "Pending",
      notes: "Need these materials by end of week for foundation work.",
      deliveryAddress: "123 Main St, London",
      contactPhone: "+44 20 1234 5678",
    },
    "REQ-002": {
      id: "REQ-002",
      requestedBy: "Jane Smith",
      siteLocation: "Site B - Riverside Apartments",
      materials: ["Lumber 2x4", "Drywall Sheets"],
      quantity: ["50 pieces", "25 sheets"],
      dateRequested: "Apr 2, 2025",
      status: "Approved",
      notes: "For interior framing on the second floor.",
      deliveryAddress: "456 River Rd, Manchester",
      contactPhone: "+44 16 1234 5678",
    },
    "REQ-003": {
      id: "REQ-003",
      requestedBy: "Mike Johnson",
      siteLocation: "Site C - Commercial Plaza",
      materials: ["Electrical Conduit", "Junction Boxes"],
      quantity: ["100m", "15 units"],
      dateRequested: "Apr 1, 2025",
      status: "Denied",
      notes: "Required for electrical work in the east wing.",
      deliveryAddress: "789 Plaza Ave, Birmingham",
      contactPhone: "+44 12 1234 5678",
      denialReason: "Items already in inventory at site. Please check with site manager.",
    },
    "REQ-004": {
      id: "REQ-004",
      requestedBy: "Sarah Williams",
      siteLocation: "Site A - Downtown Project",
      materials: ["Paint - White Eggshell", "Brushes"],
      quantity: ["10 gallons", "5 sets"],
      dateRequested: "Mar 31, 2025",
      status: "Fulfilled",
      notes: "For interior walls in units 101-105.",
      deliveryAddress: "123 Main St, London",
      contactPhone: "+44 20 1234 5678",
      deliveryDate: "Apr 2, 2025",
      receivedBy: "John Doe",
    },
    "REQ-005": {
      id: "REQ-005",
      requestedBy: "David Brown",
      siteLocation: "Site B - Riverside Apartments",
      materials: ["Plumbing Fixtures", "PVC Pipes"],
      quantity: ["8 sets", "20 pieces"],
      dateRequested: "Mar 30, 2025",
      status: "Pending",
      notes: "For bathroom installations on the third floor.",
      deliveryAddress: "456 River Rd, Manchester",
      contactPhone: "+44 16 1234 5678",
    },
  }

  return mockRequests[requestId as keyof typeof mockRequests]
}

export default function ViewRequestModal({
  isOpen,
  onClose,
  requestId,
  onApprove,
  onDeny,
  onFulfill,
  isStaffView = false,
}: ViewRequestModalProps) {
  const request = getMaterialRequest(requestId)

  if (!request) {
    return null
  }

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

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Material Request Details</span>
            {getStatusBadge(request.status)}
          </DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <div className="col-span-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="bg-primary/10 p-2 rounded-full">
                  <Package className="h-4 w-4 text-primary" />
                </div>
                <h3 className="font-medium">{request.id}</h3>
              </div>
            </div>

            <div className="col-span-4 space-y-3">
              <div className="flex items-start gap-2">
                <User className="h-4 w-4 text-muted-foreground mt-0.5" />
                <div>
                  <div className="text-sm font-medium">Requested By</div>
                  <div className="text-sm">{request.requestedBy}</div>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                <div>
                  <div className="text-sm font-medium">Site Location</div>
                  <div className="text-sm">{request.siteLocation}</div>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground mt-0.5" />
                <div>
                  <div className="text-sm font-medium">Date Requested</div>
                  <div className="text-sm">{request.dateRequested}</div>
                </div>
              </div>
            </div>

            <div className="col-span-4">
              <div className="text-sm font-medium mb-2">Materials Requested</div>
              <div className="rounded-md border p-3 space-y-2">
                {request.materials.map((material, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <span>{material}</span>
                    <span className="text-sm text-muted-foreground">{request.quantity[index]}</span>
                  </div>
                ))}
              </div>
            </div>

            {request.notes && (
              <div className="col-span-4">
                <div className="text-sm font-medium mb-2">Notes</div>
                <div className="rounded-md border p-3 text-sm">{request.notes}</div>
              </div>
            )}

            {request.deliveryAddress && (
              <div className="col-span-4">
                <div className="text-sm font-medium mb-2">Delivery Information</div>
                <div className="rounded-md border p-3 space-y-2">
                  <div className="text-sm">
                    <span className="text-muted-foreground">Address: </span>
                    {request.deliveryAddress}
                  </div>
                  <div className="text-sm">
                    <span className="text-muted-foreground">Contact: </span>
                    {request.contactPhone}
                  </div>
                </div>
              </div>
            )}

            {request.status === "Denied" && request.denialReason && (
              <div className="col-span-4">
                <div className="text-sm font-medium mb-2 text-red-500">Denial Reason</div>
                <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm">{request.denialReason}</div>
              </div>
            )}

            {request.status === "Fulfilled" && (
              <div className="col-span-4">
                <div className="text-sm font-medium mb-2 text-green-500">Fulfillment Details</div>
                <div className="rounded-md border border-green-200 bg-green-50 p-3 space-y-2">
                  <div className="text-sm">
                    <span className="text-muted-foreground">Delivery Date: </span>
                    {request.deliveryDate}
                  </div>
                  <div className="text-sm">
                    <span className="text-muted-foreground">Received By: </span>
                    {request.receivedBy}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <DialogFooter>
          {!isStaffView && request.status === "Pending" && (
            <>
              <Button variant="outline" onClick={() => onDeny(request.id)} className="gap-1">
                <XCircle className="h-4 w-4" />
                Deny
              </Button>
              <Button variant="outline" onClick={() => onApprove(request.id)} className="gap-1">
                <CheckCircle className="h-4 w-4" />
                Approve
              </Button>
            </>
          )}

          {!isStaffView && request.status === "Approved" && (
            <Button onClick={() => onFulfill(request.id)} className="gap-1">
              <Package className="h-4 w-4" />
              Mark as Fulfilled
            </Button>
          )}

          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
