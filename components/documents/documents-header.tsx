"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Upload } from "lucide-react"
import { UploadDocumentModal } from "./upload-document-modal"

interface DocumentsHeaderProps {
  isStaffView?: boolean
}

export function DocumentsHeader({ isStaffView = false }: DocumentsHeaderProps) {
  const [showUploadModal, setShowUploadModal] = useState(false)

  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Documents</h1>
        <p className="text-muted-foreground">
          {isStaffView ? "View and upload documents for your assigned sites" : "Manage all project documents and files"}
        </p>
      </div>
      {!isStaffView && (
        <Button onClick={() => setShowUploadModal(true)} className="rounded-2xl">
          <Upload className="mr-2 h-4 w-4" />
          Upload Document
        </Button>
      )}
      <UploadDocumentModal open={showUploadModal} onOpenChange={setShowUploadModal} />
    </div>
  )
}
