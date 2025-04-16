"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Eye, Download, FileText, FileImage, FileArchive, FileCog, File } from "lucide-react"
import { DocumentPreviewModal } from "@/components/documents/document-preview-modal"
import { useToast } from "@/hooks/use-toast"

// Mock data for client documents
const getClientDocuments = (clientId: string) => {
  // TODO: Replace with actual API call to get client documents
  return {
    projects: [
      {
        id: "site-a",
        name: "London Office",
        documents: [
          {
            id: "doc-1",
            name: "Site A - Building Permit.pdf",
            type: "permit",
            uploadedBy: "John Doe",
            uploadedDate: "2023-06-15",
            fileSize: "2.4 MB",
            fileType: "pdf",
            notes: "Building permit for Site A construction. Valid until December 2023.",
            url: "/placeholder.svg?height=600&width=400",
          },
          {
            id: "doc-2",
            name: "Client Contract - Oakwood Properties.pdf",
            type: "contract",
            uploadedBy: "Sarah Smith",
            uploadedDate: "2023-06-10",
            fileSize: "1.8 MB",
            fileType: "pdf",
            notes: "Signed contract for Oakwood Properties project.",
            url: "/placeholder.svg?height=600&width=400",
          },
        ],
      },
      {
        id: "site-b",
        name: "Manchester Residence",
        documents: [
          {
            id: "doc-3",
            name: "Site B - Floor Plans.jpg",
            type: "site-plan",
            uploadedBy: "Mike Johnson",
            uploadedDate: "2023-06-05",
            fileSize: "3.2 MB",
            fileType: "image",
            notes: "Detailed floor plans for Site B project.",
            url: "/placeholder.svg?height=600&width=400",
          },
          {
            id: "doc-5",
            name: "Safety Inspection Report.pdf",
            type: "report",
            uploadedBy: "Lisa Brown",
            uploadedDate: "2023-05-28",
            fileSize: "2.7 MB",
            fileType: "pdf",
            notes: "Monthly safety inspection report for Site B.",
            url: "/placeholder.svg?height=600&width=400",
          },
        ],
      },
      {
        id: "site-c",
        name: "Birmingham Commercial",
        documents: [
          {
            id: "doc-7",
            name: "Site C - Electrical Diagrams.pdf",
            type: "site-plan",
            uploadedBy: "Sarah Smith",
            uploadedDate: "2023-05-20",
            fileSize: "4.5 MB",
            fileType: "pdf",
            notes: "Electrical wiring diagrams for Site C project.",
            url: "/placeholder.svg?height=600&width=400",
          },
        ],
      },
    ],
  }
}

interface ClientDocumentsProps {
  clientId: string
}

export function ClientDocuments({ clientId }: ClientDocumentsProps) {
  const [documentsData, setDocumentsData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [previewDocument, setPreviewDocument] = useState<any>(null)
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    // Simulate API call
    const fetchData = async () => {
      setIsLoading(true)
      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 500))
      const data = getClientDocuments(clientId)
      setDocumentsData(data)
      setIsLoading(false)
    }

    fetchData()
  }, [clientId])

  // Add a function to handle document upload success (this would be called from a context or event system)
  const handleDocumentUploaded = () => {
    // Refresh documents
    setIsLoading(true)
    // Simulate network delay
    setTimeout(() => {
      const data = getClientDocuments(clientId)
      setDocumentsData(data)
      setIsLoading(false)
    }, 500)
  }

  // Handle preview document
  const handlePreviewDocument = (document: any) => {
    setPreviewDocument(document)
    setIsPreviewModalOpen(true)
  }

  // Handle download document
  const handleDownloadDocument = (document: any) => {
    toast({
      title: "Document Downloaded",
      description: `${document.name} has been downloaded`,
    })
  }

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })
  }

  // Get document icon based on file type
  const getDocumentIcon = (fileType: string) => {
    switch (fileType) {
      case "pdf":
        return <FileText className="h-10 w-10 text-rose-500" />
      case "image":
        return <FileImage className="h-10 w-10 text-blue-500" />
      case "spreadsheet":
        return <FileCog className="h-10 w-10 text-green-500" />
      case "archive":
        return <FileArchive className="h-10 w-10 text-amber-500" />
      default:
        return <File className="h-10 w-10 text-muted-foreground" />
    }
  }

  // Get document type badge
  const getDocumentTypeBadge = (type: string) => {
    let className = ""
    const label = type.charAt(0).toUpperCase() + type.slice(1).replace("-", " ")

    switch (type) {
      case "contract":
        className = "bg-purple-500/10 text-purple-500 border-purple-500/20"
        break
      case "site-plan":
        className = "bg-teal-500/10 text-teal-500 border-teal-500/20"
        break
      case "permit":
        className = "bg-green-500/10 text-green-500 border-green-500/20"
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

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Card className="animate-pulse">
          <CardContent className="h-40 p-6"></CardContent>
        </Card>
      </div>
    )
  }

  // If no projects or documents
  if (!documentsData.projects.length) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center p-6">
          <FileText className="h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-center text-muted-foreground">No documents available</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue={documentsData.projects[0].id} className="w-full">
        <TabsList className="flex flex-wrap h-auto py-1">
          {documentsData.projects.map((project: any) => (
            <TabsTrigger key={project.id} value={project.id} className="mb-1">
              {project.name}
              <Badge className="ml-2 bg-primary text-primary-foreground">{project.documents.length}</Badge>
            </TabsTrigger>
          ))}
        </TabsList>

        {documentsData.projects.map((project: any) => (
          <TabsContent key={project.id} value={project.id} className="mt-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {project.documents.map((document: any) => (
                <Card
                  key={document.id}
                  className="overflow-hidden rounded-2xl border-border/40 bg-card/50 backdrop-blur-sm"
                >
                  <div
                    className="h-40 bg-muted/30 flex items-center justify-center cursor-pointer"
                    onClick={() => handlePreviewDocument(document)}
                  >
                    {getDocumentIcon(document.fileType)}
                  </div>
                  <CardContent className="p-4">
                    <div className="space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-medium text-sm line-clamp-2" title={document.name}>
                          {document.name}
                        </h3>
                        {getDocumentTypeBadge(document.type)}
                      </div>
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>{document.fileSize}</span>
                        <span>{formatDate(document.uploadedDate)}</span>
                      </div>
                      <div className="flex justify-between pt-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="rounded-xl"
                          onClick={() => handlePreviewDocument(document)}
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          View
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="rounded-xl"
                          onClick={() => handleDownloadDocument(document)}
                        >
                          <Download className="mr-2 h-4 w-4" />
                          Download
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>

      {/* Document Preview Modal */}
      <DocumentPreviewModal
        isOpen={isPreviewModalOpen}
        onClose={() => {
          setIsPreviewModalOpen(false)
          setPreviewDocument(null)
        }}
        document={previewDocument}
        onDownload={handleDownloadDocument}
        isClientView={true}
      />
    </div>
  )
}
