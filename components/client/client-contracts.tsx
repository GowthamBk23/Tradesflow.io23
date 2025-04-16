"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Eye, Download, FileText, CheckCircle, XCircle, Clock, PenTool } from "lucide-react"
import { ViewContractModal } from "@/components/contracts/view-contract-modal"
import { useToast } from "@/hooks/use-toast"

// Mock data for client contracts
const getClientContracts = (clientId: string) => {
  // TODO: Replace with actual API call to get client contracts
  return {
    pendingContracts: [
      {
        id: "contract-2",
        title: "Metro Commercial - Renovation Contract",
        clientId: "client-1",
        clientName: "Oakwood Properties",
        projectId: "site-b",
        projectName: "Site B - Manchester Residence",
        dateCreated: "2023-06-20",
        status: "pending",
        description: "Renovation contract for the Manchester Residence project.",
        pdfUrl: "/placeholder.svg?height=600&width=400",
      },
      {
        id: "contract-5",
        title: "Thompson Residence - Kitchen Renovation",
        clientId: "client-1",
        clientName: "Oakwood Properties",
        projectId: "site-b",
        projectName: "Site B - Manchester Residence",
        dateCreated: "2023-07-10",
        status: "pending",
        description: "Kitchen renovation contract for the Thompson residence.",
        pdfUrl: "/placeholder.svg?height=600&width=400",
      },
    ],
    signedContracts: [
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
        signature: {
          data: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASwAAACWCAYAAABkW7XSAAAAAXNSR0IArs4c6QAABGJJREFUeF7t1AEJAAAMAsHZv/RyPNwSyDncOQIECEQEFskpJgECBM5geQICBDICBitTlaAECBgsP0CAQEbAYGWqEpQAAYPlBwgQyAgYrExVghIgYLD8AAECGQGDlalKUAIEDJYfIEAgI2CwMlUJSoCAwfIDBAhkBAxWpipBCRAwWH6AAIGMgMHKVCUoAQIGyw8QIJARMFiZqgQlQMBg+QECBDICBitTlaAECBgsP0CAQEbAYGWqEpQAAYPlBwgQyAgYrExVghIgYLD8AAECGQGDlalKUAIEDJYfIEAgI2CwMlUJSoCAwfIDBAhkBAxWpipBCRAwWH6AAIGMgMHKVCUoAQIGyw8QIJARMFiZqgQlQMBg+QECBDICBitTlaAECBgsP0CAQEbAYGWqEpQAAYPlBwgQyAgYrExVghIgYLD8AAECGQGDlalKUAIEDJYfIEAgI2CwMlUJSoCAwfIDBAhkBAxWpipBCRAwWH6AAIGMgMHKVCUoAQIGyw8QIJARMFiZqgQlQMBg+QECBDICBitTlaAECBgsP0CAQEbAYGWqEpQAAYPlBwgQyAgYrExVghIgYLD8AAECGQGDlalKUAIEDJYfIEAgI2CwMlUJSoCAwfIDBAhkBAxWpipBCRAwWH6AAIGMgMHKVCUoAQIGyw8QIJARMFiZqgQlQMBg+QECBDICBitTlaAECBgsP0CAQEbAYGWqEpQAAYPlBwgQyAgYrExVghIgYLD8AAECGQGDlalKUAIEDJYfIEAgI2CwMlUJSoCAwfIDBAhkBAxWpipBCRAwWH6AAIGMgMHKVCUoAQIGyw8QIJARMFiZqgQlQMBg+QECBDICBitTlaAECBgsP0CAQEbAYGWqEpQAAYPlBwgQyAgYrExVghIgYLD8AAECGQGDlalKUAIEDJYfIEAgI2CwMlUJSoCAwfIDBAhkBAxWpipBCRAwWH6AAIGMgMHKVCUoAQIGyw8QIJARMFiZqgQlQMBg+QECBDICBitTlaAECBgsP0CAQEbAYGWqEpQAAYPlBwgQyAgYrExVghIgYLD8AAECGQGDlalKUAIEDJYfIEAgI2CwMlUJSoCAwfIDBAhkBAxWpipBCRAwWH6AAIGMgMHKVCUoAQIGyw8QIJARMFiZqgQlQMBg+QECBDICBitTlaAECBgsP0CAQEbAYGWqEpQAAYPlBwgQyAgYrExVghIgYLD8AAECGQGDlalKUAIEDJYfIEAgI2CwMlUJSoCAwfIDBAhkBAxWpipBCRAwWH6AAIGMgMHKVCUoAQIGyw8QIJARMFiZqgQlQMBg+QECBDICBitTlaAECBgsP0CAQEbAYGWqEpQAgQdWMQCX4yW9owAAAABJRU5ErkJggg==",
          type: "drawn",
          timestamp: "2023-06-18T10:30:00Z",
        },
      },
      {
        id: "contract-6",
        title: "Wilson Family - Bathroom Remodel",
        clientId: "client-1",
        clientName: "Oakwood Properties",
        projectId: "site-c",
        projectName: "Site C - Birmingham Commercial",
        dateCreated: "2023-07-15",
        status: "signed",
        signedDate: "2023-07-18",
        description: "Bathroom remodeling contract for the Wilson family home.",
        pdfUrl: "/placeholder.svg?height=600&width=400",
        signature: {
          data: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASwAAACWCAYAAABkW7XSAAAAAXNSR0IArs4c6QAABGJJREFUeF7t1AEJAAAMAsHZv/RyPNwSyDncOQIECEQEFskpJgECBM5geQICBDICBitTlaAECBgsP0CAQEbAYGWqEpQAAYPlBwgQyAgYrExVghIgYLD8AAECGQGDlalKUAIEDJYfIEAgI2CwMlUJSoCAwfIDBAhkBAxWpipBCRAwWH6AAIGMgMHKVCUoAQIGyw8QIJARMFiZqgQlQMBg+QECBDICBitTlaAECBgsP0CAQEbAYGWqEpQAAYPlBwgQyAgYrExVghIgYLD8AAECGQGDlalKUAIEDJYfIEAgI2CwMlUJSoCAwfIDBAhkBAxWpipBCRAwWH6AAIGMgMHKVCUoAQIGyw8QIJARMFiZqgQlQMBg+QECBDICBitTlaAECBgsP0CAQEbAYGWqEpQAAYPlBwgQyAgYrExVghIgYLD8AAECGQGDlalKUAIEDJYfIEAgI2CwMlUJSoCAwfIDBAhkBAxWpipBCRAwWH6AAIGMgMHKVCUoAQIGyw8QIJARMFiZqgQlQMBg+QECBDICBitTlaAECBgsP0CAQEbAYGWqEpQAAYPlBwgQyAgYrExVghIgYLD8AAECGQGDlalKUAIEDJYfIEAgI2CwMlUJSoCAwfIDBAhkBAxWpipBCRAwWH6AAIGMgMHKVCUoAQIGyw8QIJARMFiZqgQlQMBg+QECBDICBitTlaAECBgsP0CAQEbAYGWqEpQAAYPlBwgQyAgYrExVghIgYLD8AAECGQGDlalKUAIEDJYfIEAgI2CwMlUJSoCAwfIDBAhkBAxWpipBCRAwWH6AAIGMgMHKVCUoAQIGyw8QIJARMFiZqgQlQMBg+QECBDICBitTlaAECBgsP0CAQEbAYGWqEpQAAYPlBwgQyAgYrExVghIgYLD8AAECGQGDlalKUAIEDJYfIEAgI2CwMlUJSoCAwfIDBAhkBAxWpipBCRAwWH6AAIGMgMHKVCUoAQIGyw8QIJARMFiZqgQlQMBg+QECBDICBitTlaAECBgsP0CAQEbAYGWqEpQAAYPlBwgQyAgYrExVghIgYLD8AAECGQGDlalKUAIEDJYfIEAgI2CwMlUJSoCAwfIDBAhkBAxWpipBCRAwWH6AAIGMgMHKVCUoAQIGyw8QIJARMFiZqgQlQMBg+QECBDICBitTlaAECBgsP0CAQEbAYGWqEpQAAYPlBwgQyAgYrExVghIgYLD8AAECGQGDlalKUAIEDJYfIEAgI2CwMlUJSoCAwfIDBAhkBAxWpipBCRAwWH6AAIGMgMHKVCUoAQIGyw8QIJARMFiZqgQlQMBg+QECBDICBitTlaAECBgsP0CAQEbAYGWqEpQAgQdWMQCX4yW9owAAAABJRU5ErkJggg==",
          type: "typed",
          timestamp: "2023-07-18T14:45:00Z",
        },
      },
    ],
    rejectedContracts: [
      {
        id: "contract-3",
        title: "Greenfield Developments - Eco Homes Agreement",
        clientId: "client-1",
        clientName: "Oakwood Properties",
        projectId: "site-c",
        projectName: "Site C - Birmingham Commercial",
        dateCreated: "2023-06-25",
        status: "rejected",
        rejectionReason: "Budget concerns, need to revise pricing structure.",
        description: "Construction agreement for eco-friendly homes development.",
        pdfUrl: "/placeholder.svg?height=600&width=400",
      },
    ],
  }
}

