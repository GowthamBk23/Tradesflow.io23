"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Download,
  Send,
  Copy,
  FileText,
  Calendar,
  UserCircle,
  Briefcase,
  CheckCircle,
  XCircle,
  AlertCircle,
  PenTool,
} from "lucide-react"
import { SignatureModal } from "./signature-modal"
import { useToast } from "@/hooks/use-toast"

interface ViewContractModalProps {
  isOpen: boolean
  onClose: () => void
  contract: any
  onDownload: (contract: any) => void
  onResend?: (contract: any) => void
  onDuplicate?: (contract: any) => void
  isClientView?: boolean
}

export function ViewContractModal({
  isOpen,
  onClose,
  contract,
  onDownload,
  onResend,
  onDuplicate,
  isClientView = false,
}: ViewContractModalProps) {
  const [isSignatureModalOpen, setIsSignatureModalOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("preview")
  const { toast } = useToast()

  if (!contract) return null

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

  // Get status icon
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "signed":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case "rejected":
        return <XCircle className="h-5 w-5 text-rose-500" />
      case "pending":
        return <AlertCircle className="h-5 w-5 text-amber-500" />
      default:
        return <FileText className="h-5 w-5 text-muted-foreground" />
    }
  }

  // Handle sign contract
  const handleSignContract = (signatureData: string, signatureType: "drawn" | "typed") => {
    // In a real app, this would send the signature to your backend
    toast({
      title: "Contract Signed",
      description: "The contract has been signed successfully.",
    })

    // Update contract status locally for demo purposes
    contract.status = "signed"
    contract.signedDate = new Date().toISOString().split("T")[0]
    contract.signature = {
      data: signatureData,
      type: signatureType,
      timestamp: new Date().toISOString(),
    }

    // Switch to the details tab to show the signature
    setActiveTab("details")
  }

  // Handle reject contract
  const handleRejectContract = () => {
    const reason = prompt("Please provide a reason for rejecting this contract:")

    if (reason) {
      // In a real app, this would send the rejection to your backend
      toast({
        title: "Contract Rejected",
        description: "The contract has been rejected.",
      })

      // Update contract status locally for demo purposes
      contract.status = "rejected"
      contract.rejectionReason = reason
      contract.rejectionDate = new Date().toISOString().split("T")[0]

      // Switch to the details tab to show the rejection reason
      setActiveTab("details")
    }
  }

  return (
    <>
      <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
        <DialogContent className="sm:max-w-[800px] max-h-[90vh] rounded-2xl p-0 overflow-hidden">
          <DialogHeader className="p-6 pb-0 flex flex-row items-start justify-between">
            <div>
              <DialogTitle className="text-xl">{contract.title}</DialogTitle>
              <div className="flex items-center gap-2 mt-2">
                {getStatusBadge(contract.status)}
                <span className="text-sm text-muted-foreground">Created on {formatDate(contract.dateCreated)}</span>
              </div>
            </div>
            <Button variant="ghost" size="icon" className="rounded-full" onClick={onClose}>
              <span className="sr-only">Close</span>×
            </Button>
          </DialogHeader>

          <Tabs defaultValue="preview" value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="px-6 pt-4">
              <TabsList className="grid grid-cols-2 w-full rounded-xl">
                <TabsTrigger value="preview" className="rounded-xl">
                  Preview
                </TabsTrigger>
                <TabsTrigger value="details" className="rounded-xl">
                  Details
                </TabsTrigger>
              </TabsList>
            </div>

            {/* Preview Tab */}
            <TabsContent value="preview" className="p-6 overflow-y-auto max-h-[calc(90vh-150px)]">
              {/* Contract Preview */}
              <div className="bg-muted/30 rounded-xl p-4 flex items-center justify-center min-h-[400px]">
                <img
                  src={contract.pdfUrl || "/placeholder.svg"}
                  alt={contract.title}
                  className="max-w-full max-h-[400px] object-contain"
                />
              </div>

              <Separator className="my-6" />

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" className="rounded-xl" onClick={() => onDownload(contract)}>
                  <Download className="mr-2 h-4 w-4" />
                  Download
                </Button>

                {isClientView && contract.status === "pending" && (
                  <>
                    <Button className="rounded-xl" onClick={() => setIsSignatureModalOpen(true)}>
                      <PenTool className="mr-2 h-4 w-4" />
                      Sign Contract
                    </Button>
                    <Button variant="outline" className="rounded-xl" onClick={handleRejectContract}>
                      <XCircle className="mr-2 h-4 w-4" />
                      Reject
                    </Button>
                  </>
                )}

                {!isClientView && contract.status === "pending" && onResend && (
                  <Button variant="outline" className="rounded-xl" onClick={() => onResend(contract)}>
                    <Send className="mr-2 h-4 w-4" />
                    Resend to Client
                  </Button>
                )}

                {!isClientView && onDuplicate && (
                  <Button variant="outline" className="rounded-xl" onClick={() => onDuplicate(contract)}>
                    <Copy className="mr-2 h-4 w-4" />
                    Duplicate
                  </Button>
                )}
              </div>
            </TabsContent>

            {/* Details Tab */}
            <TabsContent value="details" className="p-6 overflow-y-auto max-h-[calc(90vh-150px)]">
              <div className="space-y-6">
                {/* Contract Status */}
                <div className="bg-card/50 border border-border/40 rounded-xl p-4">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(contract.status)}
                    <div>
                      <h3 className="font-medium">
                        Contract Status: {contract.status.charAt(0).toUpperCase() + contract.status.slice(1)}
                      </h3>
                      {contract.status === "signed" && (
                        <p className="text-sm text-muted-foreground">
                          Signed on {formatDate(contract.signedDate || "")}
                        </p>
                      )}
                      {contract.status === "rejected" && (
                        <p className="text-sm text-muted-foreground">Reason: {contract.rejectionReason}</p>
                      )}
                      {contract.status === "pending" && (
                        <p className="text-sm text-muted-foreground">Waiting for client to sign or reject</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Signature Display (if signed) */}
                {contract.status === "signed" && contract.signature && (
                  <div className="space-y-2">
                    <h3 className="text-lg font-medium">Signature</h3>
                    <div className="bg-card/50 border border-border/40 rounded-xl p-4">
                      <div className="flex justify-center p-4 bg-black/20 rounded-lg">
                        <img
                          src={contract.signature.data || "/placeholder.svg"}
                          alt="Signature"
                          className="max-h-[100px] object-contain"
                        />
                      </div>
                      <div className="mt-2 text-sm text-muted-foreground">
                        <p>Signed on: {new Date(contract.signature.timestamp).toLocaleString()}</p>
                        <p>Signature type: {contract.signature.type === "drawn" ? "Hand-drawn" : "Typed"}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Contract Details */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Contract Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <UserCircle className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">Client</span>
                      </div>
                      <p className="font-medium">{contract.clientName}</p>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Briefcase className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">Project/Site</span>
                      </div>
                      <p className="font-medium">{contract.projectName}</p>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">Date Created</span>
                      </div>
                      <p className="font-medium">{formatDate(contract.dateCreated)}</p>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">Contract ID</span>
                      </div>
                      <p className="font-medium">{contract.id}</p>
                    </div>
                  </div>
                </div>

                {/* Description */}
                {contract.description && (
                  <div className="space-y-2">
                    <h3 className="text-lg font-medium">Description</h3>
                    <p className="text-sm">{contract.description}</p>
                  </div>
                )}

                {/* Client Actions Section */}
                {isClientView && contract.status === "pending" && (
                  <div className="bg-card/50 border border-border/40 rounded-xl p-4 space-y-3">
                    <h3 className="font-medium">Actions</h3>
                    <p className="text-sm text-muted-foreground">
                      Please review this contract carefully before taking action.
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <Button className="rounded-xl" onClick={() => setIsSignatureModalOpen(true)}>
                        <PenTool className="mr-2 h-4 w-4" />
                        Sign Contract
                      </Button>
                      <Button variant="outline" className="rounded-xl" onClick={handleRejectContract}>
                        <XCircle className="mr-2 h-4 w-4" />
                        Reject Contract
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>

      {/* Signature Modal */}
      <SignatureModal
        isOpen={isSignatureModalOpen}
        onClose={() => setIsSignatureModalOpen(false)}
        onSign={handleSignContract}
        contractTitle={contract?.title || ""}
      />
    </>
  )
}
