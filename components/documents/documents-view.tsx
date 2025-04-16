"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download, Eye, Trash2, FileText, FileImage, FileArchive, FileCog } from "lucide-react"
import { DocumentPreviewModal } from "./document-preview-modal"
import { DeleteDocumentDialog } from "./delete-document-dialog"
import { useUser } from "@/contexts/user-context"
import { PermissionGuard } from "@/components/auth/permission-guard"

// Mock document data
const allDocuments = [
  {
    id: "doc-1",
    name: "Project Contract.pdf",
    type: "pdf",
    size: "2.4 MB",
    uploadedBy: "Admin User",
    uploadDate: "2023-05-15",
    clientId: "client-1",
    teamId: "team-1",
    icon: FileText,
  },
  {
    id: "doc-2",
    name: "Site Photos.zip",
    type: "zip",
    size: "15.8 MB",
    uploadedBy: "Staff Member",
    uploadDate: "2023-05-20",
    clientId: "client-1",
    teamId: "team-1",
    icon: FileArchive,
  },
  {
    id: "doc-3",
    name: "Blueprint.jpg",
    type: "jpg",
    size: "4.2 MB",
    uploadedBy: "Admin User",
    uploadDate: "2023-05-22",
    clientId: "client-1",
    teamId: "team-1",
    icon: FileImage,
  },
  {
    id: "doc-4",
    name: "Equipment Manual.pdf",
    type: "pdf",
    size: "8.7 MB",
    uploadedBy: "Staff Member",
    uploadDate: "2023-05-25",
    clientId: "client-2",
    teamId: "team-2",
    icon: FileCog,
  },
]

export function DocumentsView() {
  const [previewDocument, setPreviewDocument] = useState<any | null>(null)
  const [deleteDocument, setDeleteDocument] = useState<any | null>(null)
  const { user } = useUser()

  // TODO: Replace with actual backend filtering logic
  const filteredDocuments = allDocuments.filter((doc) => {
    if (user?.role === "admin") return true
    if (user?.role === "staff" && doc.teamId === user.teamId) return true
    if (user?.role === "client" && doc.clientId === user.clientId) return true
    return false
  })

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {filteredDocuments.length === 0 ? (
        <Card className="col-span-full">
          <CardContent className="flex h-40 flex-col items-center justify-center p-6">
            <FileText className="h-10 w-10 text-muted-foreground" />
            <p className="mt-2 text-center text-sm text-muted-foreground">No documents found</p>
          </CardContent>
        </Card>
      ) : (
        filteredDocuments.map((doc) => (
          <Card key={doc.id} className="overflow-hidden">
            <CardContent className="p-0">
              <div className="flex items-center gap-3 border-b p-4">
                <doc.icon className="h-8 w-8 text-primary" />
                <div className="flex-1 overflow-hidden">
                  <p className="truncate font-medium">{doc.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {doc.size} • {doc.uploadDate}
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-between p-2">
                <p className="text-xs text-muted-foreground">Uploaded by: {doc.uploadedBy}</p>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-full"
                    onClick={() => setPreviewDocument(doc)}
                  >
                    <Eye className="h-4 w-4" />
                    <span className="sr-only">Preview</span>
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                    <Download className="h-4 w-4" />
                    <span className="sr-only">Download</span>
                  </Button>
                  <PermissionGuard permission="delete:all">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 rounded-full text-destructive"
                      onClick={() => setDeleteDocument(doc)}
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Delete</span>
                    </Button>
                  </PermissionGuard>
                </div>
              </div>
            </CardContent>
          </Card>
        ))
      )}

      <DocumentPreviewModal
        document={previewDocument}
        open={!!previewDocument}
        onOpenChange={(open) => !open && setPreviewDocument(null)}
      />

      <DeleteDocumentDialog
        document={deleteDocument}
        open={!!deleteDocument}
        onOpenChange={(open) => !open && setDeleteDocument(null)}
      />
    </div>
  )
}
