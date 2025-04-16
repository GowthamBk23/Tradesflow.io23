"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Download, Share2, Trash2, X } from "lucide-react"

interface DocumentPreviewModalProps {
  isOpen: boolean
  onClose: () => void
  document: any
  onDownload: (document: any) => void
  onShare: (document: any) => void
  onDelete: (document: any) => void
}

export function DocumentPreviewModal({
  isOpen,
  onClose,
  document,
  onDownload,
  onShare,
  onDelete,
}: DocumentPreviewModalProps) {
  if (!document) return null

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })
  }

  // Get document type badge
  const getDocumentTypeBadge = (type: string) => {
    let className = ""
    const label = type.charAt(0).toUpperCase() + type.slice(1).replace("-", " ")

    switch (type) {
      case "invoice":
        className = "bg-blue-500/10 text-blue-500 border-blue-500/20"
        break
      case "contract":
        className = "bg-purple-500/10 text-purple-500 border-purple-500/20"
        break
      case "site-plan":
        className = "bg-teal-500/10 text-teal-500 border-teal-500/20"
        break
      case "receipt":
        className = "bg-amber-500/10 text-amber-500 border-amber-500/20"
        break
      case "permit":
        className = "bg-green-500/10 text-green-500 border-green-500/20"
        break
      case "certificate":
        className = "bg-rose-500/10 text-rose-500 border-rose-500/20"
        break
      case "report":
        className = "bg-indigo-500/10 text-indigo-500 border-indigo-500/20"
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

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] rounded-2xl p-0 overflow-hidden">
        <DialogHeader className="p-6 pb-0 flex flex-row items-start justify-between">
          <div>
            <DialogTitle className="text-xl">{document.name}</DialogTitle>
            <div className="flex items-center gap-2 mt-2">
              {getDocumentTypeBadge(document.type)}
              <span className="text-sm text-muted-foreground">
                Uploaded on {formatDate(document.uploadedDate)} by {document.uploadedBy}
              </span>
            </div>
          </div>
          <Button variant="ghost" size="icon" className="rounded-full" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>

        <div className="p-6 space-y-6 overflow-y-auto max-h-[calc(90vh-150px)]">
          {/* Document Preview */}
          <div className="bg-muted/30 rounded-xl p-4 flex items-center justify-center min-h-[400px]">
            <img
              src={document.url || "/placeholder.svg"}
              alt={document.name}
              className="max-w-full max-h-[400px] object-contain"
            />
          </div>

          <Separator />

          {/* Document Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-2">Document Details</h3>
              <dl className="space-y-2">
                <div className="flex justify-between">
                  <dt className="text-sm text-muted-foreground">File Size:</dt>
                  <dd className="text-sm font-medium">{document.fileSize}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-sm text-muted-foreground">File Type:</dt>
                  <dd className="text-sm font-medium">{document.fileType.toUpperCase()}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-sm text-muted-foreground">Job Site:</dt>
                  <dd className="text-sm font-medium">
                    {document.jobSite ? document.jobSite.replace("site-", "Site ") : "—"}
                  </dd>
                </div>
              </dl>
            </div>

            {document.notes && (
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-2">Notes</h3>
                <p className="text-sm">{document.notes}</p>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" className="rounded-xl" onClick={() => onDownload(document)}>
              <Download className="mr-2 h-4 w-4" />
              Download
            </Button>
            <Button variant="outline" className="rounded-xl" onClick={() => onShare(document)}>
              <Share2 className="mr-2 h-4 w-4" />
              Share
            </Button>
            <Button
              variant="outline"
              className="rounded-xl text-destructive hover:text-destructive hover:bg-destructive/10"
              onClick={() => {
                onDelete(document)
                onClose()
              }}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
