"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Eye, Package, MapPin, Calendar, User } from "lucide-react"
import ViewRequestModal from "../materials/view-request-modal"

// Mock data for staff materials
const getStaffMaterials = (staffId: string) => {
  return {
    siteRequests: [
      {
        id: "REQ-001",
        requestedBy: "John Doe",
        siteLocation: "Site A - London Office",
        materials: ["Concrete Mix", "Rebar 10mm"],
        quantity: "20 bags, 30 units",
        dateRequested: "Apr 3, 2025",
        status: "Pending",
      },
      {
        id: "REQ-004",
        requestedBy: "Sarah Williams",
        siteLocation: "Site A - London Office",
        materials: ["Paint - White Eggshell", "Brushes"],
        quantity: "10 gallons, 5 sets",
        dateRequested: "Mar 31, 2025",
        status: "Fulfilled",
      },
      {
        id: "REQ-005",
        requestedBy: "David Brown",
        siteLocation: "Site C - Birmingham Commercial",
        materials: ["Plumbing Fixtures", "PVC Pipes"],
        quantity: "8 sets, 20 pieces",
        dateRequested: "Mar 30, 2025",
        status: "Pending",
      },
    ],
    myRequests: [
      {
        id: "REQ-001",
        requestedBy: "John Doe",
        siteLocation: "Site A - London Office",
        materials: ["Concrete Mix", "Rebar 10mm"],
        quantity: "20 bags, 30 units",
        dateRequested: "Apr 3, 2025",
        status: "Pending",
      },
    ],
  }
}

interface StaffMaterialsViewProps {
  staffId: string
  isMobile: boolean
}

export default function StaffMaterialsView({ staffId, isMobile }: StaffMaterialsViewProps) {
  const [materials, setMaterials] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [viewRequest, setViewRequest] = useState<string | null>(null)

  useEffect(() => {
    // Simulate API call
    const fetchData = async () => {
      setIsLoading(true)
      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 500))
      const data = getStaffMaterials(staffId)
      setMaterials(data)
      setIsLoading(false)
    }

    fetchData()
  }, [staffId])

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Card className="animate-pulse">
          <CardHeader>
            <div className="h-5 w-32 bg-muted rounded"></div>
          </CardHeader>
          <CardContent>
            <div className="h-40 bg-muted rounded"></div>
          </CardContent>
        </Card>
      </div>
    )
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

  // Render table view
  const renderTableView = (requests: any[]) => (
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
                {request.materials.map((material: string, index: number) => (
                  <div key={index}>{material}</div>
                ))}
              </TableCell>
              <TableCell>{request.quantity}</TableCell>
              <TableCell>{request.dateRequested}</TableCell>
              <TableCell>{getStatusBadge(request.status)}</TableCell>
              <TableCell>
                <Button variant="ghost" size="icon" onClick={() => setViewRequest(request.id)} title="View Details">
                  <Eye className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )

  // Render card view
  const renderCardView = (requests: any[]) => (
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
                {request.materials.map((material: string, index: number) => (
                  <div key={index} className="text-sm">
                    {material} - {request.quantity.split(", ")[index]}
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
          <div className="flex justify-end border-t bg-muted/50 px-6 py-3">
            <Button variant="ghost" size="sm" onClick={() => setViewRequest(request.id)} className="h-8 px-2">
              <Eye className="mr-1 h-4 w-4" />
              View
            </Button>
          </div>
        </Card>
      ))}
    </div>
  )

  return (
    <div className="space-y-6">
      <Tabs defaultValue="site">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="site">
            <MapPin className="h-4 w-4 mr-2" />
            Site Materials
          </TabsTrigger>
          <TabsTrigger value="my">
            <Package className="h-4 w-4 mr-2" />
            My Requests
          </TabsTrigger>
        </TabsList>

        <TabsContent value="site" className="mt-4">
          {materials.siteRequests.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-8">
                <Package className="h-12 w-12 text-muted-foreground opacity-20" />
                <p className="mt-4 text-lg font-medium">No materials found</p>
                <p className="text-muted-foreground">No materials have been ordered for your sites</p>
              </CardContent>
            </Card>
          ) : isMobile ? (
            renderCardView(materials.siteRequests)
          ) : (
            renderTableView(materials.siteRequests)
          )}
        </TabsContent>

        <TabsContent value="my" className="mt-4">
          {materials.myRequests.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-8">
                <Package className="h-12 w-12 text-muted-foreground opacity-20" />
                <p className="mt-4 text-lg font-medium">No requests found</p>
                <p className="text-muted-foreground">You haven't made any material requests yet</p>
              </CardContent>
            </Card>
          ) : isMobile ? (
            renderCardView(materials.myRequests)
          ) : (
            renderTableView(materials.myRequests)
          )}
        </TabsContent>
      </Tabs>

      {viewRequest && (
        <ViewRequestModal
          isOpen={!!viewRequest}
          onClose={() => setViewRequest(null)}
          requestId={viewRequest}
          onApprove={() => {}}
          onDeny={() => {}}
          onFulfill={() => {}}
          isStaffView={true}
        />
      )}
    </div>
  )
}
