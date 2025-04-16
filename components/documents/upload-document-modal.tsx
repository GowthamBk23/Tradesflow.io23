"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { FileUp, Upload, X } from "lucide-react"
import { useUser } from "@/contexts/user-context"

interface UploadDocumentModalProps {
  isOpen: boolean
  onClose: () => void
  isClientView?: boolean
}

export function UploadDocumentModal({ isOpen, onClose, isClientView = false }: UploadDocumentModalProps) {
  const { toast } = useToast()
  const { user } = useUser()
  const [documentType, setDocumentType] = useState("")
  const [jobSite, setJobSite] = useState("")
  const [notes, setNotes] = useState("")
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isDragging, setIsDragging] = useState(false)

  // Get client sites based on user
  const getClientSites = () => {
    if (isClientView && user?.clientId) {
      // In a real app, this would fetch sites associated with the client
      return [
        { id: "site-a", name: "London Office" },
        { id: "site-b", name: "Manchester Residence" },
        { id: "site-c", name: "Birmingham Commercial" },
      ]
    }

    // Default sites for admin/staff
    return [
      { id: "site-a", name: "Site A" },
      { id: "site-b", name: "Site B" },
      { id: "site-c", name: "Site C" },
      { id: "site-d", name: "Site D" },
    ]
  }

  const clientSites = getClientSites()

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]

      // Check file size (50MB limit)
      if (file.size > 50 * 1024 * 1024) {
        toast({
          title: "File Too Large",
          description: "Maximum file size is 50MB",
          variant: "destructive",
        })
        return
      }

      setSelectedFile(file)
    }
  }

  // Handle drag events
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0]

      // Check file size (50MB limit)
      if (file.size > 50 * 1024 * 1024) {
        toast({
          title: "File Too Large",
          description: "Maximum file size is 50MB",
          variant: "destructive",
        })
        return
      }

      setSelectedFile(file)
    }
  }

  // Handle file removal
  const handleRemoveFile = () => {
    setSelectedFile(null)
  }

  // Handle upload
  const handleUpload = () => {
    if (!selectedFile) {
      toast({
        title: "No File Selected",
        description: "Please select a file to upload",
        variant: "destructive",
      })
      return
    }

    if (!documentType) {
      toast({
        title: "Missing Information",
        description: "Please select a document type",
        variant: "destructive",
      })
      return
    }

    if (!jobSite) {
      toast({
        title: "Missing Information",
        description: "Please select a job site",
        variant: "destructive",
      })
      return
    }

    // In a real app, this would upload the file to your storage
    // and tag it with the client ID if it's a client upload
    const uploadData = {
      file: selectedFile,
      documentType,
      jobSite,
      notes,
      clientId: isClientView ? user?.clientId : undefined,
      uploadedBy: user?.name || "Unknown User",
    }

    console.log("Uploading document:", uploadData)

    toast({
      title: "Document Uploaded",
      description: `${selectedFile.name} has been uploaded successfully`,
    })

    // Reset form and close modal
    setSelectedFile(null)
    setDocumentType("")
    setJobSite("")
    setNotes("")
    onClose()
  }

  // Get document type options based on user role
  const getDocumentTypeOptions = () => {
    if (isClientView) {
      return [
        { value: "invoice", label: "Invoice" },
        { value: "receipt", label: "Receipt" },
        { value: "proposal", label: "Proposal" },
        { value: "request", label: "Change Request" },
        { value: "approval", label: "Approval" },
        { value: "other", label: "Other" },
      ]
    }

    return [
      { value: "invoice", label: "Invoice" },
      { value: "contract", label: "Contract" },
      { value: "site-plan", label: "Site Plan" },
      { value: "receipt", label: "Receipt" },
      { value: "permit", label: "Permit" },
      { value: "certificate", label: "Certificate" },
      { value: "report", label: "Report" },
      { value: "other", label: "Other" },
    ]
  }

  const documentTypeOptions = getDocumentTypeOptions()

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[600px] rounded-2xl">
        <DialogHeader>
          <DialogTitle>Upload Document</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Client Message */}
          {isClientView && (
            <div className="bg-primary/5 border border-primary/10 rounded-xl p-4 text-sm">
              <p>
                Upload supporting documents related to your project here. These will be visible to your project manager.
              </p>
            </div>
          )}

          {/* File Upload Area */}
          <div
            className={`border-2 border-dashed rounded-2xl p-6 text-center ${
              isDragging ? "border-primary bg-primary/5" : "border-border/40"
            } transition-colors`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            {!selectedFile ? (
              <div className="space-y-4">
                <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <FileUp className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium">Drag and drop your file here or click to browse</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Supports PDF, Word, Excel, JPG, PNG, and ZIP files up to 50MB
                  </p>
                </div>
                <Input
                  type="file"
                  id="file-upload"
                  className="hidden"
                  onChange={handleFileChange}
                  accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png,.zip"
                />
                <Button
                  variant="outline"
                  className="rounded-xl"
                  onClick={() => document.getElementById("file-upload")?.click()}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Browse Files
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-muted/30 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <FileUp className="h-5 w-5 text-primary" />
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-medium truncate max-w-[300px]">{selectedFile.name}</p>
                      <p className="text-xs text-muted-foreground">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-xl text-muted-foreground hover:text-destructive"
                    onClick={handleRemoveFile}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">File selected. Click "Upload" to complete the process.</p>
              </div>
            )}
          </div>

          {/* Document Type */}
          <div className="space-y-2">
            <Label htmlFor="document-type">
              Document Type <span className="text-destructive">*</span>
            </Label>
            <Select value={documentType} onValueChange={setDocumentType}>
              <SelectTrigger id="document-type" className="rounded-xl">
                <SelectValue placeholder="Select document type" />
              </SelectTrigger>
              <SelectContent>
                {documentTypeOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Job Site */}
          <div className="space-y-2">
            <Label htmlFor="job-site">
              Project/Site <span className="text-destructive">*</span>
            </Label>
            <Select value={jobSite} onValueChange={setJobSite}>
              <SelectTrigger id="job-site" className="rounded-xl">
                <SelectValue placeholder="Select project/site" />
              </SelectTrigger>
              <SelectContent>
                {clientSites.map((site) => (
                  <SelectItem key={site.id} value={site.id}>
                    {site.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Textarea
              id="notes"
              placeholder="Add any notes about this document..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="min-h-[100px] rounded-xl"
            />
          </div>
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" className="rounded-xl" onClick={onClose}>
            Cancel
          </Button>
          <Button type="button" className="rounded-xl" onClick={handleUpload}>
            <Upload className="mr-2 h-4 w-4" />
            Upload Document
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
