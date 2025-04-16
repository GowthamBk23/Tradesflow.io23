"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { FileUp, Send, Upload } from "lucide-react"

// Mock data for clients
const clients = [
  { id: "client-1", name: "Oakwood Properties" },
  { id: "client-2", name: "Metro Commercial Ltd" },
  { id: "client-3", name: "Greenfield Developments" },
  { id: "client-4", name: "City Hospital Trust" },
  { id: "client-8", name: "Thompson Residence" },
  { id: "client-9", name: "Wilson Family Home" },
]

// Mock data for projects/sites
const projects = [
  { id: "site-a", name: "Site A - London Office" },
  { id: "site-b", name: "Site B - Manchester Residence" },
  { id: "site-c", name: "Site C - Birmingham Commercial" },
  { id: "site-d", name: "Site D - Edinburgh Hospital" },
]

interface CreateContractModalProps {
  isOpen: boolean
  onClose: () => void
}

export function CreateContractModal({ isOpen, onClose }: CreateContractModalProps) {
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("upload")
  const [contractTitle, setContractTitle] = useState("")
  const [clientId, setClientId] = useState("")
  const [projectId, setProjectId] = useState("")
  const [description, setDescription] = useState("")
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [contractText, setContractText] = useState("")
  const [isDragging, setIsDragging] = useState(false)

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0])
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
      setSelectedFile(e.dataTransfer.files[0])
    }
  }

  // Handle file removal
  const handleRemoveFile = () => {
    setSelectedFile(null)
  }

  // Handle form submission
  const handleSubmit = () => {
    if (!contractTitle) {
      toast({
        title: "Missing Information",
        description: "Please enter a contract title",
        variant: "destructive",
      })
      return
    }

    if (!clientId) {
      toast({
        title: "Missing Information",
        description: "Please select a client",
        variant: "destructive",
      })
      return
    }

    if (activeTab === "upload" && !selectedFile) {
      toast({
        title: "Missing Information",
        description: "Please upload a contract document",
        variant: "destructive",
      })
      return
    }

    if (activeTab === "create" && !contractText) {
      toast({
        title: "Missing Information",
        description: "Please enter contract text",
        variant: "destructive",
      })
      return
    }

    // In a real app, this would create and send the contract
    toast({
      title: "Contract Created",
      description: `Contract "${contractTitle}" has been created and sent to the client`,
    })

    // Reset form and close modal
    resetForm()
    onClose()
  }

  // Reset form
  const resetForm = () => {
    setContractTitle("")
    setClientId("")
    setProjectId("")
    setDescription("")
    setSelectedFile(null)
    setContractText("")
    setActiveTab("upload")
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[700px] rounded-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Contract</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Contract Details */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="contract-title">
                Contract Title <span className="text-destructive">*</span>
              </Label>
              <Input
                id="contract-title"
                value={contractTitle}
                onChange={(e) => setContractTitle(e.target.value)}
                placeholder="Enter contract title"
                className="rounded-xl"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="client">
                  Client <span className="text-destructive">*</span>
                </Label>
                <Select value={clientId} onValueChange={setClientId}>
                  <SelectTrigger id="client" className="rounded-xl">
                    <SelectValue placeholder="Select client" />
                  </SelectTrigger>
                  <SelectContent>
                    {clients.map((client) => (
                      <SelectItem key={client.id} value={client.id}>
                        {client.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="project">Project/Job Site</Label>
                <Select value={projectId} onValueChange={setProjectId}>
                  <SelectTrigger id="project" className="rounded-xl">
                    <SelectValue placeholder="Select project/site" />
                  </SelectTrigger>
                  <SelectContent>
                    {projects.map((project) => (
                      <SelectItem key={project.id} value={project.id}>
                        {project.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description/Notes</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Add any notes about this contract..."
                className="rounded-xl min-h-[80px]"
              />
            </div>
          </div>

          {/* Contract Content Tabs */}
          <Tabs defaultValue="upload" value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-2 w-full rounded-xl">
              <TabsTrigger value="upload" className="rounded-xl">
                Upload PDF
              </TabsTrigger>
              <TabsTrigger value="create" className="rounded-xl">
                Create Contract
              </TabsTrigger>
            </TabsList>

            {/* Upload PDF Tab */}
            <TabsContent value="upload" className="mt-4 space-y-4">
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
                      <p className="text-sm font-medium">Drag and drop your contract PDF here or click to browse</p>
                      <p className="text-xs text-muted-foreground mt-1">Supports PDF files up to 10MB</p>
                    </div>
                    <Input type="file" id="file-upload" className="hidden" onChange={handleFileChange} accept=".pdf" />
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
                          <p className="text-xs text-muted-foreground">
                            {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 rounded-xl text-muted-foreground hover:text-destructive"
                        onClick={handleRemoveFile}
                      >
                        <span className="sr-only">Remove</span>×
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      File selected. Click "Send to Client" to complete the process.
                    </p>
                  </div>
                )}
              </div>
            </TabsContent>

            {/* Create Contract Tab */}
            <TabsContent value="create" className="mt-4 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="contract-text">Contract Text</Label>
                <Textarea
                  id="contract-text"
                  value={contractText}
                  onChange={(e) => setContractText(e.target.value)}
                  placeholder="Enter contract text here..."
                  className="rounded-xl min-h-[300px] font-mono"
                />
                <p className="text-xs text-muted-foreground">
                  This is a simple text editor. In a real application, this would be a rich text editor (WYSIWYG) with
                  formatting options.
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" className="rounded-xl" onClick={onClose}>
            Cancel
          </Button>
          <Button type="button" className="rounded-xl" onClick={handleSubmit}>
            <Send className="mr-2 h-4 w-4" />
            Send to Client
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
