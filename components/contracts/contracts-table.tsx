"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Eye, Download, Send, MoreHorizontal, Copy, FileText, Calendar, UserCircle, Briefcase } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ViewContractModal } from "./view-contract-modal"
import { useIsMobile } from "@/hooks/use-mobile"
import { useToast } from "@/hooks/use-toast"

// Mock data for contracts
const initialContractsData = [
  {
    id: "contract-1",
    title: "Oakwood Properties - Construction Agreement",
    clientId: "client-1",
    clientName: "Oakwood Properties",
    projectId: "site-a",
    projectName: "Site A - London Office",
    dateCreated: "2023-06-15",
    status: "signed",
    signedDate: "2023-06-18",
    description: "Main construction agreement for the London Office project.",
    pdfUrl: "/placeholder.svg?height=600&width=400",
  },
  {
    id: "contract-2",
    title: "Metro Commercial - Renovation Contract",
    clientId: "client-2",
    clientName: "Metro Commercial Ltd",
    projectId: "site-b",
    projectName: "Site B - Manchester Residence",
    dateCreated: "2023-06-20",
    status: "pending",
    description: "Renovation contract for the Manchester Residence project.",
    pdfUrl: "/placeholder.svg?height=600&width=400",
  },
  {
    id: "contract-3",
    title: "Greenfield Developments - Eco Homes Agreement",
    clientId: "client-3",
    clientName: "Greenfield Developments",
    projectId: "site-c",
    projectName: "Site C - Birmingham Commercial",
    dateCreated: "2023-06-25",
    status: "rejected",
    rejectionReason: "Budget concerns, need to revise pricing structure.",
    description: "Construction agreement for eco-friendly homes development.",
    pdfUrl: "/placeholder.svg?height=600&width=400",
  },
  {
    id: "contract-4",
    title: "City Hospital - Wing Expansion Contract",
    clientId: "client-4",
    clientName: "City Hospital Trust",
    projectId: "site-d",
    projectName: "Site D - Edinburgh Hospital",
    dateCreated: "2023-07-01",
    status: "signed",
    signedDate: "2023-07-05",
    description: "Contract for hospital wing expansion project.",
    pdfUrl: "/placeholder.svg?height=600&width=400",
  },
  {
    id: "contract-5",
    title: "Thompson Residence - Kitchen Renovation",
    clientId: "client-8",
    clientName: "Thompson Residence",
    projectId: "site-b",
    projectName: "Site B - Manchester Residence",
    dateCreated: "2023-07-10",
    status: "pending",
    description: "Kitchen renovation contract for the Thompson residence.",
    pdfUrl: "/placeholder.svg?height=600&width=400",
  },
  {
    id: "contract-6",
    title: "Wilson Family - Bathroom Remodel",
    clientId: "client-9",
    clientName: "Wilson Family Home",
    projectId: "site-c",
    projectName: "Site C - Birmingham Commercial",
    dateCreated: "2023-07-15",
    status: "signed",
    signedDate: "2023-07-18",
    description: "Bathroom remodeling contract for the Wilson family home.",
    pdfUrl: "/placeholder.svg?height=600&width=400",
  },
]

