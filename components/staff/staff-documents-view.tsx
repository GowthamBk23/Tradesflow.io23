"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Download, Eye, FileText, FileImage, FileArchive, FileCog, Upload } from "lucide-react"
import { DocumentPreviewModal } from "../documents/document-preview-modal"
import { UploadDocumentModal } from "../documents/upload-document-modal"

// Mock document data for staff
const getStaffDocuments = (staffId: string) => {
  return {
    "Site A - London Office": [
      {
        id: "doc-1",
        name: "Project Contract.pdf",
        type: "pdf",
        size: "2.4 MB",
        uploadedBy: "Admin User",
        uploadDate: "2023-05-15",
        siteId: "site-a",
        icon: FileText,
      },
      {
        id: "doc-3",
        name: "Blueprint.jpg",
        type: "jpg",
        size: "4.2 MB",
        uploadedBy: "Admin User",
        uploadDate: "2023-05-22",
        siteId: "site-a",
        icon: FileImage,
      },
    ],
    "Site C - Birmingham Commercial": [
      {
        id: "doc-4",
        name: "Equipment Manual.pdf",
        type: "pdf",
        size: "8.7 MB",
        uploadedBy: "Staff Member",
        uploadDate: "2023-05-25",
        siteId: "site-c",
        icon: FileCog,
      },
      {
        id: "doc-10",
        name: "Site Photos.zip",
        type: "zip",
        size: "15.8 MB",
        uploadedBy: "John Doe",
        uploadDate: "2023-06-01",
        siteId: "site-c",
        icon: FileArchive,
      },
    ],
  }
}

// Get staff assigned sites
const getStaffSites = (staffId: string) => {
  return [
    { id: "site-a", name: "Site A - London Office" },
    { id: "site-c", name: "Site C - Birmingham Commercial" },
  ]
}

interface StaffDocumentsViewProps {
  staffId: string
}

export function StaffDocumentsView({ staffId }: StaffDocumentsViewProps) {
  const [documents, setDocuments] = useState<Record<string, any[]>>({})
  const [sites, setSites] = useState<{ id: string; name: string }[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [previewDocument, setPreviewDocument] = useState<any | null>(null)
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [selectedSite, setSelectedSite] = useState<string | null>(null)

  useEffect(() => {
    // Simulate API call
    const fetchData = async () => {
      setIsLoading(true)
      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 500))
      const docs = getStaffDocuments(staffId)
      const staffSites = getStaffSites(staffId)

      setDocuments(docs)
      setSites(staffSites)

      if (staffSites.length > 0) {
        setSelectedSite(staffSites[0].name)
      }

      setIsLoading(false)
    }

    fetchData()
  }, [staffId])

  const handleUploadSuccess = (newDoc: any) => {
    if (!selectedSite) return

    setDocuments((prev) => ({
      ...prev,
      [selectedSite]: [...(prev[selectedSite] || []), newDoc],
    }))
  }

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-0">
              <div className="flex items-center gap-3 border-b p-4">
                <div className="h-8 w-8 rounded-full bg-muted"></div>
                <div className="flex-1">
                  <div className="h-4 w-3/4 bg-muted rounded"></div>
                  <div className="h-3 w-1/2 bg-muted rounded mt-2"></div>
                </div>
              </div>
              <div className="p-2">
                <div className="h-4 w-1/3 bg-muted rounded"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (sites.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-8">
          <FileText className="h-12 w-12 text-muted-foreground opacity-20" />
          <p className="mt-4 text-lg font-medium">No assigned sites</p>
          <p className="text-muted-foreground">You don't have access to any documents yet</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Upload Button */}
      <div className="flex justify-end">
        <Button onClick={() => setShowUploadModal(true)} className="rounded-xl">
          <Upload className="mr-2 h-4 w-4" />
          Upload Document
        </Button>
      </div>

      {/* Site Tabs */}
      <Tabs
        defaultValue={sites[0].name}
        value={selectedSite || undefined}
        onValueChange={setSelectedSite}
        className="w-full"
      >
        <TabsList className="w-full justify-start overflow-auto">
          {sites.map((site) => (
            <TabsTrigger key={site.id} value={site.name} className="flex-shrink-0">
              {site.name}
            </TabsTrigger>
          ))}
        </TabsList>

        {sites.map((site) => (
          <TabsContent key={site.id} value={site.name} className="mt-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {documents[site.name]?.length > 0 ? (
                documents[site.name].map((doc) => (
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
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <Card className="col-span-full">
                  <CardContent className="flex flex-col items-center justify-center py-8">
                    <FileText className="h-12 w-12 text-muted-foreground opacity-20" />
                    <p className="mt-4 text-lg font-medium">No documents found</p>
                    <p className="text-muted-foreground">Upload a document to get started</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>
        ))}
      </Tabs>

      {/* Document Preview Modal */}
      <DocumentPreviewModal
        document={previewDocument}
        open={!!previewDocument}
        onOpenChange={(open) => !open && setPreviewDocument(null)}
      />

      {/* Upload Document Modal */}
      <UploadDocumentModal
        open={showUploadModal}
        onOpenChange={setShowUploadModal}
        onUploadSuccess={handleUploadSuccess}
        sites={sites}
        defaultSite={selectedSite ? sites.find((site) => site.name === selectedSite)?.id : undefined}
        isStaffView={true}
      />
    </div>
  )
}