interface ClientContractsProps {
  clientId: string
}

export function ClientContracts({ clientId }: ClientContractsProps) {
  const [contractsData, setContractsData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [viewingContract, setViewingContract] = useState<any>(null)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    // Simulate API call
    const fetchData = async () => {
      setIsLoading(true)
      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 500))
      const data = getClientContracts(clientId)
      setContractsData(data)
      setIsLoading(false)
    }

    fetchData()
  }, [clientId])

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

  // Handle sign contract
  const handleSignContract = (contract: any) => {
    toast({
      title: "Contract Signing",
      description: "You will be redirected to the e-signature platform.",
    })
    // TODO: Redirect to e-signature platform
  }

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Card className="animate-pulse">
          <CardContent className="h-40 p-6"></CardContent>
        </Card>
      </div>
    )
  }

  const renderContractCard = (contract: any) => (
    <Card key={contract.id} className="overflow-hidden rounded-2xl border-border/40 bg-card/50 backdrop-blur-sm">
      <CardContent className="p-0">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b p-4">
          <div>
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              <p className="font-medium">{contract.title}</p>
              {contract.status === "signed" && (
                <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20 rounded-xl">
                  <CheckCircle className="mr-1 h-3 w-3" />
                  Signed
                </Badge>
              )}
              {contract.status === "pending" && (
                <Badge variant="outline" className="bg-amber-500/10 text-amber-500 border-amber-500/20 rounded-xl">
                  <Clock className="mr-1 h-3 w-3" />
                  Pending
                </Badge>
              )}
              {contract.status === "rejected" && (
                <Badge variant="outline" className="bg-rose-500/10 text-rose-500 border-rose-500/20 rounded-xl">
                  <XCircle className="mr-1 h-3 w-3" />
                  Rejected
                </Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground mt-1">{contract.projectName.split(" - ")[1]}</p>
          </div>
          <div className="mt-2 md:mt-0 flex flex-col md:items-end">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span>Created: {formatDate(contract.dateCreated)}</span>
              {contract.signedDate && (
                <>
                  <span>•</span>
                  <span>Signed: {formatDate(contract.signedDate)}</span>
                </>
              )}
            </div>
          </div>
        </div>
        <div className="flex flex-wrap items-center justify-between p-4">
          {contract.status === "rejected" && (
            <p className="text-sm text-rose-500 mb-2 w-full">
              <XCircle className="inline-block mr-1 h-4 w-4" />
              Reason: {contract.rejectionReason || "No reason provided"}
            </p>
          )}
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="rounded-xl" onClick={() => handleViewContract(contract)}>
              <Eye className="mr-2 h-4 w-4" />
              View Details
            </Button>
            <Button variant="outline" size="sm" className="rounded-xl" onClick={() => handleDownloadContract(contract)}>
              <Download className="mr-2 h-4 w-4" />
              Download
            </Button>
          </div>
          {contract.status === "pending" && (
            <Button size="sm" className="rounded-xl mt-2 sm:mt-0" onClick={() => handleViewContract(contract)}>
              <PenTool className="mr-2 h-4 w-4" />
              Sign Contract
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
            {contractsData.pendingContracts.length > 0 && (
              <Badge className="ml-2 bg-primary text-primary-foreground">{contractsData.pendingContracts.length}</Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="signed">Signed</TabsTrigger>
          <TabsTrigger value="rejected">Rejected</TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="mt-6 space-y-4">
          {contractsData.pendingContracts.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center p-6">
                <FileText className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-center text-muted-foreground">No pending contracts</p>
              </CardContent>
            </Card>
          ) : (
            contractsData.pendingContracts.map((contract: any) => renderContractCard(contract))
          )}
        </TabsContent>

        <TabsContent value="signed" className="mt-6 space-y-4">
          {contractsData.signedContracts.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center p-6">
                <CheckCircle className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-center text-muted-foreground">No signed contracts</p>
              </CardContent>
            </Card>
          ) : (
            contractsData.signedContracts.map((contract: any) => renderContractCard(contract))
          )}
        </TabsContent>

        <TabsContent value="rejected" className="mt-6 space-y-4">
          {contractsData.rejectedContracts.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center p-6">
                <XCircle className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-center text-muted-foreground">No rejected contracts</p>
              </CardContent>
            </Card>
          ) : (
            contractsData.rejectedContracts.map((contract: any) => renderContractCard(contract))
          )}
        </TabsContent>
      </Tabs>

      {/* View Contract Modal */}
      <ViewContractModal
        isOpen={isViewModalOpen}
        onClose={() => {
          setIsViewModalOpen(false)
          setViewingContract(null)
        }}
        contract={viewingContract}
        onDownload={handleDownloadContract}
        isClientView={true}
      />
    </div>
  )
}