export function ContractsTable() {
  const [contractsData, setContractsData] = useState(initialContractsData)
  const [viewingContract, setViewingContract] = useState<any>(null)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)

  const { toast } = useToast()
  const isMobile = useIsMobile()

  // Handle view contract
  const handleViewContract = (contract: any) => {
    setViewingContract(contract)
    setIsViewModalOpen(true)
  }

  // Handle download contract
  const handleDownloadContract = (contract: any) => {
    toast({
      title: "Contract Downloaded",
      description: `${contract.title} has been downloaded as PDF`,
    })
  }

  // Handle resend contract
  const handleResendContract = (contract: any) => {
    toast({
      title: "Contract Resent",
      description: `${contract.title} has been resent to ${contract.clientName}`,
    })
  }

  // Handle duplicate contract
  const handleDuplicateContract = (contract: any) => {
    const newContract = {
      ...contract,
      id: `contract-${Date.now()}`,
      title: `${contract.title} (Copy)`,
      dateCreated: new Date().toISOString().split("T")[0],
      status: "pending",
      signedDate: undefined,
      rejectionReason: undefined,
    }

    setContractsData([newContract, ...contractsData])

    toast({
      title: "Contract Duplicated",
      description: `${contract.title} has been duplicated`,
    })
  }

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })
  }

  // Get status badge
  const getStatusBadge = (status: string) => {
    let className = ""
    const label = status.charAt(0).toUpperCase() + status.slice(1)

    switch (status) {
      case "signed":
        className = "bg-green-500/10 text-green-500 border-green-500/20"
        break
      case "rejected":
        className = "bg-rose-500/10 text-rose-500 border-rose-500/20"
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
    <div className="rounded-2xl border border-border/40 bg-card/50 backdrop-blur-sm overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Contract Title</TableHead>
            <TableHead>Client</TableHead>
            <TableHead>Project/Site</TableHead>
            <TableHead>Date Created</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {contractsData.map((contract) => (
            <TableRow key={contract.id}>
              <TableCell className="font-medium">{contract.title}</TableCell>
              <TableCell>{contract.clientName}</TableCell>
              <TableCell>{contract.projectName.split(" - ")[0]}</TableCell>
              <TableCell>{formatDate(contract.dateCreated)}</TableCell>
              <TableCell>{getStatusBadge(contract.status)}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-xl"
                    onClick={() => handleViewContract(contract)}
                  >
                    <Eye className="h-4 w-4" />
                    <span className="sr-only">View</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-xl"
                    onClick={() => handleDownloadContract(contract)}
                  >
                    <Download className="h-4 w-4" />
                    <span className="sr-only">Download</span>
                  </Button>
                  {contract.status === "pending" && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 rounded-xl"
                      onClick={() => handleResendContract(contract)}
                    >
                      <Send className="h-4 w-4" />
                      <span className="sr-only">Resend</span>
                    </Button>
                  )}
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
                      <DropdownMenuItem onClick={() => handleDuplicateContract(contract)}>
                        <Copy className="h-4 w-4 mr-2" />
                        Duplicate
                      </DropdownMenuItem>
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
      {contractsData.map((contract) => (
        <Card key={contract.id} className="rounded-2xl border-border/40 bg-card/50 backdrop-blur-sm">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <CardTitle className="text-lg">{contract.title}</CardTitle>
              {getStatusBadge(contract.status)}
            </div>
          </CardHeader>
          <CardContent className="pb-2">
            <div className="grid gap-2 text-sm">
              <div className="flex items-center gap-2">
                <UserCircle className="h-4 w-4 text-muted-foreground" />
                <span>{contract.clientName}</span>
              </div>
              <div className="flex items-center gap-2">
                <Briefcase className="h-4 w-4 text-muted-foreground" />
                <span>{contract.projectName.split(" - ")[0]}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>{formatDate(contract.dateCreated)}</span>
              </div>
              {contract.status === "signed" && (
                <div className="flex items-center gap-2 text-green-500">
                  <FileText className="h-4 w-4" />
                  <span>Signed on {formatDate(contract.signedDate || "")}</span>
                </div>
              )}
              {contract.status === "rejected" && (
                <div className="flex items-center gap-2 text-rose-500">
                  <FileText className="h-4 w-4" />
                  <span>Rejected: {contract.rejectionReason}</span>
                </div>
              )}
            </div>
          </CardContent>
          <CardFooter className="pt-2 flex justify-between">
            <Button variant="ghost" size="sm" className="rounded-xl" onClick={() => handleViewContract(contract)}>
              <Eye className="h-4 w-4 mr-1" />
              View
            </Button>
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" className="rounded-xl" onClick={() => handleDownloadContract(contract)}>
                <Download className="h-4 w-4 mr-1" />
                Download
              </Button>
              {contract.status === "pending" && (
                <Button variant="ghost" size="sm" className="rounded-xl" onClick={() => handleResendContract(contract)}>
                  <Send className="h-4 w-4 mr-1" />
                  Resend
                </Button>
              )}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="rounded-xl w-9 px-0">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="rounded-xl">
                  <DropdownMenuItem onClick={() => handleDuplicateContract(contract)}>
                    <Copy className="h-4 w-4 mr-2" />
                    Duplicate
                  </DropdownMenuItem>
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

      {/* View Contract Modal */}
      <ViewContractModal
        isOpen={isViewModalOpen}
        onClose={() => {
          setIsViewModalOpen(false)
          setViewingContract(null)
        }}
        contract={viewingContract}
        onDownload={handleDownloadContract}
        onResend={handleResendContract}
        onDuplicate={handleDuplicateContract}
      />
    </>
  )
}
