"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FileUp, Upload, Camera, Loader2, Sparkles } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { InvoiceForm } from "./invoice-form"

export function InvoiceUploader() {
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("upload")
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [extractedData, setExtractedData] = useState<any>(null)

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setSelectedFile(file)
      processFile(file)
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
      setSelectedFile(file)
      processFile(file)
    }
  }

  // Handle file removal
  const handleRemoveFile = () => {
    setSelectedFile(null)
    setExtractedData(null)
  }

  // Process file with AI (simulated)
  const processFile = (file: File) => {
    setIsProcessing(true)

    // Simulate AI processing delay
    setTimeout(() => {
      // Mock extracted data
      const mockData = extractInvoiceData(file)
      setExtractedData(mockData)
      setIsProcessing(false)

      toast({
        title: "Invoice Processed",
        description: "AI has successfully extracted data from your invoice.",
      })
    }, 2500)
  }

  // Mock function to extract invoice data
  const extractInvoiceData = (file: File) => {
    // In a real app, this would call an AI service
    return {
      invoiceNumber: "INV-2023-" + Math.floor(1000 + Math.random() * 9000),
      vendor: ["Supplier Co Ltd", "Construction Materials Inc", "Tool Rental Services"][Math.floor(Math.random() * 3)],
      date: new Date().toISOString().split("T")[0],
      amount: (Math.random() * 5000 + 500).toFixed(2),
      lineItems: [
        { description: "Construction materials", amount: (Math.random() * 2000 + 200).toFixed(2) },
        { description: "Labor costs", amount: (Math.random() * 2000 + 200).toFixed(2) },
        { description: "Equipment rental", amount: (Math.random() * 1000 + 100).toFixed(2) },
      ],
      notes: "",
    }
  }

  // Handle form submission
  const handleSubmit = (formData: any) => {
    toast({
      title: "Invoice Saved",
      description: `Invoice ${formData.invoiceNumber} has been saved successfully.`,
    })

    // Reset form
    setSelectedFile(null)
    setExtractedData(null)
  }

  return (
    <Card className="rounded-2xl border-border/40 bg-card/50 backdrop-blur-sm">
      <CardContent className="p-6 space-y-6">
        <Tabs defaultValue="upload" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-2 w-full md:w-[400px] rounded-xl">
            <TabsTrigger value="upload" className="rounded-xl">
              Upload Invoice PDF
            </TabsTrigger>
            <TabsTrigger value="scan" className="rounded-xl">
              Scan Receipt
            </TabsTrigger>
          </TabsList>

          {/* Upload PDF Tab */}
          <TabsContent value="upload" className="mt-6 space-y-6">
            {!selectedFile && !isProcessing ? (
              <div
                className={`border-2 border-dashed rounded-2xl p-8 text-center ${
                  isDragging ? "border-primary bg-primary/5" : "border-border/40"
                } transition-colors`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <div className="space-y-4">
                  <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                    <FileUp className="h-8 w-8 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium">Drag and drop your invoice here</h3>
                    <p className="text-muted-foreground mt-1">Support for PDF, JPG, and PNG files up to 10MB</p>
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <p className="text-sm text-muted-foreground">or</p>
                    <Input
                      type="file"
                      id="file-upload"
                      className="hidden"
                      onChange={handleFileChange}
                      accept=".pdf,.jpg,.jpeg,.png"
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
                </div>
              </div>
            ) : isProcessing ? (
              <div className="border rounded-2xl p-8 text-center">
                <div className="space-y-4">
                  <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                    <Loader2 className="h-8 w-8 text-primary animate-spin" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium">Processing your invoice</h3>
                    <div className="flex flex-col items-center gap-2 mt-2">
                      <p className="text-muted-foreground">AI is extracting data from your document...</p>
                      <div className="flex items-center gap-2 text-primary">
                        <Sparkles className="h-4 w-4" />
                        <span className="text-sm">Using AI to read and extract invoice details</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <InvoiceForm
                file={selectedFile}
                initialData={extractedData}
                onRemoveFile={handleRemoveFile}
                onSubmit={handleSubmit}
              />
            )}
          </TabsContent>

          {/* Scan Receipt Tab */}
          <TabsContent value="scan" className="mt-6">
            <div className="border rounded-2xl p-8 text-center">
              <div className="space-y-4">
                <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <Camera className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-medium">Scan Receipt with Camera</h3>
                  <p className="text-muted-foreground mt-1">Use your device's camera to scan receipts and invoices</p>
                </div>
                <Button className="rounded-xl" disabled>
                  <Camera className="h-4 w-4 mr-2" />
                  Open Camera
                </Button>
                <p className="text-xs text-muted-foreground">
                  This feature is coming soon. Please use the Upload option for now.
                </p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

// Hidden input component for file upload
function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} />
}
